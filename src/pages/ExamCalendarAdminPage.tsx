import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ExamCalendarRow } from '@/lib/supabase/types'

const EXAM_TYPES = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'SEGEM_TPYS']
const EVENT_TYPES = [
  { value: 'exam', label: 'Sınav', color: '#ef4444' },
  { value: 'registration', label: 'Başvuru', color: '#f59e0b' },
  { value: 'result', label: 'Sonuç', color: '#22c55e' },
  { value: 'deadline', label: 'Son Tarih', color: '#ef4444' },
]

interface CalForm {
  exam_type: string
  label: string
  event_date: string
  event_type: string
  description: string
}

const emptyForm = (): CalForm => ({
  exam_type: 'LEVEL_1', label: '', event_date: '', event_type: 'exam', description: '',
})

const rowToForm = (r: ExamCalendarRow): CalForm => ({
  exam_type: r.exam_type, label: r.label,
  event_date: r.event_date, event_type: r.event_type, description: r.description ?? '',
})

export default function ExamCalendarAdminPage() {
  const [rows, setRows] = useState<ExamCalendarRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CalForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [filterExam, setFilterExam] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('exam_calendar').select('*').order('event_date', { ascending: true })
    setRows((data ?? []) as ExamCalendarRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r => !filterExam || r.exam_type === filterExam)

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setShowForm(true) }
  const openEdit = (r: ExamCalendarRow) => { setForm(rowToForm(r)); setEditId(r.id); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditId(null) }

  const saveForm = async () => {
    if (!form.label.trim() || !form.event_date) {
      showToast('Başlık ve tarih zorunludur.', false); return
    }
    setSaving(true)
    const payload = {
      exam_type: form.exam_type,
      label: form.label.trim(),
      event_date: form.event_date,
      event_type: form.event_type,
      description: form.description.trim() || null,
      is_active: true,
    }
    if (editId) {
      const { error } = await supabase.from('exam_calendar').update(payload as never).eq('id', editId)
      if (error) showToast('Güncelleme başarısız.', false)
      else { showToast('Etkinlik güncellendi.'); closeForm(); load() }
    } else {
      const { error } = await supabase.from('exam_calendar').insert(payload as never)
      if (error) showToast('Ekleme başarısız.', false)
      else { showToast('Etkinlik eklendi.'); closeForm(); load() }
    }
    setSaving(false)
  }

  const deleteRow = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return
    await supabase.from('exam_calendar').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    showToast('Etkinlik silindi.')
  }

  const toggleActive = async (r: ExamCalendarRow) => {
    await supabase.from('exam_calendar').update({ is_active: !r.is_active } as never).eq('id', r.id)
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x))
  }

  const inp: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    padding: '0.6rem 0.85rem', color: '#f1f5f9', fontSize: 13, outline: 'none', width: '100%',
  }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Sınav Takvimi</h1>
        <button onClick={openAdd} style={{
          padding: '0.6rem 1.1rem', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
        }}>+ Etkinlik Ekle</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)',
        }} onClick={closeForm}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 16,
            padding: '2rem', width: '100%', maxWidth: 480,
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>
              {editId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelS}>Sınav Türü</label>
                  <select value={form.exam_type} onChange={e => setForm(f => ({ ...f, exam_type: e.target.value }))} style={sel}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelS}>Etkinlik Türü</label>
                  <select value={form.event_type} onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))} style={sel}>
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelS}>Başlık *</label>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="ör. Aktüerlik L1 Bahar Sınavı" style={inp} />
              </div>

              <div>
                <label style={labelS}>Tarih *</label>
                <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  style={{ ...inp, colorScheme: 'dark' }} />
              </div>

              <div>
                <label style={labelS}>Açıklama</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="İsteğe bağlı açıklama..." style={inp} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveForm} disabled={saving} style={{
                flex: 1, padding: '0.65rem', borderRadius: 9, background: '#f59e0b', border: 'none',
                color: '#0f172a', fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer',
              }}>
                {saving ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Ekle'}
              </button>
              <button onClick={closeForm} style={{
                padding: '0.65rem 1rem', borderRadius: 9, background: 'transparent',
                border: '1px solid #334155', color: '#94a3b8', fontSize: 13, cursor: 'pointer',
              }}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)} style={{ ...sel, width: 160 }}>
          <option value="">Tüm Sınavlar</option>
          {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>{filtered.length} etkinlik</span>
      </div>

      {/* Timeline view */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#475569', fontSize: 14 }}>Henüz etkinlik yok. Yukarıdan ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(r => {
            const evType = EVENT_TYPES.find(t => t.value === r.event_type)
            const isPast = r.event_date < new Date().toISOString().slice(0, 10)
            return (
              <div key={r.id} style={{
                background: '#1e293b', border: '1px solid #334155', borderRadius: 12,
                padding: '0.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: 16,
                opacity: !r.is_active ? 0.5 : 1,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: isPast ? '#334155' : (evType?.color ?? '#94a3b8'),
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: isPast ? '#475569' : '#f1f5f9', fontSize: 14 }}>{r.label}</span>
                    <span style={{
                      padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: `${evType?.color ?? '#94a3b8'}20`, color: evType?.color ?? '#94a3b8',
                    }}>{evType?.label ?? r.event_type}</span>
                    <span style={{
                      padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: '#334155', color: '#64748b',
                    }}>{r.exam_type}</span>
                  </div>
                  {r.description && <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{r.description}</p>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isPast ? '#475569' : '#cbd5e1' }}>
                    {new Date(r.event_date + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => toggleActive(r)} style={{
                    padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: r.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${r.is_active ? 'rgba(34,197,94,0.3)' : '#334155'}`,
                    color: r.is_active ? '#22c55e' : '#64748b',
                  }}>
                    {r.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                  <button onClick={() => openEdit(r)} style={editBtnS}>Düzenle</button>
                  <button onClick={() => deleteRow(r.id)} style={delBtnS}>Sil</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? '#166534' : '#7f1d1d',
          border: `1px solid ${toast.ok ? '#16a34a' : '#991b1b'}`,
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 10, fontSize: 13, fontWeight: 500,
        }}>{toast.msg}</div>
      )}
    </div>
  )
}

const labelS: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }
const editBtnS: React.CSSProperties = { padding: '2px 8px', borderRadius: 5, fontSize: 11, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', cursor: 'pointer' }
const delBtnS: React.CSSProperties = { padding: '2px 8px', borderRadius: 5, fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }
