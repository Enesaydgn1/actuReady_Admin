import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateText } from '@/lib/ai/gemini'
import type { TopicContentRow } from '@/lib/supabase/types'

const EXAM_TYPES = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'SEGEM_TPYS']
const SUBJECTS = ['matematik', 'istatistik', 'mevzuat', 'olasilik', 'hayat-sigortasi', 'yangin-sigortasi']

type Mode = 'list' | 'edit'

interface CForm {
  exam_type: string
  subject: string
  topic: string
  content_markdown: string
}

const emptyForm = (): CForm => ({ exam_type: 'LEVEL_1', subject: 'matematik', topic: '', content_markdown: '' })

export default function TopicContentPage() {
  const [rows, setRows] = useState<TopicContentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiLevel, setAiLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('topic_content').select('*').order('subject').then(r => r)
    setRows((data ?? []) as TopicContentRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r =>
    !search || r.topic.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setMode('edit') }
  const openEdit = (r: TopicContentRow) => {
    setForm({ exam_type: r.exam_type, subject: r.subject, topic: r.topic, content_markdown: r.content_markdown })
    setEditId(r.id)
    setMode('edit')
  }

  const saveForm = async () => {
    if (!form.topic.trim() || !form.content_markdown.trim()) {
      showToast('Konu ve içerik zorunludur.', false); return
    }
    setSaving(true)
    const payload = {
      exam_type: form.exam_type,
      subject: form.subject,
      topic: form.topic.trim(),
      content_markdown: form.content_markdown.trim(),
      updated_at: new Date().toISOString(),
    }
    if (editId) {
      const { error } = await supabase.from('topic_content').update(payload as never).eq('id', editId)
      if (error) showToast('Güncelleme başarısız: ' + error.message, false)
      else { showToast('İçerik güncellendi.'); setMode('list'); load() }
    } else {
      const { error } = await supabase.from('topic_content').insert(payload as never)
      if (error) showToast('Ekleme başarısız: ' + error.message, false)
      else { showToast('İçerik eklendi.'); setMode('list'); load() }
    }
    setSaving(false)
  }

  const deleteRow = async (id: string) => {
    if (!confirm('Bu içeriği silmek istediğinize emin misiniz?')) return
    await supabase.from('topic_content').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    showToast('İçerik silindi.')
  }

  const generateWithAI = async () => {
    if (!form.topic.trim()) { showToast('Önce konu adını girin.', false); return }
    setAiLoading(true)
    try {
      const levelLabel = aiLevel === 'beginner' ? 'Temel' : aiLevel === 'intermediate' ? 'Orta' : 'İleri'
      const prompt = `Aktüerya sınavı (${form.exam_type}) için "${form.subject}" dersinden "${form.topic}" konusunu ${levelLabel} seviyede öğrencilere öğret.

Markdown formatında şu bölümleri içersin:
## Temel Kavramlar
(temel tanımlar ve açıklamalar)

## Formüller
(kullanılan formüller, LaTeX $...$ ile)

## Adım Adım Örnek
(çözümlü sayısal örnek)

## Sınav İpuçları
(sınavda dikkat edilecek noktalar)

## ⚡ Kritik Notlar
(en sık yapılan hatalar ve uyarılar)

Türkçe yaz. Aktüerya sınavına özgü içerik olsun.`

      const content = await generateText(prompt, 'Sen bir aktüerya sınavı eğitmenisin.')
      setForm(f => ({ ...f, content_markdown: content }))
      showToast('İçerik üretildi, inceleyip kaydedin.')
    } catch (e) {
      showToast('AI hatası: ' + (e instanceof Error ? e.message : 'Hata'), false)
    }
    setAiLoading(false)
  }

  const inp: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    padding: '0.6rem 0.85rem', color: '#f1f5f9', fontSize: 13, outline: 'none', width: '100%',
  }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }

  // ── EDIT VIEW ─────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setMode('list')} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{editId ? 'İçeriği Düzenle' : 'Yeni Konu İçeriği'}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelS}>Sınav Türü</label>
                <select value={form.exam_type} onChange={e => setForm(f => ({ ...f, exam_type: e.target.value }))} style={sel}>
                  {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelS}>Ders</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={sel}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelS}>Konu Adı *</label>
              <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="ör. Bileşik Faiz" style={inp} />
            </div>

            {/* AI Panel */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, padding: '1rem', marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 10 }}>✨ AI ile İçerik Üret</p>
              <div style={{ marginBottom: 10 }}>
                <label style={labelS}>Seviye</label>
                <select value={aiLevel} onChange={e => setAiLevel(e.target.value as typeof aiLevel)} style={{ ...sel, width: '100%' }}>
                  <option value="beginner">Temel</option>
                  <option value="intermediate">Orta</option>
                  <option value="advanced">İleri</option>
                </select>
              </div>
              <button onClick={generateWithAI} disabled={aiLoading || !form.topic.trim()} style={{
                width: '100%', padding: '0.6rem', borderRadius: 8, background: aiLoading ? '#334155' : '#7c3aed',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: aiLoading ? 'default' : 'pointer',
              }}>
                {aiLoading ? 'Üretiliyor...' : '✨ AI ile Yaz'}
              </button>
              {aiLoading && <p style={{ fontSize: 11, color: '#64748b', marginTop: 6, textAlign: 'center' }}>AI içerik hazırlıyor...</p>}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveForm} disabled={saving} style={{
                flex: 1, padding: '0.65rem', borderRadius: 9, background: '#f59e0b', border: 'none',
                color: '#0f172a', fontWeight: 700, fontSize: 13, cursor: saving ? 'default' : 'pointer',
              }}>
                {saving ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button onClick={() => setMode('list')} style={{
                padding: '0.65rem 1rem', borderRadius: 9, background: 'transparent',
                border: '1px solid #334155', color: '#94a3b8', fontSize: 13, cursor: 'pointer',
              }}>
                İptal
              </button>
            </div>
          </div>

          {/* Markdown editor */}
          <div>
            <label style={{ ...labelS, marginBottom: 8 }}>İçerik (Markdown) *</label>
            <textarea
              value={form.content_markdown}
              onChange={e => setForm(f => ({ ...f, content_markdown: e.target.value }))}
              placeholder="## Temel Kavramlar&#10;&#10;İçeriği buraya yazın veya AI ile üretin..."
              rows={28}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.65, fontFamily: 'monospace', fontSize: 12 }}
            />
            <p style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>Markdown + LaTeX ($formül$) desteklenmektedir.</p>
          </div>
        </div>

        {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Konu İçerikleri</h1>
        <button onClick={openAdd} style={{
          padding: '0.6rem 1.1rem', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
        }}>+ Yeni İçerik</button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Konu veya ders ara..."
        style={{ ...inp, maxWidth: 280, marginBottom: 16 }} />

      {loading ? (
        <p style={{ color: '#64748b' }}>Yükleniyor...</p>
      ) : (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Konu', 'Ders', 'Sınav', 'İçerik (önizleme)', 'İşlem'].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ ...tdS, textAlign: 'center', padding: '2rem', color: '#475569' }}>İçerik bulunamadı.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ ...tdS, fontWeight: 600, color: '#f1f5f9' }}>{r.topic}</td>
                  <td style={{ ...tdS, color: '#94a3b8' }}>{r.subject}</td>
                  <td style={tdS}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: '#334155', color: '#94a3b8' }}>
                      {r.exam_type}
                    </span>
                  </td>
                  <td style={{ ...tdS, maxWidth: 280 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260, fontSize: 12, color: '#475569' }}>
                      {r.content_markdown.slice(0, 100)}...
                    </div>
                  </td>
                  <td style={tdS}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(r)} style={editBtnS}>Düzenle</button>
                      <button onClick={() => deleteRow(r.id)} style={delBtnS}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  )
}

const labelS: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }
const thS: React.CSSProperties = { padding: '0.6rem 0.9rem', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #334155' }
const tdS: React.CSSProperties = { padding: '0.65rem 0.9rem', borderBottom: '1px solid #1e293b', fontSize: 13, color: '#cbd5e1', verticalAlign: 'middle' }
const editBtnS: React.CSSProperties = { padding: '3px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', cursor: 'pointer' }
const delBtnS: React.CSSProperties = { padding: '3px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer' }

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: ok ? '#166534' : '#7f1d1d',
      border: `1px solid ${ok ? '#16a34a' : '#991b1b'}`,
      color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 10, fontSize: 13, fontWeight: 500,
    }}>{msg}</div>
  )
}
