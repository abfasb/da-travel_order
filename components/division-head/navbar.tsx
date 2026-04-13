'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Bell, Moon, Sun, User, LogOut, Settings, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { logout } from '@/app/actions/logout'
import { toast } from 'sonner'
import { markNotificationAsRead } from '@/app/actions/notifications/markAllNotificationsAsRead'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  link: string | null
  createdAt: Date
  travelOrder: {
    travelOrderNumber: string | null
  } | null
}

interface NavbarProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    division: string | null
  }
  initialNotifications: Notification[]
  unreadCount: number
}

export function DivisionHeadNavbar({ user, initialNotifications, unreadCount }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [notifCount, setNotifCount] = useState(unreadCount)
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setNotifCount(prev => Math.max(0, prev - 1))
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const divisionLabels: Record<string, string> = {
    regulatory: 'Regulatory Division',
    laboratory: 'Integrated Laboratory Division',
    research: 'Research Division',
    field_ops: 'Field Operations Division',
    agri_marketing: 'Agribusiness and Marketing Assistance Division',
    engineering: 'Regional Agricultural Engineering Division',
    planning: 'Planning, Monitoring and Evaluation Division',
    info_section: 'Regional Agriculture & Fisheries Information Section',
    admin_finance: 'Administrative & Finance Division',
    procurement: 'Procurement of Goods and Infrastructure',
  }
  const divisionName = user.division ? divisionLabels[user.division] || user.division : 'Division'

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPROVAL': return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'REJECTION': return <XCircle className="h-4 w-4 text-red-500" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4 text-slate-500" />
    }
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground dark:text-white">{divisionName}</h2>
          <p className="text-xs text-muted-foreground/70 dark:text-white">Division Head Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {notifCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white">
                  {notifCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <Badge variant="secondary" className="text-xs">
                {notifCount} unread
              </Badge>
            </div>
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                        !notif.isRead ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                      }`}
                      onClick={async () => {
                        if (!notif.isRead) await handleMarkAsRead(notif.id)
                        if (notif.link) {
                          setPopoverOpen(false)
                          window.location.href = notif.link
                        }
                      }}
                    >
                      <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
                          {notif.travelOrder?.travelOrderNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{notif.travelOrder.travelOrderNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                asChild
              >
                <Link href="/division-head/notifications">View all notifications</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/division-head/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}