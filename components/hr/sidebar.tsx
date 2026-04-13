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
  Clock,
  CheckCircle,
  Printer,
  Archive,
} from 'lucide-react'

type Route = {
  label: string
  icon: React.ElementType
  href: string
  children?: { label: string; icon: React.ElementType; href: string }[]
}

const routes: Route[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/hr/dashboard',
  },
  {
    label: 'Travel Orders',
    icon: FileText,
    href: '/hr/orders',
  },
  {
    label: 'User Management',
    icon: Users,
    href: '/hr/users',
    children: [
      { label: 'All Users', icon: List, href: '/hr/users' },
      { label: 'Add User', icon: UserPlus, href: '/hr/users/new' },
    ],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/hr/analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/hr/settings',
    children: [
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
    '/hr/orders': true, // default open for quick access
  })

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .hr-sidebar {
          font-family: 'Inter', sans-serif;
          position: relative;
          display: none;
          flex-direction: column;
          width: 260px;
          height: 100vh;
          background: #0a0c10;
          border-right: 1px solid rgba(255,255,255,0.05);
          transition: width 0.25s ease;
          overflow: hidden;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .hr-sidebar { display: flex; } }
        .hr-sidebar.collapsed { width: 72px; }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .sidebar-logo {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          background: rgba(34,197,94,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sidebar-logo img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }
        .sidebar-title {
          font-weight: 600;
          font-size: 15px;
          color: #f1f5f9;
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
          color: #4ade80;
          background: rgba(74,222,128,0.12);
          padding: 2px 5px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          margin-left: 5px;
        }
        .collapsed .sidebar-badge { display: none; }

        .sidebar-toggle {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.15);
        }

        .sidebar-nav {
          flex: 1;
          padding: 14px 6px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .nav-section-title {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.25);
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
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.85);
        }
        .nav-link.active {
          background: rgba(34,197,94,0.12);
          color: #4ade80;
          border-color: rgba(34,197,94,0.25);
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
          color: rgba(255,255,255,0.3);
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
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
          border-left: 1px solid rgba(255,255,255,0.1);
          margin-left: 6px;
        }
        .sub-link:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.03);
        }
        .sub-link.active {
          color: #4ade80;
          background: rgba(34,197,94,0.08);
          border-left-color: #4ade80;
        }

        /* Tooltip for collapsed */
        .nav-tooltip {
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: #1a1e2a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .collapsed .nav-item:hover .nav-tooltip {
          opacity: 1;
          pointer-events: auto;
        }

        /* Footer */
        .sidebar-footer {
          padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .version-text {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          white-space: nowrap;
        }
        .collapsed .version-text { opacity: 0; }
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
                        { /*@ts-ignore */}
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
                        { /*@ts-ignore */}
                          <child.icon size={13} strokeWidth={1.5} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={route.href} className={cn('nav-link', pathname === route.href && 'active')}>
                    <span className="nav-icon">
                        { /*@ts-ignore */}
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