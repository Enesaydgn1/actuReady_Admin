-- ============================================================
-- ActuReady — 7. Migration: is_starred kolonu ekleme
-- SQL Editor'da çalıştırın.
--
-- Değişiklikler:
-- 1. question_bank: is_starred (boolean, default false) eklendi
--    Sınavda daha önce sorulmuş / kritik sorular için yıldız işareti
-- ============================================================

ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS is_starred BOOLEAN NOT NULL DEFAULT FALSE;

-- İndeks: yıldızlı soruları hızlı çekmek için
CREATE INDEX IF NOT EXISTS idx_question_bank_is_starred
  ON question_bank (is_starred)
  WHERE is_starred = TRUE;

COMMENT ON COLUMN question_bank.is_starred IS
  'TRUE = sınavda daha önce sorulmuş veya kritik önem taşıyan soru';
