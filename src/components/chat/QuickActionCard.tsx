import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  subtitle: string
  color: string
  onClick: () => void
}

const COLOR_MAP: Record<string, string> = {
  indigo:  'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 group-hover:border-indigo-500/40 [--icon-color:theme(colors.indigo.400)]',
  violet:  'from-violet-500/10 to-violet-600/5 border-violet-500/20 group-hover:border-violet-500/40 [--icon-color:theme(colors.violet.400)]',
  blue:    'from-blue-500/10   to-blue-600/5   border-blue-500/20   group-hover:border-blue-500/40   [--icon-color:theme(colors.blue.400)]',
  purple:  'from-purple-500/10 to-purple-600/5 border-purple-500/20 group-hover:border-purple-500/40 [--icon-color:theme(colors.purple.400)]',
}

const ICON_COLOR: Record<string, string> = {
  indigo: 'text-indigo-400',
  violet: 'text-violet-400',
  blue:   'text-blue-400',
  purple: 'text-purple-400',
}

export function QuickActionCard({ icon: Icon, title, subtitle, color, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-start gap-3.5 overflow-hidden rounded-xl border bg-gradient-to-br p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${COLOR_MAP[color] ?? ''}`}
    >
      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/5 blur-xl" />

      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 ${ICON_COLOR[color] ?? 'text-indigo-400'}`}>
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[var(--color-text)]">{title}</p>
        <p className="mt-0.5 text-[12px] text-[var(--color-text-2)]">{subtitle}</p>
      </div>
    </button>
  )
}