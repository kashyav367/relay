import { Zap } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="msg-enter flex gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/30">
        <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-3)]" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-3)]" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-3)]" />
      </div>
    </div>
  )
}