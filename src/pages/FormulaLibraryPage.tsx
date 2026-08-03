import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateJSON } from '@/lib/ai/gemini'
import type { FormulaLibraryRow } from '@/lib/supabase/types'
import { Plus, ArrowLeft, Sparkles, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { TABLE_WRAP, TABLE_WRAP_STYLE, TH, TH_BORDER_STYLE, TD, TD_BORDER_STYLE, TR_HOVER } from '@/components/ui/table'

type Mode = 'list' | 'edit'
interface FForm {
  name: string; name_en: string; subject: string
  latex: string; description: string; tags: string; example: string
}
const emptyForm = (): FForm => ({ name: '', name_en: '', subject: '', latex: '', description: '', tags: '', example: '' })

const rowToForm = (r: FormulaLibraryRow): FForm => ({
  name: r.name, name_en: r.name_en, subject: r.subject,
  latex: r.latex, description: r.description,
  tags: (r.tags ?? []).join(', '), example: r.example ?? '',
})

export default function FormulaLibraryPage() {
  const [rows, setRows] = useState<FormulaLibraryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('list')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('formula_library').select('*').order('subject')
    setRows((data ?? []) as FormulaLibraryRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const existingSubjects = Array.from(new Set(rows.map(r => r.subject))).sort()

  const filtered = rows.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase()) ||
    (r.tags ?? []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd = () => { setForm(emptyForm()); setEditId(null); setMode('edit') }
  const openEdit = (r: FormulaLibraryRow) => { setForm(rowToForm(r)); setEditId(r.id); setMode('edit') }

  const saveForm = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.latex.trim()) {
      showToast('Ad, ders ve LaTeX zorunludur.', false); return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      subject: form.subject.trim(),
      latex: form.latex.trim(),
      description: form.description.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      example: form.example.trim() || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    }
    if (editId) {
      const { error } = await supabase.from('formula_library').update(payload as never).eq('id', editId)
      if (error) showToast('Güncelleme başarısız: ' + error.message, false)
      else { showToast('Formül güncellendi.'); setMode('list'); load() }
    } else {
      const { error } = await supabase.from('formula_library').insert(payload as never)
      if (error) showToast('Ekleme başarısız: ' + error.message, false)
      else { showToast('Formül eklendi.'); setMode('list'); load() }
    }
    setSaving(false)
  }

  const deleteRow = async () => {
    if (!deleteId) return
    await supabase.from('formula_library').delete().eq('id', deleteId)
    setRows(prev => prev.filter(r => r.id !== deleteId))
    showToast('Formül silindi.')
    setDeleteId(null)
  }

  const generateWithAI = async () => {
    if (!form.name.trim()) { showToast('Önce formül adını girin.', false); return }
    setAiLoading(true)
    try {
      const prompt = `Aktüerlik sınavına özgü "${form.name}" formülü için bilgi üret.
${form.subject ? `Ders: ${form.subject}` : ''}

JSON formatında dön:
{
  "name_en": "İngilizce adı",
  "latex": "KaTeX uyumlu LaTeX ifadesi (başına/sonuna $ koyma)",
  "description": "Türkçe, 1-2 cümlelik kısa açıklama",
  "tags": ["etiket1", "etiket2", "etiket3"]
}

Sadece JSON döndür, başka metin ekleme.`
      const result = await generateJSON<{ name_en: string; latex: string; description: string; tags: string[] }>(
        prompt, 'Sen bir aktüerya eğitmenisin. Sadece JSON formatında cevap ver.'
      )
      setForm(f => ({
        ...f,
        name_en: result.name_en ?? f.name_en,
        latex: result.latex ?? f.latex,
        description: result.description ?? f.description,
        tags: (result.tags ?? []).join(', ') || f.tags,
      }))
      showToast('AI önerisi dolduruldu, inceleyip kaydedin.')
    } catch (e) {
      showToast('AI hatası: ' + (e instanceof Error ? e.message : 'Hata'), false)
    }
    setAiLoading(false)
  }

  const setF = (key: keyof FForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  // ── EDIT VIEW ─────────────────────────────────────────
  if (mode === 'edit') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode('list')} className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-100">
            {editId ? 'Formülü Düzenle' : 'Yeni Formül'}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
          {/* Sol: formül içeriği */}
          <Card>
            <div className="space-y-4">
              <Input label="Formül Adı (TR) *" value={form.name} onChange={setF('name')} placeholder="ör. Net Tek Prim (Hayat Ömür Boyu)" />
              <Input label="Formül Adı (EN)" value={form.name_en} onChange={setF('name_en')} placeholder="ör. Net Single Premium (Whole Life)" />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">LaTeX İfadesi *</label>
                <textarea
                  value={form.latex}
                  onChange={setF('latex')}
                  placeholder="ör. A_x = \sum_{k=0}^{\infty} v^{k+1} \cdot {}_k p_x \cdot q_{x+k}"
                  rows={3}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors resize-y font-mono w-full"
                />
                <p className="text-xs text-slate-600">KaTeX uyumlu yazın, başına/sonuna $ işareti koymayın.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={setF('description')}
                  placeholder="Formülün kısa Türkçe açıklaması..."
                  rows={3}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors resize-y leading-relaxed w-full"
                />
              </div>

              <Input label="Etiketler (virgülle ayır)" value={form.tags} onChange={setF('tags')} placeholder="ör. net prim, mortalite, ömür boyu" />
              <Input label="Örnek (isteğe bağlı)" value={form.example} onChange={setF('example')} placeholder="Çözümlü kısa örnek..." />
            </div>
          </Card>

          {/* Sağ: sınıflandırma + AI + kaydet */}
          <div className="flex flex-col gap-5 xl:sticky xl:top-6">
            <Card>
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ders</p>
                {existingSubjects.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <select
                      value={existingSubjects.includes(form.subject) ? form.subject : '__custom__'}
                      onChange={e => {
                        if (e.target.value !== '__custom__') setForm(f => ({ ...f, subject: e.target.value }))
                        else setForm(f => ({ ...f, subject: '' }))
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-slate-500 transition-colors"
                    >
                      <option value="__custom__">— Yeni ders yaz —</option>
                      {existingSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {!existingSubjects.includes(form.subject) && (
                      <input
                        value={form.subject}
                        onChange={setF('subject')}
                        placeholder="ör. Hayat Sigortacılığı"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors"
                      />
                    )}
                  </div>
                ) : (
                  <input
                    value={form.subject}
                    onChange={setF('subject')}
                    placeholder="ör. Hayat Sigortacılığı"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors"
                  />
                )}
              </div>
            </Card>

            <Card>
              <div className="bg-violet-950/30 -m-5 p-4 rounded-xl space-y-3" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
                <p className="text-xs font-bold text-violet-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI ile Doldur
                </p>
                <p className="text-xs text-slate-500">Formül adını yazıp AI'a LaTeX, açıklama ve etiketleri ürettir.</p>
                <Button
                  variant="ai"
                  className="w-full justify-center"
                  loading={aiLoading}
                  disabled={!form.name.trim()}
                  onClick={generateWithAI}
                >
                  <Sparkles className="w-4 h-4" />
                  {aiLoading ? 'Üretiliyor...' : 'AI ile Üret'}
                </Button>
              </div>
            </Card>

            <Card>
              <div className="flex gap-3">
                <Button variant="primary" loading={saving} onClick={saveForm} className="flex-1">
                  {editId ? 'Güncelle' : 'Kaydet'}
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
        title="Formül Kütüphanesi"
        count={filtered.length}
        actions={
          <Button variant="primary" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Yeni Formül
          </Button>
        }
      />

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Formül, ders veya etiket ara..."
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
                  <th className={TH}>Formül</th>
                  <th className={TH}>Ders</th>
                  <th className={TH}>Etiketler</th>
                  <th className={TH}>Durum</th>
                  <th className={TH}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-600">Formül bulunamadı.</td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className={TR_HOVER} style={TD_BORDER_STYLE}>
                    <td className={TD}>
                      <span className="font-semibold text-slate-100">{r.name}</span>
                      <p className="text-xs text-slate-600">{r.name_en}</p>
                    </td>
                    <td className={`${TD} text-slate-400`}>{r.subject}</td>
                    <td className={`${TD} max-w-xs`}>
                      <div className="flex flex-wrap gap-1">
                        {(r.tags ?? []).slice(0, 3).map(t => <Badge key={t}>{t}</Badge>)}
                      </div>
                    </td>
                    <td className={TD}>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold border" style={r.is_active ? {
                        background: 'rgba(34,197,94,0.1)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.25)',
                      } : {
                        background: 'rgba(255,255,255,0.04)', color: '#64748b', borderColor: 'rgba(148,163,184,0.12)',
                      }}>
                        {r.is_active ? 'Aktif' : 'Pasif'}
                      </span>
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
          title="Formülü Sil"
          message="Bu formülü kalıcı olarak silmek istediğinize emin misiniz?"
          onConfirm={deleteRow}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
