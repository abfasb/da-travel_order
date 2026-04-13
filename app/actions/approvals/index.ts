'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'

async function getRequestMetadata() {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const ipAddress = forwardedFor?.split(',')[0]?.trim() || 
                    headersList.get('x-real-ip') || 
                    'unknown'
  const userAgent = headersList.get('user-agent') || undefined
  return { ipAddress, userAgent }
}

export async function submitApproval({
  approvalId,
  action,
  signature,
  comment,
  certificationCheck,
}: {
  approvalId: string
  action: 'APPROVE' | 'REJECT'
  signature?: string | null
  comment?: string | null
  certificationCheck?: boolean
}) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: { 
        travelOrder: {
          include: { 
            user: { 
              select: { 
                firstName: true, 
                lastName: true, 
                division: true 
              } 
            } 
          }
        }
      },
    })

    if (!approval) {
      return { success: false, error: 'Approval record not found' }
    }

    const { ipAddress, userAgent } = await getRequestMetadata()
    const travelOrderNumber = approval.travelOrder.travelOrderNumber || 'Draft'
    const staffDivision = approval.travelOrder.user.division

    await prisma.$transaction(async (tx) => {
      // Update approval status
      await tx.approval.update({
        where: { id: approvalId },
        data: {
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          signatureData: signature,
          comment: comment,
          certificationCheck: action === 'APPROVE' ? certificationCheck : false,
        },
      })

      // Handle rejection
      if (action === 'REJECT') {
        await tx.travelOrderRequest.update({
          where: { id: approval.travelOrderId },
          data: { status: 'REJECTED', rejectionReason: comment },
        })
      }

      // If approved, check if all approvals are complete
      if (action === 'APPROVE') {
        const allApprovals = await tx.approval.findMany({
          where: { travelOrderId: approval.travelOrderId },
        })
        const allApproved = allApprovals.every(a => a.status === 'APPROVED')
        if (allApproved) {
          await tx.travelOrderRequest.update({
            where: { id: approval.travelOrderId },
            data: { status: 'APPROVED' }, 
          })
        }
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId,
          action: action === 'APPROVE' ? 'APPROVE' : 'REJECT',
          details: `${action === 'APPROVE' ? 'Approved' : 'Rejected'} travel order ${travelOrderNumber} (${approval.approverRole})${comment ? ` - Reason: ${comment}` : ''}`,
          ipAddress,
          userAgent,
          travelOrderId: approval.travelOrderId,
        },
      })

      // Notify employee
      await tx.notification.create({
        data: {
          userId: approval.travelOrder.userId,
          type: action === 'APPROVE' ? 'APPROVAL' : 'REJECTION',
          title: `Travel order ${action === 'APPROVE' ? 'approved' : 'rejected'}`,
          message: action === 'APPROVE'
            ? `Your travel order has been approved by ${approval.approverRole}.`
            : `Your travel order was rejected. Reason: ${comment || 'No reason provided'}`,
          link: `/employee/requests/${approval.travelOrderId}`,
          travelOrderId: approval.travelOrderId,
        },
      })

      // ✅ NEW: Notify Division Head on rejection
      if (action === 'REJECT' && staffDivision) {
        const divisionHead = await tx.user.findFirst({
          where: { 
            division: staffDivision, 
            role: 'DIVISION_HEAD' 
          },
        })

        if (divisionHead) {
          await tx.notification.create({
            data: {
              userId: divisionHead.id,
              type: 'REJECTION',
              title: 'Travel order rejected',
              message: `Travel order ${travelOrderNumber} for ${approval.travelOrder.user.firstName} ${approval.travelOrder.user.lastName} was rejected by ${approval.approverRole}.${comment ? ` Reason: ${comment}` : ''}`,
              link: `/division-head/travel-orders/${approval.travelOrderId}`,
              travelOrderId: approval.travelOrderId,
            },
          })
        }
      }
    })

    revalidatePath('/approvers/approvals')
    return { success: true }
  } catch (error) {
    console.error('Approval error:', error)
    return { success: false, error: 'Failed to process approval.' }
  }
}