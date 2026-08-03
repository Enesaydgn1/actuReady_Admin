/**
 * generate_content.mjs
 * Supabase'deki boş topic_content kayıtlarına Gemini ile içerik üretir.
 *
 * Çalıştırma:
 *   node generate_content.mjs
 *
 * Gereksinim: Node.js 18+
 */

const SUPABASE_URL  = 'https://vxnohqhaomaleftnlpyl.supabase.co'
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5OTExMTcsImV4cCI6MjA5MDU2NzExN30.CsHdeC2lrgG4aqJXz7tg2nAHcjMQ7rEfqMdNlVu4140'
const GEMINI_KEY    = process.env.GEMINI_API_KEY ?? 'YOUR_GEMINI_API_KEY_HERE'
const GEMINI_MODEL  = 'gemini-1.5-flash'

// İstekler arası bekleme (ms) — rate limit aşımını önler
const DELAY_MS = 2000

// ─── Supabase REST helpers ─────────────────────────────────────────────────

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
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
    { headers: { 'Prefer': 'return=representation' } }
  )
  return res.json()
}

async function updateContent(id, html) {
  await sbFetch(`/topic_content?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content_markdown: html, updated_at: new Date().toISOString() }),
  })
}

// ─── Gemini helper ────────────────────────────────────────────────────────

const EXAM_LABEL = {
  LEVEL_1: 'Aktüer Birinci Seviye',
  LEVEL_2: 'Aktüer İkinci Seviye',
  LEVEL_3: 'Aktüer Üçüncü Seviye',
  SEGEM_TPYS: 'SEGEM/TPYS',
}

async function generateHTML(exam_type, subject, topic, difficulty) {
  const examLabel = EXAM_LABEL[exam_type] ?? exam_type
  const diffLabel = difficulty === 'easy' ? 'başlangıç' : difficulty === 'medium' ? 'orta' : 'ileri'

  const prompt = `Sen bir aktüerlik sınavı eğitmenisin. ${examLabel} sınavı için "${subject}" dersinden "${topic}" konusunu öğrencilere öğret.

Zorluk seviyesi: ${diffLabel}

SADECE HTML içeriği üret. Şu yapıyı kullan:

<h2>Temel Kavramlar</h2>
<p>... açıklama ...</p>

<h2>Formüller ve Teoremler</h2>
<p>... formüller LaTeX notasyonuyla: \\( formül \\) şeklinde satır içi, \\[ formül \\] şeklinde blok ...</p>

<h2>Adım Adım Örnek</h2>
<p>... çözümlü örnek ...</p>
<ol><li>...</li></ol>

<h2>Sınav İpuçları</h2>
<ul><li>...</li></ul>

<h2>Kritik Notlar</h2>
<ul><li>...</li></ul>

Türkçe yaz. Aktüerlik sınavına özgü, teknik ve eksiksiz içerik üret. Yalnızca HTML döndür, başka açıklama ekleme.`

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.6, maxOutputTokens: 8192 },
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini ${res.status}: ${text}`)
  }

  const data = await res.json()
  let html = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Gemini bazen ```html ... ``` sarmalıyor — temizle
  html = html.replace(/^```html\s*/i, '').replace(/```\s*$/, '').trim()

  return html
}

// ─── Main ─────────────────────────────────────────────────────────────────

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
  let failed  = 0

  for (let i = 0; i < topics.length; i++) {
    const { id, exam_type, subject, topic, difficulty } = topics[i]
    const prefix = `[${i + 1}/${topics.length}]`

    process.stdout.write(`${prefix} "${topic}" (${subject}) üretiliyor... `)

    try {
      const html = await generateHTML(exam_type, subject, topic, difficulty)
      if (!html || html.length < 50) throw new Error('Boş yanıt')
      await updateContent(id, html)
      console.log('✅')
      success++
    } catch (err) {
      console.log(`❌ HATA: ${err.message}`)
      failed++
    }

    // Son eleman değilse bekle
    if (i < topics.length - 1) await sleep(DELAY_MS)
  }

  console.log(`\n🎉 Tamamlandı: ${success} başarılı, ${failed} hatalı.`)
}

main().catch(err => {
  console.error('❌ Script hatası:', err)
  process.exit(1)
})
