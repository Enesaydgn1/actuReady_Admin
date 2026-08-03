/**
 * Content generation — Groq multi-model rotation + service_role key
 * Günlük limit dolunca otomatik sonraki modele geçer.
 *
 * Usage: node generate_content_groq.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const GROQ_API_KEY     = process.env.GROQ_API_KEY
const GROQ_BASE        = 'https://api.groq.com/openai/v1'

// Model rotasyon listesi — TPD limiti dolunca sıradakine geçer
const MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'llama-3.1-8b-instant',
  'compound-beta',
]

if (!SUPABASE_URL || !SUPABASE_KEY || !GROQ_API_KEY) {
  console.error('❌ .env eksik: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY (veya ANON_KEY), GROQ_API_KEY')
  process.exit(1)
}

if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('🔑 Service role key kullanılıyor (RLS bypass)')
} else {
  console.warn('⚠️  SUPABASE_SERVICE_KEY bulunamadı — anon key ile devam (kayıt başarısız olabilir!)')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── State ──────────────────────────────────────────────────────────────────────

let currentModelIdx = 0

function currentModel() { return MODELS[currentModelIdx] }

function nextModel() {
  currentModelIdx++
  if (currentModelIdx >= MODELS.length) return false
  console.log(`\n🔄 Model değiştirildi → ${currentModel()}\n`)
  return true
}

// ── Groq helper ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function parseRetryMs(errMsg) {
  const full = errMsg.match(/Please try again in (\d+)m([\d.]+)s/)
  const sec  = errMsg.match(/Please try again in ([\d.]+)s/)
  if (full) return (parseInt(full[1]) * 60 + parseFloat(full[2])) * 1000 + 2000
  if (sec)  return parseFloat(sec[1]) * 1000 + 2000
  return 65_000
}

async function groqChat(systemPrompt, userPrompt) {
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
      temperature: 0.4,
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq ${res.status} [${currentModel()}]: ${err}`)
  }

  const data = await res.json()
  return data.choices[0]?.message?.content ?? ''
}

// ── Content generation ────────────────────────────────────────────────────────

const SYSTEM = `Sen bir aktüerya eğitim uzmanısın. Türkiye aktüerlik sınavları için detaylı,
açıklayıcı eğitim içerikleri oluşturuyorsun. İçerik HTML formatında olsun, başlıklar için
<h2> ve <h3>, paragraflar için <p>, listeler için <ul>/<li>, formüller için <code> veya
<pre> kullan. Matematik formülleri LaTeX değil, düz metin ya da Unicode semboller kullan.
Sadece HTML içeriğini döndür, başka açıklama ekleme.`

async function generateTopicContent(topicTitle, subject) {
  const prompt = `"${topicTitle}" konusu için kapsamlı bir eğitim içeriği oluştur.
Konu, "${subject}" ders alanına ait.

İçerik şunları kapsamalı:
1. Konunun tanımı ve önemi
2. Temel kavramlar ve formüller
3. Pratik örnekler (en az 2 örnek)
4. Sınav ipuçları

Türkçe yaz, aktüerlik sınavı seviyesinde akademik ama anlaşılır bir dil kullan.`

  return groqChat(SYSTEM, prompt)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🚀 Başlangıç modeli: ${currentModel()}`)
  console.log('🔍 Boş içerikli konular aranıyor...\n')

  const { data: topics, error } = await supabase
    .from('topic_content')
    .select('id, topic, subject')
    .or('content_markdown.is.null,content_markdown.eq.')
    .order('subject', { ascending: true })

  if (error) { console.error('❌ Supabase sorgu hatası:', error); process.exit(1) }
  if (!topics || topics.length === 0) {
    console.log('✅ Tüm konuların içeriği dolu.')
    return
  }

  console.log(`📋 ${topics.length} boş konu bulundu.\n`)

  let success = 0, failed = 0
  let i = 0

  while (i < topics.length) {
    const topic = topics[i]
    const prefix = `[${i + 1}/${topics.length}] [${currentModel()}]`
    console.log(`${prefix} "${topic.topic}" (${topic.subject})`)

    try {
      const html = await generateTopicContent(topic.topic, topic.subject)

      if (!html || html.length < 100) {
        console.warn('  ⚠️  Çok kısa içerik, atlandı.')
        failed++
        i++
        await sleep(3_000)
        continue
      }

      const { error: updateErr, count } = await supabase
        .from('topic_content')
        .update({ content_markdown: html })
        .eq('id', topic.id)
        .select('id', { count: 'exact', head: true })

      if (updateErr) {
        console.error('  ❌ DB hatası:', updateErr.message)
        failed++
      } else if (count === 0) {
        console.error('  ❌ Kayıt başarısız — RLS engelliyor! Service role key gerekli.')
        failed++
      } else {
        console.log(`  ✅ Kaydedildi (${html.length} karakter)`)
        success++
      }
      i++
      await sleep(3_000)

    } catch (err) {
      const msg = err.message ?? ''
      console.error('  ❌ Hata:', msg.slice(0, 150))

      const isTPD = msg.includes('tokens per day') || msg.includes('TPD')
      const isTPM = msg.includes('tokens per minute') || msg.includes('TPM')
      const isDecommissioned = msg.includes('decommissioned') || msg.includes('Groq 400')

      if (isTPD || isDecommissioned) {
        // Günlük limit doldu → model değiştir
        console.log(`  🚫 ${currentModel()} günlük limiti doldu.`)
        if (!nextModel()) {
          console.error('  ❌ Tüm modellerin limiti doldu, yarın devam edin.')
          break
        }
        // Aynı konuyu tekrar dene, bekleme yok
        continue
      } else if (isTPM || is429) {
        const waitMs = parseRetryMs(msg)
        console.log(`  ⏳ TPM limit — ${Math.ceil(waitMs / 1000)}s bekleniyor...`)
        await sleep(waitMs)
        // Aynı konuyu tekrar dene
        continue
      } else {
        failed++
        i++
        await sleep(3_000)
      }
    }
  }

  console.log(`\n🏁 İçerik tamamlandı: ✅ ${success} / ❌ ${failed}`)
}

main().catch(err => { console.error('❌ Fatal:', err); process.exit(1) })
