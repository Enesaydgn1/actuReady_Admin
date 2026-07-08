-- ============================================================
-- ActuReady — 5. Migration: delete_own_account() RPC fonksiyonu
-- SQL Editor'da çalıştırın.
--
-- Frontend'deki Ayarlar → Tehlikeli Bölge → "Hesabı Sil" butonu
-- supabase.rpc('delete_own_account') çağırıyor; bu fonksiyon
-- çağıran kullanıcının TÜM verilerini ve auth hesabını siler.
-- Sadece kendi hesabını silebilir (auth.uid() üzerinden),
-- anon (oturumsuz) erişime kapalıdır.
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Oturum bulunamadı';
  END IF;

  -- Kullanıcıya bağlı uygulama verileri
  -- (tasks tablosunda user_id yok — roadmap üzerinden bağlanır,
  --  FK sırası gereği roadmaps'ten önce silinir)
  DELETE FROM tasks WHERE roadmap_id IN (SELECT id FROM roadmaps WHERE user_id = uid);
  DELETE FROM roadmaps            WHERE user_id = uid;
  DELETE FROM quiz_attempts       WHERE user_id = uid;
  DELETE FROM xp_events           WHERE user_id = uid;
  DELETE FROM monthly_leaderboard WHERE user_id = uid;
  DELETE FROM error_notebook      WHERE user_id = uid;
  DELETE FROM chat_messages       WHERE user_id = uid;
  DELETE FROM user_notes          WHERE user_id = uid;
  DELETE FROM progress_logs       WHERE user_id = uid;
  DELETE FROM spaced_rep_cards    WHERE user_id = uid;
  DELETE FROM user_profiles       WHERE user_id = uid;

  -- Auth hesabı (identities/sessions/refresh_tokens cascade ile silinir)
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

-- Sadece oturum açmış kullanıcılar çağırabilsin
REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- Kontrol: fonksiyon oluştu mu?
SELECT proname, prosecdef AS security_definer
FROM pg_proc
WHERE proname = 'delete_own_account';
