import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  actions?: ReactNode
  noPadding?: boolean
}

export function Card({ children, className = '', title, actions, noPadding }: CardProps) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{
        background: '#1e293b',
        borderColor: 'rgba(148,163,184,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {(title || actions) && (
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}
        >
          {title && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}
