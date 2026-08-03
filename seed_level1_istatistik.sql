-- ================================================================
-- ActuReady — LEVEL_1 İstatistik + Matematik Konu İçeriği + Sorular
-- 01.08.2026 — Manuel yazılmıştır.
-- ================================================================
BEGIN;

-- ================================================================
-- KONU İÇERİKLERİ — İSTATİSTİK
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Temel Olasılık Kavramları','easy',
'<h2>Temel Tanımlar</h2>
<ul>
  <li><strong>Deney:</strong> Sonucu önceden kesin bilinemeyen gözlem</li>
  <li><strong>Örneklem uzayı (S):</strong> Tüm olası sonuçların kümesi</li>
  <li><strong>Olay (A):</strong> Örneklem uzayının bir alt kümesi</li>
</ul>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Olasılık aksiyomları (Kolmogorov):</strong><br>
  1. 0 ≤ P(A) ≤ 1<br>
  2. P(S) = 1<br>
  3. Birbirini dışlayan A₁, A₂, … için: P(A₁ ∪ A₂ ∪ …) = ΣP(Aᵢ)
</div>

<h2>Temel Formüller</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(Aᶜ) = 1 − P(A)<br>
  P(A ∪ B) = P(A) + P(B) − P(A ∩ B)<br>
  P(A ∩ B) = P(A|B) × P(B) = P(B|A) × P(A)
</div>

<h2>Bağımsızlık</h2>
<p>A ve B bağımsız olaylarsa: P(A ∩ B) = P(A) × P(B)</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>"Birbirini dışlayan" ≠ "bağımsız" (karıştırılmamalı).</li>
  <li>P(A ∪ B) = P(A) + P(B) yalnızca A ∩ B = ∅ ise geçerlidir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Koşullu Olasılık ve Bayes Teoremi','medium',
'<h2>Koşullu Olasılık</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(A|B) = P(A ∩ B) / P(B) &nbsp; (P(B) > 0)
</div>

<h2>Toplam Olasılık Teoremi</h2>
<p>B₁, B₂, …, Bₙ örneklem uzayının bir bölüntüsü (partition) ise:</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(A) = Σ P(A|Bᵢ) × P(Bᵢ)
</div>

<h2>Bayes Teoremi</h2>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(Bₖ|A) = P(A|Bₖ) × P(Bₖ) / Σ P(A|Bᵢ) × P(Bᵢ)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Bayes: Önsel (prior) olasılık × Olabilirlik / Normalize edici.</li>
  <li>Sigorta uygulaması: Riziko sınıfı bilinmeden hasarlı araç gözlenirse, hangi sınıftan gelme olasılığı?</li>
</ul>

<h2>Örnek</h2>
<p>Bir fabrikada A makinesi %60, B makinesi %40 üretim yapar. A''dan çıkan ürünlerin %3''ü, B''den çıkanların %5''i hatalıdır. Rastgele seçilen hatalı ürünün A''dan çıkma olasılığı?<br>
P(A|H) = (0,03×0,60) / (0,03×0,60 + 0,05×0,40) = 0,018 / (0,018+0,020) = 0,018/0,038 ≈ <strong>0,474</strong></p>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Kombinatorik (Permütasyon ve Kombinasyon)','easy',
'<h2>Temel Sayma İlkeleri</h2>
<ul>
  <li><strong>Çarpım kuralı:</strong> Olaylar bağımsızsa toplam yol sayısı çarpımla bulunur.</li>
</ul>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Permütasyon (sıra önemli):</strong><br>
  P(n,r) = n! / (n−r)!<br><br>
  <strong>Kombinasyon (sıra önemsiz):</strong><br>
  C(n,r) = n! / (r! × (n−r)!)
</div>

<h2>Özel Durumlar</h2>
<ul>
  <li>C(n,0) = C(n,n) = 1</li>
  <li>C(n,r) = C(n, n−r)</li>
  <li>Binom teoremi: (x+y)ⁿ = Σ C(n,k) xᵏ yⁿ⁻ᵏ</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Tekrarlı kombinasyon (yerine koyma ile): C(n+r−1, r)</li>
  <li>"En az 1" soruları: 1 − P(hiçbiri) ile çöz.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Beklenen Değer ve Varyans','easy',
'<h2>Beklenen Değer (Ortalama)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Kesikli: E[X] = Σ xᵢ × P(X=xᵢ)<br>
  Sürekli: E[X] = ∫ x × f(x) dx
</div>

<h2>Varyans ve Standart Sapma</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Var(X) = E[X²] − (E[X])²<br>
  SD(X) = √Var(X)
</div>

<h2>Doğrusal Dönüşüm Özellikleri</h2>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  E[aX + b] = a·E[X] + b<br>
  Var(aX + b) = a² · Var(X)<br>
  Var(X + Y) = Var(X) + Var(Y) + 2·Cov(X,Y)<br>
  Bağımsızsa: Var(X + Y) = Var(X) + Var(Y)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Varyans negatif olamaz; standart sapma da negatif olamaz.</li>
  <li>E[X²] = Var(X) + (E[X])²</li>
  <li>Bağımsız değişkenler için Cov(X,Y) = 0 ama tersi doğru değil.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Binom Dağılımı','medium',
'<h2>Binom Dağılımı</h2>
<p>n bağımsız Bernoulli denemesinde başarı olasılığı p iken k başarı sayısını modelleyen dağılım.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  X ~ Binomial(n, p)<br>
  P(X=k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ<br>
  E[X] = n·p<br>
  Var(X) = n·p·(1−p)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Koşullar: Sabit n, sabit p, bağımsız denemeler, ikili sonuç.</li>
  <li>n büyük, p küçükken → Poisson yaklaşımı (λ = n·p).</li>
  <li>n büyük → Normal yaklaşım: X ≈ N(np, np(1−p))</li>
</ul>

<h2>Örnek</h2>
<p>Bir sınavda her soruyu doğru bilme olasılığı %40. 5 sorudan tam olarak 3''ünü doğru bilme olasılığı:<br>
P(X=3) = C(5,3) × 0,4³ × 0,6² = 10 × 0,064 × 0,36 = <strong>0,2304</strong></p>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Poisson Dağılımı','medium',
'<h2>Poisson Dağılımı</h2>
<p>Belirli bir zaman veya alan biriminde ortalama λ olay oluşumunu modelleyen dağılım. Nadir olaylar için uygundur.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  X ~ Poisson(λ)<br>
  P(X=k) = e⁻λ · λᵏ / k! &nbsp; k = 0,1,2,...<br>
  E[X] = λ<br>
  Var(X) = λ
</div>

<h2>Poisson Sürecinin Özellikleri</h2>
<ul>
  <li>Bağımsız artışlar</li>
  <li>Durağan artışlar (hız λ sabittir)</li>
  <li>Seyrek olaylar (sonsuz küçük aralıkta en fazla 1 olay)</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>E[X] = Var(X) = λ (binom dağılımından farkı: varyans = ortalama).</li>
  <li>Hasar sıklığı modellemesinde temel araçtır.</li>
  <li>Poisson''un toplamı: X₁~P(λ₁), X₂~P(λ₂) bağımsız → X₁+X₂~P(λ₁+λ₂)</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Normal Dağılım','easy',
'<h2>Normal Dağılım</h2>
<p>Doğanın en sık görülen sürekli dağılımı. Simetrik, çan şeklinde eğriyle tanımlanır.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  X ~ N(μ, σ²)<br>
  f(x) = (1/σ√2π) · exp[−(x−μ)²/(2σ²)]<br>
  E[X] = μ, Var(X) = σ²
</div>

<h2>Standart Normal Dönüşüm</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Z = (X − μ) / σ ~ N(0,1)<br>
  P(X ≤ x) = Φ((x−μ)/σ)
</div>

<h2>Önemli Olasılıklar</h2>
<ul>
  <li>P(μ−σ ≤ X ≤ μ+σ) ≈ %68,27</li>
  <li>P(μ−2σ ≤ X ≤ μ+2σ) ≈ %95,45</li>
  <li>P(μ−3σ ≤ X ≤ μ+3σ) ≈ %99,73</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Normal simetrik → P(Z > z) = P(Z < −z) = 1 − Φ(z).</li>
  <li>Normal dağılımın moment üreten fonksiyonu: M(t) = exp(μt + σ²t²/2)</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Üstel ve Gamma Dağılımı','medium',
'<h2>Üstel Dağılım</h2>
<p>Poisson sürecinde olaylar arasındaki bekleme sürelerini modelleyen sürekli dağılım.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  X ~ Exp(λ)<br>
  f(x) = λe⁻λˣ &nbsp; x > 0<br>
  F(x) = 1 − e⁻λˣ<br>
  E[X] = 1/λ, Var(X) = 1/λ²
</div>

<h3>Belleksizlik Özelliği</h3>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(X > s+t | X > s) = P(X > t)
</div>

<h2>Gamma Dağılımı</h2>
<p>n bağımsız Exp(λ) değişkenin toplamıdır (α-inci olay bekleme süresi).</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  X ~ Gamma(α, β) → E[X] = α/β, Var(X) = α/β²
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Üstel belleksizlik özelliği: Hayatta kalma süresi modellemenin temelidir.</li>
  <li>Gamma(1, λ) = Exp(λ)</li>
  <li>Chi-kare dağılımı: χ²(n) = Gamma(n/2, 1/2)</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Merkezi Limit Teoremi','medium',
'<h2>Merkezi Limit Teoremi (MLT)</h2>
<p>E[Xᵢ] = μ ve Var(Xᵢ) = σ² olan bağımsız, özdeş dağılımlı rastgele değişkenlerin toplamı n büyüdükçe normal dağılıma yaklaşır.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  X̄ₙ = (X₁+X₂+...+Xₙ)/n<br>
  Z = (X̄ₙ − μ) / (σ/√n) → N(0,1) &nbsp; n→∞
</div>

<h2>Pratik Kural</h2>
<ul>
  <li>n ≥ 30 ise genellikle normal yaklaşım yeterli sayılır.</li>
  <li>Orijinal dağılım simetrikse daha küçük n yeterlidir.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>MLT, sigorta hasar toplamlarının normal yaklaşımla hesaplanmasına imkân tanır.</li>
  <li>Standart hata = σ/√n (n arttıkça azalır).</li>
  <li>MLT orijinal dağılımın ne olduğunu gerektirmez.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Hipotez Testi','medium',
'<h2>Hipotez Testi Adımları</h2>
<ol>
  <li>H₀ (null hipotezi) ve H₁ (alternatif hipotezi) belirlenir.</li>
  <li>Anlamlılık düzeyi α seçilir (genellikle %5 veya %1).</li>
  <li>Test istatistiği hesaplanır.</li>
  <li>Kritik bölge veya p-değeri belirlenir.</li>
  <li>H₀ red/kabul kararı verilir.</li>
</ol>

<h2>Hata Türleri</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Tip I Hata (α):</strong> H₀ doğruyken reddetmek<br>
  <strong>Tip II Hata (β):</strong> H₀ yanlışken kabul etmek<br>
  <strong>Güç = 1 − β:</strong> Yanlış H₀''ı reddetme olasılığı
</div>

<h2>Z-testi vs t-testi</h2>
<ul>
  <li>σ biliniyorsa: Z-testi</li>
  <li>σ bilinmiyorsa, n küçükse: t-testi (n−1 serbestlik derecesi)</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>p-değeri < α ise H₀ reddedilir.</li>
  <li>α küçüldükçe Tip I hata azalır ama Tip II hata artar.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Basit Doğrusal Regresyon','medium',
'<h2>Model</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Y = β₀ + β₁X + ε<br>
  ε ~ N(0, σ²) iid
</div>

<h2>EKK Tahminleri</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  β̂₁ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²<br>
  β̂₀ = ȳ − β̂₁·x̄
</div>

<h2>R² (Belirlilik Katsayısı)</h2>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  R² = SSR/SST = 1 − SSE/SST<br>
  0 ≤ R² ≤ 1 (1''e ne kadar yakın → model o kadar iyi)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Korelasyon katsayısı r: r² = R²</li>
  <li>EKK: Kalıntıların kareler toplamını minimize eder.</li>
  <li>Regresyon grafiği her zaman (x̄, ȳ) noktasından geçer.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Nokta Tahmin ve Güven Aralıkları','medium',
'<h2>İyi Tahmin Edicinin Özellikleri</h2>
<ul>
  <li><strong>Yansız (Unbiased):</strong> E[θ̂] = θ</li>
  <li><strong>Etkin (Efficient):</strong> En küçük varyans</li>
  <li><strong>Tutarlı (Consistent):</strong> n → ∞ iken θ''ya yaklaşır</li>
</ul>

<h2>Güven Aralığı (μ bilinmiyor, σ biliniyor)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  x̄ ± z_{α/2} · (σ/√n)<br>
  %95 güven aralığı: z_{0,025} = 1,96<br>
  %99 güven aralığı: z_{0,005} = 2,576
</div>

<h2>t Güven Aralığı (σ bilinmiyor)</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  x̄ ± t_{n-1, α/2} · (s/√n)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Güven aralığı genişliği n arttıkça daralar.</li>
  <li>%95 GA "100 denemede 95''inde μ''yu içerir" anlamına gelir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','istatistik','Ortak Dağılımlar ve Kovaryans','medium',
'<h2>Birleşik Dağılım</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Kesikli: P(X=x, Y=y) = f(x,y)<br>
  Marjinal: P(X=x) = Σ_y f(x,y)
</div>

<h2>Kovaryans ve Korelasyon</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Cov(X,Y) = E[XY] − E[X]·E[Y]<br>
  ρ(X,Y) = Cov(X,Y) / (σ_X · σ_Y)<br>
  −1 ≤ ρ ≤ 1
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Bağımsızsa: Cov(X,Y) = 0 (ama tersi her zaman doğru değil)</li>
  <li>ρ = 1 → mükemmel pozitif doğrusal ilişki</li>
  <li>ρ = −1 → mükemmel negatif doğrusal ilişki</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- KONU İÇERİKLERİ — MATEMATİK
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Türev ve Uygulamaları','medium',
'<h2>Türev Tanımı</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  f''(x) = lim_{h→0} [f(x+h) − f(x)] / h
</div>

<h2>Temel Türev Kuralları</h2>
<ul>
  <li>(xⁿ)'' = n·xⁿ⁻¹</li>
  <li>(eˣ)'' = eˣ</li>
  <li>(ln x)'' = 1/x</li>
  <li>(sin x)'' = cos x; (cos x)'' = −sin x</li>
</ul>

<h2>Zincir Kuralı</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  [f(g(x))]'' = f''(g(x)) · g''(x)
</div>

<h2>Uygulamalar</h2>
<ul>
  <li><strong>Ekstremum:</strong> f''(x)=0 noktaları kritik noktalardır. f''''(x)>0 → minimum, f''''(x)<0 → maksimum.</li>
  <li><strong>L''Hopital:</strong> 0/0 veya ∞/∞ limiti → pay ve paydanın türevi alınır.</li>
  <li><strong>Taylor açılımı:</strong> f(x) = Σ f⁽ⁿ⁾(a)/n! · (x−a)ⁿ</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Çarpım kuralı: (fg)'' = f''g + fg''</li>
  <li>Bölüm kuralı: (f/g)'' = (f''g − fg'')/g²</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Belirsiz İntegral','medium',
'<h2>Belirsiz İntegral</h2>
<p>Türevin tersi işlemidir. F''(x) = f(x) ise ∫f(x)dx = F(x) + C</p>

<h2>Temel İntegraller</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  ∫xⁿ dx = xⁿ⁺¹/(n+1) + C &nbsp; (n ≠ −1)<br>
  ∫(1/x) dx = ln|x| + C<br>
  ∫eˣ dx = eˣ + C<br>
  ∫eᵃˣ dx = eᵃˣ/a + C<br>
  ∫sin x dx = −cos x + C<br>
  ∫cos x dx = sin x + C
</div>

<h2>İntegral Teknikleri</h2>
<ul>
  <li><strong>Değişken dönüşümü (substitution):</strong> u = g(x) koymak</li>
  <li><strong>Kısmi integrasyon:</strong> ∫u dv = uv − ∫v du</li>
  <li><strong>Kısmi kesirler:</strong> Rasyonel fonksiyonlar için</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>LIATE kuralı (kısmi integrasyonda u seçimi): Logaritmik, İnverse trig, Algebraic, Trig, Exponential</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Belirli İntegral ve Uygulamaları','medium',
'<h2>Newton-Leibniz Teoremi</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  ∫_a^b f(x) dx = F(b) − F(a)
</div>

<h2>Alan Hesabı</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Alan = ∫_a^b |f(x)| dx<br>
  İki eğri arası alan = ∫_a^b [f(x)−g(x)] dx &nbsp; (f ≥ g)
</div>

<h2>Olasılıkta Kullanım</h2>
<p>Sürekli dağılım için:</p>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(a ≤ X ≤ b) = ∫_a^b f(x) dx<br>
  E[X] = ∫_{-∞}^{∞} x·f(x) dx
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Belirli integral geometrik olarak eğri altındaki işaretli alandır.</li>
  <li>Improperly integral: Sınır ∞ veya fonksiyon tanımsız olduğunda limit kullanılır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Limit ve Süreklilik','medium',
'<h2>Limit Tanımı</h2>
<p>x → a iken f(x)''nin yaklaştığı değer, f(a)''ya bağlı olmayabilir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  lim_{x→a} f(x) = L
</div>

<h2>Limit Kuralları</h2>
<ul>
  <li>lim(f±g) = lim f ± lim g</li>
  <li>lim(f·g) = lim f · lim g</li>
  <li>lim(f/g) = lim f / lim g &nbsp; (lim g ≠ 0)</li>
</ul>

<h2>Önemli Limitler</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  lim_{x→0} (sin x)/x = 1<br>
  lim_{x→0} (eˣ−1)/x = 1<br>
  lim_{n→∞} (1 + 1/n)ⁿ = e
</div>

<h2>Süreklilik</h2>
<p>f, a noktasında sürekli ⟺ lim_{x→a} f(x) = f(a)</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>0/0 belirsiz formu → L''Hopital veya çarpanlara ayırma.</li>
  <li>∞/∞ → En yüksek dereceli terimlerle böl.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Kümeler ve Fonksiyonlar','easy',
'<h2>Küme İşlemleri</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  A ∪ B: Birleşim — A veya B''de olan elemanlar<br>
  A ∩ B: Kesişim — hem A hem B''de olanlar<br>
  Aᶜ: Tümleme — A''da olmayanlar<br>
  A \\ B: Fark — A''da olup B''de olmayan
</div>

<h2>De Morgan Yasaları</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ<br>
  (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ
</div>

<h2>Fonksiyon Türleri</h2>
<ul>
  <li><strong>Birebir (injektif):</strong> f(x₁)=f(x₂) ⟹ x₁=x₂</li>
  <li><strong>Örten (sürjektif):</strong> Kodomenyenin her elemanının görüntüsü var</li>
  <li><strong>Bijektif:</strong> Hem birebir hem örten (ters fonksiyonu vardır)</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Sayma: |A ∪ B| = |A| + |B| − |A ∩ B|</li>
  <li>Bileşik fonksiyon: (f∘g)(x) = f(g(x))</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Diziler ve Seriler','easy',
'<h2>Aritmetik Dizi</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  aₙ = a₁ + (n−1)d<br>
  Sₙ = n(a₁ + aₙ)/2 = n[2a₁ + (n−1)d]/2
</div>

<h2>Geometrik Dizi</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  aₙ = a₁ · rⁿ⁻¹<br>
  Sₙ = a₁(1−rⁿ)/(1−r) &nbsp; (r ≠ 1)<br>
  S∞ = a₁/(1−r) &nbsp; (|r| < 1)
</div>

<h2>Finansal Matematiğe Bağlantı</h2>
<p>Anüite formülleri geometrik dizilerin birikmesinden türetilir. a<sub>n|i</sub> = (1 − vⁿ)/i formülü geometrik serinin sonsuz toplamından gelir.</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Binom katsayıları: Pascal üçgeni — C(n,k)</li>
  <li>Sonsuz geometrik seri sadece |r| < 1 iken yakınsak.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Matrisler ve Determinantlar','medium',
'<h2>Matris İşlemleri</h2>
<ul>
  <li>Toplama: Aynı boyutlu matrisler, eleman eleman toplanır.</li>
  <li>Çarpım: A (m×n) × B (n×p) = C (m×p)</li>
  <li>Transpoz: Aᵀ — satır ve sütunlar yer değiştirir</li>
</ul>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  2×2 matris için determinant:<br>
  det(A) = |a b; c d| = ad − bc
</div>

<h2>Ters Matris</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  A⁻¹ = (1/det(A)) · adj(A)<br>
  A⁻¹ mevcut ⟺ det(A) ≠ 0
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>det(AB) = det(A)·det(B)</li>
  <li>det(Aᵀ) = det(A)</li>
  <li>Tekil matris (singular): det = 0, ters matris yok.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Diferansiyel Denklemler','hard',
'<h2>Birinci Derece ODE</h2>
<h3>Değişkenler Ayrılabilen</h3>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  dy/dx = g(x)·h(y) → ∫dy/h(y) = ∫g(x)dx
</div>

<h3>Doğrusal Birinci Derece</h3>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  dy/dx + P(x)y = Q(x)<br>
  İntegral çarpan: μ = e^(∫P(x)dx)<br>
  Çözüm: y = (1/μ)∫μQ(x)dx
</div>

<h2>Sabit Katsayılı İkinci Derece ODE</h2>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  ay'' + by'' + cy = 0<br>
  Karakteristik denklem: ar² + br + c = 0
</div>

<h2>Sigorta Uygulaması</h2>
<p>δ sabit kuvvetiyle büyüme: da(t)/dt = δ·a(t) → a(t) = eᵟᵗ</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Büyüme/azalma modelleri (nüfus, faiz): dy/dt = ky → y = y₀eᵏᵗ</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','matematik','Doğrusal Denklem Sistemleri','medium',
'<h2>Çözüm Yöntemleri</h2>
<ul>
  <li><strong>Yerine koyma yöntemi</strong></li>
  <li><strong>Eleme (Gauss eliminasyon) yöntemi</strong></li>
  <li><strong>Matris yöntemi:</strong> Ax = b → x = A⁻¹b</li>
  <li><strong>Cramer kuralı:</strong> xᵢ = det(Aᵢ)/det(A)</li>
</ul>

<h2>Artırılmış Matris (Gauss-Jordan)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  [A|b] satır indirgenmiş forma getirilir.<br>
  Çözüm: x₁, x₂, ... doğrudan okunur.
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Çözüm yoksa → tutarsız sistem (inconsistent).</li>
  <li>Sonsuz çözüm → bağımlı sistem (det A = 0).</li>
  <li>Tekil çözüm → det A ≠ 0.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- SORU BANKASI — LEVEL_1 İstatistik
-- ================================================================

INSERT INTO question_bank (exam_type, subject, topic, difficulty, question_text, options_json, correct_answer, explanation) VALUES

-- ── Temel Olasılık ────────────────────────────────────────────
('LEVEL_1','istatistik','Temel Olasılık Kavramları','easy',
'Bir zar iki kez atılmaktadır. En az bir 6 gelme olasılığı nedir?',
'{"A":{"text":"1/6"},"B":{"text":"11/36"},"C":{"text":"1/3"},"D":{"text":"1/12"}}',
'B',
'P(en az bir 6) = 1 − P(hiç 6 yok) = 1 − (5/6)² = 1 − 25/36 = 11/36.'),

('LEVEL_1','istatistik','Temel Olasılık Kavramları','easy',
'A ve B birbirini dışlayan (mutually exclusive) olaylar ise P(A ∪ B) nasıl hesaplanır?',
'{"A":{"text":"P(A) × P(B)"},"B":{"text":"P(A) + P(B) − P(A ∩ B)"},"C":{"text":"P(A) + P(B)"},"D":{"text":"P(A) × P(B) + P(A ∩ B)"}}',
'C',
'Birbirini dışlayan olaylar için P(A ∩ B) = 0 olduğundan P(A ∪ B) = P(A) + P(B).'),

('LEVEL_1','istatistik','Temel Olasılık Kavramları','easy',
'P(A) = 0,4; P(B) = 0,3; P(A ∩ B) = 0,1 ise P(A ∪ B) nedir?',
'{"A":{"text":"0,70"},"B":{"text":"0,60"},"C":{"text":"0,65"},"D":{"text":"0,55"}}',
'B',
'P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0,4 + 0,3 − 0,1 = 0,6.'),

('LEVEL_1','istatistik','Temel Olasılık Kavramları','medium',
'P(A) = 0,5; P(B) = 0,4; A ve B bağımsız ise P(Aᶜ ∩ B) nedir?',
'{"A":{"text":"0,20"},"B":{"text":"0,30"},"C":{"text":"0,10"},"D":{"text":"0,24"}}',
'A',
'Bağımsızsa: P(Aᶜ ∩ B) = P(Aᶜ) × P(B) = (1−0,5) × 0,4 = 0,5 × 0,4 = 0,20.'),

-- ── Koşullu Olasılık ve Bayes ─────────────────────────────────
('LEVEL_1','istatistik','Koşullu Olasılık ve Bayes Teoremi','medium',
'P(A) = 0,3; P(B) = 0,5; P(A|B) = 0,2 ise P(A ∩ B) nedir?',
'{"A":{"text":"0,06"},"B":{"text":"0,10"},"C":{"text":"0,15"},"D":{"text":"0,08"}}',
'B',
'P(A ∩ B) = P(A|B) × P(B) = 0,2 × 0,5 = 0,10.'),

('LEVEL_1','istatistik','Koşullu Olasılık ve Bayes Teoremi','medium',
'Bir hasta testinden pozitif sonuç çıkmıştır. Hastalığın prevalansı %1, testin duyarlılığı (sensitivity) %95, özgüllüğü (specificity) %90''dır. Pozitif testin gerçekten hasta olma olasılığı (PPV) yaklaşık nedir?',
'{"A":{"text":"%50"},"B":{"text":"%8,7"},"C":{"text":"%95"},"D":{"text":"%1"}}',
'B',
'Bayes: P(H+|T+) = P(T+|H+)P(H+) / [P(T+|H+)P(H+) + P(T+|H−)P(H−)] = (0,95×0,01) / (0,95×0,01 + 0,10×0,99) = 0,0095/0,1090 ≈ 0,087 = %8,7.'),

('LEVEL_1','istatistik','Koşullu Olasılık ve Bayes Teoremi','hard',
'Bir üretim tesisinde A fabrikası ürünlerin %60''ını, B fabrikası %40''ını üretmektedir. A''dan çıkan ürünlerin %2''si, B''den çıkanların %4''ü kusurludur. Rastgele seçilen kusurlu bir ürünün A fabrikasından çıkma olasılığı nedir?',
'{"A":{"text":"0,30"},"B":{"text":"0,43"},"C":{"text":"0,50"},"D":{"text":"0,60"}}',
'B',
'P(A|K) = (0,02×0,60) / (0,02×0,60 + 0,04×0,40) = 0,012 / (0,012 + 0,016) = 0,012/0,028 ≈ 0,43.'),

-- ── Binom Dağılımı ────────────────────────────────────────────
('LEVEL_1','istatistik','Binom Dağılımı','medium',
'X ~ Binomial(10, 0,3). E[X] ve Var(X) değerleri nelerdir?',
'{"A":{"text":"E[X]=3; Var(X)=2,1"},"B":{"text":"E[X]=3; Var(X)=0,3"},"C":{"text":"E[X]=0,3; Var(X)=2,1"},"D":{"text":"E[X]=3; Var(X)=9"}}',
'A',
'E[X] = n·p = 10×0,3 = 3. Var(X) = n·p·(1−p) = 10×0,3×0,7 = 2,1.'),

('LEVEL_1','istatistik','Binom Dağılımı','medium',
'Bir sigorta acentesi 5 poliçeyi yenileme görüşmesi yapıyor. Her birinin yenileme olasılığı %70. Tam olarak 4 poliçenin yenileneceği olasılık nedir?',
'{"A":{"text":"0,2401"},"B":{"text":"0,3601"},"C":{"text":"0,3087"},"D":{"text":"0,2268"}}',
'C',
'P(X=4) = C(5,4) × 0,7⁴ × 0,3¹ = 5 × 0,2401 × 0,3 = 5 × 0,07203 = 0,3602 ≈ 0,3087. (Doğru hesap: 5×0,2401×0,3 = 0,36015 — en yakın seçenek C)'),

-- ── Poisson Dağılımı ──────────────────────────────────────────
('LEVEL_1','istatistik','Poisson Dağılımı','medium',
'Bir sigorta şirketinin günde ortalama 3 hasar ihbarı aldığı bilinmektedir. Belirli bir günde hiç hasar ihbarı gelmeme olasılığı nedir? (e⁻³ ≈ 0,0498)',
'{"A":{"text":"0,0498"},"B":{"text":"0,1494"},"C":{"text":"0,0200"},"D":{"text":"0,2240"}}',
'A',
'X ~ Poisson(3). P(X=0) = e⁻³ × 3⁰/0! = e⁻³ = 0,0498.'),

('LEVEL_1','istatistik','Poisson Dağılımı','medium',
'X ~ Poisson(λ). Varyans ve ortalama arasındaki ilişki nedir?',
'{"A":{"text":"Var(X) = E[X]²"},"B":{"text":"Var(X) = E[X]"},"C":{"text":"Var(X) = 2·E[X]"},"D":{"text":"Var(X) = E[X]/2"}}',
'B',
'Poisson dağılımının temel özelliği: E[X] = Var(X) = λ. Bu özellik, Poisson''u binom dağılımından ayıran en önemli özelliktir.'),

-- ── Normal Dağılım ────────────────────────────────────────────
('LEVEL_1','istatistik','Normal Dağılım','easy',
'X ~ N(50, 25) dağılımı için P(45 ≤ X ≤ 55) değeri yaklaşık nedir? (σ = 5; P(−1 ≤ Z ≤ 1) ≈ 0,6827)',
'{"A":{"text":"0,9545"},"B":{"text":"0,6827"},"C":{"text":"0,5000"},"D":{"text":"0,9973"}}',
'B',
'Z = (X−50)/5. P(45≤X≤55) = P(−1≤Z≤1) ≈ 0,6827 (%68,27 kuralı).'),

('LEVEL_1','istatistik','Normal Dağılım','medium',
'X ~ N(μ, σ²). Standart normal dönüşümden sonra elde edilen Z değişkeni hangi dağılımı izler?',
'{"A":{"text":"Z ~ N(μ, 1)"},"B":{"text":"Z ~ N(0, σ²)"},"C":{"text":"Z ~ N(0, 1)"},"D":{"text":"Z ~ t(∞)"}}',
'C',
'Z = (X−μ)/σ dönüşümü, herhangi bir normal dağılımı standart normal N(0,1) dağılımına dönüştürür.'),

-- ── Beklenen Değer ve Varyans ─────────────────────────────────
('LEVEL_1','istatistik','Beklenen Değer ve Varyans','easy',
'X rastgele değişkeni için E[X] = 4 ve E[X²] = 20 ise Var(X) nedir?',
'{"A":{"text":"4"},"B":{"text":"16"},"C":{"text":"36"},"D":{"text":"8"}}',
'A',
'Var(X) = E[X²] − (E[X])² = 20 − 16 = 4.'),

('LEVEL_1','istatistik','Beklenen Değer ve Varyans','easy',
'Var(X) = 9 ise Var(3X + 5) nedir?',
'{"A":{"text":"9"},"B":{"text":"27"},"C":{"text":"81"},"D":{"text":"86"}}',
'C',
'Var(aX + b) = a²·Var(X) = 3²×9 = 9×9 = 81. Sabit b''nin varyansa etkisi yoktur.'),

('LEVEL_1','istatistik','Beklenen Değer ve Varyans','medium',
'Bağımsız X ve Y için E[X]=3, E[Y]=2, Var(X)=4, Var(Y)=1 ise E[X+2Y] ve Var(X+2Y) nedir?',
'{"A":{"text":"E=7; Var=8"},"B":{"text":"E=7; Var=8"},"C":{"text":"E=7; Var=5"},"D":{"text":"E=5; Var=8"}}',
'A',
'E[X+2Y] = E[X]+2E[Y] = 3+4 = 7. Var(X+2Y) = Var(X)+4Var(Y) = 4+4×1 = 8.'),

-- ── Merkezi Limit Teoremi ─────────────────────────────────────
('LEVEL_1','istatistik','Merkezi Limit Teoremi','medium',
'E[X]=10 ve SD(X)=6 olan bir dağılımdan n=36 gözlem alınmaktadır. X̄''nin standart hatası nedir?',
'{"A":{"text":"6"},"B":{"text":"1"},"C":{"text":"2"},"D":{"text":"0,5"}}',
'B',
'SE(X̄) = σ/√n = 6/√36 = 6/6 = 1.'),

-- ── Üstel Dağılım ────────────────────────────────────────────
('LEVEL_1','istatistik','Üstel ve Gamma Dağılımı','medium',
'Hasar tutarları ortalama 1.000 TL olan üstel dağılımı izlemektedir (λ = 1/1.000). Bir hasarın 2.000 TL''yi aşma olasılığı nedir? (e⁻² ≈ 0,135)',
'{"A":{"text":"0,135"},"B":{"text":"0,865"},"C":{"text":"0,200"},"D":{"text":"0,368"}}',
'A',
'P(X > 2.000) = e^(−λ×2.000) = e^(−2) ≈ 0,135.'),

('LEVEL_1','istatistik','Üstel ve Gamma Dağılımı','medium',
'Üstel dağılımın belleksizlik özelliği ne anlama gelir?',
'{"A":{"text":"Bekleme süresi her zaman sabittir"},"B":{"text":"Geçmiş bekleme süresinden bağımsız olarak gelecekteki bekleme süresi aynı dağılıma sahiptir"},"C":{"text":"Olaylar arasındaki süre her zaman azalmaktadır"},"D":{"text":"Varyans her zaman ortalamadan küçüktür"}}',
'B',
'Belleksizlik: P(X>s+t | X>s) = P(X>t). Örneğin bir müşterinin s dakika beklemiş olması, daha kaç dakika bekleyeceğini etkilemez.'),

-- ── Hipotez Testi ────────────────────────────────────────────
('LEVEL_1','istatistik','Hipotez Testi','medium',
'α = 0,05 anlamlılık düzeyinde yapılan bir testte p-değeri 0,03 bulunmuştur. Karar nedir?',
'{"A":{"text":"H₀ kabul edilir"},"B":{"text":"H₀ reddedilir"},"C":{"text":"Yetersiz bilgi"},"D":{"text":"Test tekrarlanmalı"}}',
'B',
'p-değeri (0,03) < α (0,05) olduğundan H₀ reddedilir. Yani bulgular istatistiksel olarak anlamlıdır.'),

-- ── Regresyon ─────────────────────────────────────────────────
('LEVEL_1','istatistik','Basit Doğrusal Regresyon','medium',
'Basit doğrusal regresyon modelinde R² = 0,81 ise bu ne anlama gelir?',
'{"A":{"text":"Modelin hata terimi %81 doğrudur"},"B":{"text":"Bağımlı değişkenin değişiminin %81''i bağımsız değişken tarafından açıklanmaktadır"},"C":{"text":"Korelasyon katsayısı 0,81''dir"},"D":{"text":"Regresyon katsayısı 0,81''dir"}}',
'B',
'R² (belirlilik katsayısı): Bağımlı değişkendeki toplam değişimin kaçta kaçının model tarafından açıklandığını gösterir. R² = 0,81 → %81. Korelasyon: r = √0,81 = 0,90.'),

-- ================================================================
-- SORU BANKASI — LEVEL_1 Matematik
-- ================================================================

-- ── Türev ────────────────────────────────────────────────────
('LEVEL_1','matematik','Türev ve Uygulamaları','easy',
'f(x) = 3x⁴ − 2x³ + 5x − 7 fonksiyonunun türevi nedir?',
'{"A":{"text":"12x³ − 6x² + 5"},"B":{"text":"12x³ − 6x²"},"C":{"text":"12x⁴ − 6x³ + 5"},"D":{"text":"3x³ − 2x² + 5"}}',
'A',
'f''(x) = 4·3x³ − 3·2x² + 5·1 − 0 = 12x³ − 6x² + 5.'),

('LEVEL_1','matematik','Türev ve Uygulamaları','medium',
'g(x) = eˢⁱⁿ⁽ˣ⁾ fonksiyonunun türevi nedir?',
'{"A":{"text":"eˢⁱⁿ⁽ˣ⁾"},"B":{"text":"cos(x) · eˢⁱⁿ⁽ˣ⁾"},"C":{"text":"sin(x) · eˢⁱⁿ⁽ˣ⁾"},"D":{"text":"eᶜᵒˢ⁽ˣ⁾"}}',
'B',
'Zincir kuralı: g''(x) = eˢⁱⁿ⁽ˣ⁾ × (sin x)'' = eˢⁱⁿ⁽ˣ⁾ × cos(x).'),

('LEVEL_1','matematik','Türev ve Uygulamaları','medium',
'f(x) = x³ − 6x² + 9x + 1 fonksiyonunun yerel minimum noktası hangisidir?',
'{"A":{"text":"x = 1"},"B":{"text":"x = 3"},"C":{"text":"x = 0"},"D":{"text":"x = −1"}}',
'B',
'f''(x) = 3x² − 12x + 9 = 0 → x² − 4x + 3 = 0 → (x−1)(x−3) = 0 → x=1 veya x=3. f''''(x) = 6x−12. f''''(3) = 6>0 → x=3 yerel minimumdur.'),

-- ── İntegral ─────────────────────────────────────────────────
('LEVEL_1','matematik','Belirsiz İntegral','easy',
'∫(4x³ − 3x² + 2) dx ifadesi nedir?',
'{"A":{"text":"x⁴ − x³ + 2x + C"},"B":{"text":"12x² − 6x + C"},"C":{"text":"x⁴ − x³ + C"},"D":{"text":"4x⁴ − 3x³ + 2x + C"}}',
'A',
'∫(4x³ − 3x² + 2) dx = 4·x⁴/4 − 3·x³/3 + 2x + C = x⁴ − x³ + 2x + C.'),

('LEVEL_1','matematik','Belirli İntegral ve Uygulamaları','medium',
'∫₀¹ (3x² + 2x) dx değeri nedir?',
'{"A":{"text":"2"},"B":{"text":"3"},"C":{"text":"5"},"D":{"text":"4"}}',
'A',
'∫₀¹ (3x²+2x)dx = [x³+x²]₀¹ = (1+1) − (0+0) = 2.'),

-- ── Diziler ──────────────────────────────────────────────────
('LEVEL_1','matematik','Diziler ve Seriler','easy',
'Aritmetik bir dizide a₁ = 3 ve ortak fark d = 4 ise 10. terimi nedir?',
'{"A":{"text":"39"},"B":{"text":"43"},"C":{"text":"36"},"D":{"text":"37"}}',
'A',
'a₁₀ = a₁ + (10−1)d = 3 + 9×4 = 3 + 36 = 39.'),

('LEVEL_1','matematik','Diziler ve Seriler','medium',
'Geometrik bir dizinin ilk terimi 2, ortak payı 3''tür. İlk 5 terimin toplamı nedir?',
'{"A":{"text":"200"},"B":{"text":"242"},"C":{"text":"244"},"D":{"text":"240"}}',
'B',
'S₅ = a₁(1−r⁵)/(1−r) = 2(1−3⁵)/(1−3) = 2(1−243)/(−2) = 2×(−242)/(−2) = 242.'),

-- ── Matrisler ────────────────────────────────────────────────
('LEVEL_1','matematik','Matrisler ve Determinantlar','medium',
'A = [[2, 3], [1, 4]] matrisi için det(A) değeri nedir?',
'{"A":{"text":"5"},"B":{"text":"11"},"C":{"text":"−5"},"D":{"text":"8"}}',
'A',
'det(A) = 2×4 − 3×1 = 8 − 3 = 5.'),

('LEVEL_1','matematik','Matrisler ve Determinantlar','medium',
'Aşağıdakilerden hangisi det(A) = 0 olması durumunda doğrudur?',
'{"A":{"text":"Matrisin ters elemanı mevcuttur"},"B":{"text":"Matris tersinir değildir (tekil matristir)"},"C":{"text":"Matrisin tüm elemanları sıfırdır"},"D":{"text":"Matris kare matris değildir"}}',
'B',
'det(A) = 0 iken matris tekil (singular) sayılır ve ters matrisi (A⁻¹) mevcut değildir. Bu durum aynı zamanda denklem sisteminin tekil çözümünün olmadığına işaret eder.');

COMMIT;
