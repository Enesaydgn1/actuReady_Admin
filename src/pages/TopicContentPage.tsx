import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateText } from '@/lib/ai/gemini'
import type { TopicContentRow } from '@/lib/supabase/types'
import { Plus, ArrowLeft, Sparkles, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { isHtmlContent, markdownToEditorHtml, stripHtmlToText } from '@/lib/contentFormat'
import { TABLE_WRAP, TABLE_WRAP_STYLE, TH, TH_BORDER_STYLE, TD, TD_BORDER_STYLE, TR_HOVER } from '@/components/ui/table'

const EXAM_OPTIONS = [
  { value: 'LEVEL_1', label: 'Aktüer 1' }, { value: 'LEVEL_2', label: 'Aktüer 2' },
  { value: 'LEVEL_3', label: 'Aktüer 3' }, { value: 'LEVEL_4', label: 'Aktüer 4' },
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

type Mode = 'list' | 'edit'
interface CForm {
  exam_type: string; subject: string; topic: string; content_markdown: string
}
const emptyForm = (): CForm => ({ exam_type: 'LEVEL_1', subject: 'matematik', topic: '', content_markdown: '' })

export default function TopicContentPage() {
  const [rows, setRows] = useState<TopicContentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('topic_content').select('*').order('subject')
    setRows((data ?? []) as TopicContentRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = rows.filter(r =>
    !search || r.topic.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setMode('edit') }
  const openEdit = (r: TopicContentRow) => {
    // Eski kayıtlar markdown olabilir — görsel editöre yüklemeden önce HTML'e çevir
    const html = isHtmlContent(r.content_markdown) ? r.content_markdown : markdownToEditorHtml(r.content_markdown)
    setForm({ exam_type: r.exam_type, subject: r.subject, topic: r.topic, content_markdown: html })
    setEditId(r.id)
    setMode('edit')
  }

  const saveForm = async () => {
    if (!form.topic.trim() || !stripHtmlToText(form.content_markdown)) {
      showToast('Konu ve içerik zorunludur.', false); return
    }
    setSaving(true)
    const payload = {
      exam_type: form.exam_type, subject: form.subject,
      topic: form.topic.trim(), difficulty: 'intermediate',
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

  const deleteRow = async () => {
    if (!deleteId) return
    await supabase.from('topic_content').delete().eq('id', deleteId)
    setRows(prev => prev.filter(r => r.id !== deleteId))
    showToast('İçerik silindi.')
    setDeleteId(null)
  }

  const generateWithAI = async () => {
    if (!form.topic.trim()) { showToast('Önce konu adını girin.', false); return }
    setAiLoading(true)
    try {
      const prompt = `Aktüerlik sınavı (${form.exam_type}) için "${form.subject}" dersinden "${form.topic}" konusunu öğrencilere öğret.

Markdown formatında şu bölümleri içersin:
## Temel Kavramlar
## Formüller
## Adım Adım Örnek
## Sınav İpuçları
## ⚡ Kritik Notlar

Türkçe yaz. Aktüerlik sınavına özgü içerik olsun.`

      const content = await generateText(prompt, 'Sen bir aktüerlik sınavı eğitmenisin.')
      setForm(f => ({ ...f, content_markdown: markdownToEditorHtml(content) }))
      showToast('İçerik üretildi, inceleyip kaydedin.')
    } catch (e) {
      showToast('AI hatası: ' + (e instanceof Error ? e.message : 'Hata'), false)
    }
    setAiLoading(false)
  }

  // ── EDIT VIEW ─────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('list')} className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-100">
            {editId ? 'İçeriği Düzenle' : 'Yeni Konu İçeriği'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left: settings + AI */}
          <Card>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select label="Sınav Türü" options={EXAM_OPTIONS} value={form.exam_type}
                  onChange={e => setForm(f => ({ ...f, exam_type: e.target.value }))} />
                <Select label="Ders" options={SUBJECT_OPTIONS} value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>

              <Input
                label="Konu Adı *"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="ör. Bileşik Faiz"
              />

              {/* AI panel */}
              <div className="bg-violet-950/30 border border-violet-700/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-violet-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI ile İçerik Üret
                </p>
                <p className="text-xs text-slate-500">
                  Seçili ders ve sınav türü için konu içeriği üretir.
                </p>
                <Button
                  variant="ai"
                  className="w-full justify-center"
                  loading={aiLoading}
                  disabled={!form.topic.trim()}
                  onClick={generateWithAI}
                >
                  <Sparkles className="w-4 h-4" />
                  {aiLoading ? 'Üretiliyor...' : 'AI ile Yaz'}
                </Button>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="primary" loading={saving} onClick={saveForm} className="flex-1 justify-center">
                  {editId ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button variant="secondary" onClick={() => setMode('list')}>İptal</Button>
              </div>
            </div>
          </Card>

          {/* Right: rich text editor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              İçerik *
            </label>
            <RichTextEditor
              content={form.content_markdown}
              onChange={html => setForm(f => ({ ...f, content_markdown: html }))}
            />
            <p className="text-xs text-slate-600">
              Word gibi doğrudan yazabilirsiniz — başlık, liste ve vurgu için üstteki araç çubuğunu,
              matematik formülü için ∑ butonunu kullanın. Öğrenci tarafında birebir bu görünümle yayınlanır.
            </p>
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
        title="Konu İçerikleri"
        count={filtered.length}
        actions={
          <>
            <Button variant="primary" onClick={openAdd}>
              <Plus className="w-4 h-4" /> Yeni İçerik
            </Button>
          </>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Konu veya ders ara..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-600"
        />
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
                  <th className={TH}>Ders</th>
                  <th className={TH}>Sınav</th>
                  <th className={TH}>İçerik</th>
                  <th className={TH}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">İçerik bulunamadı.</td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className={TR_HOVER} style={TD_BORDER_STYLE}>
                    <td className={`${TD} font-semibold text-slate-100`}>{r.topic}</td>
                    <td className={`${TD} text-slate-400`}>{r.subject}</td>
                    <td className={TD}><Badge>{examLabel(r.exam_type)}</Badge></td>
                    <td className={`${TD} max-w-xs`}>
                      <p className="text-xs text-slate-600 truncate">{stripHtmlToText(r.content_markdown).slice(0, 80)}...</p>
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
          title="İçeriği Sil"
          message="Bu konu içeriğini kalıcı olarak silmek istediğinize emin misiniz?"
          onConfirm={deleteRow}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
