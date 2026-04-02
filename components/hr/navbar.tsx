'use client'

import { Bell, Search, Menu } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'

export default function Navbar() {
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

        /* Subtle bottom line accent */
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

        /* Keyboard shortcut badge */
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

        /* Divider */
        .navbar-divider {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
          margin: 0 4px;
        }

        .navbar-bell-btn {
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

        .navbar-bell-btn:hover {
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

        /* Pulse animation on badge */
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

        .navbar-profile-caret {
          color: #94a3b8;
          margin-left: 2px;
          transition: transform 0.15s ease;
        }
      `}</style>

      <header className="navbar-root">
        {/* Mobile menu */}
        <button className="navbar-mobile-btn">
          <Menu size={16} strokeWidth={2} />
        </button>

        {/* Search */}
        <div className="navbar-search-wrap">
          <span className="navbar-search-icon">
            <Search size={14} strokeWidth={2} />
          </span>
          <input
            className="navbar-search-input"
            placeholder="Search orders by number, employee..."
          />
          <span className="navbar-search-kbd">⌘K</span>
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Notification bell */}
          <button className="navbar-bell-btn">
            <Bell size={16} strokeWidth={2} />
            <span className="navbar-bell-badge">3</span>
          </button>

          <div className="navbar-divider" />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="navbar-profile-btn">
                <div className="navbar-avatar">HR</div>
                <div className="navbar-profile-info">
                  <div className="navbar-profile-name">Maria Santos</div>
                  <div className="navbar-profile-role">HR Officer</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}