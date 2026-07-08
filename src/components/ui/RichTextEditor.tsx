import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Node, mergeAttributes } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ── Formül düğümü: frontend'in beklediği <span data-math data-latex="..."> formatında kaydeder ──
function MathView({ node }: NodeViewProps) {
  const latex = node.attrs.latex as string
  let html = ''
  let hasError = false
  try {
    html = katex.renderToString(latex, { throwOnError: true, displayMode: false })
  } catch {
    hasError = true
  }
  return (
    <NodeViewWrapper
      as="span"
      className="inline-block align-middle px-1 rounded bg-violet-500/10 border border-violet-500/25 cursor-default select-none"
    >
      {hasError ? (
        <span className="text-red-400 text-xs font-mono">Hatalı formül</span>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </NodeViewWrapper>
  )
}

const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return { latex: { default: '' } }
  },
  parseHTML() {
    return [{
      tag: 'span[data-math]',
      getAttrs: el => ({ latex: (el as HTMLElement).getAttribute('data-latex') ?? '' }),
    }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-math': '', 'data-latex': node.attrs.latex as string }),
      node.attrs.latex as string,
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(MathView)
  },
})

const TEXT_COLORS = [
  { label: 'Varsayılan', value: '' },
  { label: 'Beyaz',      value: '#F4F6FA' },
  { label: 'Altın',      value: '#C9A84C' },
  { label: 'Yeşil',      value: '#34D399' },
  { label: 'Mavi',       value: '#60A5FA' },
  { label: 'Kırmızı',    value: '#F87171' },
  { label: 'Mor',        value: '#A78BFA' },
  { label: 'Turuncu',    value: '#FB923C' },
]

const HIGHLIGHT_COLORS = [
  { label: 'Yok',     value: '' },
  { label: 'Altın',   value: 'rgba(201,168,76,0.3)' },
  { label: 'Yeşil',   value: 'rgba(52,211,153,0.25)' },
  { label: 'Mavi',    value: 'rgba(96,165,250,0.25)' },
  { label: 'Kırmızı', value: 'rgba(248,113,113,0.25)' },
]

const MATH_TEMPLATES = [
  { label: 'Kesir',      latex: '\\frac{a}{b}' },
  { label: 'Üs',         latex: 'x^{n}' },
  { label: 'Alt indis',  latex: 'x_{i}' },
  { label: 'Kök',        latex: '\\sqrt{x}' },
  { label: 'Toplam Σ',   latex: '\\sum_{i=1}^{n} x_i' },
  { label: 'İntegral',   latex: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'Limit',      latex: '\\lim_{x \\to \\infty}' },
  { label: 'Olasılık P', latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}' },
  { label: 'Binom',      latex: '\\binom{n}{k}' },
  { label: 'Ortalama μ', latex: '\\mu = \\frac{1}{n}\\sum_{i=1}^n x_i' },
]

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolBtn({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`inline-flex items-center justify-center min-w-7 h-7 px-1 rounded text-[0.82rem] font-semibold cursor-pointer transition-colors ${
        active ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40' : 'bg-transparent text-slate-400 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-[18px] bg-slate-700 shrink-0" />
}

const SELECT_CLS = 'bg-slate-900 text-slate-300 border border-slate-700 rounded text-[0.8rem] px-1 h-7 cursor-pointer'

interface RichTextEditorProps {
  /** HTML içerik */
  content: string
  onChange: (html: string) => void
  minHeightPx?: number
}

export default function RichTextEditor({ content, onChange, minHeightPx = 520 }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [mathOpen, setMathOpen] = useState(false)
  const [mathInput, setMathInput] = useState('')
  const mathInputRef = useRef<HTMLTextAreaElement>(null)

  let previewHtml = ''
  let previewError = false
  if (mathInput.trim()) {
    try {
      previewHtml = katex.renderToString(mathInput, { throwOnError: true, displayMode: true })
    } catch {
      previewError = true
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      MathInline,
    ],
    content,
    editorProps: {
      attributes: { class: 'admin-rich-editor', spellcheck: 'false' },
    },
    onUpdate({ editor }) {
      onChangeRef.current(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content || '', { emitUpdate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  useEffect(() => {
    if (mathOpen) setTimeout(() => mathInputRef.current?.focus(), 50)
  }, [mathOpen])

  const insertMath = () => {
    if (!editor || !mathInput.trim() || previewError) return
    editor.chain().focus().insertContent({
      type: 'mathInline',
      attrs: { latex: mathInput.trim() },
    }).run()
    setMathInput('')
    setMathOpen(false)
  }

  const handleMathKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); insertMath() }
    if (e.key === 'Escape') { setMathOpen(false); setMathInput('') }
  }

  if (!editor) return null

  return (
    <div className="flex flex-col">

      {/* ── Toolbar ── */}
      <div className={`flex flex-wrap gap-1 items-center px-2 py-1.5 bg-slate-800 border border-slate-700 ${mathOpen ? 'rounded-t-xl border-b-transparent' : 'rounded-t-xl'}`}>
        <select
          className={SELECT_CLS}
          onChange={e => {
            const val = e.target.value
            if (val === '0') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(val) as 1 | 2 | 3 }).run()
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' : '0'
          }
        >
          <option value="0">Normal</option>
          <option value="1">Başlık 1</option>
          <option value="2">Başlık 2</option>
          <option value="3">Başlık 3</option>
        </select>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive('bold')}      title="Kalın (Ctrl+B)"><b>B</b></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive('italic')}    title="İtalik (Ctrl+I)"><i>I</i></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Altı çizili (Ctrl+U)"><u>U</u></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive('strike')}    title="Üstü çizili"><s>S</s></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()}      active={editor.isActive('code')}      title="Kod">{'<>'}</ToolBtn>

        <Divider />

        <div className="inline-flex items-center gap-0.5">
          <span className="text-xs text-slate-500">A</span>
          <select
            className={`${SELECT_CLS} max-w-[90px]`}
            onChange={e => {
              const val = e.target.value
              if (!val) editor.chain().focus().unsetColor().run()
              else editor.chain().focus().setColor(val).run()
            }}
          >
            {TEXT_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="inline-flex items-center gap-0.5">
          <span className="text-xs text-slate-500">🖊</span>
          <select
            className={`${SELECT_CLS} max-w-[80px]`}
            onChange={e => {
              const val = e.target.value
              if (!val) editor.chain().focus().unsetHighlight().run()
              else editor.chain().focus().setHighlight({ color: val }).run()
            }}
          >
            {HIGHLIGHT_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive('bulletList')}  title="Madde listesi">≡</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı liste">1≡</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive('blockquote')}  title="Önemli not / alıntı">"</ToolBtn>

        <Divider />

        <ToolBtn onClick={() => setMathOpen(o => !o)} active={mathOpen} title="Matematik formülü ekle">∑</ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Geri al">↩</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="İleri al">↪</ToolBtn>
      </div>

      {/* ── Matematik paneli ── */}
      {mathOpen && (
        <div className="bg-slate-800 border border-t-0 border-slate-700 px-3 py-3 flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-1.5">
            {MATH_TEMPLATES.map(tpl => (
              <button
                key={tpl.label}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => setMathInput(tpl.latex)}
                className="px-2 py-0.5 rounded text-xs bg-slate-900 text-slate-300 border border-slate-700 cursor-pointer hover:border-slate-500 transition-colors"
              >
                {tpl.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2.5">
            <div className="flex-1 flex flex-col gap-1.5">
              <textarea
                ref={mathInputRef}
                value={mathInput}
                onChange={e => setMathInput(e.target.value)}
                onKeyDown={handleMathKey}
                placeholder="LaTeX gir, ör: \frac{1}{2}mv^2"
                rows={2}
                className="resize-none bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono text-sm px-2.5 py-1.5 outline-none w-full focus:border-slate-500"
              />
              <p className="m-0 text-[0.72rem] text-slate-500">Enter ile ekle · Esc ile kapat · Shift+Enter = yeni satır</p>
            </div>

            <div className={`flex-1 min-h-[60px] bg-slate-900 border rounded px-2.5 py-1.5 flex items-center justify-center overflow-hidden ${previewError ? 'border-red-500/40' : 'border-slate-700'}`}>
              {!mathInput.trim() ? (
                <span className="text-slate-500 text-xs">Önizleme</span>
              ) : previewError ? (
                <span className="text-red-400 text-xs">Geçersiz formül</span>
              ) : (
                <span className="text-slate-100" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              )}
            </div>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={insertMath}
              disabled={!mathInput.trim() || previewError}
              className={`self-start h-9 px-4 rounded text-sm font-semibold border border-slate-700 transition-colors ${
                !mathInput.trim() || previewError
                  ? 'bg-transparent text-slate-500 opacity-50 cursor-default'
                  : 'bg-violet-600 text-white cursor-pointer hover:bg-violet-500'
              }`}
            >
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* ── Editör alanı ── */}
      <div
        className="bg-slate-800/60 border border-t-0 border-slate-700 rounded-b-xl px-4 py-3 overflow-y-auto"
        style={{ minHeight: minHeightPx, maxHeight: '70vh' }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .admin-rich-editor { outline: none; min-height: ${minHeightPx - 40}px; color: #cbd5e1; font-size: 0.92rem; line-height: 1.75; }
        .admin-rich-editor p { margin: 0 0 0.5rem; }
        .admin-rich-editor h1 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0.9rem 0 0.4rem; }
        .admin-rich-editor h2 { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; margin: 0.8rem 0 0.35rem; border-bottom: 1px solid #334155; padding-bottom: 0.25rem; }
        .admin-rich-editor h3 { font-size: 1.02rem; font-weight: 600; color: #e2e8f0; margin: 0.6rem 0 0.3rem; }
        .admin-rich-editor strong { font-weight: 700; color: #f1f5f9; }
        .admin-rich-editor em { font-style: italic; }
        .admin-rich-editor u { text-decoration: underline; }
        .admin-rich-editor s { text-decoration: line-through; opacity: 0.6; }
        .admin-rich-editor code { background: #0f172a; border-radius: 3px; padding: 1px 5px; font-size: 0.88em; font-family: monospace; color: #c4b5fd; }
        .admin-rich-editor pre { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 0.6rem 0.8rem; margin: 0.5rem 0; overflow-x: auto; }
        .admin-rich-editor blockquote { border-left: 3px solid #8b5cf6; padding-left: 1rem; margin: 0.5rem 0; color: #94a3b8; }
        .admin-rich-editor ul { list-style: disc; padding-left: 1.4rem; margin: 0.3rem 0; }
        .admin-rich-editor ol { list-style: decimal; padding-left: 1.4rem; margin: 0.3rem 0; }
        .admin-rich-editor li { margin: 0.15rem 0; }
        .admin-rich-editor .katex { color: #f1f5f9; }
      `}</style>
    </div>
  )
}
