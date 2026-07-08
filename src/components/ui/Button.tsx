import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ai'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:   'text-slate-900 font-bold border-transparent',
  secondary: 'text-slate-300 border-slate-600 hover:border-slate-500 hover:text-white',
  danger:    'text-red-400 border-red-500/40 hover:border-red-500/60 hover:text-red-300',
  ghost:     'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200',
  ai:        'text-violet-400 border-violet-500/40 hover:border-violet-500/60 hover:text-violet-300',
}

const bgVariants = {
  primary:   'linear-gradient(135deg, #f59e0b, #d97706)',
  secondary: 'rgba(255,255,255,0.05)',
  danger:    'rgba(239,68,68,0.08)',
  ghost:     'transparent',
  ai:        'rgba(139,92,246,0.1)',
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center rounded-lg border font-semibold transition-all cursor-pointer',
        variants[variant],
        sizes[size],
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ background: bgVariants[variant], ...style }}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}
