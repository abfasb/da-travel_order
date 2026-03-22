'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitApproval({
  approvalId,
  action,
  signature,
  comment,
  certificationCheck,
  placeSigned,
}: {
  approvalId: string
  action: 'APPROVE' | 'REJECT'
  signature?: string | null
  comment?: string | null
  certificationCheck?: boolean
  placeSigned?: string | null
}) {
  try {
    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: { travelOrder: true },
    })

    if (!approval) throw new Error('Approval not found')

    await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        signatureData: signature,
        comment: comment,
        certificationCheck: action === 'APPROVE' ? certificationCheck : false,
    // @ts-ignore
        placeSigned: placeSigned,
      },
    })

    if (action === 'REJECT') {
      await prisma.travelOrderRequest.update({
        where: { id: approval.travelOrderId },
        data: { status: 'REJECTED', rejectionReason: comment },
      })
    }

    if (action === 'APPROVE') {
      const allApprovals = await prisma.approval.findMany({
        where: { travelOrderId: approval.travelOrderId },
      })

      const allApproved = allApprovals.every(a => a.status === 'APPROVED')
      if (allApproved) {
        await prisma.travelOrderRequest.update({
          where: { id: approval.travelOrderId },
          data: { status: 'APPROVED' },
        })
      }
    }

    await prisma.notification.create({
      data: {
        userId: approval.travelOrder.userId,
        type: action === 'APPROVE' ? 'APPROVAL' : 'REJECTION',
        title: `Travel order ${action === 'APPROVE' ? 'approved' : 'rejected'}`,
        message: action === 'APPROVE'
          ? `Your travel order has been approved by ${approval.approverRole}.`
          : `Your travel order was rejected. Reason: ${comment}`,
        link: `/employee/requests/${approval.travelOrderId}`,
      },
    })

    revalidatePath('/approvals')
    return { success: true }
  } catch (error) {
    console.error('Approval error:', error)
    return { success: false, error: 'Failed to process approval.' }
  }
}