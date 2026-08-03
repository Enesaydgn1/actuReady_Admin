/**
 * Bozuk soruları siler:
 * - Tekrarlı metin (hallucination döngüsü)
 * - Aynı/çok benzer seçenekler (2+ seçenek ilk 50 karakter aynı)
 * - 40 karakterden kısa soru metni
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

console.log('🔍 Sorular analiz ediliyor...')
const { data: all } = await sb.from('question_bank')
  .select('id, question_text, options_json, correct_answer')
  .eq('is_active', true)

console.log(`📊 Toplam soru: ${all.length}`)

const badIds = []

for (const q of all) {
  // 1. Tekrarlı metin (hallucination)
  const words = q.question_text.split(' ')
  let isRepeat = false
  if (words.length >= 6) {
    const phrase = words.slice(0, 6).join(' ')
    let count = 0, idx = 0
    const text = q.question_text
    while ((idx = text.indexOf(phrase, idx)) !== -1) { count++; idx += phrase.length }
    if (count >= 3) isRepeat = true
  }
  if (isRepeat) { badIds.push({ id: q.id, reason: 'hallucination' }); continue }

  // 2. Aynı/benzer seçenekler
  const opts = Object.values(q.options_json || {})
  const uniq = new Set(opts.map(o => String(o).trim().slice(0, 50)))
  if (uniq.size < 4) { badIds.push({ id: q.id, reason: 'dup_options' }); continue }

  // 3. Çok kısa soru
  if (q.question_text.length < 40) { badIds.push({ id: q.id, reason: 'too_short' }); continue }
}

const byReason = {}
badIds.forEach(b => byReason[b.reason] = (byReason[b.reason] || 0) + 1)
console.log('\nSilinecek:')
Object.entries(byReason).forEach(([k, v]) => console.log(`  ${k}: ${v}`))
console.log(`  TOPLAM: ${badIds.length}`)

if (badIds.length === 0) {
  console.log('✅ Silinecek soru yok.')
  process.exit(0)
}

// Batch delete
const ids = badIds.map(b => b.id)
const BATCH = 100
let deleted = 0

for (let i = 0; i < ids.length; i += BATCH) {
  const batch = ids.slice(i, i + BATCH)
  const { error } = await sb.from('question_bank').delete().in('id', batch)
  if (error) {
    console.error(`  ❌ Silme hatası (batch ${i}):`, error.message)
  } else {
    deleted += batch.length
    console.log(`  🗑️  ${deleted}/${ids.length} silindi`)
  }
}

// Final count
const { count } = await sb.from('question_bank')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', true)

console.log(`\n✅ Temizlik tamamlandı!`)
console.log(`   Silinen: ${deleted}`)
console.log(`   Kalan temiz soru: ${count}`)
