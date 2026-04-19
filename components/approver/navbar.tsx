'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { formatDistanceToNow } from 'date-fns'
import { 
  LogOut, 
  User, 
  Settings, 
  LayoutDashboard, 
  Bell, 
  Moon, 
  Sun 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Assuming these actions exist based on your employee navbar
import { getUnreadCount, getRecentNotifications, markAsRead } from '@/app/actions/notifications'

interface UserData {
  firstName: string | null
  lastName: string | null
  role: string | null
  email: string | null
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: Date
}

interface NavbarProps {
  user: UserData | null
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchNotifications = async () => {
    try {
      const [count, recent] = await Promise.all([
        getUnreadCount(),
        getRecentNotifications(5)
      ])
      setUnreadCount(count)
      setRecentNotifications(recent)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoadingNotifs(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
      setUnreadCount(prev => Math.max(0, prev - 1))
      setRecentNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      )
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName?.charAt(0) || ''
    const last = user.lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        toast.success('Logged out successfully')
        router.push('/login')
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User'
    : 'Guest'

  // Format role to Title Case (e.g., CHIEF_ADMINISTRATIVE -> Chief Administrative)
  const displayRole = user?.role 
    ? user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    : 'Approver'

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0">
          <img 
            src="https://c8.alamy.com/comp/KENDB8/logo-of-the-department-of-agriculture-of-the-philippines-KENDB8.jpg" 
            alt='DA Logo' 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight tracking-tight text-foreground">Travel Order</span>
          <span className="text-xs font-medium text-muted-foreground leading-tight">{displayRole}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Utilities Section (Theme & Notifications) */}
        {isMounted && (
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 sm:w-96">
                <DropdownMenuLabel className="flex items-center justify-between pb-3 pt-2">
                  <span className="font-semibold">Notifications</span>
                  <Badge variant="secondary" className="font-normal bg-muted">
                    {unreadCount} unread
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {loadingNotifs ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mb-2 opacity-20" />
                      <span className="text-sm font-medium">All caught up!</span>
                      <span className="text-xs mt-1">You have no new notifications.</span>
                    </div>
                  ) : (
                    recentNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          'flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors focus:bg-muted/60',
                          !notification.isRead ? 'bg-primary/5' : 'bg-transparent'
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <span className={cn("text-sm font-medium leading-none", !notification.isRead && "text-foreground")}>
                            {notification.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={cn("text-xs line-clamp-2 leading-relaxed mt-1.5", !notification.isRead ? "text-foreground/80" : "text-muted-foreground")}>
                          {notification.message}
                        </p>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-0">
                  <Button variant="ghost" className="w-full rounded-none justify-center h-10 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5 cursor-pointer" onClick={() => router.push('/approvers/notifications')}>
                    View all notifications
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* User Dropdown */}
        {isMounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2.5 px-2 hover:bg-muted/50 rounded-full sm:rounded-md">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none text-foreground">{displayName}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || 'No email provided'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/approvers/approvals')} className="cursor-pointer py-2">
                <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" /> 
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer py-2">
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" /> 
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/approvers/approvals/settings')} className="cursor-pointer py-2">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" /> 
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2.5 h-4 w-4" /> 
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}