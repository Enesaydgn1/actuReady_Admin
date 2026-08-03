/**
 * Test scripti — 1 konu + 5 soru üretip Supabase'e yazar.
 * node scripts/test-generate.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env')
const envLines = readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
}

const GEMINI_KEY   = process.env.VITE_GEMINI_API_KEY
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      thinkingConfig: { thinkingBudget: 0 }
    })
  })
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function supabaseInsert(table, rows, onConflict = null) {
  const url = onConflict
    ? `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
    : `${SUPABASE_URL}/rest/v1/${table}`
  const prefer = onConflict
    ? 'resolution=merge-duplicates,return=representation'
    : 'return=representation'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': prefer,
    },
    body: JSON.stringify(rows)
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Supabase hata: ${JSON.stringify(body)}`)
  return body
}

// ── TEST 1: Konu Anlatımı ──
console.log('\n📚 TEST 1: Konu anlatımı üretiliyor...')
const topicPrompt = `Sen aktüerlik sınavı hocasısın. LEVEL_1 / matematik / "Limitler ve Süreklilik" konusunu anlat.
Kısa ama kaliteli: Temel kavramlar, 1 formül, 1 örnek, 1 kritik not. Markdown. Türkçe. Max 400 kelime.`

const topicContent = await callGemini(topicPrompt)
console.log('✅  Konu içeriği üretildi:', topicContent.slice(0, 150) + '...')

const topicInsert = await supabaseInsert('topic_content', [{
  exam_type: 'LEVEL_1',
  subject: 'matematik',
  topic: 'Limitler ve Süreklilik',
  difficulty: 'intermediate',
  content_markdown: topicContent,
}], 'exam_type,subject,topic')
console.log('✅  Supabase topic_content eklendi:', topicInsert?.[0]?.id)

// ── TEST 2: Sorular ──
console.log('\n❓  TEST 2: 5 soru üretiliyor...')
const qPrompt = `Aktüerlik sınavı LEVEL_1 matematik "Limitler ve Süreklilik" konusundan 5 adet orta zorlukta soru üret.
Cevap dağılımı: A, C, B, D, A olsun.
Yanlış şıklar akıllıca, açıklamalar öğretici olsun. Türkçe.

SADECE JSON dizisi döndür:
[
  {
    "question_text": "...",
    "options_json": {
      "A": {"text": "...", "image_url": null},
      "B": {"text": "...", "image_url": null},
      "C": {"text": "...", "image_url": null},
      "D": {"text": "...", "image_url": null}
    },
    "correct_answer": "A",
    "explanation": "...",
    "is_starred": false
  }
]`

const raw = await callGemini(qPrompt)
const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

function tryParse(str) { try { return JSON.parse(str) } catch { return null } }

let questions = tryParse(cleaned)
if (!questions) { const m = cleaned.match(/\[[\s\S]*\]/); if (m) questions = tryParse(m[0]) }
if (!questions) {
  const lastBrace = cleaned.lastIndexOf('}')
  if (lastBrace !== -1) { const m = (cleaned.slice(0, lastBrace + 1) + ']').match(/\[[\s\S]*\]/); if (m) questions = tryParse(m[0]) }
}
if (!Array.isArray(questions) || questions.length === 0)
  throw new Error('JSON parse edilemedi: ' + raw.slice(0, 200))
console.log(`✅  ${questions.length} soru üretildi`)
console.log('   İlk soru:', questions[0]?.question_text?.slice(0, 100))
console.log('   Cevaplar:', questions.map(q => q.correct_answer).join(', '))

const qRows = questions.map(q => ({
  exam_type: 'LEVEL_1',
  subject: 'matematik',
  topic: 'Limitler ve Süreklilik',
  difficulty: 'medium',
  question_text: q.question_text,
  question_image_url: null,
  options_json: q.options_json,
  correct_answer: q.correct_answer,
  explanation: q.explanation,
  is_active: true,
  is_starred: q.is_starred ?? false,
}))

const qInsert = await supabaseInsert('question_bank', qRows)
console.log(`✅  ${qInsert?.length} soru Supabase'e eklendi. İlk ID: ${qInsert?.[0]?.id}`)

console.log('\n🎉 TEST BAŞARILI! Script hazır.')
