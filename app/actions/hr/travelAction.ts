'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function completeTravelOrder(orderId: string, travelNumber: string) {
  try {
    const existing = await prisma.travelOrderRequest.findUnique({
      where: { travelOrderNumber: travelNumber },
    })
    if (existing) {
      return { success: false, error: 'Travel order number already exists' }
    }

    await prisma.travelOrderRequest.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        travelOrderNumber: travelNumber,
      },
    })

    const order = await prisma.travelOrderRequest.findUnique({
      where: { id: orderId },
      select: { userId: true },
    })
    if (order) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: 'HR_PROCESSING',
          title: 'Travel Order Completed',
          message: `Your travel order has been processed. Travel number: ${travelNumber}`,
          link: `/employee/requests/${orderId}`,
        },
      })
    }

    revalidatePath('/hr/orders')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to complete travel order' }
  }
}