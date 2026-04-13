'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function markAllNotificationsAsRead() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath('/hr/notifications')
    return { success: true }
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return { success: false, error: 'Failed to update notifications' }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('auth_session')?.value

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      return { success: false, error: 'Notification not found' }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath('/hr/notifications')
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: 'Failed to update notification' }
  }
}