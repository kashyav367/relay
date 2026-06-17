'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  Inbox,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Circle,
} from 'lucide-react'
const NAV = [
  {
    href: "/dashboard/chat",
    icon: MessageSquare,
    label: "AI Chat",
    badge: null,
  },
  {
    href: "/dashboard/inbox",
    icon: Inbox,
    label: "Inbox",
    badge: "3",
  },
  {
    href: "/dashboard/calendar",
    icon: Calendar,
    label: "Calendar",
    badge: null,
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    badge: null,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const path = usePathname()

  return (
    <aside
      className={`sidebar-transition relative flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] ${
        collapsed ? 'w-[56px]' : 'w-[220px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex h-14 items-center border-b border-[var(--color-border)] px-4 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] shadow-lg shadow-indigo-900/30">
          <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-[13px] font-semibold tracking-tight text-[var(--color-text)]">
            Relay
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 pt-3">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? label : undefined}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--color-accent)]" />
              )}

              <Icon
                className={`h-4 w-4 flex-shrink-0 ${active ? 'text-[var(--color-accent-2)]' : ''}`}
                strokeWidth={active ? 2 : 1.75}
              />

              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 text-[10px] font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip on collapse */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2.5 z-50 hidden whitespace-nowrap rounded-md border border-[var(--color-border-2)] bg-[var(--color-surface-3)] px-2 py-1 text-[12px] text-[var(--color-text)] shadow-xl group-hover:flex">
                  {label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto border-t border-[var(--color-border)] p-2">
        {/* Status */}
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2 rounded-md px-2.5 py-2">
            <div className="live-dot h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" />
            <span className="text-[11px] text-[var(--color-text-3)]">Connected to Gmail</span>
          </div>
        )}

        {/* User avatar stub */}
        <div className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white">
            R
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-[var(--color-text)]">User</p>
              <p className="truncate text-[10px] text-[var(--color-text-3)]">Relayt</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[52px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-2)] bg-[var(--color-surface-3)] text-[var(--color-text-2)] shadow-md transition-colors hover:text-[var(--color-text)]"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  )
}