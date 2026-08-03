import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const { data: all } = await sb.from('question_bank')
  .select('id, question_text, options_json, correct_answer')
  .eq('is_active', true)

// Correct answer distribution
const counts = { A: 0, B: 0, C: 0, D: 0 }
all.forEach(q => counts[q.correct_answer] = (counts[q.correct_answer] || 0) + 1)
console.log('Doğru cevap dağılımı:', counts)
console.log('Toplam:', all.length)

let repeatLoop = 0, dupOptions = 0, shortQ = 0
const badIds = []

for (const q of all) {
  // Check repetitive text: split into 6-word phrases, check if any appears 3+ times
  const words = q.question_text.split(' ')
  let isRepeat = false
  if (words.length >= 6) {
    const phrase = words.slice(0, 6).join(' ')
    let count = 0
    let idx = 0
    const text = q.question_text
    while ((idx = text.indexOf(phrase, idx)) !== -1) { count++; idx += phrase.length }
    if (count >= 3) isRepeat = true
  }
  if (isRepeat) { repeatLoop++; badIds.push(q.id); continue }

  // Check duplicate options
  const opts = Object.values(q.options_json || {})
  const uniq = new Set(opts.map(o => String(o).trim().slice(0, 50)))
  if (uniq.size < 4) { dupOptions++; badIds.push(q.id); continue }

  // Too short question
  if (q.question_text.length < 40) { shortQ++; badIds.push(q.id); continue }
}

console.log('\nBozuk soru tipleri:')
console.log('  Tekrarlı metin (hallucination):', repeatLoop)
console.log('  Aynı/benzer seçenekler:', dupOptions)
console.log('  Çok kısa soru:', shortQ)
console.log('  Toplam silinecek:', badIds.length)
console.log('  Temiz kalan:', all.length - badIds.length)
