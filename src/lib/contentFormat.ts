import { marked } from 'marked'

// İçerik iki formatta olabilir:
// - Eski kayıtlar / AI üretimi: Markdown ($...$ LaTeX içerebilir)
// - Görsel editörden kaydedilenler: HTML (<span data-math data-latex="..."> formül düğümleri)
export const isHtmlContent = (s: string) => /^\s*</.test(s)

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Doğrulama ve liste önizlemesi için etiketlerden arındırılmış düz metin */
export const stripHtmlToText = (s: string) =>
  s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

/**
 * Markdown içeriği görsel editörün anlayacağı HTML'e çevirir.
 * $...$ ve $$...$$ LaTeX parçaları, editörün MathInline düğümüne karşılık gelen
 * <span data-math data-latex="..."> etiketlerine dönüştürülür.
 */
export function markdownToEditorHtml(md: string): string {
  const mathParts: string[] = []
  let text = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, latex: string) => {
    mathParts.push(latex.trim())
    return `⟦MATH${mathParts.length - 1}⟧`
  })
  text = text.replace(/\$([^$\n]+?)\$/g, (_, latex: string) => {
    mathParts.push(latex.trim())
    return `⟦MATH${mathParts.length - 1}⟧`
  })

  let html = marked.parse(text, { breaks: true, async: false }) as string

  html = html.replace(/⟦MATH(\d+)⟧/g, (_, i: string) => {
    const latex = mathParts[Number(i)] ?? ''
    return `<span data-math data-latex="${escapeAttr(latex)}">${escapeAttr(latex)}</span>`
  })

  return html
}
