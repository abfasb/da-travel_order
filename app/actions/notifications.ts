'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUnreadCount() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  if (!userId) return 0

  return prisma.notification.count({
    where: { userId, isRead: false },
  })
}

export async function getRecentNotifications(limit: number = 5) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  if (!userId) return []

  return prisma.notification.findMany({
    where: { userId },
    include: {
      travelOrder: { select: { travelOrderNumber: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function markAsRead(notificationId: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  if (!userId) return { success: false }

  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  })

  revalidatePath('/hr/notifications')
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value
  if (!userId) return { success: false }

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })

  revalidatePath('/hr/notifications')
  return { success: true }
}