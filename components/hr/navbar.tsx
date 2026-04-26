'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Bell, Search, Menu, Maximize, Minimize, LogOut, User, Settings,
  Moon, Sun
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout } from '@/app/actions/logout'
import { toast } from 'sonner'
import Link from 'next/link'
import { NotificationsDropdown } from '@/components/hr/notifications-dropdown'

interface NavbarProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    avatarUrl?: string | null
  } | null
  notificationCount: number
}

export function Navbar({ user, notificationCount }: NavbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
    setIsFullscreen(!!document.fullscreenElement)
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
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
    <header className="navbar-root">
      <style jsx>{`
        .navbar-root {
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 20px;
          background: hsl(var(--background));
          border-bottom: 1px solid hsl(var(--border));
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
          background: linear-gradient(90deg, transparent, hsl(var(--primary)) 20%, hsl(var(--primary)/0.8) 50%, hsl(var(--primary)) 80%, transparent);
          opacity: 0.4;
        }
        .navbar-mobile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          background: transparent;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .navbar-mobile-btn:hover {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
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
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .navbar-search-input {
          width: 100%;
          height: 36px;
          padding: 0 12px 0 34px;
          font-size: 13px;
          color: hsl(var(--foreground));
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          outline: none;
          transition: all 0.15s ease;
          caret-color: hsl(var(--primary));
        }
        .navbar-search-input::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .navbar-search-input:focus {
          background: hsl(var(--background));
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary)/0.12);
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
          background: hsl(var(--border));
          margin: 0 4px;
        }
        .navbar-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          background: transparent;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .navbar-icon-btn:hover {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
        }
        .navbar-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 4px 4px;
          border-radius: 10px;
          border: 1px solid hsl(var(--border));
          background: transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .navbar-profile-btn:hover {
          background: hsl(var(--muted));
        }
        .navbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          color: hsl(var(--primary-foreground));
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
          color: hsl(var(--foreground));
        }
        .navbar-profile-role {
          font-size: 11px;
          color: hsl(var(--muted-foreground));
        }
      `}</style>

      {/* Mobile menu button */}
      <button className="navbar-mobile-btn">
        <Menu size={16} strokeWidth={2} />
      </button>

      {/* Search */}
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
      </form>

      <div className="navbar-actions">
        {/* Dark mode toggle */}
        {mounted && (
          <button
            className="navbar-icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        )}

        {/* Fullscreen toggle */}
        <button className="navbar-icon-btn" onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        {/* Notifications (live badge) */}
        <NotificationsDropdown userId={user.id} initialCount={notificationCount} />

        <div className="navbar-divider" />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="navbar-profile-btn">
              <Avatar className="navbar-avatar">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-transparent">{initials}</AvatarFallback>
              </Avatar>
              <div className="navbar-profile-info">
                <div className="navbar-profile-name">{displayName}</div>
                <div className="navbar-profile-role">{roleDisplay}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/hr/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/hr/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}