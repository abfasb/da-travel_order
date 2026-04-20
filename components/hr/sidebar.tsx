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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        /* Light mode fallback variables */
        :root {
          --sidebar-bg: 0 0% 100%;
          --sidebar-border: 214 32% 91%;
          --sidebar-muted: 210 40% 96%;
          --sidebar-foreground: 222 47% 11%;
          --sidebar-muted-foreground: 215 16% 47%;
          --sidebar-primary: 142 76% 36%;
        }
        .dark {
          --sidebar-bg: 222 47% 11%;
          --sidebar-border: 217 33% 17%;
          --sidebar-muted: 217 33% 17%;
          --sidebar-foreground: 210 40% 98%;
          --sidebar-muted-foreground: 215 20% 65%;
          --sidebar-primary: 142 71% 45%;
        }

        .hr-sidebar {
          font-family: 'Inter', sans-serif;
          position: relative;
          display: none;
          flex-direction: column;
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, hsl(var(--sidebar-bg)) 0%, hsl(var(--sidebar-muted)) 100%);
          border-right: 1px solid hsl(var(--sidebar-border));
          transition: width 0.25s ease;
          overflow: hidden;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .hr-sidebar { display: flex; } }
        .hr-sidebar.collapsed { width: 72px; }

        /* Decorative agricultural accent */
        .hr-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: radial-gradient(ellipse at 20% 0%, hsl(var(--sidebar-primary) / 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .sidebar-header {
          display: flex;
          align-items: center;
          height: 60px;
          padding: 0 12px;
          border-bottom: 1px solid hsl(var(--sidebar-border));
          flex-shrink: 0;
          position: relative;
          z-index: 2;
          transition: padding 0.25s;
        }
        .hr-sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .hr-sidebar.collapsed .sidebar-brand {
          justify-content: center;
        }

        .sidebar-logo {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          background: linear-gradient(135deg, hsl(var(--sidebar-primary) / 0.2), hsl(var(--sidebar-primary) / 0.1));
          border: 1px solid hsl(var(--sidebar-primary) / 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px hsl(var(--sidebar-primary) / 0.1);
        }
        .sidebar-logo img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }

        .sidebar-title {
          font-weight: 600;
          font-size: 15px;
          color: hsl(var(--sidebar-foreground));
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .collapsed .sidebar-title {
          opacity: 0;
          width: 0;
        }

        .sidebar-badge {
          font-size: 9px;
          font-weight: 600;
          color: hsl(var(--sidebar-primary));
          background: hsl(var(--sidebar-primary) / 0.12);
          padding: 2px 5px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          margin-left: 5px;
          border: 1px solid hsl(var(--sidebar-primary) / 0.2);
        }
        .collapsed .sidebar-badge { display: none; }

        /* Toggle button */
        .sidebar-toggle {
          position: absolute;
          right: 12px;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: hsl(var(--sidebar-muted) / 0.5);
          border: 1px solid hsl(var(--sidebar-border));
          color: hsl(var(--sidebar-muted-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .hr-sidebar.collapsed .sidebar-toggle {
          right: 50%;
          transform: translateX(50%);
        }
        .sidebar-toggle:hover {
          background: hsl(var(--sidebar-muted));
          color: hsl(var(--sidebar-foreground));
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 14px 6px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
        }
        .nav-section-title {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--sidebar-muted-foreground) / 0.6);
          padding: 8px 10px 4px;
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .collapsed .nav-section-title { opacity: 0; }

        .nav-item { position: relative; margin-bottom: 1px; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 7px;
          color: hsl(var(--sidebar-muted-foreground));
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          background: hsl(var(--sidebar-muted) / 0.5);
          color: hsl(var(--sidebar-foreground));
        }
        .nav-link.active {
          background: linear-gradient(90deg, hsl(var(--sidebar-primary) / 0.15) 0%, hsl(var(--sidebar-primary) / 0.05) 100%);
          color: hsl(var(--sidebar-primary));
          border-color: hsl(var(--sidebar-primary) / 0.3);
        }
        .nav-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .nav-label {
          flex: 1;
          transition: opacity 0.15s;
        }
        .collapsed .nav-label { opacity: 0; width: 0; }

        .nav-chevron {
          margin-left: auto;
          color: hsl(var(--sidebar-muted-foreground) / 0.6);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .nav-chevron.open { transform: rotate(180deg); }
        .collapsed .nav-chevron { display: none; }

        /* Submenu */
        .nav-submenu {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.25s ease, opacity 0.2s;
          margin-left: 32px;
        }
        .nav-submenu.open {
          max-height: 250px;
          opacity: 1;
        }
        .collapsed .nav-submenu { display: none; }

        .sub-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px 6px 14px;
          border-radius: 5px;
          color: hsl(var(--sidebar-muted-foreground) / 0.8);
          font-size: 12px;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
          border-left: 1px solid hsl(var(--sidebar-border));
          margin-left: 6px;
        }
        .sub-link:hover {
          color: hsl(var(--sidebar-foreground));
          background: hsl(var(--sidebar-muted) / 0.3);
        }
        .sub-link.active {
          color: hsl(var(--sidebar-primary));
          background: hsl(var(--sidebar-primary) / 0.08);
          border-left-color: hsl(var(--sidebar-primary));
        }

        /* Tooltip for collapsed */
        .nav-tooltip {
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: hsl(var(--sidebar-popover, 0 0% 100%));
          border: 1px solid hsl(var(--sidebar-border));
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 500;
          color: hsl(var(--sidebar-popover-foreground, 222 47% 11%));
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .collapsed .nav-item:hover .nav-tooltip {
          opacity: 1;
          pointer-events: auto;
        }

        /* Footer */
        .sidebar-footer {
          padding: 10px 14px;
          border-top: 1px solid hsl(var(--sidebar-border));
          flex-shrink: 0;
          position: relative;
          z-index: 2;
          background: hsl(var(--sidebar-muted) / 0.3);
          backdrop-filter: blur(4px);
        }
        .version-text {
          font-size: 10px;
          color: hsl(var(--sidebar-muted-foreground) / 0.5);
          text-align: center;
          white-space: nowrap;
        }
        .collapsed .version-text { opacity: 0; }

        /* Sprout accent in footer */
        .sidebar-footer::before {
          content: '🌱';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.15;
          font-size: 20px;
          pointer-events: none;
        }
      `}</style>

      <div className={cn('hr-sidebar', collapsed && 'collapsed')}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <img src="https://isu.edu.ph/wp-content/uploads/2019/03/DA.png" alt="DA" />
            </div>
            <div className="sidebar-title">
              TOMS <span className="sidebar-badge">HR</span>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Main</div>
          {routes.map((route) => {
            const hasChildren = route.children && route.children.length > 0
            const isActive = pathname === route.href || (hasChildren && route.children!.some(c => pathname.startsWith(c.href)))
            const isOpen = openMenus[route.href] || (hasChildren && route.children!.some(c => pathname.startsWith(c.href)))

            return (
              <div className="nav-item" key={route.href}>
                <span className="nav-tooltip">{route.label}</span>
                {hasChildren ? (
                  <>
                    <div
                      className={cn('nav-link', isActive && 'active')}
                      onClick={() => !collapsed && toggleMenu(route.href)}
                    >
                      <span className="nav-icon">
                        <route.icon size={16} strokeWidth={1.8} />
                      </span>
                      <span className="nav-label">{route.label}</span>
                      <ChevronRight size={13} className={cn('nav-chevron', isOpen && 'open')} />
                    </div>
                    <div className={cn('nav-submenu', isOpen && !collapsed && 'open')}>
                      {route.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn('sub-link', pathname === child.href && 'active')}
                        >
                          <child.icon size={13} strokeWidth={1.5} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={route.href} className={cn('nav-link', pathname === route.href && 'active')}>
                    <span className="nav-icon">
                      <route.icon size={16} strokeWidth={1.8} />
                    </span>
                    <span className="nav-label">{route.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="version-text">TOMS v1.0 · DA MIMAROPA</div>
        </div>
      </div>
    </>
  )
}