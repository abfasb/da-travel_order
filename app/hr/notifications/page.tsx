import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { markAllNotificationsAsRead, markAsRead } from '@/app/actions/notifications'
import Link from 'next/link'
import { Bell, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'HR') redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    include: {
      travelOrder: { select: { travelOrderNumber: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getIcon = (type: string) => {
    if (type.includes('APPROVAL') || type === 'APPROVE') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    if (type.includes('REJECT')) return <XCircle className="h-5 w-5 text-red-500" />
    if (type.includes('HR_READY')) return <FileText className="h-5 w-5 text-blue-500" />
    return <Bell className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        { /* @ts-ignore */ }
        <form action={markAllNotificationsAsRead}>
          <Button variant="outline" type="submit" disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </form>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="divide-y p-0">
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            notifications.map(async (notif) => {
              const markAsReadAction = markAsRead.bind(null, notif.id)
              return (
                <div
                  key={notif.id}
                  className={`py-4 px-6 flex items-start gap-4 transition-colors ${
                    !notif.isRead ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{notif.title}</h3>
                      {!notif.isRead && (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(notif.createdAt, { addSuffix: true })}</span>
                      {notif.travelOrder && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{notif.travelOrder.travelOrderNumber}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {notif.travelOrder.status}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
             /* @ts-ignore */
                      <form action={markAsReadAction}>
                        <Button variant="ghost" size="sm" type="submit">
                          Mark read
                        </Button>
                      </form>
                    )}
                    {notif.link && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={notif.link}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}