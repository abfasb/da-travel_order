'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})


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
                division: true,
                email: true,
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
      await tx.approval.update({
        where: { id: approvalId },
        data: {
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          signatureData: signature,
          comment: comment,
          certificationCheck: action === 'APPROVE' ? certificationCheck : false,
        },
      })

      if (action === 'REJECT') {
        await tx.travelOrderRequest.update({
          where: { id: approval.travelOrderId },
          data: { status: 'REJECTED', rejectionReason: comment },
        })
      }

     if (action === 'APPROVE') {
        const allApprovals = await tx.approval.findMany({
          where: { travelOrderId: approval.travelOrderId },
        })
        
        const allApproved = allApprovals.every(a => a.status === 'APPROVED')
        
        if (allApproved) {
          await tx.travelOrderRequest.update({
            where: { id: approval.travelOrderId },
            data: { status: 'HR_PROCESSING' }, 
          })
        }
      }

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

    try {
      const isApproved = action === 'APPROVE';
      const statusColor = isApproved ? '#059669' : '#dc2626';
      const statusText = isApproved ? 'Approved' : 'Rejected';
      const roleName = approval.approverRole.replace('_', ' '); 

      await transporter.sendMail({
        from: `"Travel Order System" <${process.env.EMAIL_USER}>`,
        to: approval.travelOrder.user.email,
        subject: `Travel Order ${statusText} by ${roleName} ✈️`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: ${statusColor}; margin-top: 0;">Travel Order ${statusText}</h2>
            <p>Hi <strong>${approval.travelOrder.user.firstName}</strong>,</p>
            <p>Your travel order request has been <strong>${statusText.toLowerCase()}</strong> by the ${roleName}.</p>
            
            ${!isApproved && comment ? `
              <div style="background-color: #fef2f2; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;"><strong>Reason for rejection:</strong><br/>${comment}</p>
              </div>
            ` : ''}

            ${isApproved 
              ? `<p style="color: #475569;">Your request will continue through the approval workflow or proceed to HR for final processing.</p>` 
              : `<p style="color: #475569;">Please review the comments and submit a new request if necessary.</p>`
            }
            
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employee/requests/${approval.travelOrderId}" 
               style="display: inline-block; background-color: ${statusColor}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Travel Order
            </a>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Failed to send Nodemailer email:', emailError)
    }

    revalidatePath('/approvers/approvals')
    revalidatePath(`/approvers/approvals/${approval.travelOrderId}`) 
    revalidatePath('/employee/requests')

    return { success: true }
  } catch (error) {
    console.error('Approval error:', error)
    return { success: false, error: 'Failed to process approval.' }
  }
}