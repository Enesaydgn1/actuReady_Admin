-- ============================================================
-- ActuReady — 3. Migration: Duyuru banner'ına görsel desteği
-- SQL Editor'da çalıştırın.
-- ============================================================

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS announcement_image_url TEXT;
