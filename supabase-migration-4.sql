-- ============================================================
-- ActuReady — 4. Migration: topic_content'e seviye (difficulty) desteği
-- SQL Editor'da çalıştırın.
-- ============================================================

ALTER TABLE topic_content
  ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'intermediate';

-- Eski (exam_type, subject, topic) unique kısıtını bul ve kaldır —
-- artık aynı konunun 3 farklı seviyesi (temel/orta/ileri) ayrı satır olabilmeli.
DO $$
DECLARE
  conname text;
BEGIN
  SELECT tc.constraint_name INTO conname
  FROM information_schema.table_constraints tc
  WHERE tc.table_name = 'topic_content' AND tc.constraint_type = 'UNIQUE'
  LIMIT 1;
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE topic_content DROP CONSTRAINT %I', conname);
  END IF;
END $$;

ALTER TABLE topic_content
  ADD CONSTRAINT topic_content_exam_subject_topic_diff_key
  UNIQUE (exam_type, subject, topic, difficulty);

-- ============================================================
-- Roadmap görevinde sabit soru sayısı + geçme barajı (admin panelden ayarlanabilir)
-- ============================================================
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS roadmap_quiz_question_count INT NOT NULL DEFAULT 12;
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS roadmap_pass_threshold_pct INT NOT NULL DEFAULT 70;
