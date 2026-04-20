'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  List,
  History,
  Bell,
  Toolbox,
  Sprout,
} from 'lucide-react'

type Route = {
  label: string
  icon: React.ElementType
  href: string
  children?: { label: string; icon: React.ElementType; href: string }[]
}

const routes: Route[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/hr/dashboard' },
  { label: 'Travel Orders', icon: FileText, href: '/hr/orders' },
  {
    label: 'User Management',
    icon: Users,
    href: '/hr/users',
    children: [
      { label: 'All Users', icon: List, href: '/hr/users' },
      { label: 'Add User', icon: UserPlus, href: '/hr/users/new' },
    ],
  },
  { label: 'Analytics', icon: BarChart3, href: '/hr/analytics' },
  {
    label: 'Settings',
    icon: Settings,
    href: '/hr/settings',
    children: [
      { label: 'Main Settings', icon: Toolbox, href: '/hr/settings' },
      { label: 'Audit Logs', icon: History, href: '/hr/audit-logs' },
      { label: 'Notifications', icon: Bell, href: '/hr/notifications' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '/hr/users': false,
    '/hr/orders': true,
  })

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <div
      className={cn(
        'hidden md:flex flex-col h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background border-r border-border transition-all duration-300 ease-in-out relative overflow-hidden',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Agricultural gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className={cn(
        'flex items-center h-16 border-b border-border px-4 shrink-0',
        collapsed && 'justify-center px-0'
      )}>
        <div className={cn('flex items-center gap-3 overflow-hidden', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-sm shrink-0">
            <img src="https://isu.edu.ph/wp-content/uploads/2019/03/DA.png" alt="DA" className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="font-bold text-foreground whitespace-nowrap">
              TOMS <span className="ml-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">HR</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(v => !v)}
          className={cn(
            'w-7 h-7 rounded-md bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center shrink-0',
            collapsed ? 'mt-2' : 'ml-auto'
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className={cn('text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-3 py-2', collapsed && 'opacity-0')}>
          Main
        </div>
        {routes.map((route) => {
          const hasChildren = route.children && route.children.length > 0
          const isActive = pathname === route.href || (hasChildren && route.children!.some(c => pathname.startsWith(c.href)))
          const isOpen = openMenus[route.href] || (hasChildren && route.children!.some(c => pathname.startsWith(c.href)))

          return (
            <div key={route.href} className="relative mb-0.5">
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-1.5 text-sm font-medium text-popover-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {route.label}
                </div>
              )}
              
              {hasChildren ? (
                <>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer text-sm font-medium',
                      isActive && 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                      collapsed && 'justify-center px-2'
                    )}
                    onClick={() => !collapsed && toggleMenu(route.href)}
                  >
                    <route.icon size={18} strokeWidth={1.8} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{route.label}</span>
                        <ChevronRight size={14} className={cn('transition-transform', isOpen && 'rotate-90')} />
                      </>
                    )}
                  </div>
                  <div className={cn(
                    'overflow-hidden transition-all duration-300 ml-9',
                    isOpen && !collapsed ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    {route.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2.5 py-2 px-3 pl-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors ml-2 border-l border-border',
                          pathname === child.href && 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-l-emerald-500'
                        )}
                      >
                        <child.icon size={13} strokeWidth={1.5} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-sm font-medium',
                    isActive && 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <route.icon size={18} strokeWidth={1.8} className="shrink-0" />
                  {!collapsed && <span>{route.label}</span>}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-border py-4 px-3 text-center text-[10px] text-muted-foreground/50 shrink-0 backdrop-blur-sm bg-muted/10 relative',
        collapsed && 'opacity-0'
      )}>
        TOMS v2.0 · DA MIMAROPA
        <Sprout className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/20" />
      </div>
    </div>
  )
}