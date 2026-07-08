import * as XLSX from 'xlsx'

// ── Şablon / içe aktarma kolonları ────────────────────────
// Sıra önemli: şablonda da aynı sırayla yazılır.
const HEADERS = [
  'exam_type', 'subject', 'topic', 'difficulty',
  'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
  'correct_answer', 'explanation',
] as const

type Header = typeof HEADERS[number]

export interface ImportedQuestion {
  exam_type: string
  subject: string
  topic: string
  difficulty: string
  question_text: string
  options_json: Record<string, { text: string; image_url: null }>
  correct_answer: string
  explanation: string | null
  question_image_url: null
  is_active: true
}

export interface RowError {
  row: number // Excel'deki satır numarası (başlık = 1)
  message: string
}

export interface ParseResult {
  valid: ImportedQuestion[]
  errors: RowError[]
}

// Türkçe etiketleri de kabul et — hücre değerini normalize edip eşle
const EXAM_MAP: Record<string, string> = {
  'level_1': 'LEVEL_1', 'aktüer 1': 'LEVEL_1', 'aktuer 1': 'LEVEL_1',
  'level_2': 'LEVEL_2', 'aktüer 2': 'LEVEL_2', 'aktuer 2': 'LEVEL_2',
  'level_3': 'LEVEL_3', 'aktüer 3': 'LEVEL_3', 'aktuer 3': 'LEVEL_3',
  'level_4': 'LEVEL_4', 'aktüer 4': 'LEVEL_4', 'aktuer 4': 'LEVEL_4',
  'segem_tpys': 'SEGEM_TPYS', 'segem': 'SEGEM_TPYS', 'segem/tpys': 'SEGEM_TPYS',
}
const SUBJECT_MAP: Record<string, string> = {
  'matematik': 'matematik',
  'istatistik': 'istatistik', 'i̇statistik': 'istatistik',
  'mevzuat': 'mevzuat',
  'olasilik': 'olasilik', 'olasılık': 'olasilik',
  'hayat-sigortasi': 'hayat-sigortasi', 'hayat sigortası': 'hayat-sigortasi', 'hayat sigortasi': 'hayat-sigortasi',
  'yangin-sigortasi': 'yangin-sigortasi', 'yangın sigortası': 'yangin-sigortasi', 'yangin sigortasi': 'yangin-sigortasi',
}
const DIFF_MAP: Record<string, string> = {
  'easy': 'easy', 'kolay': 'easy',
  'medium': 'medium', 'orta': 'medium',
  'hard': 'hard', 'zor': 'hard',
}

const norm = (v: unknown) => String(v ?? '').trim()
const normKey = (v: unknown) => norm(v).toLocaleLowerCase('tr-TR')

// ── Şablon indirme ────────────────────────────────────────
export function downloadTemplate() {
  const sampleRows = [
    {
      exam_type: 'LEVEL_1', subject: 'matematik', topic: 'Bileşik Faiz', difficulty: 'medium',
      question_text: '1000 TL, yıllık %10 bileşik faizle 2 yıl sonra kaç TL olur?',
      option_a: '1100', option_b: '1200', option_c: '1210', option_d: '1250',
      correct_answer: 'C',
      explanation: '1000 × (1,10)² = 1210 TL',
    },
    {
      exam_type: 'Aktüer 1', subject: 'İstatistik', topic: 'Ortalama ve Varyans', difficulty: 'Kolay',
      question_text: '2, 4, 6 sayılarının aritmetik ortalaması kaçtır?',
      option_a: '3', option_b: '4', option_c: '5', option_d: '6',
      correct_answer: 'B',
      explanation: '(2+4+6)/3 = 4',
    },
  ]
  const ws = XLSX.utils.json_to_sheet(sampleRows, { header: [...HEADERS] })
  ws['!cols'] = HEADERS.map(h => ({ wch: h === 'question_text' || h === 'explanation' ? 55 : h.startsWith('option') ? 22 : 14 }))

  const infoRows = [
    ['Kolon', 'Zorunlu', 'Geçerli Değerler / Açıklama'],
    ['exam_type', 'Evet', 'LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, SEGEM_TPYS (veya: Aktüer 1..4, SEGEM/TPYS)'],
    ['subject', 'Evet', 'matematik, istatistik, mevzuat, olasilik, hayat-sigortasi, yangin-sigortasi (Türkçe adları da kabul edilir)'],
    ['topic', 'Evet', 'Konu adı — Konu İçerikleri sayfasındaki adla birebir aynı olursa frontend eşleşmesi sorunsuz olur'],
    ['difficulty', 'Evet', 'easy, medium, hard (veya: Kolay, Orta, Zor)'],
    ['question_text', 'Evet', 'Soru metni'],
    ['option_a .. option_d', 'Evet', 'Dört şıkkın metinleri'],
    ['correct_answer', 'Evet', 'A, B, C veya D'],
    ['explanation', 'Hayır', 'Çözüm açıklaması (boş bırakılabilir)'],
    [],
    ['Not: "Sorular" sayfasındaki örnek 2 satırı silip kendi sorularınızı ekleyin.'],
  ]
  const wsInfo = XLSX.utils.aoa_to_sheet(infoRows)
  wsInfo['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 100 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sorular')
  XLSX.utils.book_append_sheet(wb, wsInfo, 'Açıklamalar')
  XLSX.writeFile(wb, 'soru-sablonu.xlsx')
}

// ── Excel dosyasını parse + doğrula ───────────────────────
export async function parseQuestionExcel(file: File): Promise<ParseResult> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  // "Sorular" sayfası varsa onu, yoksa ilk sayfayı kullan
  const sheetName = wb.SheetNames.includes('Sorular') ? 'Sorular' : wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  if (!ws) return { valid: [], errors: [{ row: 0, message: 'Dosyada okunabilir bir sayfa bulunamadı.' }] }

  const rows = XLSX.utils.sheet_to_json<Record<Header, unknown>>(ws, { defval: '' })
  if (rows.length === 0) {
    return { valid: [], errors: [{ row: 0, message: 'Dosyada soru satırı yok. Şablondaki "Sorular" sayfasını doldurun.' }] }
  }

  const valid: ImportedQuestion[] = []
  const errors: RowError[] = []

  rows.forEach((r, i) => {
    const rowNo = i + 2 // 1 = başlık satırı
    const problems: string[] = []

    const examType = EXAM_MAP[normKey(r.exam_type)]
    if (!examType) problems.push(`exam_type geçersiz: "${norm(r.exam_type)}"`)

    const subject = SUBJECT_MAP[normKey(r.subject)]
    if (!subject) problems.push(`subject geçersiz: "${norm(r.subject)}"`)

    const difficulty = DIFF_MAP[normKey(r.difficulty)]
    if (!difficulty) problems.push(`difficulty geçersiz: "${norm(r.difficulty)}"`)

    const topic = norm(r.topic)
    if (!topic) problems.push('topic boş')

    const questionText = norm(r.question_text)
    if (!questionText) problems.push('question_text boş')

    const opts = {
      A: norm(r.option_a), B: norm(r.option_b),
      C: norm(r.option_c), D: norm(r.option_d),
    }
    for (const [k, v] of Object.entries(opts)) {
      if (!v) problems.push(`option_${k.toLowerCase()} boş`)
    }

    const correct = norm(r.correct_answer).toUpperCase()
    if (!['A', 'B', 'C', 'D'].includes(correct)) problems.push(`correct_answer geçersiz: "${norm(r.correct_answer)}" (A/B/C/D olmalı)`)

    if (problems.length > 0) {
      errors.push({ row: rowNo, message: problems.join('; ') })
      return
    }

    valid.push({
      exam_type: examType!, subject: subject!, topic, difficulty: difficulty!,
      question_text: questionText,
      question_image_url: null,
      options_json: {
        A: { text: opts.A, image_url: null },
        B: { text: opts.B, image_url: null },
        C: { text: opts.C, image_url: null },
        D: { text: opts.D, image_url: null },
      },
      correct_answer: correct,
      explanation: norm(r.explanation) || null,
      is_active: true,
    })
  })

  return { valid, errors }
}
