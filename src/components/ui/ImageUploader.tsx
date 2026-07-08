import { useRef, useState } from 'react'
import { Upload, Link as LinkIcon, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const DEFAULT_BUCKET = 'question-images'

export function ImageUploader({
  label,
  value,
  onChange,
  bucket = DEFAULT_BUCKET,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  bucket?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(data.publicUrl)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const applyUrl = () => {
    if (urlInput.trim()) onChange(urlInput.trim())
    setUrlInput('')
    setUrlMode(false)
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>

      {/* Preview */}
      {value && (
        <div className="mb-2 relative inline-block">
          <img src={value} alt="preview" className="max-h-28 rounded-lg border border-slate-700 object-contain bg-slate-900" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
            title="Görseli kaldır"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {/* Dosya yükle */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {/* URL yapıştır */}
        <button
          type="button"
          onClick={() => setUrlMode(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL Yapıştır
        </button>
      </div>

      {/* URL input */}
      {urlMode && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            placeholder="https://..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-500 transition-colors"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-600 text-white hover:bg-slate-500 transition-colors"
          >
            Ekle
          </button>
        </div>
      )}
    </div>
  )
}
