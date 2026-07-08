import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { SiteSettings } from '@/lib/supabase/types'

const DEFAULTS: SiteSettings = {
  id: 'global',
  primary_color: '#C2445A',
  maintenance_mode: false,
  maintenance_message: 'Sistem şu anda bakımda. Lütfen daha sonra tekrar deneyin.',
  announcement_enabled: false,
  announcement_text: '',
  announcement_type: 'info',
  announcement_image_url: null,
  registration_enabled: true,
  roadmap_quiz_question_count: 12,
  roadmap_pass_threshold_pct: 70,
  updated_at: '',
  updated_by: null,
}

interface SiteSettingsContextValue {
  settings: SiteSettings
  loading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULTS,
  loading: true,
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

function darkenHex(hex: string, factor = 0.85): string {
  const clean = hex.replace('#', '')
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return hex
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * factor)
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * factor)
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * factor)
  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function applyAccentColor(color: string) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return
  const root = document.documentElement
  root.style.setProperty('--color-accent', color)
  root.style.setProperty('--color-accent-d', darkenHex(color))
  root.style.setProperty('--gold', color)
  root.style.setProperty('--gold-light', darkenHex(color, 1.12))
  root.style.setProperty('--gold-dark', darkenHex(color, 0.78))
  root.style.setProperty('--gold-dim', `${color}14`)
  root.style.setProperty('--border', `${color}40`)
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  const applySettings = useCallback((data: SiteSettings) => {
    setSettings(data)
    applyAccentColor(data.primary_color)
  }, [])

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single()
      .then(({ data, error }) => {
        if (!error && data) applySettings(data as SiteSettings)
        setLoading(false)
      }, () => setLoading(false))

    const channel = supabase
      .channel('site-settings-global')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'id=eq.global',
        },
        (payload) => {
          applySettings(payload.new as SiteSettings)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [applySettings])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
