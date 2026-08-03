#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const questions = [
  {
    exam_type: 'LEVEL_1', subject: 'mevzuat', topic: 'Türk Sigorta Mevzuatı', is_active: true,
    question_text: 'Sigortacılık Kanunu (5684) kaç yılında yürürlüğe girmiştir?',
    options_json: { A: '2003', B: '2005', C: '2007', D: '2010' },
    correct_answer: 'C',
    explanation: '5684 sayılı Sigortacılık Kanunu 14 Haziran 2007 tarihinde Resmî Gazete\'de yayımlanarak yürürlüğe girmiştir.',
  },
  {
    exam_type: 'LEVEL_1', subject: 'mevzuat', topic: 'Türk Sigorta Mevzuatı', is_active: true,
    question_text: 'Türkiye\'de sigorta şirketleri üzerinde denetim yetkisini kullanan kurum aşağıdakilerden hangisidir?',
    options_json: { A: 'Bankacılık Düzenleme ve Denetleme Kurumu (BDDK)', B: 'Sermaye Piyasası Kurulu (SPK)', C: 'Sigortacılık ve Özel Emeklilik Düzenleme ve Denetleme Kurumu (SEDDK)', D: 'Hazine ve Maliye Bakanlığı' },
    correct_answer: 'C',
    explanation: 'SEDDK (Sigortacılık ve Özel Emeklilik Düzenleme ve Denetleme Kurumu), 2020 yılında Hazine Müsteşarlığı\'nın sigorta denetim yetkilerini devralmıştır.',
  },
  {
    exam_type: 'LEVEL_1', subject: 'mevzuat', topic: 'Türk Sigorta Mevzuatı', is_active: true,
    question_text: 'DASK (Doğal Afet Sigortaları Kurumu) tarafından zorunlu olarak sunulan sigorta türü hangisidir?',
    options_json: { A: 'Zorunlu Trafik Sigortası', B: 'Zorunlu Deprem Sigortası (DASK)', C: 'Zorunlu Sağlık Sigortası', D: 'Zorunlu Yangın Sigortası' },
    correct_answer: 'B',
    explanation: 'DASK, 587 sayılı Kanun Hükmünde Kararname kapsamında konut sahiplerine yönelik Zorunlu Deprem Sigortası (ZDS) sunmaktadır.',
  },
];

async function main() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
    method: 'POST',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(questions),
  });
  if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
  console.log(`✅ ${questions.length} soru yüklendi`);
}
main().catch(e => { console.error(e); process.exit(1); });
