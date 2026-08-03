-- ================================================================
-- SEGEM Aktüerlik Sınavı — topic_content eksiksiz konu listesi
-- Supabase Studio > SQL Editor'da çalıştırın
-- ================================================================

-- Önce mevcut topic_content'i temizle (isteğe bağlı, dikkatli olun)
-- DELETE FROM topic_content;

-- ================================================================
-- LEVEL 1 — Birinci Seviye
-- ================================================================

-- 1A: Matematik (Genel Matematik)
INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1', 'matematik', 'Kümeler ve Fonksiyonlar', 'easy', ''),
('LEVEL_1', 'matematik', 'Diziler ve Seriler', 'easy', ''),
('LEVEL_1', 'matematik', 'Limit ve Süreklilik', 'medium', ''),
('LEVEL_1', 'matematik', 'Türev ve Uygulamaları', 'medium', ''),
('LEVEL_1', 'matematik', 'Belirsiz İntegral', 'medium', ''),
('LEVEL_1', 'matematik', 'Belirli İntegral ve Uygulamaları', 'medium', ''),
('LEVEL_1', 'matematik', 'Diferansiyel Denklemler', 'hard', ''),
('LEVEL_1', 'matematik', 'Matrisler ve Determinantlar', 'medium', ''),
('LEVEL_1', 'matematik', 'Doğrusal Denklem Sistemleri', 'medium', ''),

-- 1B: Finansal Matematik
('LEVEL_1', 'finansal-matematik', 'Basit Faiz ve Basit İskonto', 'easy', ''),
('LEVEL_1', 'finansal-matematik', 'Bileşik Faiz', 'easy', ''),
('LEVEL_1', 'finansal-matematik', 'Bileşik İskonto', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Nominal ve Efektif Faiz Oranları', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Sürekli Bileşik Faiz (Force of Interest)', 'hard', ''),
('LEVEL_1', 'finansal-matematik', 'Cari Değer ve Gelecek Değer', 'easy', ''),
('LEVEL_1', 'finansal-matematik', 'Anüiteler — Dönem Sonu Ödemeli', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Anüiteler — Dönem Başı Ödemeli (Anüite-Düe)', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Ertelenmiş Anüiteler', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Sonsuza Kadar Devam Eden Anüiteler (Perpetüite)', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Değişken Ödemeli Anüiteler', 'hard', ''),
('LEVEL_1', 'finansal-matematik', 'Nakit Akışı Analizi (NPV, IRR)', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Getiri Oranı Hesapları', 'hard', ''),
('LEVEL_1', 'finansal-matematik', 'Amortisman ve Borç Ödeme Planları', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Birikim Fonu (Sinking Fund) Yöntemi', 'medium', ''),
('LEVEL_1', 'finansal-matematik', 'Tahvil Fiyatlaması', 'hard', ''),
('LEVEL_1', 'finansal-matematik', 'Tahvil Amortismanı', 'hard', ''),
('LEVEL_1', 'finansal-matematik', 'Hisse Senedi Değerlemesi', 'hard', ''),

-- 1C: İstatistik
('LEVEL_1', 'istatistik', 'Temel Olasılık Kavramları', 'easy', ''),
('LEVEL_1', 'istatistik', 'Koşullu Olasılık ve Bayes Teoremi', 'medium', ''),
('LEVEL_1', 'istatistik', 'Kombinatorik (Permütasyon ve Kombinasyon)', 'easy', ''),
('LEVEL_1', 'istatistik', 'Kesikli Olasılık Dağılımları', 'medium', ''),
('LEVEL_1', 'istatistik', 'Binom Dağılımı', 'medium', ''),
('LEVEL_1', 'istatistik', 'Poisson Dağılımı', 'medium', ''),
('LEVEL_1', 'istatistik', 'Geometrik ve Negatif Binom Dağılımı', 'medium', ''),
('LEVEL_1', 'istatistik', 'Sürekli Olasılık Dağılımları', 'medium', ''),
('LEVEL_1', 'istatistik', 'Üstel ve Gamma Dağılımı', 'medium', ''),
('LEVEL_1', 'istatistik', 'Normal Dağılım', 'easy', ''),
('LEVEL_1', 'istatistik', 'Lognormal ve Beta Dağılımı', 'hard', ''),
('LEVEL_1', 'istatistik', 'Beklenen Değer ve Varyans', 'easy', ''),
('LEVEL_1', 'istatistik', 'Momentler ve Moment Üreten Fonksiyon', 'hard', ''),
('LEVEL_1', 'istatistik', 'Ortak Dağılımlar ve Kovaryans', 'medium', ''),
('LEVEL_1', 'istatistik', 'Merkezi Limit Teoremi', 'medium', ''),
('LEVEL_1', 'istatistik', 'Örnekleme Teorisi', 'medium', ''),
('LEVEL_1', 'istatistik', 'Nokta Tahmin ve Güven Aralıkları', 'medium', ''),
('LEVEL_1', 'istatistik', 'Hipotez Testi', 'medium', ''),
('LEVEL_1', 'istatistik', 'Basit Doğrusal Regresyon', 'medium', ''),
('LEVEL_1', 'istatistik', 'Varyans Analizi (ANOVA)', 'hard', ''),

-- 1C: Olasılık
('LEVEL_1', 'olasilik', 'Rastgele Değişkenler ve Beklenen Değer', 'easy', ''),
('LEVEL_1', 'olasilik', 'Varyans ve Standart Sapma', 'easy', ''),
('LEVEL_1', 'olasilik', 'Olasılık Teorisi Temelleri', 'easy', ''),
('LEVEL_1', 'olasilik', 'Çok Boyutlu Dağılımlar', 'hard', ''),
('LEVEL_1', 'olasilik', 'Koşullu Dağılımlar ve Koşullu Beklentiler', 'hard', ''),
('LEVEL_1', 'olasilik', 'Önemli Eşitsizlikler (Chebyshev, Markov)', 'medium', ''),

-- 1D: Mevzuat / Temel Sigortacılık ve Ekonomi
('LEVEL_1', 'mevzuat', 'Risk Kavramı ve Risk Yönetimi', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Sigortanın Tanımı ve İşlevleri', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Temel Sigorta İlkeleri', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Sigorta Sözleşmesi ve Tarafları', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Sigortacılık Kanunu (5684) Temel İlkeleri', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Türkiye''de Aktüerlik Mesleği ve Yetkilendirme', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Aktüerya Mevzuatına Giriş', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Sigorta Branşları ve Sınıflandırması', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Reasürans Temel Kavramları', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Sigorta Acenteliği ve Brokerlik Mevzuatı', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Hasar ve Tazminat', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Sigorta Ürünleri ve Branşları', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Temel Ekonomi Kavramları (Arz, Talep, Denge)', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Para Politikası ve Merkez Bankacılığı', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Maliye Politikası ve Bütçe', 'medium', ''),
('LEVEL_1', 'mevzuat', 'Makroekonomik Göstergeler (GSYİH, Enflasyon)', 'easy', ''),
('LEVEL_1', 'mevzuat', 'Dış Ticaret ve Döviz Kurları', 'medium', ''),

-- ================================================================
-- LEVEL 2 — İkinci Seviye
-- ================================================================

-- 2A: Sigorta Matematiği (Hayat ve Hayat Dışı)
('LEVEL_2', 'sigorta-matematigi', 'Hayatta Kalma Modelleri ve Hayat Süresi', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Hayat Tabloları (Tam ve Seçim Tabloları)', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Komütasyon Fonksiyonları', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Hayat Anüiteleri — Tam Hayat ve Süreli', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Hayat Anüiteleri — Ertelenmiş ve Değişken', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Hayat Sigortası Ürünleri — Tam Hayat', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Hayat Sigortası — Süreli, Karma ve Birikim', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Net Prim Hesabı', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Net Prim Karşılıkları ve Rezervler', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Teslim Değerleri ve İndirilmiş Poliçeler', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Çoklu Hayat Modelleri — Birlikte Hayat', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Çoklu Hayat Modelleri — Son Sağ Kalan', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Çoklu Azalma Modelleri', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Markov Zincirleri (Giriş)', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Fayda Teorisi', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Prim İlkeleri (Hayat Dışı)', 'medium', ''),
('LEVEL_2', 'sigorta-matematigi', 'Stokastik Süreçler — Poisson Süreci', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Bileşik Poisson Süreci ve Beklenen Değer', 'hard', ''),
('LEVEL_2', 'sigorta-matematigi', 'Monte Carlo Simülasyonu', 'hard', ''),

-- 2B: Muhasebe ve Finansal Raporlama
('LEVEL_2', 'muhasebe', 'TMS ve TFRS Çerçevesi', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Sigorta Muhasebesi — Üretim Muhasebesi', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Sigorta Muhasebesi — Hasar Muhasebesi', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Sigorta Muhasebesi — Yatırım Muhasebesi', 'hard', ''),
('LEVEL_2', 'muhasebe', 'Reasürans Muhasebesi', 'hard', ''),
('LEVEL_2', 'muhasebe', 'Bireysel Emeklilik Muhasebesi', 'hard', ''),
('LEVEL_2', 'muhasebe', 'Bilanço Hazırlama', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Gelir Tablosu Hazırlama', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Nakit Akış Tablosu', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Finansal Analiz ve Oran Analizi', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Birleşik Oran, Hasar Oranı, Masraf Oranı', 'medium', ''),
('LEVEL_2', 'muhasebe', 'Sermaye Yeterliliği — Solvency I', 'hard', ''),
('LEVEL_2', 'muhasebe', 'Risk Bazlı Sermaye Gereksinimleri', 'hard', ''),

-- 2C: Risk Analizi ve Aktüeryal Modelleme
('LEVEL_2', 'risk-analizi', 'Hasar Sıklığı Modelleri — Poisson ve Binom', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Hasar Sıklığı Modelleri — Karma Dağılımlar', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Hasar Büyüklüğü Modelleri', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Dağılım Dönüşümleri ve Türetme', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Poliçe Modifikasyonları — Muafiyet ve Limitler', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Enflasyonun Hasar Modellerine Etkisi', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Toplam Hasar Modelleri — Bireysel Risk Modeli', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Toplam Hasar Modelleri — Kolektif Risk Modeli', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Panjer Özyinelemesi', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Normal Power Yaklaşımı', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Maximum Likelihood Tahmini', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Momentler Yöntemi ve Yüzdelik Eşleştirme', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Bayesian Tahmin', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Uyum İyiliği Testleri (KS, Chi-Kare)', 'medium', ''),
('LEVEL_2', 'risk-analizi', 'Ampirik Model — Kaplan-Meier Tahmincisi', 'hard', ''),
('LEVEL_2', 'risk-analizi', 'Nelson-Aalen ve Kernel Yoğunluk Tahmini', 'hard', ''),

-- 2D: Finans Teorisi ve Uygulamaları
('LEVEL_2', 'finans-teorisi', 'Finansal Araçlar — Tahvil ve Sabit Getiri', 'easy', ''),
('LEVEL_2', 'finans-teorisi', 'Finansal Araçlar — Hisse Senedi ve Fonlar', 'easy', ''),
('LEVEL_2', 'finans-teorisi', 'Forward Sözleşmeleri', 'medium', ''),
('LEVEL_2', 'finans-teorisi', 'Vadeli İşlem (Futures) Sözleşmeleri', 'medium', ''),
('LEVEL_2', 'finans-teorisi', 'Swap Sözleşmeleri', 'medium', ''),
('LEVEL_2', 'finans-teorisi', 'Opsiyon Tanımı — Call ve Put', 'medium', ''),
('LEVEL_2', 'finans-teorisi', 'Opsiyon Stratejileri (Spread, Collar, Straddle)', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Binom Fiyatlama Modeli', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Black-Scholes Modeli', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Opsiyonun Greekleri (Delta, Gamma, Vega)', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Brownian Hareket ve Geometrik Brownian Hareket', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Itô Lemması', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Delta Koruması ve Gamma Koruması', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Getiri Eğrileri — Spot ve Forward Oranlar', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Durasyon ve Konveksite', 'hard', ''),
('LEVEL_2', 'finans-teorisi', 'Enflasyonun Finansal Araçlara Etkisi', 'medium', ''),

-- ================================================================
-- LEVEL 3 — Üçüncü Seviye
-- ================================================================

-- 3A: Hayat Sigortaları
('LEVEL_3', 'hayat-sigortalari', 'Stokastik Hayat Modelleri', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Hayat Sigortası — Yıl Sonu ve Anlık Ödemeler', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Değişken Primler ve Yardımlarla Hayat Sigortası', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Hayat Sigortası Özyinelemeli Formüller', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Hayat Anüiteleri — Yıllık ve Sürekli', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Hayat Anüiteleri — Değişken Faydalar', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Net Primler ve Özellikleri', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Net Prim Rezervleri — Prospektif Yöntem', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Net Prim Rezervleri — Retrospektif Yöntem', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Özyinelemeli Rezerv Hesabı', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Çoklu Hayat — Birlikte Hayat Statüsü', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Çoklu Hayat — Son Sağ Kalan Statüsü', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Değişmeli (Reversionary) Anüiteler', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Çoklu Azalma Modelleri (İleri)', 'hard', ''),
('LEVEL_3', 'hayat-sigortalari', 'Markov Modelleri — Kesikli ve Sürekli', 'hard', ''),

-- 3B: Hayat Dışı Sigortalar
('LEVEL_3', 'hayatdisi-sigortalar', 'İleri Hasar Sıklığı ve Büyüklüğü Modelleme', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Hasar Reserving — Zincir Merdiven Yöntemi', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Bornhuetter-Ferguson Yöntemi', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'IBNR Rezervleri ve Koşu Üçgenleri', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Fiyatlandırma ve Tarife — GLM Yaklaşımı', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Risk Sınıflandırması ve Underwriting', 'medium', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Reasürans Fiyatlandırması — XL Antlaşmaları', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Reasürans Fiyatlandırması — Proportional Antlaşmalar', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Felaket Modellemesi', 'hard', ''),
('LEVEL_3', 'hayatdisi-sigortalar', 'Prim Yeterliliği Testi', 'hard', ''),

-- 3C: Sağlık Sigortaları
('LEVEL_3', 'saglik-sigortalari', 'Hastalık Riski Modelleme (Morbidity)', 'hard', ''),
('LEVEL_3', 'saglik-sigortalari', 'Tıbbi Hasar Sıklığı ve Büyüklüğü', 'hard', ''),
('LEVEL_3', 'saglik-sigortalari', 'Risk Değerlendirme ve Underwriting (Sağlık)', 'medium', ''),
('LEVEL_3', 'saglik-sigortalari', 'Sağlık Sigortasında Teknik Karşılıklar', 'hard', ''),
('LEVEL_3', 'saglik-sigortalari', 'Sağlık Sigortası Tarife Hesabı', 'hard', ''),
('LEVEL_3', 'saglik-sigortalari', 'Sosyal Sağlık Sigortası vs. Özel Sağlık Sigortası', 'medium', ''),
('LEVEL_3', 'saglik-sigortalari', 'Sağlık Sigortasında Reasürans Uygulamaları', 'hard', ''),

-- 3D: Emeklilik Sistemleri
('LEVEL_3', 'emeklilik', 'Sosyal Güvenlik Sistemleri ve Finansman Modelleri', 'medium', ''),
('LEVEL_3', 'emeklilik', 'Tanımlanmış Fayda (DB) Planları ve Değerleme', 'hard', ''),
('LEVEL_3', 'emeklilik', 'Tanımlanmış Katkı (DC) Planları', 'medium', ''),
('LEVEL_3', 'emeklilik', 'Bireysel Emeklilik Sistemi (BES) Mevzuatı', 'medium', ''),
('LEVEL_3', 'emeklilik', 'BES — Fon Kuruluşu ve Muhasebe', 'hard', ''),
('LEVEL_3', 'emeklilik', 'BES — Giriş, Yatırım ve Çıkış Vergilendirmesi', 'hard', ''),
('LEVEL_3', 'emeklilik', 'Emeklilik Planı Değerlemesi ve Finansmanı', 'hard', ''),
('LEVEL_3', 'emeklilik', 'Aktuaryal Maliyet Yöntemleri', 'hard', ''),

-- 3E: Finans, Yatırım ve Risk Yönetimi
('LEVEL_3', 'finans-yatirim', 'Finansal Risk Yönetimi — Piyasa, Kredi, Likidite Riski', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'VaR ve TVaR Hesabı', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'CAPM ve Etkin Sınır', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Aktüeryal Risk Yönetimi — Hayat Riskleri', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Aktüeryal Risk Yönetimi — Faiz Riski ve Garanti', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Dağıtılabilir Kazançlar ve Embedded Value', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Varlık-Yükümlülük Eşleştirmesi (ALM)', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Durasyon Eşleştirmesi ve Horizon Eşleştirmesi', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Monte Carlo Yöntemleri ve Stres Testi', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Solvency II — Üç Sütunlu Yapı', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Solvency II — SCR, MCR ve BSCR Hesabı', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Solvency II — Teknik Karşılıklar ve En İyi Tahmin', 'hard', ''),
('LEVEL_3', 'finans-yatirim', 'Solvency II — Risk Marjı', 'hard', ''),

-- ================================================================
-- SEGEM_TPYS — Teknik Personel Yeterlilik Sınavı
-- ================================================================
('SEGEM_TPYS', 'mevzuat', 'Sigorta Acenteliği Mevzuatı', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Sigorta Ürünleri ve Branşları', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Trafik ve Kasko Sigortaları', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Konut ve Yangın Sigortaları', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Sağlık Sigortası Temel Bilgileri', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Hayat Sigortası Temel Bilgileri', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Sorumluluk ve Kaza Sigortaları', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Sigorta Sözleşmesi ve Tazminat Süreci', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Bireysel Emeklilik Sistemi (BES) Temelleri', 'easy', ''),
('SEGEM_TPYS', 'mevzuat', 'Sigorta Etik ve Müşteri İlişkileri', 'easy', '')

ON CONFLICT (exam_type, subject, topic) DO NOTHING;
