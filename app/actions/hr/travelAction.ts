'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import nodemailer from 'nodemailer'

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

export async function completeTravelOrder(orderId: string, travelNumber: string) {
  try {
    const cookieStore = await cookies()
    const hrUserId = cookieStore.get('auth_session')?.value
    if (!hrUserId) {
      return { success: false, error: 'Unauthorized' }
    }

    const existing = await prisma.travelOrderRequest.findUnique({
      where: { travelOrderNumber: travelNumber },
    })
    if (existing) {
      return { success: false, error: 'Travel order number already exists' }
    }

    const { ipAddress, userAgent } = await getRequestMetadata()

    // 2. We assign the transaction result to 'order' so we can use it for the email
    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.travelOrderRequest.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          travelOrderNumber: travelNumber,
          hrProcessedAt: new Date(),
          hrUserId: hrUserId,
        },
        include: {
          // ADDED: email: true to fetch the employee's email address
          user: { select: { firstName: true, lastName: true, division: true, email: true } },
        },
      })

      await tx.auditLog.create({
        data: {
          userId: hrUserId,
          action: 'COMPLETE',
          details: `Assigned travel number ${travelNumber} and completed order`,
          ipAddress,
          userAgent,
          travelOrderId: orderId,
        },
      })

      await tx.notification.create({
        data: {
          userId: updatedOrder.userId,
          type: 'COMPLETED',
          title: 'Travel Order Completed',
          message: `Your travel order has been processed. Travel number: ${travelNumber}`,
          link: `/employee/requests/${orderId}`,
          travelOrderId: orderId,
        },
      })

      const staffDivision = updatedOrder.user.division
      if (staffDivision) {
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
              type: 'COMPLETED',
              title: 'Travel order completed',
              message: `Travel order ${travelNumber} for ${updatedOrder.user.firstName} ${updatedOrder.user.lastName} has been processed and completed.`,
              link: `/division-head/travel-orders/${orderId}`,
              travelOrderId: orderId,
            },
          })
        }
      }
      
      // Return the updated order so the email function can access it
      return updatedOrder
    })

    // 3. SEND EMAIL NOTIFICATION
    try {
      await transporter.sendMail({
        from: `"HR Department" <${process.env.EMAIL_USER}>`,
        to: order.user.email,
        subject: `Travel Order Completed: ${travelNumber} ✈️`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #059669; margin-top: 0;">Travel Order Processed</h2>
            <p>Hi <strong>${order.user.firstName}</strong>,</p>
            <p>Your travel order has been officially processed and assigned the tracking number: <strong>${travelNumber}</strong>.</p>
            <p>You can now view and print the official documents in your dashboard.</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employee/requests/${orderId}" 
               style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Travel Order
            </a>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Failed to send Nodemailer email:', emailError)
    }

    revalidatePath('/hr/orders')
    return { success: true }
  } catch (error) {
    console.error('Error completing travel order:', error)
    return { success: false, error: 'Failed to complete travel order' }
  }
}


export async function getNextTravelNumber() {
  const currentYear = new Date().getFullYear()
  const prefix = `TO-${currentYear}-`
  
  const lastOrder = await prisma.travelOrderRequest.findFirst({
    where: {
      travelOrderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      travelOrderNumber: 'desc',
    },
  })
  
  let nextNumber = 1
  if (lastOrder?.travelOrderNumber) {
    const parts = lastOrder.travelOrderNumber.split('-')
    const lastSeq = parseInt(parts[2])
    if (!isNaN(lastSeq)) {
      nextNumber = lastSeq + 1
    }
  }
  
  const paddedNumber = nextNumber.toString().padStart(3, '0')
  return `${prefix}${paddedNumber}`
}