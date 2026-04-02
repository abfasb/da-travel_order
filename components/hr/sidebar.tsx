'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Leaf,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart,
  TrendingUp,
  Map,
  UserPlus,
  ShieldCheck,
  Settings2,
} from 'lucide-react'

type SubRoute = {
  label: string
  icon: React.ElementType
  href: string
  badge?: string
}

type Route = {
  label: string
  icon: React.ElementType
  href: string
  children?: SubRoute[]
}

const routes: Route[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/hr/dashboard',
  },
  {
    label: 'Travel Orders',
    icon: ClipboardList,
    href: '/hr/orders',
    children: [
      { label: 'All Orders',   icon: FileText,     href: '/hr/orders/all' },
      { label: 'Pending',      icon: Clock,        href: '/hr/orders/pending',  badge: '12' },
      { label: 'Approved',     icon: CheckCircle2, href: '/hr/orders/approved' },
      { label: 'Rejected',     icon: XCircle,      href: '/hr/orders/rejected' },
    ],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/hr/analytics',
    children: [
      { label: 'Overview',     icon: PieChart,     href: '/hr/analytics/overview' },
      { label: 'Trends',       icon: TrendingUp,   href: '/hr/analytics/trends' },
      { label: 'Travel Map',   icon: Map,          href: '/hr/analytics/map' },
    ],
  },
  {
    label: 'User Management',
    icon: Users,
    href: '/hr/users',
    children: [
      { label: 'All Users',    icon: Users,        href: '/hr/users/all' },
      { label: 'Add User',     icon: UserPlus,     href: '/hr/users/add' },
      { label: 'Roles',        icon: ShieldCheck,  href: '/hr/users/roles' },
      { label: 'Permissions',  icon: Settings2,    href: '/hr/users/permissions' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '/hr/orders': true,
  })

  const toggleMenu = (href: string) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sb {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          display: none;
          flex-direction: column;
          width: 240px;
          height: 100vh;
          background: #0c0e14;
          border-right: 1px solid rgba(255,255,255,0.055);
          transition: width 0.26s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          flex-shrink: 0;
        }
        @media (min-width: 768px) { .sb { display: flex; } }
        .sb.sb--collapsed { width: 64px; }

        .sb::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none; z-index: 0;
        }
        .sb::after {
          content: '';
          position: absolute;
          top: -60px; left: -50px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── Header ── */
        .sb__header {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; padding: 0 14px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
          flex-shrink: 0;
        }
        .sb__brand { display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden; }
        .sb__logo {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #15803d 0%, #4ade80 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(74,222,128,0.28), 0 4px 14px rgba(74,222,128,0.18);
        }
        .sb__title-wrap {
          overflow: hidden; white-space: nowrap;
          transition: opacity 0.18s, width 0.26s cubic-bezier(.4,0,.2,1);
          width: 130px; opacity: 1;
        }
        .sb--collapsed .sb__title-wrap { width: 0; opacity: 0; }
        .sb__title { font-size: 13.5px; font-weight: 600; color: #f1f5f9; letter-spacing: 0.01em; display: flex; align-items: center; gap: 6px; }
        .sb__tag {
          font-family: 'DM Mono', monospace; font-size: 10px; color: #4ade80;
          background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2);
          border-radius: 4px; padding: 1px 5px; letter-spacing: 0.06em;
        }

        /* ── Toggle button ── */
        .sb__toggle {
          position: relative; z-index: 2;
          width: 24px; height: 24px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .sb__toggle:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.18); }
        .sb--collapsed .sb__toggle { margin: 0 auto; }

        /* ── Nav ── */
        .sb__nav {
          position: relative; z-index: 1;
          flex: 1; padding: 10px 8px;
          display: flex; flex-direction: column; gap: 1px;
          overflow-y: auto; overflow-x: hidden;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent;
        }
        .sb__section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.18); padding: 8px 8px 4px;
          white-space: nowrap; overflow: hidden;
          transition: opacity 0.18s;
        }
        .sb--collapsed .sb__section-label { opacity: 0; }

        /* ── Parent row ── */
        .sb__item { position: relative; }
        .sb__row {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 8px; border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer; text-decoration: none;
          color: rgba(255,255,255,0.42);
          font-size: 13px; font-weight: 500;
          transition: all 0.14s ease;
          white-space: nowrap; position: relative;
          user-select: none;
        }
        .sb__row:hover { color: rgba(255,255,255,0.82); background: rgba(255,255,255,0.045); border-color: rgba(255,255,255,0.07); }
        .sb__row.active { color: #f1f5f9; background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.18); }
        .sb__row.active::before {
          content: '';
          position: absolute; left: -8px; top: 50%; transform: translateY(-50%);
          width: 3px; height: 16px;
          background: linear-gradient(180deg, #4ade80, #16a34a);
          border-radius: 0 3px 3px 0;
        }
        .sb__icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.14s ease;
        }
        .sb__row:hover .sb__icon { background: rgba(255,255,255,0.07); }
        .sb__row.active .sb__icon { background: rgba(74,222,128,0.14); color: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.14); }
        .sb__label { flex: 1; overflow: hidden; white-space: nowrap; transition: opacity 0.18s, width 0.26s; }
        .sb--collapsed .sb__label { opacity: 0; width: 0; }
        .sb__chevron { margin-left: auto; color: rgba(255,255,255,0.25); flex-shrink: 0; transition: transform 0.22s cubic-bezier(.4,0,.2,1), opacity 0.18s; }
        .sb__chevron.open { transform: rotate(180deg); }
        .sb--collapsed .sb__chevron { opacity: 0; }

        /* ── Sub-menu ── */
        .sb__sub { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.22s ease; }
        .sb__sub.open { max-height: 280px; opacity: 1; }
        .sb--collapsed .sb__sub { max-height: 0 !important; opacity: 0 !important; }

        .sb__sub-inner {
          padding: 3px 0 5px 13px;
          display: flex; flex-direction: column; gap: 1px;
          position: relative;
        }
        .sb__sub-inner::before {
          content: '';
          position: absolute; left: 21px; top: 4px; bottom: 4px; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.09) 15%, rgba(255,255,255,0.09) 85%, transparent);
        }

        .sb__sub-row {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px 6px 16px; border-radius: 7px;
          border: 1px solid transparent; text-decoration: none;
          color: rgba(255,255,255,0.35); font-size: 12.5px; font-weight: 450;
          transition: all 0.13s ease; white-space: nowrap; position: relative;
        }
        .sb__sub-row::before {
          content: ''; position: absolute; left: 6px; top: 50%; transform: translateY(-50%);
          width: 6px; height: 1px; background: rgba(255,255,255,0.14);
          transition: background 0.13s;
        }
        .sb__sub-row:hover { color: rgba(255,255,255,0.78); background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
        .sb__sub-row:hover::before { background: rgba(74,222,128,0.5); }
        .sb__sub-row.active { color: #4ade80; background: rgba(74,222,128,0.07); border-color: rgba(74,222,128,0.15); font-weight: 500; }
        .sb__sub-row.active::before { background: #4ade80; }
        .sb__sub-icon { display: flex; align-items: center; opacity: 0.7; }
        .sb__sub-row.active .sb__sub-icon { opacity: 1; color: #4ade80; }

        .sb__badge {
          margin-left: auto; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
          color: #fbbf24; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);
          border-radius: 4px; padding: 1px 5px; letter-spacing: 0.04em; flex-shrink: 0;
          transition: opacity 0.18s;
        }
        .sb--collapsed .sb__badge { opacity: 0; }

        /* ── Tooltip (collapsed mode) ── */
        .sb__tooltip {
          position: absolute; left: calc(100% + 10px); top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background: #1e2330; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px; padding: 5px 10px;
          font-size: 12px; font-weight: 500; color: #f1f5f9;
          white-space: nowrap; opacity: 0; pointer-events: none;
          transition: opacity 0.15s, transform 0.15s; z-index: 999;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .sb--collapsed .sb__item:hover .sb__tooltip { opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }

        /* ── Footer ── */
        .sb__footer { position: relative; z-index: 2; padding: 10px 8px; border-top: 1px solid rgba(255,255,255,0.055); flex-shrink: 0; }
        .sb__version { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.18); text-align: center; letter-spacing: 0.05em; white-space: nowrap; overflow: hidden; transition: opacity 0.18s; }
        .sb--collapsed .sb__version { opacity: 0; }
      `}</style>

      <div className={cn('sb', collapsed && 'sb--collapsed')}>

        {/* Header */}
        <div className="sb__header">
          <div className="sb__brand">
            <div className="sb__logo">
              <Leaf size={14} strokeWidth={2.5} color="#fff" />
            </div>
            <div className="sb__title-wrap">
              <div className="sb__title">TOMS <span className="sb__tag">HR</span></div>
            </div>
          </div>
          <button
            className="sb__toggle"
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight size={13} strokeWidth={2.5} />
              : <ChevronLeft  size={13} strokeWidth={2.5} />}
          </button>
        </div>

        {/* @ts-ignore */}
        <nav className="sb__nav">
          <div className="sb__section-label">Main Menu</div>

          {routes.map((route) => {
            const isParentActive = pathname === route.href || route.children?.some(c => pathname === c.href)
            const isOpen         = !!openMenus[route.href]
            const hasChildren    = !!route.children?.length

            return (
              <div className="sb__item" key={route.href}>
                <span className="sb__tooltip">{route.label}</span>

                {hasChildren ? (
                  <div
                    className={cn('sb__row', isParentActive && 'active')}
                    onClick={() => !collapsed && toggleMenu(route.href)}
                  >
                    <div className="sb__icon">
                      <route.icon size={14} strokeWidth={2} />
                    </div>
                    <span className="sb__label">{route.label}</span>
                    <ChevronDown size={13} strokeWidth={2} className={cn('sb__chevron', isOpen && 'open')} />
                  </div>
                ) : (
                  <Link href={route.href} className={cn('sb__row', pathname === route.href && 'active')}>
                    <div className="sb__icon">

                      <route.icon size={14} strokeWidth={2} />
                    </div>
                    <span className="sb__label">{route.label}</span>
                  </Link>
                )}

                {hasChildren && (
                  <div className={cn('sb__sub', isOpen && !collapsed && 'open')}>
                    <div className="sb__sub-inner">
                      {route.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn('sb__sub-row', pathname === child.href && 'active')}
                        >
                          <span className="sb__sub-icon">
                            <child.icon size={12} strokeWidth={2} />
                          </span>
                          {child.label}
                          {child.badge && <span className="sb__badge">{child.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sb__footer">
          <div className="sb__version">v2.4.1 · Enterprise</div>
        </div>
      </div>
    </>
  )
}