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

    await prisma.$transaction(async (tx) => {
      const order = await tx.travelOrderRequest.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          travelOrderNumber: travelNumber,
          hrProcessedAt: new Date(),
          hrUserId: hrUserId,
        },
        include: {
          user: { select: { firstName: true, lastName: true, division: true } },
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
          userId: order.userId,
          type: 'COMPLETED',
          title: 'Travel Order Completed',
          message: `Your travel order has been processed. Travel number: ${travelNumber}`,
          link: `/employee/requests/${orderId}`,
          travelOrderId: orderId,
        },
      })

      const staffDivision = order.user.division
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
              message: `Travel order ${travelNumber} for ${order.user.firstName} ${order.user.lastName} has been processed and completed.`,
              link: `/division-head/travel-orders/${orderId}`,
              travelOrderId: orderId,
            },
          })
        }
      }
    })

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