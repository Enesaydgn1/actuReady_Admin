import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        className={`rounded-lg px-3 py-2.5 text-sm text-slate-100 outline-none cursor-pointer transition-colors w-full ${className}`}
        style={{ background: '#0f172a', border: '1px solid #334155' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
