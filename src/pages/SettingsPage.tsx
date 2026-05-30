import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface ExamDateRow {
  id: string
  exam_type: string
  exam_date: string
  registration_start: string | null
  registration_end: string | null
  notes: string | null
}

export default function SettingsPage() {
  const [examDates, setExamDates] = useState<ExamDateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await (supabase as unknown as { from: (t: string) => { select: (c: string) => { order: (col: string, opts: object) => Promise<{ data: unknown[] | null }> } } })
          .from('exam_calendar')
          .select('*')
          .order('exam_date', { ascending: true })
        setExamDates((data ?? []) as ExamDateRow[])
      } catch { /* table may not exist yet */ }
      setLoading(false)
    }
    load()
  }, [])

  const inputStyle: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    padding: '0.55rem 0.85rem', color: '#f1f5f9', fontSize: 13, outline: 'none', width: '100%',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block',
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Sistem Ayarları</h1>
      <p style={{ fontSize: 13, color: '#475569', marginBottom: 32 }}>
        Sınav takvimi ve genel yapılandırma ayarları.
      </p>

      {/* Supabase Info */}
      <Section title="Supabase Bağlantısı">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Supabase URL</label>
            <input
              readOnly
              value={import.meta.env.VITE_SUPABASE_URL ?? '(env ile yükle)'}
              style={{ ...inputStyle, color: '#64748b' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Anon Key (kısaltılmış)</label>
            <input
              readOnly
              value={
                import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? import.meta.env.VITE_SUPABASE_ANON_KEY.slice(0, 24) + '…'
                  : '(env ile yükle)'
              }
              style={{ ...inputStyle, color: '#64748b' }}
            />
          </div>
          <ConnectivityCheck showToast={showToast} />
        </div>
      </Section>

      {/* Exam Calendar */}
      <Section title="Sınav Takvimi">
        {loading ? (
          <p style={{ color: '#64748b', fontSize: 13 }}>Yükleniyor...</p>
        ) : examDates.length === 0 ? (
          <div>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 12 }}>
              Sınav takvimi tablosu bulunamadı ya da boş.
            </p>
            <p style={{ fontSize: 12, color: '#334155' }}>
              Supabase'de <code style={{ color: '#f59e0b' }}>exam_calendar</code> tablosu oluşturulmalıdır.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Sınav Türü', 'Sınav Tarihi', 'Kayıt Başlangıç', 'Kayıt Bitiş', 'Notlar'].map(h => (
                    <th key={h} style={{
                      padding: '0.55rem 0.85rem', textAlign: 'left', fontSize: 11, fontWeight: 600,
                      color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderBottom: '1px solid #334155',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {examDates.map(row => (
                  <tr key={row.id}>
                    {[row.exam_type, row.exam_date, row.registration_start ?? '—', row.registration_end ?? '—', row.notes ?? '—'].map((v, i) => (
                      <td key={i} style={{
                        padding: '0.65rem 0.85rem', fontSize: 12.5, color: '#94a3b8',
                        borderBottom: '1px solid #1e293b',
                      }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? '#166534' : '#7f1d1d',
          border: `1px solid ${toast.ok ? '#16a34a' : '#991b1b'}`,
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 10,
          fontSize: 13, fontWeight: 500,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function ConnectivityCheck({ showToast }: { showToast: (msg: string, ok?: boolean) => void }) {
  const [checking, setChecking] = useState(false)

  const check = async () => {
    setChecking(true)
    const { error } = await supabase.from('user_profiles').select('id').limit(1)
    setChecking(false)
    if (error) showToast('Bağlantı başarısız: ' + error.message, false)
    else showToast('Supabase bağlantısı başarılı!')
  }

  return (
    <button
      onClick={check}
      disabled={checking}
      style={{
        padding: '0.6rem 1.2rem', borderRadius: 8, fontSize: 13, fontWeight: 600,
        background: checking ? '#1e293b' : 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
        cursor: checking ? 'default' : 'pointer', width: 'fit-content',
      }}
    >
      {checking ? 'Test ediliyor...' : '⚡ Bağlantıyı Test Et'}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#1e293b', border: '1px solid #334155', borderRadius: 12,
      padding: '1.5rem', marginBottom: 24,
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 20,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{title}</h2>
      {children}
    </div>
  )
}
