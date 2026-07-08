import type { ReactNode } from 'react'

type BadgeColor = 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'slate' | 'cyan'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
}

const colors: Record<BadgeColor, string> = {
  amber:  'bg-amber-500/15 text-amber-400 border-amber-500/20',
  green:  'bg-green-500/15 text-green-400 border-green-500/20',
  red:    'bg-red-500/15 text-red-400 border-red-500/20',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  purple: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  slate:  'bg-slate-700/50 text-slate-400 border-slate-700',
  cyan:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
}

export function Badge({ children, color = 'slate' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  )
}
