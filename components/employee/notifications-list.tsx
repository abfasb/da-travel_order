'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { CheckCheck, Bell, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock notifications
const initialNotifications = [
  {
    id: '1',
    type: 'approval',
    title: 'Travel Order Approved',
    message: 'Your travel order TO-2026-012 has been approved by APCO.',
    timestamp: new Date(2026, 2, 15, 9, 30),
    read: false,
  },
  {
    id: '2',
    type: 'rejection',
    title: 'Travel Order Rejected',
    message: 'Your travel order TO-2026-011 was rejected by Regional Director. Reason: Incomplete justification.',
    timestamp: new Date(2026, 2, 14, 14, 15),
    read: false,
  },
  {
    id: '3',
    type: 'hr',
    title: 'Travel Number Assigned',
    message: 'HR has assigned travel number TO-2026-010 to your request.',
    timestamp: new Date(2026, 2, 13, 11, 0),
    read: true,
  },
  {
    id: '4',
    type: 'signature',
    title: 'Signature Required',
    message: 'Please provide your e-signature for travel order TO-2026-009.',
    timestamp: new Date(2026, 2, 12, 16, 20),
    read: true,
  },
]

const typeIconMap = {
  approval: CheckCircle,
  rejection: XCircle,
  hr: FileText,
  signature: Clock,
  default: Bell,
}

const typeColorMap = {
  approval: 'text-green-600 bg-green-100',
  rejection: 'text-red-600 bg-red-100',
  hr: 'text-blue-600 bg-blue-100',
  signature: 'text-yellow-600 bg-yellow-100',
  default: 'text-gray-600 bg-gray-100',
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIconMap[notification.type as keyof typeof typeIconMap] || typeIconMap.default
              const colorClass = typeColorMap[notification.type as keyof typeof typeColorMap] || typeColorMap.default

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 p-4 transition-colors hover:bg-muted/50',
                    !notification.read && 'bg-primary/5'
                  )}
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', colorClass)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="outline" className="h-5 border-primary text-xs text-primary">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}