import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', style, onFocus, onBlur, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        className={`rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 transition-colors w-full ${className}`}
        style={{
          background: '#0f172a',
          border: '1px solid #334155',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(245,158,11,0.6)'
          onFocus?.(e)
        }}
        onBlur={e => {
          e.target.style.borderColor = '#334155'
          onBlur?.(e)
        }}
        {...props}
      />
    </div>
  )
}
