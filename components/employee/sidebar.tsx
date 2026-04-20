'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  History,
  BarChart3,
  Bell,
  User,
  Leaf,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LogOut,
  Settings,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const DIVISION_CHOICES = [
  { value: "regulatory", label: "Regulatory Division" },
  { value: "laboratory", label: "Integrated Laboratory Division" },
  { value: "research", label: "Research Division" },
  { value: "field_ops", label: "Field Operations Division" },
  { value: "agri_marketing", label: "Agribusiness and Marketing Assistance Division" },
  { value: "engineering", label: "Regional Agricultural Engineering Division" },
  { value: "planning", label: "Planning, Monitoring and Evaluation Division" },
  { value: "info_section", label: "Regional Agriculture & Fisheries Information Section" },
  { value: "admin_finance", label: "Administrative & Finance Division" },
  { value: "procurement", label: "Procurement of Goods and Infrastructure" },
] as const;

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/employee/dashboard',
  },
  {
    label: 'Travel Requests',
    icon: ClipboardList,
    href: '/employee/requests',
    badge: 1, 
  },
  {
    label: 'Travel History',
    icon: History,
    href: '/employee/history',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/employee/analytics',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/employee/calendar',
  },
  {
    label: 'Notifications',
    icon: Bell,
    href: '/employee/notifications',
    badge: 5,
  },
  {
    label: 'Profile',
    icon: User,
    href: '/employee/profile',
  },
]

interface SidebarProps {
  defaultCollapsed?: boolean
  user: {
    firstName: string;
    lastName: string;
    division: string;
  }
}

export function Sidebar({ defaultCollapsed = false, user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [mounted, setMounted] = useState(false)

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`;

  const divisionLabel = DIVISION_CHOICES.find(d => d.value === user.division)?.label || user.division;

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
    localStorage.setItem('sidebar-collapsed', String(!collapsed))
  }

  if (!mounted) return null

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col border-r bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'md:w-20' : 'md:w-64'
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b px-4',
          collapsed ? 'justify-center' : 'gap-2'
        )}
      >
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMVJJK1z4PWdaWJG9ArC6U45RvjxMJsEZVKQ&s' alt='DA Logo' className="h-12 w-12 text-primary rounded-full shrink-0" />
        {!collapsed && (
          <span className="text-lg font-semibold whitespace-nowrap">TOMS · Employee</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <TooltipProvider key={route.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      collapsed ? 'justify-center' : 'justify-start',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <route.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{route.label}</span>
                        {route.badge && (
                          <Badge variant="outline" className="ml-auto bg-primary/10 text-primary">
                            {route.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{route.label}</span>
                    {route.badge && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {route.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </nav>

      {/* Bottom section: user & settings */}
      <div className="border-t p-3">
        {collapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{fullName}</p>
                <p className="text-xs text-muted-foreground">{divisionLabel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fullName}</p>
              {/* 4. Render divisionLabel here */}
              <p className="text-xs text-muted-foreground truncate">{divisionLabel}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="mt-2 w-full"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}