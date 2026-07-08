import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ExamCalendarRow } from '@/lib/supabase/types'
import { Plus, Pencil, Trash2, Loader2, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

const EXAM_OPTIONS = [
  { value: 'LEVEL_1', label: 'Aktüer 1' }, { value: 'LEVEL_2', label: 'Aktüer 2' },
  { value: 'LEVEL_3', label: 'Aktüer 3' }, { value: 'LEVEL_4', label: 'Aktüer 4' },
  { value: 'SEGEM_TPYS', label: 'SEGEM/TPYS' },
]

const EVENT_TYPES = [
  { value: 'exam',         label: 'Sınav',     color: 'red' as const },
  { value: 'registration', label: 'Başvuru',   color: 'amber' as const },
  { value: 'result',       label: 'Sonuç',     color: 'green' as const },
  { value: 'deadline',     label: 'Son Tarih', color: 'red' as const },
]

interface CalForm {
  exam_type: string; label: string; event_date: string; event_type: string; description: string
}

const emptyForm = (): CalForm => ({
  exam_type: 'LEVEL_1', label: '', event_date: '', event_type: 'exam', description: '',
})

const rowToForm = (r: ExamCalendarRow): CalForm => ({
  exam_type: r.exam_type, label: r.label, event_date: r.event_date,
  event_type: r.event_type, description: r.description ?? '',
})

export default function ExamCalendarAdminPage() {
  const [rows, setRows] = useState<ExamCalendarRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CalForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterExam, setFilterExam] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('exam_calendar').select('*').order('event_date', { ascending: true })
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
      exam_type: form.exam_type, label: form.label.trim(),
      event_date: form.event_date, event_type: form.event_type,
      description: form.description.trim() || null, is_active: true,
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

  const deleteRow = async () => {
    if (!deleteId) return
    await supabase.from('exam_calendar').delete().eq('id', deleteId)
    setRows(prev => prev.filter(r => r.id !== deleteId))
    showToast('Etkinlik silindi.')
    setDeleteId(null)
  }

  const toggleActive = async (r: ExamCalendarRow) => {
    await supabase.from('exam_calendar').update({ is_active: !r.is_active } as never).eq('id', r.id)
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x))
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <PageHeader
        title="Sınav Takvimi"
        count={filtered.length}
        actions={
          <Button variant="primary" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Etkinlik Ekle
          </Button>
        }
      />

      {/* Filter */}
      <div className="flex gap-3 mb-5 items-center">
        <select
          value={filterExam}
          onChange={e => setFilterExam(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer"
        >
          <option value="">Tüm Sınavlar</option>
          {EXAM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Henüz etkinlik yok. Yukarıdan ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => {
            const evType = EVENT_TYPES.find(t => t.value === r.event_type)
            const isPast = r.event_date < today
            return (
              <div
                key={r.id}
                className={`bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 flex items-center gap-4 transition-opacity ${
                  !r.is_active ? 'opacity-40' : ''
                }`}
              >
                {/* Dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  isPast ? 'bg-slate-600' :
                  evType?.color === 'red' ? 'bg-red-500' :
                  evType?.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'
                }`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${isPast ? 'text-slate-500' : 'text-slate-100'}`}>
                      {r.label}
                    </span>
                    <Badge color={evType?.color ?? 'slate'}>{evType?.label ?? r.event_type}</Badge>
                    <Badge>{r.exam_type}</Badge>
                  </div>
                  {r.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                  )}
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${isPast ? 'text-slate-600' : 'text-slate-300'}`}>
                    {new Date(r.event_date + 'T00:00:00').toLocaleDateString('tr-TR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      r.is_active
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-slate-700/50 text-slate-500 border-slate-700'
                    }`}
                  >
                    {r.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'} onClose={closeForm}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Sınav Türü"
                options={EXAM_OPTIONS}
                value={form.exam_type}
                onChange={e => setForm(f => ({ ...f, exam_type: e.target.value }))}
              />
              <Select
                label="Etkinlik Türü"
                options={EVENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
                value={form.event_type}
                onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
              />
            </div>

            <Input
              label="Başlık *"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="ör. Aktüerlik L1 Bahar Sınavı"
            />

            <Input
              label="Tarih *"
              type="date"
              value={form.event_date}
              onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
            />

            <Input
              label="Açıklama"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="İsteğe bağlı açıklama..."
            />

            <div className="flex gap-3 pt-1">
              <Button variant="primary" loading={saving} onClick={saveForm} className="flex-1 justify-center">
                {editId ? 'Güncelle' : 'Ekle'}
              </Button>
              <Button variant="secondary" onClick={closeForm}>İptal</Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmModal
          title="Etkinliği Sil"
          message="Bu takvim etkinliğini kalıcı olarak silmek istediğinize emin misiniz?"
          onConfirm={deleteRow}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
