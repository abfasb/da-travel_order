import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { markAllNotificationsAsRead } from '@/app/actions/notifications/markAllNotificationsAsRead';
import Link from 'next/link';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'DIVISION_HEAD') redirect('/login');

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    include: { travelOrder: { select: { travelOrderNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        { /* @ts-ignore */}
        <form action={markAllNotificationsAsRead}>
          <Button variant="outline" type="submit" disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="divide-y p-0">
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-4 px-6 flex items-start gap-4 ${!notif.isRead ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}
              >
                <div className="mt-0.5">
                  {notif.type === 'REJECTION' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : notif.type === 'COMPLETED' ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Bell className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{notif.title}</h3>
                    {!notif.isRead && <Badge className="bg-blue-100 text-blue-700">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
                    {notif.travelOrder?.travelOrderNumber && (
                      <>
                        <span>•</span>
                        <span className="font-mono">{notif.travelOrder.travelOrderNumber}</span>
                      </>
                    )}
                  </div>
                </div>
                {notif.link && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={notif.link}>View</Link>
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}