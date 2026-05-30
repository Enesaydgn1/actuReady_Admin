import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateJSON } from '@/lib/ai/gemini'
import type { QuestionBankRow } from '@/lib/supabase/types'

const EXAM_TYPES = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'SEGEM_TPYS']
const SUBJECTS = ['matematik', 'istatistik', 'mevzuat', 'olasilik', 'hayat-sigortasi', 'yangin-sigortasi']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const DIFF_LABELS: Record<string, string> = { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }
const DIFF_COLORS: Record<string, string> = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }

type Mode = 'list' | 'edit' | 'add'

interface QForm {
  exam_type: string
  subject: string
  topic: string
  difficulty: string
  question_text: string
  opt_a: string
  opt_b: string
  opt_c: string
  opt_d: string
  correct_answer: string
  explanation: string
}

const emptyForm = (): QForm => ({
  exam_type: 'LEVEL_1', subject: 'matematik', topic: '',
  difficulty: 'medium', question_text: '',
  opt_a: '', opt_b: '', opt_c: '', opt_d: '',
  correct_answer: 'A', explanation: '',
})

const rowToForm = (r: QuestionBankRow): QForm => {
  const opts = r.options_json as Record<string, string>
  return {
    exam_type: r.exam_type, subject: r.subject, topic: r.topic,
    difficulty: r.difficulty, question_text: r.question_text,
    opt_a: opts['A'] ?? '', opt_b: opts['B'] ?? '',
    opt_c: opts['C'] ?? '', opt_d: opts['D'] ?? '',
    correct_answer: r.correct_answer, explanation: r.explanation ?? '',
  }
}

export default function QuestionBankPage() {
  const [rows, setRows] = useState<QuestionBankRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<QForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Filters
  const [filterExam, setFilterExam] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const [search, setSearch] = useState('')

  // AI generation
  const [aiTopic, setAiTopic] = useState('')
  const [aiCount, setAiCount] = useState(5)
  const [aiDiff, setAiDiff] = useState('medium')
  const [aiExam, setAiExam] = useState('LEVEL_1')
  const [aiSubject, setAiSubject] = useState('matematik')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('question_bank')
      .select('*')
      .order('created_at', { ascending: false })
    setRows((data ?? []) as QuestionBankRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r => {
    if (filterExam && r.exam_type !== filterExam) return false
    if (filterSubject && r.subject !== filterSubject) return false
    if (filterDiff && r.difficulty !== filterDiff) return false
    if (search && !r.question_text.toLowerCase().includes(search.toLowerCase()) && !r.topic.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setMode('add') }
  const openEdit = (r: QuestionBankRow) => { setForm(rowToForm(r)); setEditId(r.id); setMode('edit') }

  const saveForm = async () => {
    if (!form.question_text.trim() || !form.topic.trim() || !form.opt_a || !form.opt_b || !form.opt_c || !form.opt_d) {
      showToast('Tüm zorunlu alanları doldurun.', false); return
    }
    setSaving(true)
    const payload = {
      exam_type: form.exam_type,
      subject: form.subject,
      topic: form.topic.trim(),
      difficulty: form.difficulty,
      question_text: form.question_text.trim(),
      options_json: { A: form.opt_a, B: form.opt_b, C: form.opt_c, D: form.opt_d },
      correct_answer: form.correct_answer,
      explanation: form.explanation.trim() || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    }
    if (mode === 'edit' && editId) {
      const { error } = await supabase.from('question_bank').update(payload as never).eq('id', editId)
      if (error) { showToast('Güncelleme başarısız: ' + error.message, false) }
      else { showToast('Soru güncellendi.'); setMode('list'); load() }
    } else {
      const { error } = await supabase.from('question_bank').insert(payload as never)
      if (error) { showToast('Ekleme başarısız: ' + error.message, false) }
      else { showToast('Soru eklendi.'); setMode('list'); load() }
    }
    setSaving(false)
  }

  const deleteRow = async (id: string) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
    await supabase.from('question_bank').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
    showToast('Soru silindi.')
  }

  const toggleActive = async (r: QuestionBankRow) => {
    await supabase.from('question_bank').update({ is_active: !r.is_active } as never).eq('id', r.id)
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x))
  }

  // ── AI Generation ──────────────────────────────────
  const generateWithAI = async () => {
    if (!aiTopic.trim()) { showToast('Konu yazın.', false); return }
    setAiLoading(true)
    try {
      const prompt = `Aktüerya sınavı (${aiExam}) için "${aiSubject}" dersinden "${aiTopic}" konusunda ${aiCount} adet ${DIFF_LABELS[aiDiff]} zorlukta çoktan seçmeli soru üret.

Her soru JSON formatında olsun:
[
  {
    "question_text": "Soru metni...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct_answer": "A",
    "explanation": "Açıklama..."
  }
]

Sadece JSON array döndür, başka metin ekleme.`

      type AIQ = { question_text: string; options: Record<string, string>; correct_answer: string; explanation: string }
      const aiQuestions = await generateJSON<AIQ[]>(prompt, 'Sen bir aktüerya sınavı soru yazarısın. Sadece JSON formatında cevap ver.')

      let inserted = 0
      for (const q of aiQuestions) {
        const { error } = await supabase.from('question_bank').insert({
          exam_type: aiExam,
          subject: aiSubject,
          topic: aiTopic.trim(),
          difficulty: aiDiff,
          question_text: q.question_text,
          options_json: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation ?? null,
          is_active: true,
        } as never)
        if (!error) inserted++
      }
      showToast(`${inserted} soru eklendi.`)
      setShowAiPanel(false)
      setAiTopic('')
      load()
    } catch (e) {
      showToast('AI üretimi başarısız: ' + (e instanceof Error ? e.message : 'Hata'), false)
    }
    setAiLoading(false)
  }

  const inp: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
    padding: '0.6rem 0.85rem', color: '#f1f5f9', fontSize: 13, outline: 'none', width: '100%',
  }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }

  // ── FORM VIEW ────────────────────────────────────────
  if (mode === 'edit' || mode === 'add') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setMode('list')} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{mode === 'add' ? 'Yeni Soru Ekle' : 'Soruyu Düzenle'}</h1>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '2rem', maxWidth: 700 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
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
            <div>
              <label style={labelS}>Zorluk</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={sel}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABELS[d]}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelS}>Konu *</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="ör. Faiz Teorisi" style={inp} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelS}>Soru Metni *</label>
            <textarea value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} placeholder="Soru metnini buraya yazın..." rows={4}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {(['A', 'B', 'C', 'D'] as const).map(opt => (
              <div key={opt}>
                <label style={labelS}>Şık {opt}</label>
                <input
                  value={form[`opt_${opt.toLowerCase()}` as 'opt_a']}
                  onChange={e => setForm(f => ({ ...f, [`opt_${opt.toLowerCase()}`]: e.target.value }))}
                  placeholder={`Şık ${opt}...`} style={inp}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelS}>Doğru Cevap *</label>
            <select value={form.correct_answer} onChange={e => setForm(f => ({ ...f, correct_answer: e.target.value }))} style={{ ...sel, width: 120 }}>
              {['A', 'B', 'C', 'D'].map(opt => <option key={opt} value={opt}>Şık {opt}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelS}>Açıklama</label>
            <textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="Çözüm açıklaması..." rows={3}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={saveForm} disabled={saving} style={{
              padding: '0.7rem 1.8rem', borderRadius: 9, background: '#f59e0b', border: 'none',
              color: '#0f172a', fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer',
            }}>
              {saving ? 'Kaydediliyor...' : mode === 'add' ? 'Soru Ekle' : 'Güncelle'}
            </button>
            <button onClick={() => setMode('list')} style={{
              padding: '0.7rem 1.2rem', borderRadius: 9, background: 'transparent',
              border: '1px solid #334155', color: '#94a3b8', fontSize: 14, cursor: 'pointer',
            }}>
              İptal
            </button>
          </div>
        </div>

        {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Soru Bankası</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowAiPanel(!showAiPanel)} style={{
            padding: '0.6rem 1.1rem', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa',
          }}>
            ✨ AI ile Üret
          </button>
          <button onClick={openAdd} style={{
            padding: '0.6rem 1.1rem', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
          }}>
            + Manuel Ekle
          </button>
        </div>
      </div>

      {/* AI Panel */}
      {showAiPanel && (
        <div style={{ background: '#1e293b', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '1.5rem', marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 16 }}>✨ AI ile Soru Üret</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Sınav Türü</label>
              <select value={aiExam} onChange={e => setAiExam(e.target.value)} style={sel}>
                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Ders</label>
              <select value={aiSubject} onChange={e => setAiSubject(e.target.value)} style={sel}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Zorluk</label>
              <select value={aiDiff} onChange={e => setAiDiff(e.target.value)} style={sel}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABELS[d]}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Soru Sayısı</label>
              <select value={aiCount} onChange={e => setAiCount(Number(e.target.value))} style={sel}>
                {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n} soru</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelS}>Konu *</label>
            <input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="ör. Bileşik Faiz, Mortalite Tabloları..." style={{ ...inp, maxWidth: 400 }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={generateWithAI} disabled={aiLoading} style={{
              padding: '0.65rem 1.4rem', borderRadius: 9, background: '#7c3aed', border: 'none',
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: aiLoading ? 'default' : 'pointer',
            }}>
              {aiLoading ? 'Üretiliyor...' : '✨ Üret ve Kaydet'}
            </button>
            {aiLoading && <span style={{ fontSize: 12, color: '#64748b' }}>AI soru üretiyor, lütfen bekleyin...</span>}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Soru veya konu ara..."
          style={{ ...inp, width: 220 }} />
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)} style={{ ...sel, width: 140 }}>
          <option value="">Tüm Sınavlar</option>
          {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ ...sel, width: 150 }}>
          <option value="">Tüm Dersler</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} style={{ ...sel, width: 120 }}>
          <option value="">Tüm Zorluklar</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABELS[d]}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>{filtered.length} soru</span>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Yükleniyor...</p>
      ) : (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Konu', 'Soru', 'Sınav / Ders', 'Zorluk', 'Durum', 'İşlem'].map(h => (
                  <th key={h} style={thS}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ ...tdS, textAlign: 'center', padding: '2rem', color: '#475569' }}>Soru bulunamadı.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{r.topic}</span>
                  </td>
                  <td style={{ ...tdS, maxWidth: 320 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300, fontSize: 12, color: '#94a3b8' }}
                      title={r.question_text}>
                      {r.question_text}
                    </div>
                  </td>
                  <td style={tdS}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.exam_type}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{r.subject}</div>
                  </td>
                  <td style={tdS}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: `${DIFF_COLORS[r.difficulty]}20`, color: DIFF_COLORS[r.difficulty],
                    }}>{DIFF_LABELS[r.difficulty]}</span>
                  </td>
                  <td style={tdS}>
                    <button onClick={() => toggleActive(r)} style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: r.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                      border: `1px solid ${r.is_active ? 'rgba(34,197,94,0.3)' : '#334155'}`,
                      color: r.is_active ? '#22c55e' : '#64748b', cursor: 'pointer',
                    }}>
                      {r.is_active ? 'Aktif' : 'Pasif'}
                    </button>
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
