'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getRecentNotifications, markAsRead } from '@/app/actions/notifications'
import Link from 'next/link'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: Date
  travelOrder: { travelOrderNumber: string | null } | null
}

interface NotificationsDropdownProps {
  userId: string
  initialCount: number
}

export function NotificationsDropdown({ userId, initialCount }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(initialCount)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    const data = await getRecentNotifications(10)
    //@ts-ignore
    setNotifications(data)
    setUnreadCount(data.filter(n => !n.isRead).length)
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getRecentNotifications(10)
    //@ts-ignore
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    if (notification.link) {
      setOpen(false)
      window.location.href = notification.link
    }
  }

  const getNotificationIcon = (type: string) => {
    if (type.includes('APPROVAL') || type === 'APPROVE') return '✅'
    if (type.includes('REJECT')) return '❌'
    if (type.includes('HR_READY')) return '📋'
    return '🔔'
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex flex-col items-start gap-1 p-3 cursor-pointer',
                  !notification.isRead && 'bg-muted/50'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-start gap-2">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    {notification.travelOrder?.travelOrderNumber && (
                      <p className="text-xs font-mono text-primary mt-1">
                        {notification.travelOrder.travelOrderNumber}
                      </p>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/hr/notifications" className="cursor-pointer justify-center text-primary">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}