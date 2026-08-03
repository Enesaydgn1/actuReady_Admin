/**
 * ActuReady — Toplu İçerik Üretim Scripti
 * =========================================
 * Gemini 2.5 Flash ile aktüerlik sınavı soruları ve konu anlatımları üretir,
 * doğrudan Supabase'e yazar.
 *
 * Kullanım:
 *   node scripts/generate-content.mjs topics      → Konu anlatımlarını üret
 *   node scripts/generate-content.mjs questions   → Soruları üret
 *   node scripts/generate-content.mjs all         → İkisini de üret
 *
 * Ortam değişkenleri (.env dosyasından okunur):
 *   VITE_GEMINI_API_KEY
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── .env yükle ─────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env')
const envLines = readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const [k, ...rest] = line.split('=')
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
}

const GEMINI_KEY   = process.env.VITE_GEMINI_API_KEY
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!GEMINI_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Eksik env değişkeni. .env dosyasını kontrol et.')
  process.exit(1)
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

// ── Müfredat Tanımı ─────────────────────────────────────────────────────────
// Her konu için kaç soru üretileceği ve zorluk dağılımı burada belirlenir.
// Toplam: ~10.000 soru
const CURRICULUM = [
  // ─────────────────────── LEVEL 1 ───────────────────────
  {
    exam_type: 'LEVEL_1', subject: 'matematik',
    topics: [
      { name: 'Limitler ve Süreklilik', q: { easy: 20, medium: 35, hard: 20 } },
      { name: 'Türev ve Uygulamaları', q: { easy: 25, medium: 40, hard: 25 } },
      { name: 'İntegral ve Uygulamaları', q: { easy: 20, medium: 35, hard: 20 } },
      { name: 'Seriler ve Diziler', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Çok Değişkenli Fonksiyonlar', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Diferansiyel Denklemler', q: { easy: 15, medium: 25, hard: 20 } },
      { name: 'Vektörler ve Matris İşlemleri', q: { easy: 10, medium: 25, hard: 15 } },
      { name: 'Determinant ve Ters Matris', q: { easy: 10, medium: 25, hard: 15 } },
      { name: 'Özdeğer ve Özvektörler', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'Doğrusal Denklem Sistemleri', q: { easy: 10, medium: 20, hard: 15 } },
      { name: 'Lagrange Çarpanları ve Kısıtlı Optimizasyon', q: { easy: 8, medium: 20, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_1', subject: 'olasilik',
    topics: [
      { name: 'Örnek Uzay, Olaylar ve Aksiyomlar', q: { easy: 15, medium: 25, hard: 15 } },
      { name: 'Kombinatorik — Permütasyon ve Kombinasyon', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Koşullu Olasılık', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Bağımsızlık', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Bayes Teoremi ve Toplam Olasılık', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Kesikli Rastgele Değişkenler — PMF ve CDF', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Beklenti, Varyans ve Standart Sapma', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Binom ve Bernoulli Dağılımı', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Geometrik ve Negatif Binom Dağılımı', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Poisson Dağılımı', q: { easy: 15, medium: 30, hard: 20 } },
      { name: 'Hipergeometrik Dağılım', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Sürekli Rastgele Değişkenler — PDF ve CDF', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Düzgün (Uniform) Dağılım', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'Üstel (Exponential) Dağılım', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Normal Dağılım ve Standartlaştırma', q: { easy: 18, medium: 32, hard: 20 } },
      { name: 'Gamma Dağılımı', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Beta Dağılımı', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'Lognormal Dağılım', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Pareto Dağılımı', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Weibull Dağılımı', q: { easy: 8, medium: 18, hard: 12 } },
      { name: 'Moment Üreten Fonksiyonlar (MGF)', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Olasılık Üreten Fonksiyonlar (PGF)', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Çok Boyutlu Ortak Dağılımlar', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Marjinal ve Koşullu Dağılımlar', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Kovaryans ve Korelasyon', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Bileşik ve Karışım Dağılımlar', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Dönüşümler — Tek ve Çok Değişkenli', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Sıra İstatistikleri (Order Statistics)', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'Merkezi Limit Teoremi', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Büyük Sayılar Yasası ve Chebyshev', q: { easy: 10, medium: 20, hard: 12 } },
    ]
  },
  {
    exam_type: 'LEVEL_1', subject: 'istatistik',
    topics: [
      { name: 'Betimleyici İstatistik — Merkezi Eğilim', q: { easy: 15, medium: 22, hard: 12 } },
      { name: 'Betimleyici İstatistik — Dağılım Ölçüleri', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'Frekans Dağılımları ve Histogramlar', q: { easy: 12, medium: 18, hard: 8 } },
      { name: 'Örnekleme Yöntemleri', q: { easy: 12, medium: 20, hard: 10 } },
      { name: 'Örnekleme Dağılımları — X̄ ve S²', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 't Dağılımı', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Ki-Kare Dağılımı', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'F Dağılımı', q: { easy: 10, medium: 20, hard: 12 } },
      { name: 'Nokta Tahmini — Momentler Yöntemi', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Nokta Tahmini — Maksimum Olabilirlik (MLE)', q: { easy: 10, medium: 25, hard: 18 } },
      { name: 'Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Cramér-Rao Alt Sınırı ve UMVUE', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Güven Aralıkları — Ortalama', q: { easy: 15, medium: 28, hard: 15 } },
      { name: 'Güven Aralıkları — Oran ve Varyans', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', q: { easy: 15, medium: 25, hard: 15 } },
      { name: 'Tek Örneklem t Testi', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'İki Örneklem t Testi ve Eşleştirilmiş t', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Varyans Testleri (Ki-Kare ve F)', q: { easy: 10, medium: 20, hard: 12 } },
      { name: 'Tek Yönlü ANOVA', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Basit Doğrusal Regresyon', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Çoklu Doğrusal Regresyon', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Regresyon Tanı ve Varsayım Kontrolleri', q: { easy: 10, medium: 20, hard: 15 } },
      { name: 'Lojistik Regresyon — Temel', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Parametrik Olmayan Testler', q: { easy: 10, medium: 18, hard: 12 } },
      { name: 'Bayes İstatistiği — Prior, Posterior, Credible Interval', q: { easy: 8, medium: 20, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_1', subject: 'finansal-matematik',
    topics: [
      { name: 'Basit ve Bileşik Faiz', q: { easy: 18, medium: 30, hard: 18 } },
      { name: 'Efektif ve Nominal Faiz Oranları', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'İskonto Oranları (Discount Rates)', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Anlık Faiz (Force of Interest)', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Bugünkü Değer (Present Value)', q: { easy: 18, medium: 30, hard: 18 } },
      { name: 'Gelecek Değer (Future Value)', q: { easy: 18, medium: 28, hard: 15 } },
      { name: 'Anüite-Immediate', q: { easy: 18, medium: 32, hard: 20 } },
      { name: 'Anüite-Due', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Sürekli Anüiteler', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Süresiz Anüiteler (Perpetuity)', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Aritmetik Artan ve Azalan Anüiteler', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Geometrik Artan Anüiteler', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Borç Amortismanı — Eşit Taksit Yöntemi', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Borç Amortismanı — Batırma Fonu Yöntemi', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Tahvil Değerlemesi — Temel', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Tahvil — Premium, Discount ve YTM', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Tahvil Duration ve Convexity', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Bağışıklık (Immunization) — Redington', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Bağışıklık — Tam Bağışıklık', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Forward Faiz Oranları', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Faiz Oranı Swap\'ları', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'Forward Sözleşmeler', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Opsiyonlar — Call, Put ve Put-Call Paritesi', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Net Bugünkü Değer ve İç Verim Oranı (IRR)', q: { easy: 12, medium: 22, hard: 15 } },
      { name: 'Portföy Getirisi (TWRR ve DWRR)', q: { easy: 10, medium: 20, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_1', subject: 'mevzuat',
    topics: [
      { name: 'Sigorta Sözleşmesinin Unsurları ve Türleri', q: { easy: 18, medium: 28, hard: 12 } },
      { name: 'Sigorta Hukukunun Temel İlkeleri', q: { easy: 15, medium: 25, hard: 10 } },
      { name: 'Sigorta Ettiren ve Sigortalının Yükümlülükleri', q: { easy: 15, medium: 22, hard: 10 } },
      { name: 'Sigorta Şirketlerinin Kuruluşu ve Lisanslama', q: { easy: 12, medium: 20, hard: 8 } },
      { name: 'Sigortacılık Kanunu — Temel Hükümler', q: { easy: 15, medium: 25, hard: 10 } },
      { name: 'SEDDK — Görev ve Yetkileri', q: { easy: 12, medium: 20, hard: 8 } },
      { name: 'Aktüerlik Mesleği — Tanım, Kapsam ve Sorumluluklar', q: { easy: 15, medium: 22, hard: 10 } },
      { name: 'Aktüer Etik Kuralları ve Mesleki Standartlar', q: { easy: 15, medium: 22, hard: 8 } },
      { name: 'Türk Aktüerler Derneği Yönetmelikleri', q: { easy: 12, medium: 18, hard: 8 } },
      { name: 'Bireysel Emeklilik Sistemi (BES) Mevzuatı', q: { easy: 15, medium: 25, hard: 10 } },
      { name: 'Zorunlu Sigortalar — Trafik ve DASK', q: { easy: 15, medium: 22, hard: 8 } },
      { name: 'Hayat ve Sağlık Sigortası Mevzuatı', q: { easy: 12, medium: 22, hard: 10 } },
      { name: 'Reasürans Düzenlemeleri', q: { easy: 10, medium: 18, hard: 8 } },
      { name: 'Solvency II — Genel Çerçeve', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'IAIS ve IAA Uluslararası Standartları', q: { easy: 10, medium: 18, hard: 8 } },
      { name: 'Sigortacılıkta Vergi Uygulamaları', q: { easy: 10, medium: 18, hard: 8 } },
    ]
  },

  // ─────────────────────── LEVEL 2 ───────────────────────
  {
    exam_type: 'LEVEL_2', subject: 'sigorta-matematigi',
    topics: [
      { name: 'Hayat Tabloları — Yapı ve Temel Gösterimler', q: { easy: 15, medium: 28, hard: 18 } },
      { name: 'Hayat Tabloları — Ölüm ve Hayatta Kalma Fonksiyonları', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Hayat Tabloları — Select ve Ultimate', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Multiple Decrement Tabloları', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Gelecek Yaşam Ömrü — Tam ve Kesikli', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'Sürekli Hayat Sigortaları — Tam ve Vadeli Hayat', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Sürekli Hayat Sigortaları — Karma ve Diğer Türler', q: { easy: 10, medium: 25, hard: 20 } },
      { name: 'Kesikli Hayat Sigortaları', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Hayat Anüiteleri — Anlık ve Kesikli', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Net Primler — Denklik İlkesi', q: { easy: 15, medium: 30, hard: 22 } },
      { name: 'Net Primler — Çeşitli Sigorta Türleri', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Brüt Primler ve Gider Yüklemeleri', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Rezervler — Prospektif ve Retrospektif Yöntem', q: { easy: 12, medium: 28, hard: 22 } },
      { name: 'Rezervler — Özyinelemeli Formüller', q: { easy: 10, medium: 22, hard: 20 } },
      { name: 'Değiştirilmiş Rezervler ve Erken Ayrılma Değeri', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Kâr Analizi — Kaynak ve Deneyim Analizi', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Çok Hayatlı Modeller — Ortak ve Son Hayat', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Engellilik ve Kritik Hastalık Modelleri', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Universal Life ve Değişken Hayat Sigortası', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Stokastik Mortalite Modelleri (Lee-Carter)', q: { easy: 6, medium: 15, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_2', subject: 'risk-analizi',
    topics: [
      { name: 'Hasar Şiddet Dağılımları — Exponential, Pareto, Lognormal', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Hasar Sıklık Dağılımları — Poisson, NegBin, Binom', q: { easy: 12, medium: 25, hard: 18 } },
      { name: '(a,b,0) Sınıfı Dağılımlar', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Ağır Kuyruklu ve Sıfır-Şişirilmiş Dağılımlar', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Toplam Hasar — Bileşik Model', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Toplam Hasar — Rekürif Hesap (Panjer Algoritması)', q: { easy: 8, medium: 22, hard: 20 } },
      { name: 'Toplam Hasar — Normal Yaklaşım ve Diğer Yöntemler', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Stop-Loss ve Oransal Reasürans', q: { easy: 10, medium: 25, hard: 20 } },
      { name: 'XL Reasürans — Per-Risk ve Per-Occurrence', q: { easy: 8, medium: 22, hard: 18 } },
      { name: 'Reasürans — Karşılaştırmalı Analiz', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Kredibilite — Klasik ve Bühlmann', q: { easy: 10, medium: 25, hard: 20 } },
      { name: 'Kredibilite — Bühlmann-Straub ve Empirical Bayes', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'IBNR — Zincir Merdiveni Yöntemi', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'IBNR — Bornhuetter-Ferguson ve Cape Cod', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'IBNR — Development Faktörleri Seçimi ve Belirsizlik', q: { easy: 8, medium: 18, hard: 18 } },
      { name: 'Risk Ölçütleri — VaR ve CVaR/TVaR', q: { easy: 12, medium: 25, hard: 20 } },
      { name: 'Ruin Theory — Temel ve Gerber-Shiu', q: { easy: 6, medium: 18, hard: 18 } },
    ]
  },
  {
    exam_type: 'LEVEL_2', subject: 'finans-teorisi',
    topics: [
      { name: 'Portföy Getirisi ve Risk — Temel Kavramlar', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Ortalama-Varyans Analizi ve Etkin Sınır', q: { easy: 10, medium: 25, hard: 18 } },
      { name: 'Minimum Varyans Portföyü ve CML', q: { easy: 8, medium: 22, hard: 18 } },
      { name: 'CAPM — Teori, Beta ve SML', q: { easy: 12, medium: 25, hard: 18 } },
      { name: 'CAPM — Uygulamalar ve Eleştiriler', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'APT ve Fama-French Faktör Modelleri', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Brownian Motion ve Wiener Süreci', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'İto Lemması', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'Black-Scholes-Merton Modeli', q: { easy: 10, medium: 25, hard: 22 } },
      { name: 'Black-Scholes — Greeks (Delta, Gamma, Vega, Theta, Rho)', q: { easy: 8, medium: 22, hard: 20 } },
      { name: 'İkili Ağaç Modeli (Binomial Tree)', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Egzotik Opsiyonlar', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'Faiz Oranı Modelleri — Vasicek ve CIR', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'Faiz Oranı Modelleri — Hull-White ve HJM', q: { easy: 5, medium: 15, hard: 18 } },
      { name: 'Kredi Riski — Temel Modeller', q: { easy: 6, medium: 18, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_2', subject: 'muhasebe',
    topics: [
      { name: 'Muhasebe Döngüsü — Temel Kavramlar ve Kayıt', q: { easy: 18, medium: 28, hard: 12 } },
      { name: 'Bilanço — Varlıklar ve Kaynaklar', q: { easy: 15, medium: 25, hard: 12 } },
      { name: 'Gelir Tablosu', q: { easy: 15, medium: 22, hard: 10 } },
      { name: 'Nakit Akış ve Özkaynak Değişim Tablosu', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'Sigorta Şirketi Bilanço Özellikleri', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Kazanılmamış Primler ve Muallak Hasarlar Karşılığı', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'Matematik Karşılıklar (Hayat Sigortası)', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Sermaye Yeterliliği Hesabı — Türk Mevzuatı', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'IFRS 17 — Ölçüm Modelleri (GMM, PAA, VFA)', q: { easy: 8, medium: 22, hard: 20 } },
      { name: 'IFRS 17 — GMM Detayları ve Contractual Service Margin', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'IFRS 9 — Finansal Araçlar', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Ertelenmiş Vergi ve Konsolide Tablolar', q: { easy: 8, medium: 18, hard: 12 } },
      { name: 'Finansal Tablo Analizi — Oran Analizi', q: { easy: 12, medium: 22, hard: 12 } },
    ]
  },

  // ─────────────────────── LEVEL 3 ───────────────────────
  {
    exam_type: 'LEVEL_3', subject: 'hayat-sigortalari',
    topics: [
      { name: 'Hayat Sigortası Ürün Tasarımı — Term ve Whole Life', q: { easy: 10, medium: 22, hard: 18 } },
      { name: 'Hayat Sigortası Ürün Tasarımı — Endowment ve Birikim', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Universal Life ve Variable Life Ürünleri', q: { easy: 8, medium: 18, hard: 18 } },
      { name: 'Mortalite Deneyim Çalışması', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Lapse Rate Modelleri', q: { easy: 6, medium: 15, hard: 12 } },
      { name: 'Gider Analizi ve Kârlılık (IRR, NPV)', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Embedded Value — TEV ve MCEV', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'ALM — Duration Eşleşmesi ve Cash Flow Matching', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Solvency II — SCR Hayat Riski Modülü', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Solvency II — Life Underwriting Risk', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'Stokastik Projeksiyon — Monte Carlo', q: { easy: 6, medium: 15, hard: 18 } },
    ]
  },
  {
    exam_type: 'LEVEL_3', subject: 'hayatdisi-sigortalar',
    topics: [
      { name: 'Tarife Belirleme — Saf Prim ve Loss Ratio Yöntemi', q: { easy: 12, medium: 28, hard: 20 } },
      { name: 'Risk Sınıflandırma ve GLM ile Tarife', q: { easy: 8, medium: 22, hard: 20 } },
      { name: 'Bölgelendirme Analizi', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Hasar Rezervleri — Zincir Merdiveni (Pratik Uygulama)', q: { easy: 12, medium: 25, hard: 20 } },
      { name: 'Hasar Rezervleri — BF, Cape Cod ve Bootstrap', q: { easy: 8, medium: 22, hard: 20 } },
      { name: 'Büyük Hasar Modellemesi — Katastrofik Risk', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Deprem Sigortası — DASK ve Nat-Cat Modelleri', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Fırtına, Sel ve Diğer Doğal Afet Modelleri', q: { easy: 6, medium: 15, hard: 15 } },
      { name: 'Solvency II — Non-Life SCR', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Solvency II — NL Premium ve Reserve Risk', q: { easy: 6, medium: 18, hard: 18 } },
    ]
  },
  {
    exam_type: 'LEVEL_3', subject: 'saglik-sigortalari',
    topics: [
      { name: 'Sağlık Sigortası Ürün Türleri ve Yapısı', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'Morbidite Tabloları ve Hastalık Sıklık Modelleri', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'Sağlık Tarifeleri — Yaş-Cinsiyet Ayarlamaları', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'İlaç ve Tedavi Maliyeti Modellemesi', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Sağlık Sigortasında Rezervler', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Uzun Vadeli Bakım (Long-Term Care)', q: { easy: 6, medium: 15, hard: 15 } },
      { name: 'Tamamlayıcı Sağlık Sigortası ve SGK İlişkisi', q: { easy: 10, medium: 20, hard: 12 } },
      { name: 'Sağlık Reformu ve Aktüeryal Etkileri', q: { easy: 8, medium: 15, hard: 12 } },
    ]
  },
  {
    exam_type: 'LEVEL_3', subject: 'emeklilik',
    topics: [
      { name: 'BES Sistem Yapısı ve İşleyişi', q: { easy: 15, medium: 25, hard: 12 } },
      { name: 'BES — Devlet Katkısı ve Ek Devlet Katkısı Hesaplama', q: { easy: 12, medium: 25, hard: 15 } },
      { name: 'BES — Fon Tercihleri, Yatırım ve Çıkış Senaryoları', q: { easy: 10, medium: 22, hard: 15 } },
      { name: 'Tanımlı Fayda (DB) Emeklilik Planları', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Tanımlı Katkı (DC) Emeklilik Planları', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Aktüeryal Değerleme — DB Planları', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'SGK — Emeklilik Koşulları ve Prim Sistemi', q: { easy: 12, medium: 22, hard: 12 } },
      { name: 'Sosyal Güvenlik Demografik Projeksiyon', q: { easy: 6, medium: 15, hard: 15 } },
      { name: 'Uzun Ömür Riski ve Demografik Riskler', q: { easy: 8, medium: 18, hard: 15 } },
    ]
  },
  {
    exam_type: 'LEVEL_3', subject: 'finans-yatirim',
    topics: [
      { name: 'İleri Türevler — Faiz Oranı ve Döviz Opsiyonları', q: { easy: 6, medium: 18, hard: 18 } },
      { name: 'Kredi Türevleri — CDS ve CDO', q: { easy: 6, medium: 15, hard: 15 } },
      { name: 'ERM — Kurumsal Risk Yönetimi Çerçevesi', q: { easy: 8, medium: 20, hard: 15 } },
      { name: 'ORSA — Own Risk and Solvency Assessment', q: { easy: 6, medium: 18, hard: 15 } },
      { name: 'Operasyonel Risk ve Likidite Riski', q: { easy: 8, medium: 18, hard: 15 } },
      { name: 'Sermaye Yeterliliği — Solvency II Pillar 1, 2 ve 3', q: { easy: 8, medium: 20, hard: 18 } },
      { name: 'Yatırım Stratejileri ve Portföy Yönetimi — Sigorta', q: { easy: 8, medium: 18, hard: 15 } },
    ]
  },

  // ─────────────────────── SEGEM / TPYS ───────────────────────
  {
    exam_type: 'SEGEM_TPYS', subject: 'matematik',
    topics: [
      { name: 'Temel Matematik — Dizi, Seri ve Fonksiyon', q: { easy: 20, medium: 30, hard: 12 } },
      { name: 'Temel Matematik — Logaritma ve Üstel Fonksiyonlar', q: { easy: 18, medium: 28, hard: 10 } },
      { name: 'Finansal Matematik Temelleri — Faiz ve Bugünkü Değer', q: { easy: 20, medium: 30, hard: 12 } },
      { name: 'Finansal Matematik — Anüiteler ve Amortizasyon', q: { easy: 15, medium: 28, hard: 12 } },
      { name: 'Temel Olasılık ve İstatistik (SEGEM)', q: { easy: 18, medium: 28, hard: 10 } },
    ]
  },
  {
    exam_type: 'SEGEM_TPYS', subject: 'mevzuat',
    topics: [
      { name: 'Sigortacılık Temel Kavramları ve Ürünler', q: { easy: 20, medium: 28, hard: 10 } },
      { name: 'Hayat Sigortası Ürünleri ve İşleyişi', q: { easy: 18, medium: 25, hard: 8 } },
      { name: 'Hayat Dışı Sigorta Ürünleri', q: { easy: 18, medium: 25, hard: 8 } },
      { name: 'Sağlık Sigortası Temel Kavramları', q: { easy: 15, medium: 22, hard: 8 } },
      { name: 'BES Sistemi — Temel ve İşleyiş', q: { easy: 18, medium: 25, hard: 8 } },
      { name: 'Sigorta Mevzuatı Özeti — Temel Hükümler', q: { easy: 20, medium: 28, hard: 10 } },
      { name: 'Aktüerlik Mesleği — Genel Bakış', q: { easy: 15, medium: 22, hard: 8 } },
    ]
  },
]

// ── Yardımcı: Rastgele cevap dağılımı ──────────────────────────────────────
// Soru sayısı kadar cevap listesi döner, A/B/C/D eşit dağılır
function shuffledAnswers(count) {
  const pool = []
  const opts = ['A', 'B', 'C', 'D']
  for (let i = 0; i < Math.ceil(count / 4); i++) pool.push(...opts)
  return pool.slice(0, count).sort(() => Math.random() - 0.5)
}

// ── Gemini API çağrısı ──────────────────────────────────────────────────────
async function callGemini(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            thinkingConfig: { thinkingBudget: 0 },
          }
        })
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(`HTTP ${res.status}: ${err}`)
      }
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    } catch (e) {
      console.warn(`  ⚠️  Gemini hata (deneme ${attempt}/${retries}): ${e.message}`)
      if (attempt < retries) await sleep(2000 * attempt)
      else throw e
    }
  }
}

// ── Supabase insert ─────────────────────────────────────────────────────────
async function supabaseInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(rows)
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase ${table} insert hatası: ${err}`)
  }
}

async function supabaseUpsert(table, rows, onConflict) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase ${table} upsert hatası: ${err}`)
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── KONU ANLATIMI ÜRETİMİ ──────────────────────────────────────────────────
async function generateTopicContent(examType, subject, topicName) {
  const prompt = `Sen deneyimli bir Türk aktüer ve üniversite hocasısın. Aktüerlik sınavı adayları için "${topicName}" konusunu anlat.

Sınav: ${examType} | Ders: ${subject}

Aşağıdaki bölümleri sırayla yaz. Her bölüm çok kapsamlı, sağlam ve profesyonel olmalı. Sıradan anlatım değil, gerçek sınav odaklı, kritik bilgi yoğunluklu içerik istiyorum.

## 1. Kavramsal Temel
Konunun özü nedir? Neden önemli? Sezgisel açıklama + formal tanım.

## 2. Temel Formüller ve Teoremler
Tüm önemli formülleri listele. Her formülün ne anlama geldiğini açıkla. LaTeX gösterimi kullan ($...$).

## 3. Adım Adım Çözümlü Örnek (en az 3 örnek)
Gerçek sınav sorusuna benzer örnekler. Adım adım çözüm. Sonunda kontrol/doğrulama.

## 4. ⚠️ Kritik Notlar — Sınavda Tuzak Noktalar
Öğrencilerin en çok hata yaptığı yerler. Hangi detay gözden kaçıyor? Sınavda nasıl sorulur?

## 5. 💡 Akıllı Kısayollar ve İpuçları
Süre baskısında işe yarayan teknikler. Formül ezberlemek yerine kavramsal bağlantılar.

## 6. Diğer Konularla Bağlantı
Bu konu hangi diğer konularla doğrudan ilişkili? Nereye köprü kurar?

Markdown formatında yaz. Türkçe. Minimum 800 kelime. Üstünkörü geçme, her bölüm gerçekten öğretici olsun.`

  const content = await callGemini(prompt)
  return content
}

// ── SORU ÜRETİMİ ───────────────────────────────────────────────────────────
async function generateQuestions(examType, subject, topicName, difficulty, count, forcedAnswers) {
  const difficultyTR = { easy: 'kolay', medium: 'orta', hard: 'zor' }[difficulty]

  const prompt = `Sen aktüerlik sınavı soru yazarısın. Türkiye aktüerlik sınavları için özgün sorular üret.

Sınav: ${examType} | Ders: ${subject} | Konu: ${topicName} | Zorluk: ${difficultyTR}

${count} ADET soru üret. Her soru için aşağıdaki JSON formatını kullan:

KURALLAR:
1. Sorular gerçekten zorlayıcı ve düşündürücü olmalı. Kolay değil, derinlik isteyen.
2. Doğru cevap şöyle dağılmalı: ${forcedAnswers.join(', ')} — BU SIRAYA UYGUN şekilde cevaplar dağıtılmış olmalı.
3. Yanlış şıklar (distractors) akıllıca olmalı. Mantıklı ama yanlış. Sık yapılan hataları yansıtsın.
4. Açıklama (explanation) tam ve öğretici olmalı. Neden doğru, neden diğerleri yanlış.
5. Türkçe. Formüller için LaTeX ($...$) kullan.
6. Her ~5. soruda is_starred: true koy (gerçek sınavlarda benzer soru soruldu işareti).

Yanıtı SADECE JSON dizisi olarak ver, başka metin yok:

[
  {
    "question_text": "...",
    "options_json": {
      "A": {"text": "...", "image_url": null},
      "B": {"text": "...", "image_url": null},
      "C": {"text": "...", "image_url": null},
      "D": {"text": "...", "image_url": null}
    },
    "correct_answer": "A",
    "explanation": "...",
    "is_starred": false
  }
]`

  const raw = await callGemini(prompt)

  // JSON'u parse et — bazen model ```json ``` ile sarar, bazen token limitinde kesilir
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  function tryParse(str) {
    try { return JSON.parse(str) } catch { return null }
  }

  // 1. Tam JSON dizi
  let questions = tryParse(cleaned)
  if (!questions) {
    const m = cleaned.match(/\[[\s\S]*\]/)
    if (m) questions = tryParse(m[0])
  }
  // 2. Kesik JSON kurtarma: son tam } ile bitir, ] ekle
  if (!questions) {
    const lastBrace = cleaned.lastIndexOf('}')
    if (lastBrace !== -1) {
      const fixed = cleaned.slice(0, lastBrace + 1) + ']'
      const m = fixed.match(/\[[\s\S]*\]/)
      if (m) questions = tryParse(m[0])
    }
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn(`  ⚠️  JSON parse edilemedi, atlanıyor: ${topicName} (${difficulty})`)
    return []
  }

  return questions.map((q, i) => ({
    exam_type: examType,
    subject,
    topic: topicName,
    difficulty,
    question_text: q.question_text ?? '',
    question_image_url: null,
    options_json: q.options_json ?? {},
    correct_answer: q.correct_answer ?? forcedAnswers[i] ?? 'A',
    explanation: q.explanation ?? null,
    is_active: true,
    is_starred: q.is_starred ?? false,
  }))
}

// ── ANA AKIŞ: KONULAR ──────────────────────────────────────────────────────
async function runTopics() {
  console.log('\n📚 KONU ANLATIMI ÜRETİMİ BAŞLIYOR...\n')

  let total = 0
  for (const section of CURRICULUM) {
    for (const topic of section.topics) {
      process.stdout.write(`  ✍️  ${section.exam_type}/${section.subject}/${topic.name} ... `)
      try {
        const content = await generateTopicContent(section.exam_type, section.subject, topic.name)
        await supabaseUpsert('topic_content', [{
          exam_type: section.exam_type,
          subject: section.subject,
          topic: topic.name,
          content_markdown: content,
        }], 'exam_type,subject,topic')
        total++
        console.log(`✅  (${total} konu tamamlandı)`)
      } catch (e) {
        console.log(`❌  HATA: ${e.message}`)
      }
      await sleep(1500) // rate limit
    }
  }

  console.log(`\n✅  Toplam ${total} konu anlatımı eklendi.\n`)
}

// ── ANA AKIŞ: SORULAR ──────────────────────────────────────────────────────
async function runQuestions() {
  console.log('\n❓  SORU ÜRETİMİ BAŞLIYOR...\n')

  let totalQuestions = 0
  const BATCH = 8 // Gemini'ye tek seferde kaç soru ürettireceğiz

  for (const section of CURRICULUM) {
    for (const topic of section.topics) {
      for (const [difficulty, count] of Object.entries(topic.q)) {
        if (count === 0) continue

        // count soruyu BATCH'lik gruplara böl
        const batches = []
        let remaining = count
        while (remaining > 0) {
          batches.push(Math.min(BATCH, remaining))
          remaining -= BATCH
        }

        for (let bi = 0; bi < batches.length; bi++) {
          const batchCount = batches[bi]
          const answers = shuffledAnswers(batchCount)

          process.stdout.write(
            `  🔹 ${section.exam_type}/${topic.name} [${difficulty}] batch ${bi + 1}/${batches.length} (${batchCount} soru) ... `
          )

          try {
            const questions = await generateQuestions(
              section.exam_type, section.subject, topic.name,
              difficulty, batchCount, answers
            )

            if (questions.length > 0) {
              await supabaseInsert('question_bank', questions)
              totalQuestions += questions.length
              console.log(`✅  (+${questions.length} → toplam: ${totalQuestions})`)
            } else {
              console.log(`⚠️  0 soru`)
            }
          } catch (e) {
            console.log(`❌  ${e.message}`)
          }

          await sleep(1200) // rate limit
        }
      }
    }
  }

  console.log(`\n✅  Toplam ${totalQuestions} soru eklendi.\n`)
}

// ── GİRİŞ NOKTASI ──────────────────────────────────────────────────────────
const mode = process.argv[2] ?? 'all'

console.log('🚀 ActuReady İçerik Üretici')
console.log(`📌 Mod: ${mode}`)
console.log(`🔗 Supabase: ${SUPABASE_URL}`)
console.log(`🤖 Model: gemini-2.5-flash\n`)

if (mode === 'topics' || mode === 'all') await runTopics()
if (mode === 'questions' || mode === 'all') await runQuestions()

console.log('🎉 İşlem tamamlandı!')
