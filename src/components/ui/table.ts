import type { CSSProperties } from 'react'

export const TABLE_WRAP = 'rounded-xl overflow-hidden'
export const TABLE_WRAP_STYLE: CSSProperties = {
  background: '#1e293b',
  border: '1px solid #2d3f5a',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
}
export const TH = 'px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest'
export const TH_BORDER_STYLE: CSSProperties = { borderBottom: '1px solid #2d3f5a' }
export const TD = 'px-4 py-3 text-sm text-slate-300 align-middle'
export const TD_BORDER_STYLE: CSSProperties = { borderBottom: '1px solid rgba(255,255,255,0.04)' }
export const TR_HOVER = 'transition-colors hover:bg-white/[0.03]'

export const FILTER_INPUT: CSSProperties = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 8,
  padding: '7px 12px',
  color: '#cbd5e1',
  fontSize: 13,
  outline: 'none',
}
export const FILTER_SELECT: CSSProperties = { ...FILTER_INPUT, cursor: 'pointer' }
