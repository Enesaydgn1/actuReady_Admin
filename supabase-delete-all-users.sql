-- ============================================================
-- TÜM KULLANICILARI VE KULLANICI VERİLERİNİ SİL
-- ============================================================
-- ⚠️ GERİ ALINAMAZ! Bu script auth.users dahil tüm kullanıcı
-- hesaplarını ve onlara bağlı tüm verileri siler.
-- İçerik tablolarına (question_bank, topic_content, exam_calendar,
-- formula_library, site_settings) DOKUNMAZ.
--
-- Çalıştırma: Supabase Dashboard → SQL Editor → yapıştır → Run
-- ============================================================

BEGIN;

-- 1) Kullanıcıya bağlı uygulama verileri
--    (tasks → roadmaps FK'si nedeniyle önce tasks silinir)
DELETE FROM tasks;
DELETE FROM roadmaps;
DELETE FROM quiz_attempts;
DELETE FROM xp_events;
DELETE FROM monthly_leaderboard;
DELETE FROM error_notebook;
DELETE FROM chat_messages;
DELETE FROM user_notes;
DELETE FROM progress_logs;
DELETE FROM spaced_rep_cards;
DELETE FROM user_profiles;

-- 2) Auth hesapları (identities/sessions/refresh_tokens cascade ile silinir)
-- Not: Avatar dosyaları SQL ile silinemiyor (storage koruması) —
-- istersen Dashboard → Storage → avatars bucket'ından elle temizle (opsiyonel).
DELETE FROM auth.users;

COMMIT;

-- Kontrol: hepsi 0 dönmeli
SELECT
  (SELECT count(*) FROM auth.users)      AS users,
  (SELECT count(*) FROM user_profiles)   AS profiles,
  (SELECT count(*) FROM roadmaps)        AS roadmaps,
  (SELECT count(*) FROM quiz_attempts)   AS quiz_attempts,
  (SELECT count(*) FROM xp_events)       AS xp_events;

-- ============================================================
-- 4) SONRADAN ÇALIŞTIRILACAK — Gmail ile yeniden kayıt olduktan
--    sonra yeni hesabı admin yap (admin paneline giriş için şart):
-- ============================================================
-- UPDATE user_profiles
-- SET is_admin = TRUE
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'enesaydogan65@gmail.com');
