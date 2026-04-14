'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Bell,
  Search,
  Menu,
  PlusCircle,
  LogOut,
  Settings,
  User,
  HelpCircle,
  LayoutDashboard,
  History,
  ClipboardList,
  BarChart3,
  Leaf,
  Moon,
  Sun,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { getUnreadCount, getRecentNotifications } from '@/app/actions/notifications'
import { toast } from 'sonner'

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
    division: string;
  }
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

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  const fullName = `${user.firstName} ${user.lastName}`

  useEffect(() => {
    setMounted(true)
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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      const { markAsRead } = await import('@/app/actions/notifications')
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

  const mobileRoutes = [
    { label: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'Travel Requests', href: '/employee/requests', icon: ClipboardList },
    { label: 'Travel History', href: '/employee/history', icon: History },
    { label: 'Analytics', href: '/employee/analytics', icon: BarChart3 },
    { label: 'Notifications', href: '/employee/notifications', icon: Bell },
    { label: 'Profile', href: '/employee/profile', icon: User },
  ]

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card px-4 md:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span>TOMS · Employee</span>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <nav className="flex flex-col p-2">
              {mobileRoutes.map((route) => {
                const isActive = pathname === route.href
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                )
              })}
              <Separator className="my-4" />
              <div className="px-3 py-2">
                <p className="text-xs text-muted-foreground mb-2">Signed in as</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.division}</p>
                  </div>
                </div>
              </div>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Search bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search travel orders..."
            className="pl-9 pr-16"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button asChild variant="default" size="sm" className="hidden md:flex">
          <Link href="/employee/requests/">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="outline" className="ml-auto">
                {unreadCount} unread
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications</div>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex flex-col items-start gap-1 p-3 cursor-pointer',
                      !notification.isRead && 'bg-muted/50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/employee/notifications" className="justify-center text-primary">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">{user.division}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/employee/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/employee/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}