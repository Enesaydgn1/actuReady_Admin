import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { SiteSettings, AnnouncementType } from '@/lib/supabase/types'
import { Loader2, Save, Palette, AlertTriangle, Megaphone, UserPlus, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { useAuth } from '@/contexts/AuthContext'

const BRAND = '#c2445a'

function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div
        className="w-11 h-6 rounded-full transition-colors duration-200 relative"
        style={{ background: checked ? BRAND : 'rgba(100,116,139,0.3)' }}
      >
        <div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
    </label>
  )
}

function StatusBadge({ active, trueLabel = 'Aktif', falseLabel = 'Pasif' }: { active: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        background: active ? 'rgba(52,211,153,0.12)' : 'rgba(100,116,139,0.15)',
        color: active ? '#34D399' : '#64748b',
      }}
    >
      {active ? trueLabel : falseLabel}
    </span>
  )
}

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

const ANNOUNCEMENT_COLORS: Record<AnnouncementType, { bg: string; border: string; text: string }> = {
  info:    { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  text: '#93C5FD' },
  warning: { bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  text: '#FCD34D' },
  success: { bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  text: '#6EE7B7' },
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [form, setForm] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [hexInput, setHexInput] = useState(DEFAULTS.primary_color)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const s = data as SiteSettings
          setForm(s)
          setHexInput(s.primary_color)
        }
        setLoading(false)
      })
  }, [])

  const set = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const handleColorChange = (hex: string) => {
    setHexInput(hex)
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) set('primary_color', hex)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('site_settings')
      .update({
        primary_color: form.primary_color,
        maintenance_mode: form.maintenance_mode,
        maintenance_message: form.maintenance_message,
        announcement_enabled: form.announcement_enabled,
        announcement_text: form.announcement_text,
        announcement_type: form.announcement_type,
        announcement_image_url: form.announcement_image_url,
        registration_enabled: form.registration_enabled,
        roadmap_quiz_question_count: form.roadmap_quiz_question_count,
        roadmap_pass_threshold_pct: form.roadmap_pass_threshold_pct,
        updated_by: user?.id ?? null,
      } as never)
      .eq('id', 'global')
    setSaving(false)
    if (error) setToast({ msg: 'Kayıt başarısız: ' + error.message, ok: false })
    else setToast({ msg: 'Ayarlar kaydedildi ve tüm kullanıcılara anlık yayıldı.', ok: true })
  }

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.5rem' }
  const textareaStyle = { width: '100%', background: '#0a0f1e', border: '1px solid rgba(148,163,184,0.12)', borderRadius: '0.5rem', padding: '0.625rem 0.75rem', fontSize: '0.875rem', color: '#e2e8f0', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit' }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 p-8">
        <Loader2 className="w-5 h-5 animate-spin" /> Yükleniyor...
      </div>
    )
  }

  const announcementColors = ANNOUNCEMENT_COLORS[form.announcement_type]

  return (
    <div>
      <PageHeader title="Site Ayarları" subtitle="Tüm değişiklikler anlık olarak (Realtime) kullanıcılara yansır" />

      {/* ── Renk Teması ── */}
      <Card title="" className="mb-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Renk Teması</span>
        </div>
        <label style={labelStyle}>Accent Rengi</label>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="color"
            value={form.primary_color}
            onChange={e => handleColorChange(e.target.value)}
            style={{ width: 48, height: 40, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 6 }}
          />
          <input
            type="text"
            value={hexInput}
            onChange={e => handleColorChange(e.target.value)}
            placeholder="#C2445A"
            maxLength={7}
            style={{ ...textareaStyle, resize: undefined, width: 120, fontFamily: 'monospace' }}
          />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: form.primary_color, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
        </div>
        <p className="text-xs text-slate-600">Bu renk, butonlar, aktif menü öğeleri ve vurgu unsurlarını değiştirir.</p>
      </Card>

      {/* ── Bakım Modu ── */}
      <Card title="" className="mb-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Bakım Modu</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-300 font-medium">Bakım modunu etkinleştir</p>
            <p className="text-xs text-slate-600 mt-0.5">Admin olmayan kullanıcılar bakım sayfasını görür</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge active={form.maintenance_mode} trueLabel="AKTİF" falseLabel="PASİF" />
            <Toggle id="maintenance-toggle" checked={form.maintenance_mode} onChange={v => set('maintenance_mode', v)} />
          </div>
        </div>
        {form.maintenance_mode && (
          <div className="mb-3 p-3 rounded-lg text-xs font-medium" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
            ⚠ Bakım modu aktif — yönetici olmayan tüm kullanıcılar bakım sayfasını görecektir.
          </div>
        )}
        <label style={labelStyle}>Bakım Mesajı</label>
        <textarea
          rows={3}
          value={form.maintenance_message}
          onChange={e => set('maintenance_message', e.target.value)}
          disabled={!form.maintenance_mode}
          style={{ ...textareaStyle, opacity: form.maintenance_mode ? 1 : 0.4 }}
          placeholder="Kullanıcılara gösterilecek mesaj..."
        />
      </Card>

      {/* ── Duyuru Banner ── */}
      <Card title="" className="mb-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Duyuru Banner</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-300 font-medium">Banner'ı göster</p>
            <p className="text-xs text-slate-600 mt-0.5">Kullanıcı panelinin ana sayfasında görünür (diğer sayfaları etkilemez)</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge active={form.announcement_enabled} trueLabel="AÇIK" falseLabel="KAPALI" />
            <Toggle id="announcement-toggle" checked={form.announcement_enabled} onChange={v => set('announcement_enabled', v)} />
          </div>
        </div>

        <div style={{ opacity: form.announcement_enabled ? 1 : 0.4, pointerEvents: form.announcement_enabled ? 'all' : 'none' }}>
          <label style={labelStyle}>Banner Tipi</label>
          <div className="flex gap-2 mb-4">
            {(['info', 'warning', 'success'] as AnnouncementType[]).map(type => {
              const colors = ANNOUNCEMENT_COLORS[type]
              const labels = { info: 'Bilgi', warning: 'Uyarı', success: 'Başarı' }
              const active = form.announcement_type === type
              return (
                <button
                  key={type}
                  onClick={() => set('announcement_type', type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? colors.bg : 'rgba(30,41,59,0.6)',
                    border: `1px solid ${active ? colors.border : 'rgba(148,163,184,0.12)'}`,
                    color: active ? colors.text : '#64748b',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors.text, display: 'inline-block' }} />
                  {labels[type]}
                </button>
              )
            })}
          </div>

          <label style={labelStyle}>Duyuru Metni</label>
          <textarea
            rows={2}
            value={form.announcement_text}
            onChange={e => set('announcement_text', e.target.value)}
            style={textareaStyle}
            placeholder="Duyuru metnini girin..."
          />

          <div className="mt-3">
            <ImageUploader
              label="Duyuru Görseli (isteğe bağlı)"
              value={form.announcement_image_url ?? ''}
              onChange={url => set('announcement_image_url', url || null)}
            />
          </div>

          {form.announcement_text.trim() && (
            <div className="mt-3">
              <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Önizleme</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: announcementColors.bg, border: `1px solid ${announcementColors.border}`, color: announcementColors.text }}
              >
                {form.announcement_image_url ? (
                  <img src={form.announcement_image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <span>{form.announcement_type === 'warning' ? '⚠️' : form.announcement_type === 'success' ? '✅' : 'ℹ️'}</span>
                )}
                <span className="flex-1">{form.announcement_text}</span>
                <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>✕</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ── Kayıt Ayarları ── */}
      <Card title="" className="mb-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Kayıt Ayarları</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300 font-medium">Yeni kayıtlara izin ver</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {form.registration_enabled
                ? 'Yeni kullanıcılar /kayit sayfasından kayıt olabilir'
                : '/kayit sayfası kilitli — yeni kayıt alınmıyor'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge active={form.registration_enabled} trueLabel="AÇIK" falseLabel="KAPALI" />
            <Toggle id="registration-toggle" checked={form.registration_enabled} onChange={v => set('registration_enabled', v)} />
          </div>
        </div>
      </Card>

      {/* ── Yol Haritası Quiz Ayarları ── */}
      <Card title="" className="mb-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-200">Yol Haritası Quiz Ayarları</span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Öğrenci haftalık göreve tıklayıp quiz başlattığında zorluk/soru sayısı seçtirilmez —
          burada belirlenen sabit değerler kullanılır.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Soru Sayısı</label>
            <input
              type="number" min={1} max={50}
              value={form.roadmap_quiz_question_count}
              onChange={e => set('roadmap_quiz_question_count', Math.max(1, Number(e.target.value) || 1))}
              style={{ ...textareaStyle, resize: undefined }}
            />
          </div>
          <div>
            <label style={labelStyle}>Geçme Barajı (%)</label>
            <input
              type="number" min={1} max={100}
              value={form.roadmap_pass_threshold_pct}
              onChange={e => set('roadmap_pass_threshold_pct', Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              style={{ ...textareaStyle, resize: undefined }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Öğrenci bu barajın altında kalırsa konu "tamamlandı" sayılmaz, tekrar quiz çözmesi gerekir.
        </p>
      </Card>

      {/* ── Kaydet ── */}
      <div className="max-w-2xl">
        <Button variant="primary" className="w-full py-3 text-base" loading={saving} onClick={handleSave}>
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
