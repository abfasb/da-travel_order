'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCheck, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actions/notifications'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: Date
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const limit = 20
  const totalPages = Math.ceil(total / limit)

  const loadNotifications = async () => {
    setLoading(true)
    const result = await getNotifications(page, limit)
    setNotifications(result.notifications as Notification[])
    setTotal(result.total)
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [page])

  const handleMarkAsRead = async (id: string) => {
    const result = await markAsRead(id)
    if (result.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      )
      toast.success('Marked as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true)
    const result = await markAllAsRead()
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success('All notifications marked as read')
    }
    setMarkingAll(false)
  }

  const handleNavigate = (link: string) => {
    router.push(link)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'APPROVAL': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTION': return 'bg-red-100 text-red-800 border-red-200'
      case 'HR_PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 w-full dark:bg-black">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              <Badge variant="secondary">{total} total</Badge>
            </div>
            {notifications.some(n => !n.isRead) && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={markingAll}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground/70">
                    You'll be notified when your travel orders are approved or rejected.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-colors hover:bg-muted/30 cursor-pointer ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        if (notification.link) handleNavigate(notification.link)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground">{notification.title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}