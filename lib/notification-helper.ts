import { prisma } from '@/lib/prisma'

export async function notifyHR(
  title: string,
  message: string,
  link: string,
  travelOrderId: string,
  type: string
) {
  const hrUsers = await prisma.user.findMany({
    where: { role: 'HR' },
    select: { id: true },
  })

  for (const hr of hrUsers) {
    await prisma.notification.create({
      data: {
        userId: hr.id,
        type,
        title,
        message,
        link,
        travelOrderId,
        isRead: false,
      },
    })
  }
}