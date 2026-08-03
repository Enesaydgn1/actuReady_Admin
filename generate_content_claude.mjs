/**
 * generate_content_claude.mjs
 * Supabase'deki boş topic_content kayıtlarına Claude ile içerik üretir.
 *
 * Çalıştırma:
 *   node generate_content_claude.mjs
 *
 * Gereksinim: Node.js 18+
 */

import Anthropic from '@anthropic-ai/sdk'

const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5OTExMTcsImV4cCI6MjA5MDU2NzExN30.CsHdeC2lrgG4aqJXz7tg2nAHcjMQ7rEfqMdNlVu4140'
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? 'YOUR_ANTHROPIC_API_KEY_HERE'

const DELAY_MS = 500 // Claude çok daha hızlı, daha kısa bekleme yeterli

const client = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ── Supabase helpers ───────────────────────────────────────────────────────

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase ${res.status}: ${text}`)
  }
  return res
}

async function getEmptyTopics() {
  const res = await sbFetch(
    '/topic_content?select=id,exam_type,subject,topic,difficulty&content_markdown=eq.&order=exam_type,subject,topic',
    { headers: { Prefer: 'return=representation' } }
  )
  return res.json()
}

async function updateContent(id, html) {
  await sbFetch(`/topic_content?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content_markdown: html, updated_at: new Date().toISOString() }),
  })
}

// ── Claude content generation ──────────────────────────────────────────────

const EXAM_LABEL = {
  LEVEL_1: 'Aktüer Birinci Seviye Sınavı',
  LEVEL_2: 'Aktüer İkinci Seviye Sınavı',
  LEVEL_3: 'Aktüer Üçüncü Seviye Sınavı',
  SEGEM_TPYS: 'SEGEM/TPYS Sınavı',
}

async function generateHTML(exam_type, subject, topic, difficulty) {
  const examLabel = EXAM_LABEL[exam_type] ?? exam_type
  const diffLabel = difficulty === 'easy' ? 'başlangıç' : difficulty === 'medium' ? 'orta' : 'ileri'

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Sen bir aktüerlik sınavı eğitmenisin. ${examLabel} için "${subject}" dersinden "${topic}" konusunu öğrencilere öğret.

Zorluk seviyesi: ${diffLabel}

SADECE HTML içeriği üret, başka açıklama ekleme. Şu yapıyı kullan:

<h2>Temel Kavramlar</h2>
<p>... açıklama ...</p>

<h2>Formüller ve Teoremler</h2>
<p>Formüller LaTeX notasyonuyla: satır içi \\( formül \\), blok \\[ formül \\]</p>

<h2>Adım Adım Örnek</h2>
<ol><li>...</li></ol>

<h2>Sınav İpuçları</h2>
<ul><li>...</li></ul>

<h2>Kritik Notlar</h2>
<ul><li>...</li></ul>

Türkçe, teknik ve eksiksiz yaz. Yalnızca HTML döndür.`,
      },
    ],
  })

  let html = message.content[0]?.text ?? ''
  // Kod bloğu sarmalını temizle
  html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim()
  return html
}

// ── Main ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  console.log('📋 Boş içerikler alınıyor...')
  const topics = await getEmptyTopics()
  console.log(`✅ ${topics.length} boş konu bulundu.\n`)

  if (topics.length === 0) {
    console.log('Tüm içerikler dolu, yapılacak iş yok.')
    return
  }

  let success = 0
  let failed = 0

  for (let i = 0; i < topics.length; i++) {
    const { id, exam_type, subject, topic, difficulty } = topics[i]
    const prefix = `[${i + 1}/${topics.length}]`

    process.stdout.write(`${prefix} "${topic}" üretiliyor... `)

    try {
      const html = await generateHTML(exam_type, subject, topic, difficulty)
      if (!html || html.length < 50) throw new Error('Boş yanıt')
      await updateContent(id, html)
      console.log('✅')
      success++
    } catch (err) {
      console.log(`❌ ${err.message}`)
      failed++
    }

    if (i < topics.length - 1) await sleep(DELAY_MS)
  }

  console.log(`\n🎉 Tamamlandı: ${success} başarılı, ${failed} hatalı.`)
}

main().catch(err => {
  console.error('❌ Script hatası:', err)
  process.exit(1)
})
