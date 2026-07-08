import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  count?: number
}

export function PageHeader({ title, subtitle, actions, count }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
          {count !== undefined && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-400">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
