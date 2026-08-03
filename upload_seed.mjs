#!/usr/bin/env node
/**
 * upload_seed.mjs
 * Reads the 4 seed SQL files, parses topic_content and question_bank records,
 * then uploads them to Supabase via the REST API.
 *
 * Run: node upload_seed.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.' +
  'H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

// ─── SQL Parser ────────────────────────────────────────────────────────────────

/** Skip whitespace and SQL line comments (-- ...) */
function skipWS(text, i) {
  while (i < text.length) {
    if (/[ \t\r\n]/.test(text[i])) { i++; continue; }
    if (text[i] === '-' && text[i + 1] === '-') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    break;
  }
  return i;
}

/** Parse a single-quoted SQL string starting at position `start` (the `'`).
 *  Handles '' → ' escape. Returns { value, next }. */
function parseSqlStr(text, start) {
  let i = start + 1; // skip opening '
  let out = '';
  while (i < text.length) {
    if (text[i] === "'") {
      if (i + 1 < text.length && text[i + 1] === "'") {
        out += "'";
        i += 2;
      } else {
        return { value: out, next: i + 1 };
      }
    } else {
      out += text[i++];
    }
  }
  throw new Error(`Unterminated SQL string at offset ${start}`);
}

/** Parse one VALUES tuple `(v1, v2, ...)`.
 *  Returns { values: string[], next } or null if no `(` found. */
function parseTuple(text, start) {
  let i = skipWS(text, start);
  if (i >= text.length || text[i] !== '(') return null;
  i++; // skip (

  const values = [];

  while (i < text.length) {
    i = skipWS(text, i);
    if (i >= text.length) break;

    if (text[i] === ')') { i++; break; }

    let value;
    if (text[i] === "'") {
      const r = parseSqlStr(text, i);
      value = r.value;
      i = r.next;
    } else {
      // null, number, boolean, etc.
      let s = i;
      while (i < text.length && text[i] !== ',' && text[i] !== ')' && !/[ \t\r\n]/.test(text[i])) i++;
      value = text.slice(s, i).trim();
    }

    values.push(value);

    i = skipWS(text, i);
    if (i < text.length && text[i] === ',') i++; // consume separator
    // ')' is caught next iteration
  }

  return { values, next: i };
}

/**
 * Extract all records from INSERT INTO `tableName` (...) VALUES (...), (...) ... ;
 * Handles both single-row inserts (topic_content) and multi-row inserts (question_bank).
 */
function parseInserts(text, tableName) {
  const results = [];
  const re = new RegExp(
    `INSERT\\s+INTO\\s+${tableName}\\s*\\(([^)]+)\\)\\s*VALUES\\s*`,
    'gi'
  );

  let m;
  while ((m = re.exec(text)) !== null) {
    const columns = m[1].split(',').map((c) => c.trim());
    let pos = m.index + m[0].length;

    // Consume tuples separated by commas
    while (true) {
      const j = skipWS(text, pos);
      if (j >= text.length || text[j] !== '(') break;

      const r = parseTuple(text, j);
      if (!r) break;
      pos = r.next;

      const record = {};
      columns.forEach((col, idx) => {
        record[col] = r.values[idx] !== undefined ? r.values[idx] : null;
      });
      results.push(record);

      // Check separator
      const k = skipWS(text, pos);
      if (k < text.length && text[k] === ',') {
        pos = k + 1;
      } else {
        break;
      }
    }

    re.lastIndex = pos;
  }

  return results;
}

// ─── Supabase REST ─────────────────────────────────────────────────────────────

async function sbPost(path, data, prefer) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`[${res.status}] ${path} — ${txt}`);
  }
  return res;
}

async function uploadBatch(table, records, prefer, batchSize = 25) {
  const total = Math.ceil(records.length / batchSize);
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const n = Math.floor(i / batchSize) + 1;
    process.stdout.write(`  [${n}/${total}] ${batch.length} records...`);
    await sbPost(`/${table}`, batch, prefer);
    console.log(' ✓');
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const FILES = [
  'seed_segem_tpys.sql',
  'seed_level1_finmat.sql',
  'seed_level1_istatistik.sql',
  'seed_level1_mevzuat.sql',
];

async function main() {
  const allTopics = [];
  const allQuestions = [];

  for (const file of FILES) {
    const text = readFileSync(join(__dirname, file), 'utf8');
    const topics = parseInserts(text, 'topic_content');
    const questions = parseInserts(text, 'question_bank');
    console.log(`${file}: ${topics.length} topics, ${questions.length} questions`);
    allTopics.push(...topics);
    allQuestions.push(...questions);
  }

  console.log(`\nTotal: ${allTopics.length} topic_content, ${allQuestions.length} question_bank\n`);

  // ── topic_content: upsert via on_conflict query param
  console.log('Uploading topic_content (upsert)...');
  await uploadBatch(
    'topic_content?on_conflict=exam_type,subject,topic',
    allTopics,
    'resolution=merge-duplicates,return=minimal'
  );

  // ── question_bank: parse options_json as real JSON, then insert
  console.log('\nUploading question_bank (insert)...');
  const processedQ = allQuestions.map((q) => {
    try {
      return { ...q, options_json: JSON.parse(q.options_json) };
    } catch {
      console.warn('  ⚠ Could not parse options_json for:', q.question_text?.slice(0, 60));
      return q;
    }
  });
  await uploadBatch('question_bank', processedQ, 'return=minimal');

  console.log('\n✅ Upload complete!');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
