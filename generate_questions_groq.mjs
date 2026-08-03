/**
 * Soru üretim scripti — Groq multi-model rotation + service_role key
 * 10.000 soru olana kadar kesintisiz çalışır.
 * Her batch için mevcut soruları çekip tekrar etmemesi için prompt'a ekler.
 * Soru tipleri rotasyonla seçilir: hesap, kavramsal, mevzuat, formül, uygulama
 *
 * Usage: node generate_questions_groq.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_BASE    = 'https://api.groq.com/openai/v1'

const TARGET_TOTAL = 10_000
const QUESTIONS_PER_BATCH = 10

const MODELS = [
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant',
]

const QUESTION_TYPES = [
  'hesap (matematiksel işlem gerektiren, sayısal veri içeren)',
  'kavramsal (terim tanımı, teorik açıklama, kavram karşılaştırması)',
  'mevzuat (yasal düzenleme, yönetmelik, SPK/SEDDK/TSB kuralı)',
  'formül (formül uygulama, türev, integral, istatistiksel hesap)',
  'uygulama (gerçek senaryo, vaka analizi, portföy/sigorta uygulaması)',
]

if (!SUPABASE_URL || !SUPABASE_KEY || !GROQ_API_KEY) {
  console.error('❌ .env eksik değişken: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY, GROQ_API_KEY')
  process.exit(1)
}

if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('🔑 Service role key kullanılıyor')
} else {
  console.warn('⚠️  SUPABASE_SERVICE_KEY yok — kayıt başarısız olabilir!')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── State ──────────────────────────────────────────────────────────────────────

let currentModelIdx = 0
let exhaustedCount = 0
function currentModel() { return MODELS[currentModelIdx] }
async function nextModel() {
  currentModelIdx++
  exhaustedCount++
  if (currentModelIdx >= MODELS.length) {
    currentModelIdx = 0
    if (exhaustedCount >= MODELS.length) {
      // All models exhausted — wait 1 hour for daily limits to reset
      console.log(`\n😴 Tüm modeller günlük limitini doldurdu. 1 saat bekleniyor (limit sıfırlanana kadar)...\n`)
      await sleep(60 * 60 * 1000)
      exhaustedCount = 0
    }
    console.log(`\n🔄 Model rotasyonu yeniden başlıyor: ${currentModel()}\n`)
    return true
  }
  console.log(`\n🔄 Model değiştirildi → ${currentModel()}\n`)
  return true
}

let typeIdx = 0
function nextQuestionType() {
  const t = QUESTION_TYPES[typeIdx % QUESTION_TYPES.length]
  typeIdx++
  return t
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function parseRetryMs(errMsg) {
  const full = errMsg.match(/Please try again in (\d+)m([\d.]+)s/)
  const sec  = errMsg.match(/Please try again in ([\d.]+)s/)
  if (full) return (parseInt(full[1]) * 60 + parseFloat(full[2])) * 1000 + 2000
  if (sec)  return parseFloat(sec[1]) * 1000 + 2000
  return 65_000
}

// ── Groq JSON helper ──────────────────────────────────────────────────────────

async function groqJSON(systemPrompt, userPrompt) {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: currentModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq ${res.status} [${currentModel()}]: ${err}`)
  }

  const data = await res.json()
  const text = data.choices[0]?.message?.content ?? '{}'
  return JSON.parse(text)
}

// ── Sistem prompt ─────────────────────────────────────────────────────────────

const SYSTEM = `Sen Türkiye aktüerya ve sigortacılık sınavı sorusu hazırlayan üst düzey bir uzmansın. SEGEM sınavlarına (Sigortacılık, Aktüerya, Reasürans, Hayat Sigortası, Elementer Sigorta, Bireysel Emeklilik, Sağlık Sigortası) benzer, yüksek kaliteli sorular üretiyorsun.

Kalite standartları:
- Sorular gerçek sınav düzeyinde, özgün ve özgün senaryolar içermeli
- Hesap soruları gerçek sayısal veriler ve tablolar içermeli
- Kavramsal sorular derin anlayış ölçmeli, basit tanım sormamalı
- Mevzuat soruları güncel Türk sigorta/aktüerya mevzuatına dayanmalı (SPK, SEDDK, TSB, TTK)
- Her sorunun 4 seçeneği birbirinden açıkça farklı olmalı
- Yanlış seçenekler mantıklı ama kesinlikle yanlış olmalı
- Açıklama hem doğru cevabı hem de yanlış seçenekleri açıklamalı
- Dil akademik Türkçe, net ve anlaşılır
- Soru metinleri 50-200 kelime arasında olabilir
- KESİNLİKLE mevcut sorularla çakışmamalı
- Yanıt SADECE geçerli JSON olmalı`

async function generateBatch(topic, subject, examType, existingTexts, questionType, batchNum) {
  const level = examType?.replace('LEVEL_', '') ?? '1'

  const existingSection = existingTexts.length > 0
    ? `\n\nMEVCUT SORULAR (TEKRAR ETME, farklı açı ve senaryo kullan):\n${existingTexts.slice(-8).map((t, idx) => `${idx + 1}. ${t.slice(0, 70)}...`).join('\n')}`
    : ''

  const prompt = `"${topic}" konusunda (${subject} dersi, Seviye ${level}) ${QUESTIONS_PER_BATCH} adet özgün çoktan seçmeli soru üret.

SORU TİPİ: ${questionType}
Bu batch için bu soru tipine odaklan ama tamamen kısıtlı değilsin.

Dağılım: ${Math.ceil(QUESTIONS_PER_BATCH * 0.5)} adet medium, ${Math.floor(QUESTIONS_PER_BATCH * 0.5)} adet hard.
${existingSection}

JSON formatı (SADECE bu format, başka hiçbir şey):
{
  "questions": [
    {
      "difficulty": "medium",
      "question_text": "Detaylı soru metni (senaryo, tablo veya veriler olabilir)",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correct_answer": "B",
      "explanation": "B doğrudur çünkü... A yanlıştır çünkü... C yanlıştır çünkü..."
    }
  ]
}`

  return groqJSON(SYSTEM, prompt)
}

// ── Ana akış ──────────────────────────────────────────────────────────────────

async function getTotalQuestions() {
  const { count } = await supabase
    .from('question_bank')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  return count ?? 0
}

async function getTopicQuestions(topic) {
  const { data } = await supabase
    .from('question_bank')
    .select('question_text')
    .eq('topic', topic)
    .eq('is_active', true)
  return (data ?? []).map(q => q.question_text)
}

async function getAllTopics() {
  const { data } = await supabase
    .from('topic_content')
    .select('topic, subject, exam_type')
    .order('exam_type', { ascending: true })
  return data ?? []
}

async function main() {
  console.log(`\n🚀 Soru üretimi başlıyor. Hedef: ${TARGET_TOTAL.toLocaleString()} soru`)
  console.log(`📡 Model: ${currentModel()}`)

  let total = await getTotalQuestions()
  console.log(`📊 Mevcut soru sayısı: ${total}`)

  if (total >= TARGET_TOTAL) {
    console.log('✅ Hedef zaten ulaşıldı!')
    return
  }

  const topics = await getAllTopics()
  console.log(`📋 ${topics.length} konu mevcut\n`)

  let globalInserted = 0
  let globalFailed = 0
  let round = 0

  while (total < TARGET_TOTAL) {
    round++
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🔁 ROUND ${round} | Mevcut: ${total} | Hedef: ${TARGET_TOTAL} | Kalan: ${TARGET_TOTAL - total}`)
    console.log(`${'='.repeat(60)}\n`)

    // Shuffle topics each round for variety
    const shuffled = [...topics].sort(() => Math.random() - 0.5)

    let i = 0
    while (i < shuffled.length && total < TARGET_TOTAL) {
      const { topic, subject, exam_type } = shuffled[i]
      const questionType = nextQuestionType()
      const prefix = `[R${round} ${i + 1}/${shuffled.length}] [${currentModel()}]`

      console.log(`${prefix} "${topic}" — Tip: ${questionType.split(' ')[0]}`)

      try {
        // Fetch existing question texts for this topic to avoid duplicates
        const existingTexts = await getTopicQuestions(topic)

        const data = await generateBatch(topic, subject, exam_type, existingTexts, questionType, round)
        const questions = data?.questions

        if (!Array.isArray(questions) || questions.length === 0) {
          console.warn('  ⚠️  Geçerli soru gelmedi, atlandı')
          globalFailed++
          i++
          await sleep(2_000)
          continue
        }

        // Validate and filter questions
        const rows = questions
          .filter(q =>
            q.question_text &&
            q.question_text.length > 40 &&
            q.options?.A && q.options?.B && q.options?.C && q.options?.D &&
            ['A', 'B', 'C', 'D'].includes(q.correct_answer) &&
            q.explanation &&
            q.explanation.length > 20
          )
          // Filter: no repetitive text (hallucination loop)
          .filter(q => {
            const words = q.question_text.split(' ')
            if (words.length < 6) return true
            const phrase = words.slice(0, 6).join(' ')
            let count = 0, idx = 0
            while ((idx = q.question_text.indexOf(phrase, idx)) !== -1) { count++; idx += phrase.length }
            return count < 3
          })
          // Filter: all 4 options must be distinct (first 50 chars)
          .filter(q => {
            const opts = [q.options.A, q.options.B, q.options.C, q.options.D]
            const uniq = new Set(opts.map(o => String(o).trim().slice(0, 50)))
            return uniq.size === 4
          })
          // Deduplicate within batch
          .filter((q, idx, arr) =>
            arr.findIndex(other => other.question_text.slice(0, 50) === q.question_text.slice(0, 50)) === idx
          )
          // Exclude if too similar to existing
          .filter(q => {
            const qStart = q.question_text.slice(0, 60).toLowerCase()
            return !existingTexts.some(ex => ex.slice(0, 60).toLowerCase() === qStart)
          })
          .map(q => {
            // Shuffle options so correct_answer is randomized (A/B/C/D equally)
            const letters = ['A', 'B', 'C', 'D']
            const correctText = q.options[q.correct_answer]
            const allOpts = letters.map(l => q.options[l])
            // Fisher-Yates shuffle
            for (let k = allOpts.length - 1; k > 0; k--) {
              const j = Math.floor(Math.random() * (k + 1));
              [allOpts[k], allOpts[j]] = [allOpts[j], allOpts[k]]
            }
            const newOptions = {}
            letters.forEach((l, idx) => newOptions[l] = allOpts[idx])
            const newCorrect = letters[allOpts.indexOf(correctText)]
            // Update explanation to reference new correct letter
            const explanation = q.explanation.replace(/\b[ABCD]\b doğrudur/g, `${newCorrect} doğrudur`)

            return {
              exam_type: exam_type ?? 'LEVEL_1',
              subject,
              topic,
              difficulty: q.difficulty ?? 'medium',
              question_text: q.question_text,
              options_json: newOptions,
              correct_answer: newCorrect,
              explanation,
              is_active: true,
            }
          })

        if (rows.length === 0) {
          console.warn('  ⚠️  Tüm sorular geçersiz veya tekrar')
          globalFailed++
          i++
          await sleep(2_000)
          continue
        }

        const { error: insertErr } = await supabase.from('question_bank').insert(rows)

        if (insertErr) {
          console.error('  ❌ Insert hatası:', insertErr.message)
          globalFailed++
        } else {
          total += rows.length
          globalInserted += rows.length
          console.log(`  ✅ ${rows.length} soru eklendi | Toplam: ${total.toLocaleString()}`)
        }

        i++
        await sleep(2_500)

      } catch (err) {
        const msg = err.message ?? ''
        console.error('  ❌ Hata:', msg.slice(0, 200))

        const isTPD = msg.includes('tokens per day') || msg.includes('TPD') || msg.includes('per_day')
        const isDecommissioned = msg.includes('decommissioned') || msg.includes('not found') || msg.includes('does not exist')
        const isJsonFail = msg.includes('json_validation') || msg.includes('Failed to generate JSON') || msg.includes('413') || msg.includes('Request Entity Too Large')
        const isTPM = !isTPD && (msg.includes('tokens per minute') || msg.includes('TPM') || msg.includes('rate_limit') || (msg.includes('429') && !msg.includes('tokens per day')))

        if (isJsonFail) {
          // JSON generation failed or request too large — skip topic, don't switch model
          console.warn('  ⚠️  JSON üretim hatası, konu atlandı')
          globalFailed++
          i++
          await sleep(2_000)
          continue
        } else if (isTPD || isDecommissioned) {
          console.log(`  🚫 ${currentModel()} limiti doldu veya kullanılamaz.`)
          await nextModel()
          // Don't increment i — retry same topic with new model
          await sleep(3_000)
          continue
        } else if (isTPM) {
          const waitMs = parseRetryMs(msg)
          console.log(`  ⏳ Rate limit — ${Math.ceil(waitMs / 1000)}s bekleniyor...`)
          await sleep(waitMs)
          continue
        } else {
          globalFailed++
          i++
          await sleep(3_000)
        }
      }

      // Progress report every 50 topics
      if (i % 50 === 0 && i > 0) {
        total = await getTotalQuestions()
        console.log(`\n📊 ARA RAPOR: ${total.toLocaleString()} / ${TARGET_TOTAL.toLocaleString()} soru | Bu oturumda: +${globalInserted}\n`)
      }
    }

    // Refresh total after each round
    total = await getTotalQuestions()
    console.log(`\n📊 ROUND ${round} BITTI: ${total.toLocaleString()} / ${TARGET_TOTAL.toLocaleString()} | +${globalInserted} eklendi | ${globalFailed} hata`)
  }

  console.log(`\n🏁 HEDEF ULAŞILDI!`)
  console.log(`   Toplam soru: ${total.toLocaleString()}`)
  console.log(`   Bu oturumda eklenen: ${globalInserted}`)
  console.log(`   Başarısız batch: ${globalFailed}`)
}

main().catch(err => { console.error('❌ Fatal:', err); process.exit(1) })
