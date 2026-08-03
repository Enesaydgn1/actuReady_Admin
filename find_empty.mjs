#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

async function fetchAll(path) {
  const all = [];
  let offset = 0;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}&offset=${offset}&limit=1000`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
    });
    const data = await res.json();
    all.push(...data);
    if (data.length < 1000) break;
    offset += 1000;
  }
  return all;
}

const topics = await fetchAll('/topic_content?select=exam_type,subject,topic&order=exam_type,subject,topic');
const questions = await fetchAll('/question_bank?select=exam_type,subject,topic&order=exam_type,subject,topic');
const qSet = new Set(questions.map(q => `${q.exam_type}|${q.subject}|${q.topic}`));

const empty = topics.filter(t => !qSet.has(`${t.exam_type}|${t.subject}|${t.topic}`));
console.log(`Sorusuz ${empty.length} konu:\n`);
empty.forEach(t => console.log(`  [${t.exam_type}/${t.subject}] ${t.topic}`));
