// components/employee/sidebar.tsx
'use client'

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
} from 'lucide-react'

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
    label: 'Notifications',
    icon: Bell,
    href: '/employee/notifications',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/employee/profile',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Leaf className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">TOMS · Employee</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === route.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}