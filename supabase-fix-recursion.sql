-- ============================================================
-- ACİL DÜZELTME: user_profiles_admin_manage politikası
-- "infinite recursion detected in policy for relation user_profiles"
-- hatasına yol açıyor ve TÜM GİRİŞLERİ bozuyor. Hemen çalıştırın.
-- ============================================================

-- 1. Sorunlu politikayı kaldır (giriş hemen düzelir)
DROP POLICY IF EXISTS "user_profiles_admin_manage" ON user_profiles;

-- 2. Aynı işlevi, recursion yapmayan güvenli bir fonksiyon üzerinden geri ekle
-- (SECURITY DEFINER fonksiyon RLS'i tekrar tetiklemeden is_admin kontrolü yapar)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
  );
$$;

CREATE POLICY "user_profiles_admin_manage" ON user_profiles FOR ALL
  USING (is_admin_user());
