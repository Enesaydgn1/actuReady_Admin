#!/usr/bin/env node
/**
 * validate_seed.mjs — Sayfalama destekli doğrulama
 */

const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.' +
  'H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const PAGE = 1000;

async function sbAll(path) {
  const all = [];
  let offset = 0;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}&offset=${offset}&limit=${PAGE}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Prefer': 'count=exact',
      },
    });
    if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
    const data = await res.json();
    all.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

function group(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  ActuReady — Seed Doğrulama Raporu');
  console.log('═══════════════════════════════════════════════════\n');

  // ── TOPIC_CONTENT ──────────────────────────────────────
  const topics = await sbAll('/topic_content?select=id,exam_type,subject,topic,content_markdown&order=exam_type,subject,topic');
  console.log(`📚 TOPIC_CONTENT — Toplam: ${topics.length} kayıt\n`);

  const byExam = group(topics, 'exam_type');
  for (const [exam, count] of Object.entries(byExam).sort()) {
    console.log(`  ${exam}: ${count} konu`);
    const bySubject = group(topics.filter(t => t.exam_type === exam), 'subject');
    for (const [sub, cnt] of Object.entries(bySubject).sort()) {
      console.log(`    └─ ${sub}: ${cnt}`);
    }
  }

  const emptyContent = topics.filter(t => !t.content_markdown || t.content_markdown.trim().length < 50);
  if (emptyContent.length > 0) {
    console.log(`\n  ⚠️  İçeriği kısa/boş olan konular (${emptyContent.length}):`);
    emptyContent.forEach(t => console.log(`    - [${t.exam_type}/${t.subject}] ${t.topic}`));
  } else {
    console.log(`\n  ✅ Tüm konuların içeriği dolu.`);
  }

  // ── QUESTION_BANK ──────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  const questions = await sbAll('/question_bank?select=id,exam_type,subject,topic,question_text,options_json,correct_answer,explanation,is_active&order=exam_type,subject,topic');
  console.log(`\n❓ QUESTION_BANK — Toplam: ${questions.length} kayıt\n`);

  const qByExam = group(questions, 'exam_type');
  for (const [exam, count] of Object.entries(qByExam).sort()) {
    console.log(`  ${exam}: ${count} soru`);
    const qBySubject = group(questions.filter(q => q.exam_type === exam), 'subject');
    for (const [sub, cnt] of Object.entries(qBySubject).sort()) {
      console.log(`    └─ ${sub}: ${cnt}`);
    }
  }

  // Hata kontrolleri
  const issues = [];
  for (const q of questions) {
    const opts = q.options_json;
    if (!opts || typeof opts !== 'object') {
      issues.push({ topic: q.topic, issue: 'options_json eksik/geçersiz' }); continue;
    }
    const optKeys = Object.keys(opts);
    if (!['A','B','C','D'].every(k => optKeys.includes(k))) {
      issues.push({ topic: q.topic, issue: `Eksik şık: ${['A','B','C','D'].filter(k => !optKeys.includes(k)).join(',')}` });
    }
    if (!['A','B','C','D'].includes(q.correct_answer)) {
      issues.push({ topic: q.topic, issue: `Geçersiz correct_answer: "${q.correct_answer}"` });
    }
    if (!q.question_text || q.question_text.trim().length < 10) {
      issues.push({ topic: q.topic, issue: 'question_text çok kısa/boş' });
    }
  }

  if (issues.length > 0) {
    console.log(`\n  ⚠️  Veri hataları (${issues.length}):`);
    issues.slice(0,10).forEach(i => console.log(`    - ${i.topic}: ${i.issue}`));
    if (issues.length > 10) console.log(`    ... ve ${issues.length - 10} adet daha`);
  } else {
    console.log(`\n  ✅ Tüm sorular geçerli (options_json, correct_answer).`);
  }

  const active = questions.filter(q => q.is_active !== false).length;
  console.log(`  Aktif: ${active} / Pasif: ${questions.length - active}`);

  // ── Konu-Soru eşleşme kontrolü ──────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('\n🔗 Konu-Soru Eşleşme Özeti:\n');

  const topicSet = new Set(topics.map(t => `${t.exam_type}|${t.subject}|${t.topic}`));
  const questionsByTopic = new Map();
  for (const q of questions) {
    const key = `${q.exam_type}|${q.subject}|${q.topic}`;
    questionsByTopic.set(key, (questionsByTopic.get(key) || 0) + 1);
  }

  // Topics without questions
  const topicsWithoutQ = topics.filter(t => !questionsByTopic.has(`${t.exam_type}|${t.subject}|${t.topic}`));
  // Questions without topic_content
  const orphaned = [];
  for (const [key, count] of questionsByTopic) {
    if (!topicSet.has(key)) {
      const [exam_type, subject, topic] = key.split('|');
      orphaned.push({ exam_type, subject, topic, count });
    }
  }

  // Only show seed-related ones (topics we added)
  const ourExamTypes = ['SEGEM_TPYS', 'LEVEL_1'];
  const ourTopicsWithoutQ = topicsWithoutQ.filter(t => ourExamTypes.includes(t.exam_type));
  const ourOrphaned = orphaned.filter(o => ourExamTypes.includes(o.exam_type));

  if (ourTopicsWithoutQ.length > 0) {
    console.log(`  ⚠️  Sorusu olmayan konularımız (${ourTopicsWithoutQ.length}):`);
    ourTopicsWithoutQ.forEach(t => console.log(`    - [${t.exam_type}/${t.subject}] ${t.topic}`));
  } else {
    console.log(`  ✅ Tüm yüklediğimiz konuların sorusu var.`);
  }

  if (ourOrphaned.length > 0) {
    console.log(`\n  ⚠️  Konusu olmayan sorularımız (${ourOrphaned.length} grup — konu adı eşleşmiyor):`);
    ourOrphaned.forEach(o => console.log(`    - [${o.exam_type}/${o.subject}] "${o.topic}" → ${o.count} soru`));
  }

  // ── Özet ─────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('\n📊 ÖZET:\n');
  console.log(`  Toplam topic_content : ${topics.length}`);
  console.log(`  Toplam question_bank : ${questions.length}`);
  console.log(`  Konusu olan sorular  : ${questions.filter(q => topicSet.has(`${q.exam_type}|${q.subject}|${q.topic}`)).length}`);
  console.log(`  Konusuz sorular      : ${questions.filter(q => !topicSet.has(`${q.exam_type}|${q.subject}|${q.topic}`)).length}`);
  console.log(`  Sorusu olan konular  : ${topics.filter(t => questionsByTopic.has(`${t.exam_type}|${t.subject}|${t.topic}`)).length}`);
  console.log(`  Sorusuz konular      : ${topicsWithoutQ.length}`);
  console.log('\n✅ Doğrulama tamamlandı.');
}

main().catch(err => { console.error('\n❌ Hata:', err.message); process.exit(1); });
