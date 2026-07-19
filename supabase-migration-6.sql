-- ============================================================
-- ActuReady — 6. Migration: Seviye (difficulty) kaldırma
-- SQL Editor'da çalıştırın.
--
-- Değişiklikler:
-- 1. topic_content: unique constraint (exam_type, subject, topic, difficulty)
--    → (exam_type, subject, topic) olarak güncellendi.
--    Aynı konu için birden fazla satır varsa (beginner/intermediate/advanced),
--    içeriği en uzun olan korunur, diğerleri silinir.
-- 2. topic_content.difficulty kolonu NULL kabul eder hale getirildi
--    (geriye dönük uyumluluk için silinmedi, yeni kayıtlarda 'intermediate' gelir).
-- 3. question_bank.difficulty kolonu zaten DEFAULT 'medium' sahip —
--    ek değişiklik gerekmez.
-- ============================================================

-- ── 1. Yinelenen topic_content satırlarını temizle ──────────
-- Aynı (exam_type, subject, topic) için birden fazla satır varsa
-- içeriği en uzun olan satırı tut, diğerlerini sil.
DELETE FROM topic_content
WHERE id NOT IN (
  SELECT DISTINCT ON (exam_type, subject, topic) id
  FROM topic_content
  ORDER BY exam_type, subject, topic, length(content_markdown) DESC
);

-- ── 2. Eski 4'lü unique constraint'i kaldır ─────────────────
DO $$
DECLARE
  conname text;
BEGIN
  SELECT tc.constraint_name INTO conname
  FROM information_schema.table_constraints tc
  WHERE tc.table_name = 'topic_content'
    AND tc.constraint_type = 'UNIQUE'
  LIMIT 1;
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE topic_content DROP CONSTRAINT %I', conname);
  END IF;
END $$;

-- ── 3. Yeni 3'lü unique constraint ekle ─────────────────────
ALTER TABLE topic_content
  ADD CONSTRAINT topic_content_exam_subject_topic_key
  UNIQUE (exam_type, subject, topic);

-- ── 4. difficulty kolonunu opsiyonel yap (NULL izin ver) ────
-- Kolon silinmez — mevcut veriler korunur, yeni kayıtlar için
-- uygulama katmanı 'intermediate' gönderir.
ALTER TABLE topic_content
  ALTER COLUMN difficulty DROP NOT NULL;
