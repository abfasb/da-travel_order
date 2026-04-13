import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { markAllNotificationsAsRead } from '@/app/actions/notifications/markAllNotificationsAsRead'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {/* @ts-ignore */}
        <form action={markAllNotificationsAsRead}>
          <Button variant="outline" type="submit">Mark all as read</Button>
        </form>
      </div>
      <Card>
        <CardContent className="divide-y">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="py-4 flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-slate-600">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}