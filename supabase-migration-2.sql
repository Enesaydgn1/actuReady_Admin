-- ============================================================
-- ActuReady — 2. Migration (Claude tarafından hazırlandı)
-- SQL Editor'da çalıştırın. Her bölüm ayrı bir transaction gibi
-- düşünülebilir; bir bölüm hata verirse diğerlerini etkilemez.
-- ============================================================

-- ============================================================
-- 1. site_settings — eksikti, admin ayarlar sayfası ve
--    bakım modu/duyuru banner'ı bu olmadan çalışmıyordu
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id                   TEXT PRIMARY KEY DEFAULT 'global',
  primary_color        TEXT NOT NULL DEFAULT '#C2445A',
  maintenance_mode     BOOLEAN NOT NULL DEFAULT FALSE,
  maintenance_message  TEXT NOT NULL DEFAULT 'Sistem şu anda bakımda. Lütfen daha sonra tekrar deneyin.',
  announcement_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  announcement_text    TEXT NOT NULL DEFAULT '',
  announcement_type    TEXT NOT NULL DEFAULT 'info',
  registration_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_by           UUID
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_read" ON site_settings;
CREATE POLICY "site_settings_read" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_settings_admin_write" ON site_settings;
CREATE POLICY "site_settings_admin_write" ON site_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
  );

INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- Realtime: SettingsPage "anlık yayılır" diyor, bunun için tabloyu publication'a ekle
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ============================================================
-- 2. user_profiles — is_admin self-escalation kilidi
-- Bir kullanıcının kendi profilini güncelleyerek (veya kayıt
-- olurken) is_admin=true yapmasını DB seviyesinde engeller.
-- Mevcut RLS politikalarından bağımsız çalışır (trigger).
-- Zaten admin olan biri başka bir kullanıcıyı admin yapabilir
-- (UsersPage'deki "Admin Yap" özelliği bundan etkilenmez).
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_self_admin_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
    ) THEN
      NEW.is_admin := OLD.is_admin;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_self_admin_escalation ON user_profiles;
CREATE TRIGGER trg_prevent_self_admin_escalation
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_self_admin_escalation();

CREATE OR REPLACE FUNCTION prevent_self_admin_escalation_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin = TRUE AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
  ) THEN
    NEW.is_admin := FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_self_admin_escalation_insert ON user_profiles;
CREATE TRIGGER trg_prevent_self_admin_escalation_insert
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_self_admin_escalation_insert();

-- Admin'in başka kullanıcıların profilini görüp yönetebilmesini garanti et
-- (mevcut politikalarla çakışmaz, sadece ek izin verir — OR mantığıyla çalışır)
DROP POLICY IF EXISTS "user_profiles_admin_manage" ON user_profiles;
CREATE POLICY "user_profiles_admin_manage" ON user_profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles p WHERE p.user_id = auth.uid() AND p.is_admin = TRUE)
  );

-- ============================================================
-- 3. formula_library — Admin'in yönetebileceği formül kütüphanesi
-- (eskiden frontend'de statik bir dosyaydı, artık admin panelden
-- ekleniyor/düzenleniyor)
-- ============================================================
CREATE TABLE IF NOT EXISTS formula_library (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  name_en     TEXT NOT NULL DEFAULT '',
  subject     TEXT NOT NULL,
  latex       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags        TEXT[] NOT NULL DEFAULT '{}',
  example     TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE formula_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "formula_library_read" ON formula_library;
CREATE POLICY "formula_library_read" ON formula_library FOR SELECT USING (true);

DROP POLICY IF EXISTS "formula_library_admin_write" ON formula_library;
CREATE POLICY "formula_library_admin_write" ON formula_library FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE)
  );

-- Sadece tablo boşsa seed verisini ekle (tekrar çalıştırılırsa kayıtları çoğaltmasın)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM formula_library LIMIT 1) THEN
    -- formula_library seed verisi (eski statik dosyadan otomatik aktarıldı, 50 kayıt)
    INSERT INTO formula_library (name, name_en, subject, latex, description, tags, example) VALUES
    ('Net Tek Prim (Hayat Ömür Boyu)', 'Net Single Premium (Whole Life)', 'Hayat Sigortacılığı', 'A_x = \sum_{k=0}^{\infty} v^{k+1} \cdot {}_k p_x \cdot q_{x+k}', 'x yaşındaki bir kişi için ömür boyu hayat sigortasının net tek primini verir.', ARRAY['net prim', 'ömür boyu', 'mortalite', 'iskonto']::text[], NULL),
    ('Net Tek Prim (n-Yıllık Vadeli)', 'Net Single Premium (Term Life)', 'Hayat Sigortacılığı', 'A^1_{x:\overline{n}|} = \sum_{k=0}^{n-1} v^{k+1} \cdot {}_k p_x \cdot q_{x+k}', 'x yaşındaki kişi için n yıllık vadeli hayat sigortasının net tek primini verir.', ARRAY['net prim', 'vadeli', 'term life']::text[], NULL),
    ('Pure Endowment (Karma Sigorta Tasarruf)', 'Pure Endowment', 'Hayat Sigortacılığı', '{}_n E_x = v^n \cdot {}_n p_x', 'x yaşındaki kişinin n yıl sonra hayatta olma olasılığının iskontolu değeri.', ARRAY['endowment', 'tasarruf', 'safi yatırım']::text[], NULL),
    ('Karma Sigorta (Endowment)', 'Endowment Insurance', 'Hayat Sigortacılığı', 'A_{x:\overline{n}|} = A^1_{x:\overline{n}|} + {}_n E_x', 'Vadeli hayat sigortası ile pure endowment birleşimi.', ARRAY['karma sigorta', 'endowment']::text[], NULL),
    ('Yıllık Rant (Whole Life Annuity)', 'Whole Life Annuity-due', 'Hayat Sigortacılığı', '\ddot{a}_x = \sum_{k=0}^{\infty} v^k \cdot {}_k p_x', 'x yaşındaki kişiye ömür boyu dönem başı yapılan ödemelerin bugünkü değeri.', ARRAY['rant', 'annuity', 'ömür boyu']::text[], NULL),
    ('Yıllık Rant (n-Yıllık)', 'Temporary Life Annuity-due', 'Hayat Sigortacılığı', '\ddot{a}_{x:\overline{n}|} = \sum_{k=0}^{n-1} v^k \cdot {}_k p_x', 'x yaşındaki kişiye n yıl boyunca dönem başı yapılan ödemelerin bugünkü değeri.', ARRAY['rant', 'vadeli', 'annuity']::text[], NULL),
    ('Dönem Sonu Rant (Whole Life)', 'Whole Life Annuity-immediate', 'Hayat Sigortacılığı', 'a_x = \ddot{a}_x - 1', 'Dönem sonunda ödeme yapılan ömür boyu rant.', ARRAY['rant', 'dönem sonu']::text[], NULL),
    ('Net Yıllık Prim', 'Net Annual Premium', 'Hayat Sigortacılığı', 'P(A_x) = \frac{A_x}{\ddot{a}_x}', 'Ömür boyu hayat sigortası için yıllık eşit net prim.', ARRAY['net prim', 'yıllık prim']::text[], NULL),
    ('Prospektif Rezerv', 'Prospective Reserve', 'Hayat Sigortacılığı', '{}_t V(A_x) = A_{x+t} - P(A_x) \cdot \ddot{a}_{x+t}', 'Sigortanın t. yılındaki prospektif (ileriye dönük) matematiksel rezervi.', ARRAY['rezerv', 'prospektif']::text[], NULL),
    ('Mortalite Olasılığı (q_x)', 'Probability of Death', 'Hayat Sigortacılığı', 'q_x = \frac{d_x}{l_x} = 1 - p_x', 'x yaşındaki bir kişinin bir yıl içinde ölme olasılığı.', ARRAY['mortalite', 'ölüm olasılığı', 'hayat tablosu']::text[], NULL),
    ('k-Yıllık Hayatta Kalma Olasılığı', 'k-year Survival Probability', 'Hayat Sigortacılığı', '{}_k p_x = \frac{l_{x+k}}{l_x}', 'x yaşındaki kişinin k yıl daha hayatta kalma olasılığı.', ARRAY['hayatta kalma', 'mortalite', 'hayat tablosu']::text[], NULL),
    ('Beklenen Yaşam Süresi', 'Complete Expectation of Life', 'Hayat Sigortacılığı', '\mathring{e}_x = \int_0^{\infty} {}_t p_x \, dt', 'x yaşındaki bir kişinin beklenen yaşam süresi (sürekli).', ARRAY['beklenen ömür', 'hayat beklentisi']::text[], NULL),
    ('Curtate Beklenen Yaşam Süresi', 'Curtate Expectation of Life', 'Hayat Sigortacılığı', 'e_x = \sum_{k=1}^{\infty} {}_k p_x', 'x yaşındaki kişinin tam yıl cinsinden beklenen yaşam süresi.', ARRAY['beklenen ömür', 'curtate']::text[], NULL),
    ('UDD Varsayımı altında A_x', 'A_x under UDD', 'Hayat Sigortacılığı', 'A_x = \frac{i}{\delta} \cdot A^{(m)}_x \approx \frac{i}{\delta} \cdot A_x', 'Uniform Death Distribution (UDD) varsayımı altında sürekli ve ayrık primler arasındaki ilişki.', ARRAY['UDD', 'sürekli', 'ayrık']::text[], NULL),
    ('Faiz Kuvveti (Force of Interest)', 'Force of Interest', 'Finansal Matematik', '\delta = \ln(1+i)', 'Sürekli bileşik faiz oranı (faiz kuvveti) ile yıllık faiz oranı arasındaki ilişki.', ARRAY['faiz kuvveti', 'sürekli faiz', 'delta']::text[], NULL),
    ('Bugünkü Değer (Sürekli)', 'Present Value (Continuous)', 'Finansal Matematik', 'PV = FV \cdot e^{-\delta t}', 'Sürekli bileşik faizle t yıl sonraki değerin bugünkü karşılığı.', ARRAY['bugünkü değer', 'sürekli', 'iskonto']::text[], NULL),
    ('Bugünkü Değer Faktörü (v)', 'Discount Factor', 'Finansal Matematik', 'v = \frac{1}{1+i} = e^{-\delta}', 'Bir yıl sonraki 1 TL''nin bugünkü değeri.', ARRAY['iskonto faktörü', 'v']::text[], NULL),
    ('Sabit Ödemeli Rant (Annuity-due)', 'Annuity-due Present Value', 'Finansal Matematik', '\ddot{a}_{\overline{n}|} = \frac{1-v^n}{d}', 'n dönem boyunca dönem başında yapılan 1 birimlik ödemelerin bugünkü değeri. d = i/(1+i).', ARRAY['rant', 'annuity-due', 'sabit ödeme']::text[], NULL),
    ('Sabit Ödemeli Rant (Annuity-immediate)', 'Annuity-immediate Present Value', 'Finansal Matematik', 'a_{\overline{n}|} = \frac{1-v^n}{i}', 'n dönem boyunca dönem sonunda yapılan 1 birimlik ödemelerin bugünkü değeri.', ARRAY['rant', 'annuity-immediate', 'sabit ödeme']::text[], NULL),
    ('Artan Rant', 'Increasing Annuity', 'Finansal Matematik', '(Ia)_{\overline{n}|} = \frac{\ddot{a}_{\overline{n}|} - n v^n}{i}', 'Her dönem 1 artan ödemelerin bugünkü değeri.', ARRAY['artan rant', 'increasing annuity']::text[], NULL),
    ('Azalan Rant', 'Decreasing Annuity', 'Finansal Matematik', '(Da)_{\overline{n}|} = \frac{n - a_{\overline{n}|}}{i}', 'Her dönem 1 azalan ödemelerin bugünkü değeri.', ARRAY['azalan rant', 'decreasing annuity']::text[], NULL),
    ('Net Bugünkü Değer (NPV)', 'Net Present Value', 'Finansal Matematik', 'NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+i)^t}', 'Nakit akışlarının iskonto edilmiş değerlerinin toplamı.', ARRAY['NPV', 'nakit akışı', 'proje değerleme']::text[], NULL),
    ('İç Verim Oranı (IRR)', 'Internal Rate of Return', 'Finansal Matematik', '\sum_{t=0}^{n} \frac{CF_t}{(1+IRR)^t} = 0', 'NPV''yi sıfıra eşitleyen iskonto oranı.', ARRAY['IRR', 'verim', 'proje']::text[], NULL),
    ('Duration (Macaulay)', 'Macaulay Duration', 'Finansal Matematik', 'D_{Mac} = \frac{\sum_{t} t \cdot CF_t \cdot v^t}{P}', 'Tahvilin nakit akışlarının ağırlıklı ortalama vadesi.', ARRAY['duration', 'tahvil', 'süre']::text[], NULL),
    ('Modified Duration', 'Modified Duration', 'Finansal Matematik', 'D_{Mod} = \frac{D_{Mac}}{1+i}', 'Faiz oranına duyarlılık ölçüsü; fiyat değişimini yaklaşık tahmin eder.', ARRAY['duration', 'faiz duyarlılığı', 'tahvil']::text[], NULL),
    ('Convexity', 'Convexity', 'Finansal Matematik', 'C = \frac{1}{P} \sum_t \frac{t(t+1) \cdot CF_t}{(1+i)^{t+2}}', 'Duration''ın faiz değişimine duyarlılığı; ikinci dereceden düzeltme.', ARRAY['convexity', 'tahvil', 'faiz']::text[], NULL),
    ('Bayes Teoremi', 'Bayes'' Theorem', 'Olasılık & İstatistik', 'P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}', 'Koşullu olasılığı ters yönde hesaplar.', ARRAY['Bayes', 'koşullu olasılık']::text[], NULL),
    ('Toplam Olasılık Teoremi', 'Law of Total Probability', 'Olasılık & İstatistik', 'P(B) = \sum_{i} P(B|A_i) \cdot P(A_i)', 'Tam bölünme {A_i} üzerinden B olayının olasılığı.', ARRAY['toplam olasılık', 'tam bölünme']::text[], NULL),
    ('Beklenen Değer (Ayrık)', 'Expected Value (Discrete)', 'Olasılık & İstatistik', 'E[X] = \sum_{x} x \cdot P(X=x)', 'Ayrık rastgele değişkenin beklenen değeri.', ARRAY['beklenen değer', 'ortalama']::text[], NULL),
    ('Varyans', 'Variance', 'Olasılık & İstatistik', 'Var(X) = E[X^2] - (E[X])^2', 'Dağılımın ortalamadan ortalama kare sapması.', ARRAY['varyans', 'standart sapma']::text[], NULL),
    ('Normal Dağılım PDF', 'Normal Distribution PDF', 'Olasılık & İstatistik', 'f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}', 'Gauss (normal) dağılımının olasılık yoğunluk fonksiyonu.', ARRAY['normal dağılım', 'Gauss', 'PDF']::text[], NULL),
    ('Standartlaştırma (Z-Skoru)', 'Z-Score', 'Olasılık & İstatistik', 'Z = \frac{X - \mu}{\sigma}', 'Normal dağılımlı değişkeni standart normal''e dönüştürür.', ARRAY['z-skoru', 'standartlaştırma', 'normal']::text[], NULL),
    ('Merkezi Limit Teoremi', 'Central Limit Theorem', 'Olasılık & İstatistik', '\bar{X}_n \xrightarrow{d} N\!\left(\mu,\, \frac{\sigma^2}{n}\right)', 'Büyük örneklemde örneklem ortalaması normal dağılıma yaklaşır.', ARRAY['merkezi limit', 'CLT', 'örneklem']::text[], NULL),
    ('Poisson Dağılımı PMF', 'Poisson PMF', 'Olasılık & İstatistik', 'P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}', 'Sabit oran λ ile gerçekleşen olayların sayısının dağılımı.', ARRAY['Poisson', 'sayım', 'hasar frekansı']::text[], NULL),
    ('Binom Dağılımı PMF', 'Binomial PMF', 'Olasılık & İstatistik', 'P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}', 'n bağımsız Bernoulli denemesinde k başarı olasılığı.', ARRAY['binom', 'Bernoulli', 'başarı sayısı']::text[], NULL),
    ('Toplam Varyansın Ayrışımı', 'Law of Total Variance', 'Olasılık & İstatistik', 'Var(X) = E[Var(X|Y)] + Var(E[X|Y])', 'Varyansı koşullu beklenti ve koşullu varyans cinsinden ifade eder.', ARRAY['toplam varyans', 'ANOVA', 'koşullu']::text[], NULL),
    ('Üstel Dağılım CDF', 'Exponential Distribution CDF', 'Olasılık & İstatistik', 'F(x) = 1 - e^{-\lambda x}, \quad x \geq 0', 'Üstel dağılımın birikimli dağılım fonksiyonu. Beklenen değer = 1/λ.', ARRAY['üstel dağılım', 'hasar', 'bekleme süresi']::text[], NULL),
    ('Ki-Kare Dağılımı', 'Chi-Square Distribution', 'Olasılık & İstatistik', 'X^2 = \sum_{i=1}^{n} Z_i^2 \sim \chi^2(n)', 'n bağımsız standart normal değişkenin karelerinin toplamı.', ARRAY['ki-kare', 'hipotez testi', 'uyum iyiliği']::text[], NULL),
    ('Korelasyon Katsayısı', 'Pearson Correlation', 'Olasılık & İstatistik', '\rho_{XY} = \frac{Cov(X,Y)}{\sigma_X \sigma_Y}', 'İki değişken arasındaki doğrusal ilişkinin gücü (-1 ile 1 arasında).', ARRAY['korelasyon', 'kovaryans']::text[], NULL),
    ('Moment Üreten Fonksiyon', 'Moment Generating Function', 'Olasılık & İstatistik', 'M_X(t) = E[e^{tX}]', 'Tüm momentleri üretmek için kullanılan fonksiyon.', ARRAY['MGF', 'moment', 'karakteristik']::text[], NULL),
    ('Taylor Serisi (e^x)', 'Taylor Series (e^x)', 'Matematik', 'e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \cdots', 'Üstel fonksiyonun Taylor (Maclaurin) açılımı.', ARRAY['Taylor serisi', 'üstel', 'yaklaşım']::text[], NULL),
    ('Geometrik Seri', 'Geometric Series', 'Matematik', '\sum_{k=0}^{\infty} r^k = \frac{1}{1-r}, \quad |r|<1', 'Sonsuz geometrik serinin toplamı (|r| < 1 koşuluyla).', ARRAY['geometrik seri', 'sonsuz toplam']::text[], NULL),
    ('İntegrasyon (Parts)', 'Integration by Parts', 'Matematik', '\int u \, dv = uv - \int v \, du', 'Kısmi integrasyon formülü.', ARRAY['integral', 'kısmi integrasyon']::text[], NULL),
    ('Logaritma Özellikleri', 'Logarithm Properties', 'Matematik', '\ln(ab) = \ln a + \ln b, \quad \ln\frac{a}{b} = \ln a - \ln b', 'Doğal logaritmanın çarpım ve bölüm özellikleri.', ARRAY['logaritma', 'ln']::text[], NULL),
    ('Türev (Zincir Kuralı)', 'Chain Rule', 'Matematik', '\frac{d}{dx}[f(g(x))] = f''(g(x)) \cdot g''(x)', 'Bileşik fonksiyonun türevi.', ARRAY['türev', 'zincir kuralı']::text[], NULL),
    ('L''Hôpital Kuralı', 'L''Hôpital''s Rule', 'Matematik', '\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f''(x)}{g''(x)}', '0/0 veya ∞/∞ belirsizliği için limit hesaplama.', ARRAY['limit', 'L''Hôpital', 'belirsizlik']::text[], NULL),
    ('Gauss İntegrali', 'Gaussian Integral', 'Matematik', '\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}', 'Normal dağılım hesaplamalarında sık kullanılan temel integral.', ARRAY['Gauss', 'integral', 'normal dağılım']::text[], NULL),
    ('Solvency II SCR Formülü', 'Solvency II SCR Formula', 'Mevzuat', 'SCR = \sqrt{\sum_{i,j} Corr_{i,j} \cdot SCR_i \cdot SCR_j} + SCR_{op}', 'Solvensy II çerçevesinde Sermaye Gereksinimi (SCR) hesaplama formülü.', ARRAY['Solvency II', 'SCR', 'sermaye', 'risk']::text[], NULL),
    ('Best Estimate Liability (BEL)', 'Best Estimate Liability', 'Mevzuat', 'BEL = E\!\left[\sum_t \frac{CF_t}{(1+r_t)^t}\right]', 'Solvency II''de yükümlülüklerin en iyi tahmin değeri; risk-free oran ile iskonto edilmiş beklenen nakit akışları.', ARRAY['BEL', 'Solvency II', 'teknik karşılık']::text[], NULL),
    ('Risk Marjı (RM)', 'Risk Margin', 'Mevzuat', 'RM = CoC \cdot \sum_t \frac{SCR_t}{(1+r_t)^{t+1}}', 'CoC (Cost-of-Capital) oranı ile gelecek SCR''lerin bugünkü değeri. CoC = %6.', ARRAY['risk marjı', 'Solvency II', 'CoC']::text[], NULL);
  END IF;
END $$;

-- ============================================================
-- 4. question-images storage bucket — KONTROL EDİLDİ, ZATEN VAR
-- (önceki oturumda zaten oluşturulmuştu, tekrar çalıştırmaya gerek yok)
-- ============================================================
