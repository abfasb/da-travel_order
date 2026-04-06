'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUnreadCount() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return 0

  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  })
  return count
}

export async function getNotifications(page: number = 1, limit: number = 20) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return { notifications: [], total: 0 }

  const skip = (page - 1) * limit

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
  ])

  return { notifications, total }
}

export async function markAsRead(notificationId: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return { success: false }

  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  })

  revalidatePath('/employee/notifications')
  return { success: true }
}

export async function markAllAsRead() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return { success: false }

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })

  revalidatePath('/employee/notifications')
  return { success: true }
}

export async function getRecentNotifications(limit: number = 5) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('auth_session')?.value

  if (!userId) return []

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return notifications
}