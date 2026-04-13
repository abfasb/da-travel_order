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
    // Get current user from session
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: { 
        travelOrder: {
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      },
    })

    if (!approval) {
      return { success: false, error: 'Approval record not found' }
    }

    const { ipAddress, userAgent } = await getRequestMetadata()
    const travelOrderNumber = approval.travelOrder.travelOrderNumber || 'Draft'

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

      // Check if all approvals are done
      if (action === 'APPROVE') {
        const allApprovals = await tx.approval.findMany({
          where: { travelOrderId: approval.travelOrderId },
        })
        const allApproved = allApprovals.every(a => a.status === 'APPROVED')
        if (allApproved) {
          await tx.travelOrderRequest.update({
            where: { id: approval.travelOrderId },
            data: { status: 'APPROVED' }, // ready for HR
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

      // Create notification for employee
      await tx.notification.create({
        data: {
          userId: approval.travelOrder.userId,
          type: action === 'APPROVE' ? 'APPROVAL' : 'REJECTION',
          title: `Travel order ${action === 'APPROVE' ? 'approved' : 'rejected'}`,
          message: action === 'APPROVE'
            ? `Your travel order has been approved by ${approval.approverRole}.`
            : `Your travel order was rejected. Reason: ${comment || 'No reason provided'}`,
          link: `/employee/requests/${approval.travelOrderId}`,
        },
      })
    })

    revalidatePath('/approvers/approvals')
    return { success: true }
  } catch (error) {
    console.error('Approval error:', error)
    return { success: false, error: 'Failed to process approval.' }
  }
} 