import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateJSON } from '@/lib/ai/gemini'
import { downloadTemplate, parseQuestionExcel, type ImportedQuestion, type RowError } from '@/lib/excelImport'
import type { QuestionBankRow } from '@/lib/supabase/types'
import { Plus, Sparkles, ArrowLeft, Search, Pencil, Trash2, Loader2, FileDown, FileUp, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { TABLE_WRAP, TABLE_WRAP_STYLE, TH, TH_BORDER_STYLE, TD, TD_BORDER_STYLE, TR_HOVER, FILTER_SELECT } from '@/components/ui/table'

const EXAM_OPTIONS = [
  { value: 'LEVEL_1', label: 'Aktüer 1' },
  { value: 'LEVEL_2', label: 'Aktüer 2' },
  { value: 'LEVEL_3', label: 'Aktüer 3' },
  { value: 'LEVEL_4', label: 'Aktüer 4' },
  { value: 'SEGEM_TPYS', label: 'SEGEM/TPYS' },
]
const examLabel = (v: string) => EXAM_OPTIONS.find(o => o.value === v)?.label ?? v
const SUBJECT_OPTIONS = [
  // LEVEL 1
  { value: 'matematik',             label: 'Matematik (1.3)' },
  { value: 'finansal-matematik',    label: 'Finansal Matematik (1.1)' },
  { value: 'istatistik',            label: 'İstatistik (1.2)' },
  { value: 'olasilik',              label: 'Olasılık (1.2)' },
  { value: 'mevzuat',               label: 'Temel Sigortacılık ve Ekonomi (1.4)' },
  // LEVEL 2
  { value: 'sigorta-matematigi',    label: 'Sigorta Matematiği (2.1)' },
  { value: 'risk-analizi',          label: 'Risk Analizi ve Aktüeryal Modelleme (2.2)' },
  { value: 'finans-teorisi',        label: 'Finans Teorisi ve Uygulamaları (2.3)' },
  { value: 'muhasebe',              label: 'Muhasebe ve Finansal Raporlama (2.4)' },
  // LEVEL 3
  { value: 'hayat-sigortalari',     label: 'Hayat Sigortaları (3.1)' },
  { value: 'hayatdisi-sigortalar',  label: 'Hayat Dışı Sigortalar (3.2)' },
  { value: 'saglik-sigortalari',    label: 'Sağlık Sigortaları (3.3)' },
  { value: 'emeklilik',             label: 'Emeklilik Sistemleri (3.4)' },
  { value: 'finans-yatirim',        label: 'Finans, Yatırım ve Risk Yönetimi (3.5)' },
  // Legacy / TPYS
  { value: 'hayat-sigortasi',       label: 'Hayat Sigortası (eski)' },
  { value: 'yangin-sigortasi',      label: 'Yangın Sigortası (eski)' },
]
type Mode = 'list' | 'edit' | 'add'

interface QForm {
  exam_type: string; subject: string; topic: string
  question_text: string; question_image_url: string
  opt_a: string; opt_a_img: string
  opt_b: string; opt_b_img: string
  opt_c: string; opt_c_img: string
  opt_d: string; opt_d_img: string
  correct_answer: string; explanation: string
}

const emptyForm = (): QForm => ({
  exam_type: 'LEVEL_1', subject: 'matematik', topic: '',
  question_text: '', question_image_url: '',
  opt_a: '', opt_a_img: '',
  opt_b: '', opt_b_img: '',
  opt_c: '', opt_c_img: '',
  opt_d: '', opt_d_img: '',
  correct_answer: 'A', explanation: '',
})

type OptionVal = { text: string; image_url?: string | null } | string

const parseOpt = (v: unknown): { text: string; image_url: string } => {
  if (typeof v === 'string') return { text: v, image_url: '' }
  if (v && typeof v === 'object' && 'text' in v) {
    const o = v as { text?: unknown; image_url?: unknown }
    return { text: String(o.text ?? ''), image_url: String(o.image_url ?? '') }
  }
  return { text: '', image_url: '' }
}

const rowToForm = (r: QuestionBankRow): QForm => {
  const opts = r.options_json as Record<string, OptionVal>
  const a = parseOpt(opts['A']); const b = parseOpt(opts['B'])
  const c = parseOpt(opts['C']); const d = parseOpt(opts['D'])
  return {
    exam_type: r.exam_type, subject: r.subject, topic: r.topic,
    question_text: r.question_text,
    question_image_url: r.question_image_url ?? '',
    opt_a: a.text, opt_a_img: a.image_url,
    opt_b: b.text, opt_b_img: b.image_url,
    opt_c: c.text, opt_c_img: c.image_url,
    opt_d: d.text, opt_d_img: d.image_url,
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
  const [topicOptions, setTopicOptions] = useState<{ value: string; label: string }[]>([])
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterExam, setFilterExam] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [search, setSearch] = useState('')
  const [showAi, setShowAi] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiCount, setAiCount] = useState(5)
  const [aiExam, setAiExam] = useState('LEVEL_1')
  const [aiSubject, setAiSubject] = useState('matematik')
  const [aiLoading, setAiLoading] = useState(false)
  const [importPreview, setImportPreview] = useState<{ fileName: string; valid: ImportedQuestion[]; errors: RowError[] } | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  const handleExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // aynı dosya tekrar seçilebilsin
    if (!file) return
    try {
      const result = await parseQuestionExcel(file)
      if (result.valid.length === 0 && result.errors.length === 0) {
        showToast('Dosyada soru bulunamadı.', false)
        return
      }
      setImportPreview({ fileName: file.name, ...result })
    } catch {
      showToast('Dosya okunamadı. Geçerli bir .xlsx dosyası seçin.', false)
    }
  }

  const runImport = async () => {
    if (!importPreview || importPreview.valid.length === 0) return
    setImporting(true)
    const { error } = await supabase.from('question_bank').insert(importPreview.valid as never)
    setImporting(false)
    if (error) {
      showToast('İçe aktarma başarısız: ' + error.message, false)
      return
    }
    showToast(`${importPreview.valid.length} soru içe aktarıldı.`)
    setImportPreview(null)
    load()
  }

  // Form'daki exam_type veya subject değiştiğinde konuları yeniden yükle
  useEffect(() => {
    if (mode === 'list') return
    const loadTopics = async () => {
      setTopicsLoading(true)
      const { data } = await supabase
        .from('topic_content')
        .select('topic')
        .eq('exam_type', form.exam_type)
        .eq('subject', form.subject)
        .order('topic')
      const opts = (data ?? []).map((r: { topic: string }) => ({ value: r.topic, label: r.topic }))
      setTopicOptions(opts)
      setTopicsLoading(false)
    }
    loadTopics()
  }, [form.exam_type, form.subject, mode])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('question_bank').select('*').order('created_at', { ascending: false })
    setRows((data ?? []) as QuestionBankRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r => {
    if (filterExam && r.exam_type !== filterExam) return false
    if (filterSubject && r.subject !== filterSubject) return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.question_text.toLowerCase().includes(q) && !r.topic.toLowerCase().includes(q)) return false
    }
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
      exam_type: form.exam_type, subject: form.subject, topic: form.topic.trim(),
      difficulty: 'medium', question_text: form.question_text.trim(),
      question_image_url: form.question_image_url.trim() || null,
      options_json: {
        A: { text: form.opt_a, image_url: form.opt_a_img.trim() || null },
        B: { text: form.opt_b, image_url: form.opt_b_img.trim() || null },
        C: { text: form.opt_c, image_url: form.opt_c_img.trim() || null },
        D: { text: form.opt_d, image_url: form.opt_d_img.trim() || null },
      },
      correct_answer: form.correct_answer,
      explanation: form.explanation.trim() || null,
      is_active: true, updated_at: new Date().toISOString(),
    }
    if (mode === 'edit' && editId) {
      const { error } = await supabase.from('question_bank').update(payload as never).eq('id', editId)
      if (error) showToast('Güncelleme başarısız: ' + error.message, false)
      else { showToast('Soru güncellendi.'); setMode('list'); load() }
    } else {
      const { error } = await supabase.from('question_bank').insert(payload as never)
      if (error) showToast('Ekleme başarısız: ' + error.message, false)
      else { showToast('Soru eklendi.'); setMode('list'); load() }
    }
    setSaving(false)
  }

  const deleteRow = async () => {
    if (!deleteId) return
    await supabase.from('question_bank').delete().eq('id', deleteId)
    setRows(prev => prev.filter(r => r.id !== deleteId))
    showToast('Soru silindi.')
    setDeleteId(null)
  }

  const toggleActive = async (r: QuestionBankRow) => {
    await supabase.from('question_bank').update({ is_active: !r.is_active } as never).eq('id', r.id)
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x))
  }

  const generateWithAI = async () => {
    if (!aiTopic.trim()) { showToast('Konu yazın.', false); return }
    setAiLoading(true)
    try {
      const prompt = `Aktüerlik sınavı (${aiExam}) için "${aiSubject}" dersinden "${aiTopic}" konusunda ${aiCount} adet çoktan seçmeli soru üret.

Her soru JSON formatında olsun:
[{"question_text":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answer":"A","explanation":"..."}]

Sadece JSON array döndür, başka metin ekleme.`

      type AIQ = { question_text: string; options: Record<string, string>; correct_answer: string; explanation: string }
      const aiQuestions = await generateJSON<AIQ[]>(prompt, 'Sen bir aktüerlik sınavı soru yazarısın. Sadece JSON formatında cevap ver.')

      let inserted = 0
      for (const q of aiQuestions) {
        const { error } = await supabase.from('question_bank').insert({
          exam_type: aiExam, subject: aiSubject, topic: aiTopic.trim(),
          difficulty: 'medium', question_text: q.question_text,
          question_image_url: null,
          options_json: {
            A: { text: q.options['A'] ?? '', image_url: null },
            B: { text: q.options['B'] ?? '', image_url: null },
            C: { text: q.options['C'] ?? '', image_url: null },
            D: { text: q.options['D'] ?? '', image_url: null },
          },
          correct_answer: q.correct_answer,
          explanation: q.explanation ?? null, is_active: true,
        } as never)
        if (!error) inserted++
      }
      showToast(`${inserted} soru eklendi.`)
      setShowAi(false)
      setAiTopic('')
      load()
    } catch (e) {
      showToast('AI üretimi başarısız: ' + (e instanceof Error ? e.message : 'Hata'), false)
    }
    setAiLoading(false)
  }

  const setF = (key: keyof QForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const setImg = (key: keyof QForm) => (url: string) => setForm(f => ({ ...f, [key]: url }))

  // ── FORM VIEW ────────────────────────────────────────
  if (mode === 'edit' || mode === 'add') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('list')} className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-100">
            {mode === 'add' ? 'Yeni Soru Ekle' : 'Soruyu Düzenle'}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
          {/* ── Ana içerik: soru metni + şıklar ── */}
          <Card>
            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Soru Metni *</label>
                <textarea
                  value={form.question_text}
                  onChange={setF('question_text')}
                  placeholder="Soru metnini buraya yazın..."
                  rows={5}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors resize-y leading-relaxed w-full"
                />
                <ImageUploader label="Soru Görseli (isteğe bağlı)" value={form.question_image_url} onChange={setImg('question_image_url')} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Şıklar *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const textKey = `opt_${opt.toLowerCase()}` as keyof QForm
                    const imgKey = `opt_${opt.toLowerCase()}_img` as keyof QForm
                    const isCorrect = form.correct_answer === opt
                    return (
                      <div
                        key={opt}
                        className="rounded-lg border p-3 space-y-2.5 transition-colors"
                        style={{
                          borderColor: isCorrect ? 'rgba(34,197,94,0.4)' : 'rgb(51 65 85)',
                          background: isCorrect ? 'rgba(34,197,94,0.06)' : 'rgba(15,23,42,0.4)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Input
                            label={`Şık ${opt} *`}
                            value={form[textKey] as string}
                            onChange={setF(textKey)}
                            placeholder={`Şık ${opt} metni...`}
                          />
                        </div>
                        <ImageUploader
                          label={`Şık ${opt} Görseli (isteğe bağlı)`}
                          value={form[imgKey] as string}
                          onChange={setImg(imgKey)}
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, correct_answer: opt }))}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer"
                          style={isCorrect ? {
                            background: 'rgba(34,197,94,0.12)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)',
                          } : {
                            background: 'transparent', color: '#64748b', borderColor: 'rgba(148,163,184,0.2)',
                          }}
                        >
                          {isCorrect ? '✓ Doğru Cevap' : 'Doğru cevap olarak işaretle'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Açıklama</label>
                <textarea
                  value={form.explanation}
                  onChange={setF('explanation')}
                  placeholder="Çözüm açıklaması..."
                  rows={3}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors resize-y leading-relaxed w-full"
                />
              </div>
            </div>
          </Card>

          {/* ── Yan panel: sınıflandırma + kaydet ── */}
          <div className="flex flex-col gap-5 xl:sticky xl:top-6">
            <Card>
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sınıflandırma</p>
                <Select label="Sınav Türü" options={EXAM_OPTIONS} value={form.exam_type} onChange={setF('exam_type')} />
                <Select label="Ders" options={SUBJECT_OPTIONS} value={form.subject} onChange={setF('subject')} />

                {/* Konu: topic_content'ten dropdown + manuel girme seçeneği */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Konu *{topicsLoading && <span className="ml-1 font-normal normal-case text-slate-600">(yükleniyor...)</span>}
                  </label>
                  {topicOptions.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <select
                        value={topicOptions.some(o => o.value === form.topic) ? form.topic : '__custom__'}
                        onChange={e => {
                          if (e.target.value !== '__custom__') setForm(f => ({ ...f, topic: e.target.value }))
                          else setForm(f => ({ ...f, topic: '' }))
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500 transition-colors"
                      >
                        {topicOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        <option value="__custom__">— Manuel gir —</option>
                      </select>
                      {/* Eğer dropdown'da yoksa veya manuel seçildiyse text input göster */}
                      {!topicOptions.some(o => o.value === form.topic) && (
                        <input
                          value={form.topic}
                          onChange={setF('topic')}
                          placeholder="Konu adı yaz..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      value={form.topic}
                      onChange={setF('topic')}
                      placeholder={topicsLoading ? 'Yükleniyor...' : 'Konu adı yaz (önce Konu İçerikleri\'nden ekleyin)'}
                      disabled={topicsLoading}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors disabled:opacity-40"
                    />
                  )}
                  <p className="text-xs text-slate-600">
                    Konular &quot;Konu İçerikleri&quot; sayfasından yönetilir. Listede yoksa manuel yazabilirsiniz.
                  </p>
                </div>

                <Select
                  label="Doğru Cevap *"
                  options={[{ value: 'A', label: 'Şık A' }, { value: 'B', label: 'Şık B' }, { value: 'C', label: 'Şık C' }, { value: 'D', label: 'Şık D' }]}
                  value={form.correct_answer}
                  onChange={setF('correct_answer')}
                />
              </div>
            </Card>

            <Card>
              <div className="flex gap-3">
                <Button variant="primary" loading={saving} onClick={saveForm} className="flex-1">
                  {mode === 'add' ? 'Soru Ekle' : 'Güncelle'}
                </Button>
                <Button variant="secondary" onClick={() => setMode('list')}>İptal</Button>
              </div>
            </Card>
          </div>
        </div>

        {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Soru Bankası"
        count={filtered.length}
        actions={
          <>
            <Button variant="secondary" onClick={downloadTemplate}>
              <FileDown className="w-4 h-4" /> Şablon İndir
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <FileUp className="w-4 h-4" /> Excel'den Aktar
            </Button>
            <Button variant="ai" onClick={() => setShowAi(v => !v)}>
              <Sparkles className="w-4 h-4" /> AI ile Üret
            </Button>
            <Button variant="primary" onClick={openAdd}>
              <Plus className="w-4 h-4" /> Manuel Ekle
            </Button>
          </>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelFile}
        className="hidden"
      />

      {/* Excel içe aktarma önizlemesi */}
      {importPreview && (
        <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <FileUp className="w-4 h-4" /> Excel Önizleme — {importPreview.fileName}
            </p>
            <button onClick={() => setImportPreview(null)} className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{importPreview.valid.length} geçerli soru</span>
            {importPreview.errors.length > 0 && (
              <span className="text-red-400 font-semibold"> · {importPreview.errors.length} hatalı satır (aktarılmayacak)</span>
            )}
          </p>

          {importPreview.errors.length > 0 && (
            <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1">
              {importPreview.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-300">Satır {err.row}: {err.message}</p>
              ))}
            </div>
          )}

          {importPreview.valid.length > 0 && (
            <div className="border border-slate-700/50 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-500">
                      <th className="px-3 py-2 text-left font-semibold">Konu</th>
                      <th className="px-3 py-2 text-left font-semibold">Soru</th>
                      <th className="px-3 py-2 text-left font-semibold">Sınav / Ders</th>
                      <th className="px-3 py-2 text-left font-semibold">Doğru</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.valid.map((q, i) => (
                      <tr key={i} className="border-t border-slate-800">
                        <td className="px-3 py-2 text-slate-200 font-medium whitespace-nowrap">{q.topic}</td>
                        <td className="px-3 py-2 text-slate-400 max-w-md truncate" title={q.question_text}>{q.question_text}</td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{examLabel(q.exam_type)} / {q.subject}</td>
                        <td className="px-3 py-2 text-emerald-400 font-bold">{q.correct_answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button variant="primary" loading={importing} onClick={runImport} disabled={importPreview.valid.length === 0}>
              <FileUp className="w-4 h-4" /> {importPreview.valid.length} Soruyu İçe Aktar
            </Button>
            <Button variant="secondary" onClick={() => setImportPreview(null)}>Vazgeç</Button>
          </div>
        </div>
      )}

      {/* AI Panel */}
      {showAi && (
        <div className="bg-violet-950/30 border border-violet-700/30 rounded-xl p-4 mb-5 space-y-3">
          <p className="text-sm font-bold text-violet-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI ile Soru Üret
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Select label="Sınav" options={EXAM_OPTIONS} value={aiExam} onChange={e => setAiExam(e.target.value)} />
            <Select label="Ders" options={SUBJECT_OPTIONS} value={aiSubject} onChange={e => setAiSubject(e.target.value)} />
            <Select label="Adet" value={String(aiCount)} onChange={e => setAiCount(Number(e.target.value))}
              options={[3,5,10,15,20].map(n => ({ value: String(n), label: `${n} soru` }))} />
          </div>
          <Input
            label="Konu *"
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            placeholder="ör. Bileşik Faiz, Mortalite Tabloları..."
          />
          <div className="flex items-center gap-3">
            <Button variant="ai" loading={aiLoading} onClick={generateWithAI}>
              <Sparkles className="w-4 h-4" /> Üret ve Kaydet
            </Button>
            {aiLoading && <span className="text-xs text-slate-500">AI soru üretiyor...</span>}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Soru veya konu ara..."
            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-600 w-52"
          />
        </div>
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)}
          style={FILTER_SELECT}>
          <option value="">Tüm Sınavlar</option>
          {EXAM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
          style={FILTER_SELECT}>
          <option value="">Tüm Dersler</option>
          {SUBJECT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <div className={TABLE_WRAP} style={TABLE_WRAP_STYLE}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={TH_BORDER_STYLE}>
                  <th className={TH}>Konu</th>
                  <th className={TH}>Soru</th>
                  <th className={TH}>Sınav / Ders</th>
                  <th className={TH}>Durum</th>
                  <th className={TH}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">
                      Soru bulunamadı.
                    </td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className={TR_HOVER} style={TD_BORDER_STYLE}>
                    <td className={TD}>
                      <span className="font-semibold text-slate-100">{r.topic}</span>
                    </td>
                    <td className={`${TD} max-w-xs`}>
                      <div className="flex items-center gap-2">
                        {r.question_image_url && (
                          <img src={r.question_image_url} alt="" className="w-8 h-8 rounded object-cover border border-slate-700 flex-shrink-0" />
                        )}
                        <p className="text-slate-500 truncate" title={r.question_text}>{r.question_text}</p>
                      </div>
                    </td>
                    <td className={TD}>
                      <p className="text-xs text-slate-400">{examLabel(r.exam_type)}</p>
                      <p className="text-xs text-slate-600">{r.subject}</p>
                    </td>
                    <td className={TD}>
                      <button
                        onClick={() => toggleActive(r)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
                        style={r.is_active ? {
                          background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.25)',
                        } : {
                          background: 'rgba(255,255,255,0.04)', color: '#64748b', borderColor: 'rgba(148,163,184,0.12)',
                        }}
                      >
                        {r.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className={TD}>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>
                          <Pencil className="w-3.5 h-3.5" /> Düzenle
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Soruyu Sil"
          message="Bu soruyu kalıcı olarak silmek istediğinize emin misiniz?"
          onConfirm={deleteRow}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
