'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Menu, Maximize, Minimize, LogOut, User, Settings } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logout } from '@/app/actions/logout'
import { toast } from 'sonner'
import Link from 'next/link'

interface NavbarProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  } | null
  notificationCount: number
}

export function Navbar({ user, notificationCount }: NavbarProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifCount, setNotifCount] = useState(notificationCount)

  useEffect(() => {
    setMounted(true)
    // Check initial fullscreen state
    setIsFullscreen(!!document.fullscreenElement)
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/hr/orders?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (!mounted) return null
  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const displayName = `${user.firstName} ${user.lastName}`
  const roleDisplay = user.role === 'HR' ? 'HR Officer' : user.role

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

        .navbar-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 20px;
          background: #ffffff;
          border-bottom: 1px solid #e8ecf0;
          gap: 16px;
          position: relative;
          z-index: 40;
        }

        .navbar-root::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4ade80 20%, #16a34a 50%, #4ade80 80%, transparent);
          opacity: 0.4;
        }

        .navbar-mobile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e8ecf0;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .navbar-mobile-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        @media (min-width: 768px) {
          .navbar-mobile-btn { display: none; }
        }

        .navbar-search-wrap {
          flex: 1;
          max-width: 420px;
          position: relative;
        }

        .navbar-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
        }

        .navbar-search-input {
          width: 100%;
          height: 36px;
          padding: 0 12px 0 34px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          transition: all 0.15s ease;
          caret-color: #16a34a;
        }

        .navbar-search-input::placeholder {
          color: #94a3b8;
        }

        .navbar-search-input:focus {
          background: #ffffff;
          border-color: #86efac;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.12);
        }

        .navbar-search-kbd {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #94a3b8;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 1px 5px;
          letter-spacing: 0.03em;
          pointer-events: none;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .navbar-divider {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
          margin: 0 4px;
        }

        .navbar-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e8ecf0;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .navbar-icon-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .navbar-bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          background: #ef4444;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #ffffff;
          line-height: 1;
        }

        .navbar-bell-badge::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: #ef4444;
          opacity: 0.4;
          animation: navbar-pulse 2s ease-out infinite;
        }

        @keyframes navbar-pulse {
          0%   { transform: scale(1); opacity: 0.4; }
          70%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .navbar-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 4px 4px;
          border-radius: 10px;
          border: 1px solid #e8ecf0;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .navbar-profile-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .navbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #16a34a 0%, #4ade80 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .navbar-profile-info {
          display: none;
        }

        @media (min-width: 1024px) {
          .navbar-profile-info { display: block; }
        }

        .navbar-profile-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.2;
          white-space: nowrap;
        }

        .navbar-profile-role {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.2;
          white-space: nowrap;
        }
      `}</style>

      <header className="navbar-root">
        {/* Mobile menu button (can be connected to sidebar toggle) */}
        <button className="navbar-mobile-btn">
          <Menu size={16} strokeWidth={2} />
        </button>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="navbar-search-wrap">
          <span className="navbar-search-icon">
            <Search size={14} strokeWidth={2} />
          </span>
          <input
            className="navbar-search-input"
            placeholder="Search orders by number, employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="navbar-search-kbd">⌘K</span>
        </form>

        <div className="navbar-actions">
          {/* Fullscreen Toggle */}
          <button
            className="navbar-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="navbar-icon-btn">
                <Bell size={16} strokeWidth={2} />
                {notifCount > 0 && (
                  <span className="navbar-bell-badge">{notifCount}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {/* Notifications would be fetched and displayed here */}
                <div className="p-4 text-center text-sm text-slate-500">
                  View all notifications in the dedicated panel.
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/hr/notifications" className="cursor-pointer">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="navbar-divider" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="navbar-profile-btn">
                <div className="navbar-avatar">{initials}</div>
                <div className="navbar-profile-info">
                  <div className="navbar-profile-name">{displayName}</div>
                  <div className="navbar-profile-role">{roleDisplay}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/hr/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/hr/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}