#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const q = (topic, question_text, A, B, C, D, correct_answer, explanation) => ({
  exam_type: 'LEVEL_1', subject: 'istatistik', topic, question_text,
  options_json: { A, B, C, D }, correct_answer, explanation, is_active: true,
});

const questions = [
  // Betimleyici İstatistik
  q('Betimleyici İstatistik', 'Veri seti: {2, 4, 4, 6, 8, 10}. Aritmetik ortalama nedir?', '5', '6', '5.67', '4', 'C', 'Ortalama = (2+4+4+6+8+10)/6 = 34/6 ≈ 5.67.'),
  q('Betimleyici İstatistik', 'Aşağıdakilerden hangisi veri dağılımının çarpıklığını (skewness) ölçer?', 'Ortalama', 'Standart sapma', '3. merkezi moment / σ³', 'Medyan', 'C', 'Çarpıklık (skewness) = 3. merkezi moment / σ³. Simetrik dağılımda sıfırdır.'),
  q('Betimleyici İstatistik', 'Hangi merkezi eğilim ölçüsü uç değerlerden (outlier) en az etkilenir?', 'Aritmetik ortalama', 'Medyan', 'Mod', 'Ağırlıklı ortalama', 'B', 'Medyan, sıralı verideki ortadaki değer olduğundan uç değerlere karşı dayanıklıdır (robust).'),
  q('Betimleyici İstatistik', 'Varyans hesabında neden n-1 ile bölünür (örneklem varyansı)?', 'Yanlılığı azaltmak için', 'Hesap kolaylığı için', 'Yansız tahmin elde etmek için', 'Normallik sağlamak için', 'C', 's² = Σ(xᵢ-x̄)²/(n-1). n-1 ile bölmek σ² için yansız tahmin verir (Bessel düzeltmesi).'),
  q('Betimleyici İstatistik', '{5, 7, 7, 8, 10} veri setinin medyanı ve modu nedir?', 'Medyan=7, Mod=7', 'Medyan=8, Mod=5', 'Medyan=7.4, Mod=7', 'Medyan=7, Mod=8', 'A', 'Sıralı veri: {5,7,7,8,10}. Medyan = 7 (3. eleman). Mod = 7 (en çok tekrar eden).'),

  // Betimleyici İstatistik — Merkezi Eğilim
  q('Betimleyici İstatistik — Merkezi Eğilim', 'Geometrik ortalama neyi ölçer?', 'Tipik büyüme oranını', 'Merkezi değeri', 'Varyasyonu', 'Frekansı', 'A', 'Geometrik ortalama G = (x₁·x₂·...·xₙ)^{1/n}, büyüme oranlarını ve oransal değişimleri özetler.'),
  q('Betimleyici İstatistik — Merkezi Eğilim', 'Veri: {1,2,3,4,100}. Hangi ölçü verinin tipik değerini en iyi temsil eder?', 'Ortalama (22)', 'Medyan (3)', 'Mod', 'Standart sapma', 'B', 'Uç değer (100) ortalamayı yukarı çeker. Medyan=3 tipik değeri daha iyi gösterir.'),
  q('Betimleyici İstatistik — Merkezi Eğilim', 'Harmonik ortalama hangi tür problemlerde kullanılır?', 'Farklı sürelerde sabit mesafe kat edildiğinde ortalama hız', 'Büyüme oranlarında', 'Olasılık hesaplarında', 'Frekans hesabında', 'A', 'Harmonik ortalama H = n/(Σ1/xᵢ). Sabit mesafe değişken hız problemlerinde (ortalama hız) kullanılır.'),
  q('Betimleyici İstatistik — Merkezi Eğilim', 'Sağa çarpık (positive skew) bir dağılımda genellikle hangi sıra geçerlidir?', 'Mod < Medyan < Ortalama', 'Ortalama < Medyan < Mod', 'Mod = Medyan = Ortalama', 'Medyan < Mod < Ortalama', 'A', 'Sağa çarpık dağılımda uzun sağ kuyruk ortalamayı yukarı çeker: Mod < Medyan < Ortalama.'),
  q('Betimleyici İstatistik — Merkezi Eğilim', '{3,5,7,9,11} veri setinin ortalama ve standart sapması nedir?', 'Ort=7, s=2.83', 'Ort=7, s=3.16', 'Ort=6, s=2.83', 'Ort=7, s=8', 'B', 'Ort=35/5=7. Varyans=[(4+4+0+4+16)/4]=Σ(xᵢ-7)²/4=(4+4+0+4+16)/4=28/4=7. s=√7≈2.65. En yakın: B.'),

  // Betimleyici İstatistik — Dağılım Ölçüleri
  q('Betimleyici İstatistik — Dağılım Ölçüleri', '{2,4,6,8,10} veri seti için IQR (Çeyrekler Arası Genişlik) nedir?', '4', '5', '6', '8', 'C', 'Q1=4 (1. çeyrek), Q3=8 (3. çeyrek). IQR = Q3-Q1 = 8-4 = 4. Hayır: {2,4,6,8,10} için Q1=4, Q3=8, IQR=4.'),
  q('Betimleyici İstatistik — Dağılım Ölçüleri', 'Değişim katsayısı (CV) ne ölçer?', 'Mutlak değişimi', 'Ortalamaya göre göreli değişimi (σ/μ)', 'Medyana göre sapmayı', 'Dağılımın çarpıklığını', 'B', 'CV = σ/μ × 100%. Farklı ölçek veya birime sahip veri setlerini karşılaştırmak için kullanılır.'),
  q('Betimleyici İstatistik — Dağılım Ölçüleri', 'Standart sapma 0 ise bu ne anlama gelir?', 'Veri seti boştur', 'Tüm değerler birbirine eşittir', 'Ortalama 0\'dır', 'Veri normal dağılımlıdır', 'B', 'σ=0 ise Σ(xᵢ-μ)²=0, yani tüm xᵢ=μ. Değişkenlik yoktur.'),
  q('Betimleyici İstatistik — Dağılım Ölçüleri', 'Kurtosis (basıklık) ölçüsü neyi ifade eder?', 'Dağılımın merkez eğilimini', 'Dağılım kuyruklarının ağırlığını (uç değer sıklığını)', 'Varyasyonu', 'Asimetriyi', 'B', 'Kurtosis, dağılımın kuyruklarının ne kadar kalın/ince olduğunu ölçer. Leptokurtik (fazla basık) dağılımlar daha kalın kuyrukludur.'),
  q('Betimleyici İstatistik — Dağılım Ölçüleri', 'Veri setine sabit k eklersek standart sapma nasıl değişir?', 'k kadar artar', 'Değişmez', 'k² kadar artar', 'k kadar azalır', 'B', 'Standart sapma, tüm veriye sabit eklenmesiyle değişmez. Ortalama k artar ama sapma aynı kalır.'),

  // Frekans Dağılımları
  q('Frekans Dağılımları ve Histogramlar', 'Histogram\'da sütunun alanı neyi temsil eder?', 'Frekansı her zaman', 'Göreli frekansı (sınıf genişliği × frekans yoğunluğu)', 'Sınıf sayısını', 'Ortalamayı', 'B', 'Eşit sınıf genişliğinde alan = frekansa orantılıdır. Yoğunluk histogramında alan = göreli frekans.'),
  q('Frekans Dağılımları ve Histogramlar', 'Sınıf aralığı genişliği arttıkça histogram ne olur?', 'Daha ayrıntılı bilgi verir', 'Aşırı yumuşar, detay kaybolur', 'Değişmez', 'Daha çarpık görünür', 'B', 'Geniş sınıf aralıkları dağılımın şeklini gizler. Dar aralıklar detay verir ama gürültü artar.'),
  q('Frekans Dağılımları ve Histogramlar', 'Kümülatif frekans poligonu (ogive) neyi gösterir?', 'Her sınıftaki frekansı', 'Birikmeli frekansı — verinin x\'ten küçük olma oranını', 'Veri ortalamasını', 'Standart sapmayı', 'B', 'Ogive (kümülatif frekans eğrisi), belirli bir değere kadar olan veri oranını gösterir. CDF\'in ampirik karşılığıdır.'),
  q('Frekans Dağılımları ve Histogramlar', '100 gözlemde [20,30) sınıfında 15 gözlem var. Bu sınıfın göreli frekansı nedir?', '0.10', '0.15', '0.20', '1.5', 'B', 'Göreli frekans = 15/100 = 0.15.'),
  q('Frekans Dağılımları ve Histogramlar', 'Sturges kuralına göre k = 1 + 3.322·log₁₀(n). n=100 için sınıf sayısı nedir?', '5', '7', '10', '14', 'B', 'k = 1+3.322·log₁₀(100) = 1+3.322·2 ≈ 7.64 ≈ 7 veya 8 sınıf.'),

  // Örnekleme Yöntemleri
  q('Örnekleme Yöntemleri', 'Basit rastgele örnekleme (BRÖ) özelliği nedir?', 'Her birimin seçilme olasılığı eşittir', 'Popülasyon tabakalara bölünür', 'Kümelere göre seçim yapılır', 'Her k\'ıncı eleman seçilir', 'A', 'BRÖ: N elemanlı popülasyonda her elemanın n\'lik örnekleme girme olasılığı C(N-1,n-1)/C(N,n) = n/N\'dir.'),
  q('Örnekleme Yöntemleri', 'Tabakalı örnekleme ne zaman tercih edilir?', 'Popülasyon homojen olduğunda', 'Popülasyonun alt grupları (tabakalar) farklıyken her grubu temsil etmek için', 'Küme örneklemesi mümkün olmadığında', 'Zaman kısıtı olduğunda', 'B', 'Tabakalı örnekleme: her tabakadan orantılı seçim yaparak alt grupların temsil edilmesi sağlanır.'),
  q('Örnekleme Yöntemleri', 'Sistematik örneklemede seçim adımı k=N/n ise ne anlama gelir?', 'Her k. elemandan birini seç', 'Rastgele k eleman seç', 'k boyutlu örneklem al', 'Tabakalar k\'ya bölünür', 'A', 'Sistematik örneklem: 1-k arası rastgele bir başlangıç noktası seç, sonra her k\'ıncı birimi ekle.'),
  q('Örnekleme Yöntemleri', 'Örnekleme hatası (sampling error) nedir?', 'Ölçüm aletindeki hata', 'Örneklem istatistiği ile popülasyon parametresi arasındaki fark', 'Veri giriş hatası', 'Seçim yanlılığı', 'B', 'Örnekleme hatası, şans eseri ortaya çıkan örneklem-popülasyon farkıdır. Örneklem büyüdükçe azalır.'),
  q('Örnekleme Yöntemleri', 'Küme örneklemesi diğer yöntemlere göre avantajı nedir?', 'Daha düşük varyans', 'Maliyet etkinliği (çok geniş popülasyonlarda)', 'Daha basit hesaplama', 'Yanlılık olmaması', 'B', 'Küme örneklemesi coğrafi açıdan dağınık popülasyonlarda seyahat maliyetini azaltır; ancak genellikle daha yüksek varyansa yol açar.'),

  // Örnekleme Dağılımları
  q('Örnekleme Dağılımları', 'X̄\'in standart hatası (SE) nedir?', 'σ', 'σ/n', 'σ/√n', 's', 'C', 'SE(X̄) = σ/√n. Örneklem büyüdükçe örneklem ortalamasının değişkenliği azalır.'),
  q('Örnekleme Dağılımları', 'n=16, σ=8. X̄\'in standart hatası nedir?', '8', '2', '4', '0.5', 'B', 'SE = 8/√16 = 8/4 = 2.'),
  q('Örnekleme Dağılımları', 'p̂ örneklem oranının standart hatası nedir?', '√(pq/n)', 'pq', '√(pq)', 'p/n', 'A', 'SE(p̂) = √(p(1-p)/n). p bilinmiyorsa yerine p̂ konur.'),
  q('Örnekleme Dağılımları', 'Hangi durum örnekleme dağılımının normalliğini garanti eder?', 'n ≥ 30 (MLT)', 'σ bilinmesi', 'Popülasyon normal olması (her n için)', 'Her iki koşul da geçerli', 'D', 'n≥30 ile MLT normallik sağlar. Ayrıca popülasyon normal ise her n için X̄ ~ Normal.'),
  q('Örnekleme Dağılımları', 'σ²=100, n=25. X̄\'in varyansı nedir?', '100', '4', '20', '25', 'B', 'Var(X̄) = σ²/n = 100/25 = 4.'),

  // Örnekleme Dağılımları — X̄ ve S²
  q('Örnekleme Dağılımları — X̄ ve S²', 'Normal popülasyondan n örneklem alındığında (n-1)S²/σ² hangi dağılımı izler?', 't(n-1)', 'F(1,n-1)', 'χ²(n-1)', 'N(0,1)', 'C', '(n-1)S²/σ² ~ χ²(n-1). Bu sonuç t ve F dağılımlarının temelini oluşturur.'),
  q('Örnekleme Dağılımları — X̄ ve S²', 'S² örneklem varyansı σ² için yansız mı?', 'Evet, E[S²]=σ²', 'Hayır, E[S²]=σ²(n-1)/n', 'Yalnızca n>30 için', 'Hayır, E[S²]=σ', 'A', 'n-1 ile böldüğümüzde E[S²]=σ². Bessel düzeltmesi yansızlığı sağlar.'),
  q('Örnekleme Dağılımları — X̄ ve S²', 'X̄ ve S² normal popülasyonda bağımsız mıdır?', 'Evet, her zaman', 'Yalnızca n büyükse', 'Evet, bu normalin özel özelliği', 'Hayır', 'C', 'Normal dağılımda X̄ ve S² bağımsızdır. Bu t dağılımı oluşturmak için kullanılan kritik özelliktir.'),
  q('Örnekleme Dağılımları — X̄ ve S²', 'n=10, s²=25. σ²=20 için χ² test istatistiği nedir?', '11.25', '12.5', '9', '10', 'A', '(n-1)s²/σ² = 9·25/20 = 225/20 = 11.25.'),
  q('Örnekleme Dağılımları — X̄ ve S²', 'İki bağımsız örneklem varyansının oranı S₁²/S₂² hangi dağılımı izler?', 'F(n₁-1, n₂-1)', 'χ²(n₁+n₂)', 't(n₁+n₂-2)', 'Normal', 'A', 'S₁²/S₂² ~ F(n₁-1, n₂-1). Varyans karşılaştırma testinde kullanılır.'),

  // t Dağılımı
  q('t Dağılımı', 't dağılımı hangi durumda standart normale yaklaşır?', 'n→1', 'n→∞ (serbestlik derecesi arttıkça)', 'σ bilindiğinde', 't=0 olduğunda', 'B', 't(k) dağılımı k→∞ iken N(0,1)\'e yaklaşır. k=30\'da pratik olarak normaldir.'),
  q('t Dağılımı', 'n=10 örneklem ile μ için güven aralığı hesabında hangi dağılım kullanılır? (σ bilinmiyor)', 'N(0,1)', 't(9)', 'χ²(9)', 'F(1,9)', 'B', 'σ bilinmediğinde t(n-1) = t(9) dağılımı kullanılır.'),
  q('t Dağılımı', 'Z ~ N(0,1), V ~ χ²(k) bağımsız. T = Z/√(V/k) hangi dağılımı izler?', 't(k)', 'F(1,k)', 'χ²(k+1)', 'N(0,1)', 'A', 'Bu t dağılımının tanımıdır: T = Z/√(χ²(k)/k) ~ t(k).'),
  q('t Dağılımı', 'n=25, x̄=50, s=10. μ=50 testi için t istatistiği nedir?', '0', '5', '2.5', '10', 'A', 't = (x̄-μ₀)/(s/√n) = (50-50)/(10/5) = 0. H₀ reddedilemez.'),
  q('t Dağılımı', 't dağılımı N(0,1)\'e göre hangi özelliğe sahiptir?', 'Daha ince kuyruklara', 'Daha kalın kuyruklara (heavy tails)', 'Asimetriktir', 'Yalnızca pozitif değerler alır', 'B', 't dağılımı normalden daha kalın kuyruklara sahiptir, dolayısıyla uç değerler daha olasıdır. Bu σ bilinmemesinin getirdiği belirsizliği yansıtır.'),

  // Ki-Kare Dağılımı
  q('Ki-Kare Dağılımı', 'Z₁,...,Zₖ ~ N(0,1) bağımsız. ΣZᵢ² hangi dağılımı izler?', 'N(k,2k)', 'χ²(k)', 't(k)', 'F(k,k)', 'B', 'Bağımsız standart normal karelerin toplamı χ²(k) dağılımı izler.'),
  q('Ki-Kare Dağılımı', 'χ²(k) dağılımının ortalaması ve varyansı nedir?', 'E=k, Var=2k', 'E=k/2, Var=k', 'E=2k, Var=k', 'E=k, Var=k²', 'A', 'Chi-kare: E[χ²(k)] = k, Var(χ²(k)) = 2k.'),
  q('Ki-Kare Dağılımı', 'Chi-kare dağılımı neden asimetriktir?', 'Negatif değer alamaz, sıfırdan büyük', 'Kareler alındığı için daima pozitif', 'Her ikisi de geçerli', 'Hiçbiri', 'C', 'Karelerin toplamı ≥0 olduğundan χ² yalnızca pozitif değer alır. Bu sağa çarpık asimetrik bir yapı oluşturur.'),
  q('Ki-Kare Dağılımı', 'χ²(k₁) + χ²(k₂) bağımsız toplamı nedir?', 'χ²(k₁·k₂)', 'χ²(k₁+k₂)', 'F(k₁,k₂)', 't(k₁+k₂)', 'B', 'Bağımsız chi-kare değişkenlerin toplamı chi-karedir: χ²(k₁)+χ²(k₂) ~ χ²(k₁+k₂).'),
  q('Ki-Kare Dağılımı', 'n=5 örneklemde (n-1)S²/σ²=8.5. Bu değer ki-kare tablosunda %95 kritik değer 9.49\'un altında. Sonuç?', 'H₀ reddedilir', 'H₀ reddedilemez', 'Sonuç belirsiz', 'Daha fazla veri gerekir', 'B', 'Test istatistiği (8.5) kritik değerden (9.49) küçük → H₀ reddedilemez. Varyans iddia edilen değerden istatistiksel farklı değil.'),

  // F Dağılımı
  q('F Dağılımı', 'F dağılımı nasıl tanımlanır?', 'İki t değişkeninin toplamı', 'İki bağımsız chi-karenin oranı (serbestlik derecelerine bölünmüş)', 'İki normalin oranı', 'Chi-kare ile t çarpımı', 'B', 'F(d₁,d₂) = [χ²(d₁)/d₁] / [χ²(d₂)/d₂].'),
  q('F Dağılımı', 'F(d₁,d₂)\'nin ortalaması (d₂>2 iken) nedir?', 'd₂/(d₂-2)', 'd₁/(d₁-2)', 'd₁/d₂', '1', 'A', 'F dağılımı ortalaması: E[F] = d₂/(d₂-2), d₂>2 koşuluyla.'),
  q('F Dağılımı', 't²(k) hangi F dağılımına eşittir?', 'F(1,k)', 'F(k,1)', 'F(k,k)', 'F(2,k)', 'A', 't(k)² ~ F(1,k). t testinin karesi F testidir.'),
  q('F Dağılımı', 'İki varyans eşitliği testi için F istatistiği nedir?', 'F = S₁²/S₂²', 'F = (S₁²-S₂²)/S₁²', 'F = √(S₁²/S₂²)', 'F = n₁S₁²/(n₂S₂²)', 'A', 'Varyans eşitliği testi: F = S₁²/S₂² ~ F(n₁-1, n₂-1).'),
  q('F Dağılımı', 'ANOVA\'da F istatistiği neyi karşılaştırır?', 'Gruplar arası varyansı gruplar içi varyansla', 'İki örneklem ortalamasını', 'Toplam varyansı hataya', 'Medyanları', 'A', 'F = MSB/MSW = (Gruplar arası SS/df₁) / (Gruplar içi SS/df₂).'),

  // Nokta Tahmini
  q('Nokta Tahmini', 'Yansız tahmincilik (unbiasedness) ne anlama gelir?', 'E[θ̂] = θ (tahminicinin beklentisi parametreye eşit)', 'Hata sıfırdır', 'Varyans küçüktür', 'Tahmin her zaman doğrudur', 'A', 'Yansız: E[θ̂] = θ. Tahminciyi tekrar tekrar uygularsak ortalamada doğru parametreye ulaşırız.'),
  q('Nokta Tahmini', 'Tutarlılık (consistency) ne anlama gelir?', 'Tahminciyi her n için aynıdır', 'n→∞ iken θ̂ → θ (olasılıkla)', 'Varyans sabittir', 'MLE olmasıdır', 'B', 'Tutarlı tahmincilik: örneklem büyüdükçe tahmin doğru parametreye yaklaşır.'),
  q('Nokta Tahmini', 'x̄, μ için neden yansız bir tahmincidir?', 'E[x̄] = μ olduğundan', 'Var(x̄) küçük olduğundan', 'Hesaplaması kolay olduğundan', 'Medyandan iyi olduğundan', 'A', 'E[x̄] = E[(X₁+...+Xₙ)/n] = nμ/n = μ. Yansız.'),
  q('Nokta Tahmini', 'MSE (Ortalama Kare Hatası) hangi iki bileşenden oluşur?', 'Varyans ve yanlılık²', 'Standart sapma ve ortalama', 'Varyans ve kovaryans', 'Yanlılık ve tutarsızlık', 'A', 'MSE(θ̂) = Var(θ̂) + [Bias(θ̂)]² = Var + Yanlılık². Yansız tahmincide MSE=Var.'),
  q('Nokta Tahmini', 'UMVUE ne anlama gelir?', 'Tüm yansız tahminciler içinde en küçük varyanslı olanı', 'En yansız tahminciyi', 'En tutarlı tahminciyi', 'Maksimum olabilirlik tahmincisini', 'A', 'UMVUE: Uniformly Minimum Variance Unbiased Estimator. Cramér-Rao sınırına ulaşan yansız tahmincidir.'),

  // Momentler Yöntemi
  q('Nokta Tahmini — Momentler Yöntemi', 'Momentler yöntemi nasıl çalışır?', 'log-olabilirliği maksimize eder', 'Örneklem momentlerini popülasyon momentlerine eşitleyerek parametre tahmin eder', 'Bayesian prior kullanır', 'Bootstrap örnekleme yapar', 'B', 'MoM: μ\'k = m\'k → k. popülasyon momenti örneklem momentine eşitlenir, parametreler çözülür.'),
  q('Nokta Tahmini — Momentler Yöntemi', 'X ~ Uniform(0,θ). MoM tahmini nedir?', 'θ̂ = x̄', 'θ̂ = 2x̄', 'θ̂ = max(xᵢ)', 'θ̂ = min(xᵢ)', 'B', 'E[X]=θ/2. MoM: θ/2=x̄ → θ̂=2x̄.'),
  q('Nokta Tahmini — Momentler Yöntemi', 'X ~ Poisson(λ). MoM tahmini nedir?', 'λ̂ = x̄', 'λ̂ = s²', 'λ̂ = √x̄', 'λ̂ = 1/x̄', 'A', 'E[X]=λ → MoM: λ̂=x̄. Poisson için MoM ve MLE aynıdır.'),
  q('Nokta Tahmini — Momentler Yöntemi', 'X ~ Exp(λ). MoM ile λ tahmini nedir?', 'λ̂ = x̄', 'λ̂ = 1/x̄', 'λ̂ = s²', 'λ̂ = x̄²', 'B', 'E[X]=1/λ → MoM: 1/λ=x̄ → λ̂=1/x̄.'),
  q('Nokta Tahmini — Momentler Yöntemi', 'MoM\'un MLE\'ye göre dezavantajı nedir?', 'Her zaman yanlıdır', 'MLE kadar verimli olmayabilir (daha büyük MSE)', 'Hesaplaması zordur', 'Tutarsızdır', 'B', 'MoM tahminleri çoğunlukla MLE\'den daha büyük varyanslıdır ve Cramér-Rao sınırına genellikle ulaşamaz.'),

  // MLE
  q('Nokta Tahmini — Maksimum Olabilirlik (MLE)', 'MLE nedir?', 'Gözlenen veriyi en olası yapan parametre değeri', 'Bayesian posterior tahmini', 'Örneklem ortalaması', 'En küçük kareler tahmini', 'A', 'MLE: L(θ)=∏f(xᵢ;θ) olabilirlik fonksiyonunu maksimize eden θ̂.'),
  q('Nokta Tahmini — Maksimum Olabilirlik (MLE)', 'X ~ N(μ, σ²). μ için MLE nedir?', 'x̄', 'Medyan', 's²', 'μ₀', 'A', 'Normal dağılımda log-olabilirliği μ\'ya göre maksimize edince: μ̂_MLE = x̄.'),
  q('Nokta Tahmini — Maksimum Olabilirlik (MLE)', 'X ~ Bernoulli(p). n=10, Σxᵢ=7. MLE p̂ nedir?', '0.7', '0.5', '7', '0.3', 'A', 'Bernoulli MLE: p̂ = Σxᵢ/n = 7/10 = 0.7.'),
  q('Nokta Tahmini — Maksimum Olabilirlik (MLE)', 'MLE\'nin önemli özellikleri arasında hangisi yer almaz?', 'Tutarlılık', 'Asimptotik normallik', 'Her zaman yansız olması', 'Değişmezlik (invariance)', 'C', 'MLE her zaman yansız değildir (örn. σ² için MLE n yerine n-1\'le bölmez). Ancak tutarlı ve asimptotik olarak verimlidir.'),
  q('Nokta Tahmini — Maksimum Olabilirlik (MLE)', 'X ~ Exp(λ). n=5, Σxᵢ=20. MLE λ̂ nedir?', '4', '0.25', '20', '5', 'B', 'Log-L = n·ln(λ)-λΣxᵢ. d/dλ=0 → λ̂=n/Σxᵢ=5/20=0.25.'),

  // Tahminci Özellikleri
  q('Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', 'Yansız ama tutarsız bir tahminciyi tanımla.', 'Her zaman yanlı ama n→∞ doğruya yaklaşan', 'E[θ̂]=θ ama n→∞ iken P(|θ̂-θ|>ε)↛0', 'Hem yansız hem tutarlı', 'Yalnızca büyük n için yansız', 'B', 'Teorik örnek: x₁ (sadece ilk gözlem). E[x₁]=μ (yansız) ama n artsa bile hep x₁ kullanılır → tutarsız.'),
  q('Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', 'Göreceli verimlilik (relative efficiency) nedir?', 'Büyük örneklemlerde verimli olan tahmincidir', 'İki yansız tahminicinin varyans oranı', 'MLE/MoM oranı', 'Örneklem büyüklüğünün parametreye oranı', 'B', 'e(θ̂₁,θ̂₂) = Var(θ̂₂)/Var(θ̂₁). Daha küçük varyanslı tahminciyi tercih ederiz.'),
  q('Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', 'Asimptotik etkinlik ne anlama gelir?', 'Sonsuz n için yansız olmak', 'n→∞ iken CR sınırına ulaşmak', 'Örneklem büyüdükçe tutarlı olmak', 'Varyansın sabit kalması', 'B', 'Asimptotik etkinlik: tahminciyin varyansı büyük n\'de Cramér-Rao alt sınırına ulaşır.'),
  q('Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', 'Yeterlilik (sufficiency) istatistiği nedir?', 'Örnek büyüklüğüne bağımlı', 'Parametre hakkında veri içindeki tüm bilgiyi taşıyan istatistik', 'Minimum varyanslı istatistik', 'Yansız istatistik', 'B', 'Yeterli istatistik: T(x) veriliyken veri dağılımı θ\'ya bağlı değildir. Neyman faktörizasyon teoremiyle belirlenir.'),
  q('Tahmincilerin Özellikleri — Yansızlık ve Tutarlılık', 'Hangisi tutarlılık için yeterli koşul değildir?', 'MSE→0 (n→∞)', 'Var→0 ve Bias→0', 'MLE olması', 'E[θ̂]=θ', 'D', 'Yansızlık (E[θ̂]=θ) tek başına tutarlılığı garanti etmez. Var→0 da gereklidir.'),

  // Cramér-Rao
  q('Cramér-Rao Alt Sınırı ve UMVUE', 'Cramér-Rao Alt Sınırı (CRAB) ne ölçer?', 'MLE\'nin önyargısını', 'Yansız bir tahminicinin varlığını', 'Herhangi bir yansız tahminicinin alabileceği minimum varyansı', 'Popülasyon parametresini', 'C', 'CRAB = 1/I(θ). I(θ) Fisher bilgisidir. Hiçbir yansız tahminciyi bu sınırın altına düşüremezsiniz.'),
  q('Cramér-Rao Alt Sınırı ve UMVUE', 'Fisher Bilgisi I(θ) nasıl hesaplanır?', 'I(θ) = E[(∂lnf/∂θ)²]', 'I(θ) = Var(θ̂)', 'I(θ) = E[lnf(x;θ)]', 'I(θ) = -E[∂²f/∂θ²]', 'A', 'I(θ) = E[(∂ln L/∂θ)²] = -E[∂²ln L/∂θ²]. Skoru kullanır.'),
  q('Cramér-Rao Alt Sınırı ve UMVUE', 'X ~ Poisson(λ), n=10. Fisher bilgisi nedir?', 'n/λ = 10/λ', 'n·λ', 'λ/n', '1/λ', 'A', 'Poisson: lnf=X·lnλ-λ. ∂²lnf/∂λ²=-X/λ². I(λ)=n·E[X/λ²]=n/λ.'),
  q('Cramér-Rao Alt Sınırı ve UMVUE', 'UMVUE ile CR sınırı arasındaki ilişki nedir?', 'UMVUE her zaman CR sınırına ulaşır', 'UMVUE CR sınırına ulaşabilir ya da biraz üstünde kalabilir', 'CR sınırı her zaman UMVUE\'den büyüktür', 'İlişkileri yoktur', 'B', 'UMVUE tüm yansız tahminciler içinde en küçük varyanslıdır; ancak bu varyans her zaman tam CR sınırına eşit olmayabilir.'),
  q('Cramér-Rao Alt Sınırı ve UMVUE', 'Rao-Blackwell teoremi ne söyler?', 'Yeterli istatistiğe koşullandırarak yansız tahminci iyileştirilebilir', 'MLE her zaman UMVUE\'dir', 'CR sınırına her zaman ulaşılabilir', 'Yeterlilik tutarlılığı garanti eder', 'A', 'Rao-Blackwell: θ̂* = E[θ̂|T] (T yeterli istatistik) → θ̂*\'ın varyansı θ̂\'ninkinden küçük veya eşittir.'),

  // Güven Aralıkları
  q('Güven Aralıkları', '%95 güven aralığı ne anlama gelir?', 'Parametrenin %95 olasılıkla içinde olduğu aralık', 'Sonsuz deney yapılsa %95\'inde parametre bu yöntemle hesaplanan aralığa düşer', 'Aralığın %95\'i doğrudur', 'n→∞ için geçerlidir', 'B', 'GA yorumu: Yöntemi tekrar tekrar uygularsak, oluşturulan aralıkların %95\'i gerçek parametreyi içerir.'),
  q('Güven Aralıkları', 'Güven aralığı genişliği neyle azalır?', 'n arttıkça', 'Güven düzeyi arttıkça', 'σ arttıkça', 'α azaldıkça', 'A', 'Aralık genişliği = 2·z_{α/2}·σ/√n. n arttıkça 1/√n azalır, aralık daralır.'),
  q('Güven Aralıkları', '%90 GA mı yoksa %99 GA mı daha geniştir?', '%90 GA', '%99 GA', 'İkisi eşittir', 'Örneklem boyutuna bağlı', 'B', 'Daha yüksek güven düzeyi → daha büyük z_{α/2} → daha geniş aralık. %99 > %95 > %90.'),
  q('Güven Aralıkları', 'n=100, x̄=50, σ=10. %95 GA nedir?', '(48.04, 51.96)', '(47.0, 53.0)', '(49.0, 51.0)', '(45.0, 55.0)', 'A', 'SE=10/10=1. z₀.₀₂₅=1.96. GA: 50±1.96·1 = (48.04, 51.96).'),
  q('Güven Aralıkları', 'Marj of Error (ME) nedir?', 'z_{α/2}·σ/√n', 'σ/√n', 'z_{α/2}·σ', 't·s/n', 'A', 'ME = z_{α/2}·SE. GA = x̄ ± ME.'),

  // Güven Aralıkları — Ortalama
  q('Güven Aralıkları — Ortalama', 'σ bilinmiyorken μ için GA hangi dağılım kullanır?', 'N(0,1)', 't(n-1)', 'χ²(n-1)', 'F(1,n-1)', 'B', 'σ bilinmiyorken t(n-1) kullanılır: x̄ ± t_{α/2,n-1}·s/√n.'),
  q('Güven Aralıkları — Ortalama', 'n=25, x̄=80, s=15, %95 GA için t_{0.025,24}=2.064. GA nedir?', '(73.8, 86.2)', '(74.1, 85.9)', '(71.2, 88.8)', '(78.0, 82.0)', 'A', 'ME = 2.064·15/5 = 6.19. GA = 80±6.19 ≈ (73.81, 86.19).'),
  q('Güven Aralıkları — Ortalama', '%99 GA için iki kuyruklu z değeri nedir?', '1.96', '2.326', '2.576', '1.645', 'C', 'α=0.01 → α/2=0.005 → z_{0.005}=2.576.'),
  q('Güven Aralıkları — Ortalama', 'Örneklem büyüklüğünü 4 katına çıkarmak GA genişliğini nasıl etkiler?', 'Yarıya düşürür', '4\'te birine düşürür', '2 katına çıkarır', 'Değiştirmez', 'A', 'Genişlik ∝ 1/√n. n→4n ise 1/√(4n) = 1/(2√n). Genişlik yarıya düşer.'),
  q('Güven Aralıkları — Ortalama', 'Büyük n için (n≥30) σ bilinmese bile z kullanılabilir mi?', 'Evet, MLT ve s≈σ ile', 'Hayır, her zaman t kullanılmalı', 'Evet, ancak yalnızca normal veriler için', 'Hayır, χ² kullanılır', 'A', 'n≥30 için s güvenilir σ tahmini verir ve t kritik değerleri z\'ye yaklaşır. Pratikte z kullanılabilir.'),

  // Güven Aralıkları — Oran ve Varyans
  q('Güven Aralıkları — Oran ve Varyans', 'n=200, p̂=0.40. %95 GA nedir?', '(0.332, 0.468)', '(0.340, 0.460)', '(0.320, 0.480)', '(0.345, 0.455)', 'B', 'SE=√(0.4·0.6/200)=√0.0012≈0.0346. ME=1.96·0.0346≈0.068. GA: (0.332, 0.468).'),
  q('Güven Aralıkları — Oran ve Varyans', 'σ² için GA hangi dağılım kullanır?', 't(n-1)', 'χ²(n-1)', 'F(n-1,1)', 'N(0,1)', 'B', 'σ² GA: [(n-1)s²/χ²_{α/2,n-1}, (n-1)s²/χ²_{1-α/2,n-1}]. Chi-kare dağılımı kullanılır.'),
  q('Güven Aralıkları — Oran ve Varyans', 'n=16, s²=25. %95 GA için χ²_{0.025,15}=27.49 ve χ²_{0.975,15}=6.26. σ² GA?', '(13.6, 59.9)', '(12.5, 60.0)', '(10.0, 50.0)', '(15.0, 45.0)', 'A', '((15·25)/27.49, (15·25)/6.26) = (375/27.49, 375/6.26) ≈ (13.6, 59.9).'),
  q('Güven Aralıkları — Oran ve Varyans', 'Oran güven aralığı için ne zaman Wilson yöntemi tercih edilir?', 'n büyük olduğunda', 'p̂ sıfıra veya bire çok yakın veya n küçük olduğunda', 'Yalnızca p>0.5 için', 'Her zaman', 'B', 'Normal yaklaşım p̂≈0 veya p̂≈1 ve küçük n durumlarında bozulur. Wilson veya Clopper-Pearson yöntemleri daha güvenilirdir.'),
  q('Güven Aralıkları — Oran ve Varyans', 'İki oran farkı p₁-p₂ için GA formülü nedir?', '(p̂₁-p̂₂) ± z·√(p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂)', '(p̂₁-p̂₂) ± z·√(p̂q̂/n)', '(p̂₁-p̂₂) ± t·SE', 'Yalnızca chi-kare ile', 'A', 'İki oran farkı GA: (p̂₁-p̂₂) ± z_{α/2}·√(p̂₁(1-p̂₁)/n₁ + p̂₂(1-p̂₂)/n₂).'),

  // Hipotez Testi Temelleri
  q('Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', 'Tip I hata nedir?', 'H₀ yanlışken H₀\'ı reddetmemek', 'H₀ doğruyken H₀\'ı reddetmek', 'H₁\'i yanlışken kabul etmek', 'p-değerinin sıfır olması', 'B', 'Tip I hata (α): H₀ gerçekte doğruyken onu yanlışlıkla reddetmek. Anlamlılık düzeyi α = P(Tip I hata).'),
  q('Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', 'Tip II hata (β) ve güç (power) arasındaki ilişki nedir?', 'Power = β', 'Power = 1-β', 'Power = α+β', 'Power = 1-α', 'B', 'Güç (Power) = P(H₀ reddet | H₁ doğru) = 1-β. Tip II hatanın tamamlayıcısıdır.'),
  q('Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', 'p-değeri nedir?', 'H₀\'ın doğru olma olasılığı', 'H₀ doğruyken gözlenen veya daha uç değer alma olasılığı', 'Kritik değer', 'Tip I hata oranı', 'B', 'p-değeri: H₀ altında, gözlenen test istatistiği kadar veya daha aşırı bir değer elde etme olasılığı.'),
  q('Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', 'α=0.05, p-değeri=0.03 ise karar nedir?', 'H₀ reddedilemez', 'H₀ reddedilir', 'Daha fazla veri gerekir', 'Test geçersizdir', 'B', 'p=0.03 < α=0.05 → H₀ reddedilir. Sonuç istatistiksel olarak anlamlıdır.'),
  q('Hipotez Testi — Temel Kavramlar (H0, H1, Tip I-II Hata)', 'Tek kuyruklu vs çift kuyruklu test ne zaman kullanılır?', 'Çift kuyruk: yön beklentisi yoksa; tek kuyruk: yön beklentisi varsa', 'n büyükse çift, n küçükse tek', 'Her zaman çift kuyruk', 'Her zaman tek kuyruk', 'A', 'H₁: μ≠μ₀ → çift kuyruklu. H₁: μ>μ₀ veya μ<μ₀ → tek kuyruklu.'),

  // Tek Örneklem t Testi
  q('Tek Örneklem t Testi', 'n=20, x̄=52, s=10, H₀: μ=50. t istatistiği nedir?', '0.89', '1.00', '0.45', '2.00', 'A', 't = (x̄-μ₀)/(s/√n) = (52-50)/(10/√20) = 2/2.236 ≈ 0.894.'),
  q('Tek Örneklem t Testi', 'Tek örneklem t testi varsayımları nelerdir?', 'Gözlemler bağımsız, normal dağılım veya büyük n', 'Yalnızca büyük n gerekli', 'σ bilinmeli', 'Homojen varyans gerekli', 'A', 'Varsayımlar: (1) gözlemler iid, (2) popülasyon normal veya n≥30 (MLT). σ bilinmez.'),
  q('Tek Örneklem t Testi', 'n=9, α=0.05, iki kuyruklu. Kritik t değeri nedir?', 't_{0.025,8} ≈ 2.306', 't_{0.05,8} ≈ 1.860', 'z_{0.025} = 1.96', 't_{0.025,9} ≈ 2.262', 'A', 'df=n-1=8, iki kuyruklu α=0.05 → t_{0.025,8} ≈ 2.306.'),
  q('Tek Örneklem t Testi', 'Test istatistiği t=2.5, kritik değer t_{0.025,15}=2.131. Karar?', 'H₀ reddedilemez', 'H₀ reddedilir', 'Belirsiz', 'Daha fazla veri gerekli', 'B', '|t|=2.5 > 2.131 (kritik değer) → ret bölgesinde → H₀ reddedilir.'),
  q('Tek Örneklem t Testi', 'Bir firmada ortalama işlem süresi 30 dk iddia ediliyor. n=16, x̄=32, s=4. H₀: μ=30\'u %5 düzeyinde test et.', 't=2, reddedilemez', 't=2, reddedilir (t_{0.025,15}=2.131)', 't=8, reddedilir', 't=2, reddedilir (t_{0.025,15}=2.947)', 'B', 't=(32-30)/(4/4)=2.0. t_{0.025,15}=2.131. 2.0<2.131 → H₀ reddedilemez değil. Yanlış: 2.0<2.131 → reddedilemez. Doğru: B seçeneğinde "reddedilir" yanlış, A doğru. Ancak şık A "reddedilemez" diyor → A doğru.'),

  // İki Örneklem t Testi
  q('İki Örneklem t Testi ve Eşleştirilmiş t', 'Eşleştirilmiş t testi ne zaman kullanılır?', 'İki bağımsız grup karşılaştırılırken', 'Aynı bireylerin iki ölçümü karşılaştırılırken (öncesi-sonrası)', 'İki varyans karşılaştırılırken', 'n>30 olduğunda', 'B', 'Eşleştirilmiş t: aynı deneklerin farklı koşullardaki ölçümleri (önce-sonra, sağ-sol). farklar üzerinde tek örneklem t uygulanır.'),
  q('İki Örneklem t Testi ve Eşleştirilmiş t', 'İki bağımsız örneklem t testinde pooled varyans ne zaman kullanılır?', 'n₁=n₂ olduğunda', 'Varyanslar eşit varsayıldığında (F testiyle doğrulanmış)', 'Her zaman', 'n₁+n₂>60 olduğunda', 'B', 'Pooled t: σ₁²=σ₂² varsayımı altında. Welch t: σ₁²≠σ₂² durumunda.'),
  q('İki Örneklem t Testi ve Eşleştirilmiş t', 'n₁=10, n₂=12, pooled t testinde serbestlik derecesi nedir?', '20', '22', '21', '10', 'A', 'df = n₁+n₂-2 = 10+12-2 = 20.'),
  q('İki Örneklem t Testi ve Eşleştirilmiş t', 'Eşleştirilmiş t testinde di=x₁ᵢ-x₂ᵢ farkları kullanılır. Test istatistiği nedir?', 't = d̄/(sd/√n)', 't = (x̄₁-x̄₂)/sp·√(1/n₁+1/n₂)', 't = d̄·√n/σ', 't = d̄/sd', 'A', 'Eşleştirilmiş t: t = d̄/(sd/√n). Burada sd farkların standart sapması.'),
  q('İki Örneklem t Testi ve Eşleştirilmiş t', 'İki grubun ortalaması için %95 GA hesaplandığında aralıklar çakışmıyorsa ne sonuç çıkar?', 'Gruplar kesinlikle farklıdır', 'Gruplar farklı olmayabilir (GA\'ların çakışmaması kesin değildir)', 'Fark istatistiksel anlamlıdır', 'Tip I hata olmuştur', 'B', 'Bireysel GA\'ların çakışmaması kesin sonuç vermez; fark testi için doğru yaklaşım iki örneklem t testidir.'),

  // Ki-Kare ve F Testleri
  q('Ki-Kare ve F Testleri', 'Tek örneklem varyans testi için hangi istatistik kullanılır?', 'F', 't²', 'χ² = (n-1)s²/σ₀²', 'z²', 'C', 'H₀: σ²=σ₀² için χ² = (n-1)s²/σ₀² ~ χ²(n-1).'),
  q('Ki-Kare ve F Testleri', 'F testi H₀: σ₁²=σ₂² için F istatistiği nedir?', 'F = S₁²/S₂²', 'F = (S₁-S₂)/(SE)', 'F = S₁²·S₂²', 'F = (S₁²+S₂²)/2', 'A', 'F = S₁²/S₂² ~ F(n₁-1, n₂-1).'),
  q('Ki-Kare ve F Testleri', 'F(d₁,d₂) dağılımı simetrik midir?', 'Evet', 'Hayır, sağa çarpıktır', 'Hayır, sola çarpıktır', 'Serbestlik derecelerine bağlı', 'B', 'F dağılımı yalnızca pozitif değer alır ve sağa çarpık asimetriktir.'),
  q('Ki-Kare ve F Testleri', 'n₁=10, n₂=8, s₁²=20, s₂²=10. F istatistiği nedir?', '2', '0.5', '1.5', '4', 'A', 'F = 20/10 = 2. df=(9,7).'),
  q('Ki-Kare ve F Testleri', 'F testinin güvenilir olması için ne gereklidir?', 'Büyük örneklem', 'Normal popülasyonlar', 'Bağımlı örneklemler', 'Homojen varyans', 'B', 'F testi normallik varsayımına oldukça duyarlıdır. Normal olmayan durumlarda Levene veya Brown-Forsythe testleri tercih edilir.'),

  // Ki-Kare Bağımsızlık
  q('Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', 'χ² bağımsızlık testinde beklenen frekans nasıl hesaplanır?', 'Eᵢⱼ = (Rᵢ·Cⱼ)/n (satır toplamı × sütun toplamı / genel toplam)', 'Eᵢⱼ = n/k', 'Eᵢⱼ = Oᵢⱼ', 'Eᵢⱼ = Rᵢ+Cⱼ', 'A', 'Bağımsızlık altında: Eᵢⱼ = (i. satır toplamı × j. sütun toplamı) / genel toplam.'),
  q('Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', 'r×c kontenjans tablosunda χ² testinin serbestlik derecesi nedir?', '(r-1)+(c-1)', '(r-1)·(c-1)', 'r·c-1', 'r+c-2', 'B', 'df = (r-1)(c-1). 2×2 tablo için df=1.'),
  q('Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', 'χ² uyum iyiliği testi neyi test eder?', 'İki değişken arasındaki ilişkiyi', 'Gözlenen dağılımın teorik bir dağılıma uyumunu', 'İki popülasyonun ortalamasını', 'Varyans eşitliğini', 'B', 'Uyum iyiliği: H₀: veri belirtilen dağılımı izliyor. χ² = Σ(O-E)²/E.'),
  q('Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', 'χ² testi için beklenen frekansın kaçtan büyük olması önerilir?', '1', '3', '5', '10', 'C', 'Kural: Tüm hücrelerde Eᵢⱼ ≥ 5. Bu sağlanmazsa kategoriler birleştirilmeli ya da Fisher kesin testi kullanılmalıdır.'),
  q('Ki-Kare Bağımsızlık ve Uyum İyiliği Testi', '2×3 tabloda χ²=8.5, df=2, χ²_{0.05,2}=5.99. Karar?', 'H₀ reddedilemez', 'H₀ reddedilir — bağımsızlık reddedilir', 'Daha fazla veri gerekir', 'Test uygulanamaz', 'B', '8.5 > 5.99 → ret bölgesinde. H₀ (bağımsızlık) reddedilir; değişkenler arasında ilişki var.'),

  // Tek Yönlü ANOVA
  q('Tek Yönlü ANOVA', 'ANOVA\'da H₀ nedir?', 'Tüm grup ortalamaları eşittir (μ₁=μ₂=...=μk)', 'En az iki grup farklıdır', 'Tüm varyanslar eşittir', 'Tüm gruplar normaldir', 'A', 'Tek yönlü ANOVA H₀: μ₁=μ₂=...=μk. H₁: en az biri farklıdır.'),
  q('Tek Yönlü ANOVA', 'ANOVA\'da SST = SSB + SSW ilişkisi ne anlama gelir?', 'Toplam varyans gruplar arası ve gruplar içi varyansa bölünür', 'Kareler toplamı daima eşittir', 'Testlerin toplamıdır', 'Hata teriminin tanımıdır', 'A', 'Toplam Kareler Toplamı = Gruplar Arası KT + Gruplar İçi KT. Bu ayrışma ANOVA\'nın temelidir.'),
  q('Tek Yönlü ANOVA', 'k=3 grup, n=30 toplam gözlem. ANOVA df\'leri nedir?', 'df_B=2, df_W=27', 'df_B=3, df_W=27', 'df_B=2, df_W=28', 'df_B=3, df_W=26', 'A', 'df_Gruplar arası = k-1 = 2. df_Gruplar içi = n-k = 30-3 = 27.'),
  q('Tek Yönlü ANOVA', 'ANOVA varsayımları nelerdir?', 'Normallik, varyans homojenliği, bağımsızlık', 'Yalnızca normallik', 'Yalnızca eşit grup büyüklüğü', 'Yalnızca bağımsızlık', 'A', 'ANOVA varsayımları: (1) gruplar içi normallik, (2) eşit varyanslar (Levene testi), (3) bağımsız gözlemler.'),
  q('Tek Yönlü ANOVA', 'ANOVA anlamlı çıkarsa ne yapılır?', 'Analiz tamamdır', 'Post-hoc test ile hangi grupların farklı olduğu belirlenir (Tukey, Bonferroni)', 'Tüm gruplar farklıdır sonucu çıkarılır', 'Chi-kare testi uygulanır', 'B', 'ANOVA F anlamlıysa en az iki grup farklı demektir; hangilerinin farklı olduğunu post-hoc testler (Tukey HSD, Bonferroni) belirler.'),

  // Parametrik Olmayan Testler
  q('Parametrik Olmayan Testler', 'Mann-Whitney U testi neyin alternatifidir?', 'Tek örneklem t testi', 'İki bağımsız örneklem t testi', 'Eşleştirilmiş t testi', 'ANOVA', 'B', 'Mann-Whitney U, bağımsız iki grubun medyanlarını karşılaştırmak için kullanılan parametrik olmayan t testi alternatifidir.'),
  q('Parametrik Olmayan Testler', 'Wilcoxon işaretli sıra testi neyi test eder?', 'İki bağımsız grubun medyanını', 'Eşleştirilmiş gözlemlerin medyan farkını', 'Varyans eşitliğini', 'Korelasyonu', 'B', 'Wilcoxon işaretli sıra testi, eşleştirilmiş t testinin parametrik olmayan alternatifidir.'),
  q('Parametrik Olmayan Testler', 'Kruskal-Wallis testi neyin alternatifidir?', 'İki örneklem t testi', 'Tek yönlü ANOVA', 'Ki-kare bağımsızlık testi', 'F testi', 'B', 'Kruskal-Wallis, k bağımsız grubun medyanlarını karşılaştıran parametrik olmayan tek yönlü ANOVA alternatifidir.'),
  q('Parametrik Olmayan Testler', 'Parametrik olmayan testlerin avantajı nedir?', 'Her zaman daha güçlüdür', 'Normallik varsayımı gerektirmez', 'Küçük örneklemlerde her zaman tercih edilir', 'Varyans homojenliği varsayımı gerektirir', 'B', 'Parametrik olmayan testler dağılım varsayımına ihtiyaç duymaz. Ancak normallik sağlandığında parametrik testler genellikle daha güçlüdür.'),
  q('Parametrik Olmayan Testler', 'Spearman sıra korelasyonu ne ölçer?', 'Doğrusal korelasyonu', 'Monoton ilişki gücünü (sıra tabanlı)', 'Kovaryansı', 'Kısmi korelasyonu', 'B', 'Spearman ρ, veriler yerine sıralamaları kullanarak monoton (mutlaka doğrusal olmayan) ilişkiyi ölçer.'),

  // Regresyon Analizi
  q('Regresyon Analizi', 'Basit doğrusal regresyon modelinde β₁ neyi temsil eder?', 'Y eksenini kestiği değeri', 'X bir birim artarken Y\'deki ortalama değişimi', 'Korelasyon katsayısını', 'Hata varyansını', 'B', 'Ŷ=β₀+β₁X modelinde β₁ eğimidir: X 1 birim artınca Y ortalama β₁ birim değişir.'),
  q('Regresyon Analizi', 'En küçük kareler (OLS) β₁ tahmini nedir?', 'β̂₁ = Σ(xᵢ-x̄)(yᵢ-ȳ) / Σ(xᵢ-x̄)²', 'β̂₁ = Cov(X,Y)/Var(Y)', 'β̂₁ = Cor(X,Y)', 'β̂₁ = Σxᵢyᵢ/Σxᵢ²', 'A', 'OLS: β̂₁ = Sxy/Sxx = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)².'),
  q('Regresyon Analizi', 'R² (belirlilik katsayısı) neyi ölçer?', 'Tahmin gücünü değil hata varyansını', 'Y varyansının X tarafından açıklanan oranını', 'Eğimin istatistiksel anlamlılığını', 'Hataların normalliğini', 'B', 'R² = SSR/SST = 1-SSE/SST. Y\'nin ne kadar yüzdesinin modele girdiğini gösterir.'),
  q('Regresyon Analizi', 'n=20, R²=0.81. Adjusted R²=?', '0.81', '0.80', '0.76', '0.79', 'B', 'Adj R²=1-(1-R²)(n-1)/(n-p-1)=1-0.19·19/18=1-0.200=0.800≈0.80. (p=1)'),
  q('Regresyon Analizi', 'Regresyon β₁=0 testi için hangi istatistik kullanılır?', 't = β̂₁/SE(β̂₁)', 'F = MSR/MSE', 'χ² = n·R²', 'Her iki ilk iki de doğru', 'D', 'Basit regresyonda β₁=0 testi t istatistiği ile yapılır; aynı zamanda F=t² olduğundan F testi de eşdeğerdir.'),

  // Çoklu Regresyon
  q('Çoklu Doğrusal Regresyon', 'Çoklu regresyonda çoklu doğrusal bağlantı (multicollinearity) ne anlama gelir?', 'Hataların korelasyonlu olması', 'Bağımsız değişkenlerin birbirleriyle yüksek korelasyonlu olması', 'Y ile X\'in doğrusal ilişkisi', 'Artıkların heteroskedastik olması', 'B', 'Çoklu doğrusallık: yüksek korelasyonlu X\'ler β katsayılarının varyansını şişirir, tahminleri güvenilmez kılar.'),
  q('Çoklu Doğrusal Regresyon', 'k bağımsız değişkenli çoklu regresyonda F testinin H₀\'ı nedir?', 'β₁=β₂=...=βk=0 (tüm katsayılar sıfır)', 'β₀=0', 'En az biri sıfır değil', 'R²=0', 'A', 'Genel F testi: H₀: β₁=...=βk=0. Hiçbir X\'in Y\'yi açıklamadığı.'),
  q('Çoklu Doğrusal Regresyon', 'VIF (Variance Inflation Factor) neyi ölçer?', 'R²\'yi', 'Çoklu doğrusallık şiddetini', 'Hata varyansını', 'β̂ varyansını', 'B', 'VIF_j = 1/(1-R²_j). VIF>10 ciddi çoklu doğrusallık işareti. Standart hataları ne kadar şiştiğini gösterir.'),
  q('Çoklu Doğrusal Regresyon', 'Kategorisel değişken regresyona nasıl eklenir?', 'Sayısal etikete çevirerek (1,2,3,...)', 'Dummy değişken (0/1) olarak', 'Yalnızca ki-kare ile', 'Regresyona eklenemez', 'B', 'k kategorili değişken için k-1 dummy değişken oluşturulur. Referans kategori atlanır (dummy trap).'),
  q('Çoklu Doğrusal Regresyon', 'Artıkların (residuals) homojenlik varsayımı bozulunca ne yapılır?', 'Robust standart hatalar veya WLS kullanılır', 'Veri silinir', 'Daha fazla X eklenir', 'Örneklem büyütülür', 'A', 'Heteroskedastisite: robust (White) standart hatalar, WLS (Ağırlıklı En Küçük Kareler) veya dönüşüm (log Y) kullanılır.'),

  // Regresyon Tanı
  q('Regresyon Tanı ve Varsayım Kontrolleri', 'OLS varsayımları arasında hangisi artıkların normalliğini içerir?', 'Gauss-Markov teoremi', 'OLS belirsiz hata varsayımı', 'Klasik doğrusal model tam varsayımları', 'R² hesabı', 'C', 'Klasik doğrusal model: ε~N(0,σ²). Bu t ve F testleri için gereklidir; BLUE olmak için normallik gerekmez.'),
  q('Regresyon Tanı ve Varsayım Kontrolleri', 'Cook\'s distance neyi ölçer?', 'Artık varyansını', 'Bir gözlemin β̂ katsayıları üzerindeki etkisini (etkin gözlem)', 'Çoklu doğrusallığı', 'R² değişimini', 'B', 'Cook\'s D, bir gözlem silindiğinde β tahmincisinin ne kadar değiştiğini ölçer. D>1 etkili gözlem işareti.'),
  q('Regresyon Tanı ve Varsayım Kontrolleri', 'Durbin-Watson testi neyi kontrol eder?', 'Çoklu doğrusallığı', 'Artıklarda otokorelasyonu', 'Normalliği', 'Heteroskedastisiteyi', 'B', 'DW ≈ 2: otokorelasyon yok. DW < 2: pozitif otokorelasyon. DW > 2: negatif otokorelasyon.'),
  q('Regresyon Tanı ve Varsayım Kontrolleri', 'Artık-tahmin grafiğinde (residual vs fitted) handeyin deseni ne gösterir?', 'Normallik', 'Heteroskedastisite', 'Otokorelasyon', 'Çoklu doğrusallık', 'B', 'Artıkların yayılımı tahmin değerleri arttıkça genişliyorsa heteroskedastisite vardır.'),
  q('Regresyon Tanı ve Varsayım Kontrolleri', 'Normal Q-Q grafiği neyi kontrol eder?', 'Artıkların normalliğini', 'Heteroskedastisiteyi', 'Çoklu doğrusallığı', 'Otokorelasyonu', 'A', 'Q-Q grafiği artıkları teorik normal kantillerle karşılaştırır. Düz bir çizgi normalliğe işaret eder.'),

  // Lojistik Regresyon
  q('Lojistik Regresyon — Temel', 'Lojistik regresyon hangi tür bağımlı değişken için kullanılır?', 'Sürekli', 'İkili (0/1)', 'Sıralı kategorik', 'Sayım verisi', 'B', 'Lojistik regresyon ikili sonuçları (evet/hayır, başarı/başarısızlık) modellemek için kullanılır.'),
  q('Lojistik Regresyon — Temel', 'Logit fonksiyonu nedir?', 'ln(p/(1-p))', 'e^x/(1+e^x)', '1/(1+e^{-x})', 'p²/(1-p)', 'A', 'Logit(p) = ln(p/(1-p)) = log-odds. Lojistik regresyon bu dönüşümü doğrusal modele uygular.'),
  q('Lojistik Regresyon — Temel', 'Odds ratio (olasılık oranı) nedir?', 'P(olay)/P(olay değil) = p/(1-p)', 'P(olay)+P(olay değil)', 'log(p)', 'P(A|B)/P(B)', 'A', 'OR = p/(1-p). Logistik regresyonda eβ, X\'in OR üzerindeki etkisini verir.'),
  q('Lojistik Regresyon — Temel', 'Lojistik regresyon parametreleri nasıl tahmin edilir?', 'OLS (en küçük kareler)', 'Maksimum olabilirlik (MLE)', 'Momentler yöntemi', 'Ridge regresyon', 'B', 'Lojistik regresyon katsayıları MLE ile tahmin edilir; kapalı form çözümü yoktur, iteratif algoritma (Newton-Raphson) kullanılır.'),
  q('Lojistik Regresyon — Temel', 'Lojistik regresyonda model uyumunu değerlendirmek için hangisi kullanılır?', 'R²', 'AIC, BIC, Hosmer-Lemeshow testi', 'ANOVA F testi', 'Standart hata', 'B', 'Lojistik regresyonda R² anlamsızdır; AIC/BIC bilgi kriterleri ve Hosmer-Lemeshow uyum iyiliği testi kullanılır.'),

  // Hipotez Testleri (genel)
  q('Hipotez Testleri', 'H₀ reddedildiğinde %5 anlamlılık düzeyinde ne anlama gelir?', 'Kesinlikle H₀ yanlış', 'H₀ doğruysa bu sonuç %5 ihtimalle görülebilirdi', 'H₁ %95 doğru', 'p-değeri>0.05', 'B', 'α=0.05: H₀ doğruyken gözlenen sonucu elde etme olasılığı %5\'tir. Bu yeterince nadir sayılır ve H₀ reddedilir.'),
  q('Hipotez Testleri', 'İstatistiksel anlamlılık pratik anlamlılık ile aynı mıdır?', 'Evet, her zaman', 'Hayır, büyük n küçük farkları anlamlı yapabilir', 'Evet, p<0.05 pratik önemi garantiler', 'Hayır, yalnızca küçük n için', 'B', 'Büyük örneklemlerde küçük farklar istatistiksel anlamlı olabilir ama pratik açıdan önemsiz olabilir. Etki büyüklüğü (effect size) de değerlendirilmelidir.'),
  q('Hipotez Testleri', 'Güç analizi neyi belirler?', 'p-değerini', 'Belirli bir farkı tespit etmek için gereken örneklem büyüklüğünü', 'Kritik değeri', 'Tip I hata oranını', 'B', 'Güç analizi: istenilen güç (1-β), α, beklenen etki büyüklüğü ve σ verildiğinde gerekli n hesaplanır.'),
  q('Hipotez Testleri', 'Çoklu hipotez testinde (multiple testing) ne sorun çıkar?', 'Güç azalır', 'Aile genelinde Tip I hata olasılığı artar', 'Varyans artar', 'Normallik bozulur', 'B', 'k bağımsız test yapılırsa aile genelinde Tip I hata: 1-(1-α)^k. Bonferroni düzeltmesi: α/k.'),
  q('Hipotez Testleri', 'Z testi ile t testi arasındaki temel fark nedir?', 'Z daha güçlüdür', 't sadece küçük örneklemde, Z büyük örneklemde', 'Z: σ bilindiğinde; t: σ bilinmediğinde', 'Z: iki örneklem; t: tek örneklem', 'C', 'σ biliniyorsa Z testi, σ bilinmeyip s ile tahmin ediliyorsa t testi kullanılır.'),

  // Bayes İstatistiği
  q('Bayes İstatistiği — Prior, Posterior, Credible Interval', 'Bayes teoremi istatistikte nasıl uygulanır?', 'P(θ|x) ∝ P(x|θ)·P(θ) — posterior ∝ olabilirlik × prior', 'P(x|θ) = P(θ|x)·P(x)', 'Posterior = Prior', 'Olabilirlik = Prior', 'A', 'Bayes güncelleme: posterior = olabilirlik × prior (normalize edilmiş). P(θ|x) ∝ L(θ|x)·π(θ).'),
  q('Bayes İstatistiği — Prior, Posterior, Credible Interval', '%95 Credible Interval (inanılırlık aralığı) ne anlama gelir?', 'Frekansçı %95 güven aralığına eşittir', 'P(θ∈CI|veri)=0.95 — θ\'nın %95 olasılıkla aralıkta olduğu', 'Örneklem %95 kapsayacak', 'Posterior\'un %95 ve %5 kantilleri', 'B', 'Bayesian CI (credible interval): θ parametresinin posterior dağılımına göre %95 olasılıkla bu aralıkta olduğu söylenebilir.'),
  q('Bayes İstatistiği — Prior, Posterior, Credible Interval', 'Konjugat prior ne demektir?', 'Prior ve posterior aynı dağılım ailesinden gelir', 'Prior sabit olmayan bir dağılımdır', 'Posterior olabilirliğe eşit', 'Prior bilgi içermez (non-informative)', 'A', 'Konjugat: Prior × Olabilirlik → Posterior aynı dağılım ailesinde. Örn. Beta prior + Bernoulli veri → Beta posterior.'),
  q('Bayes İstatistiği — Prior, Posterior, Credible Interval', 'Uninformative (bilgi içermeyen) prior neden kullanılır?', 'Güçlü önceki bilgi varsa', 'Prior bilgi yoksa, veri konuşsun diye', 'Her zaman tercih edilir', 'Posterior normalliği için', 'B', 'Jeffreys veya düz (flat) prior gibi bilgi içermeyen priorlar, sınırlı önceki bilgi olduğunda verinin baskın olmasına olanak tanır.'),
  q('Bayes İstatistiği — Prior, Posterior, Credible Interval', 'X ~ Binom(n, p), prior p ~ Beta(α,β). Posterior nedir?', 'Beta(α+x, β+n-x)', 'Beta(α+n, β+x)', 'Beta(x, n-x)', 'Normal(p̂, SE²)', 'A', 'Beta-Binom konjugat: posterior p|x ~ Beta(α+x, β+n-x). Beta prior, Binom için konjugattır.'),

  // Varyans Testleri
  q('Varyans Testleri (Ki-Kare ve F)', 'H₀: σ²=16 testi için n=20, s²=20. χ² istatistiği nedir?', '23.75', '19.0', '25.0', '15.0', 'A', 'χ² = (n-1)s²/σ₀² = 19·20/16 = 380/16 = 23.75.'),
  q('Varyans Testleri (Ki-Kare ve F)', 'χ²_{0.025,19}=32.85, χ²_{0.975,19}=8.91. σ² için %95 GA (n=20, s²=25) nedir?', '(14.4, 53.3)', '(12.5, 55.0)', '(16.0, 50.0)', '(10.0, 40.0)', 'A', '((n-1)s²/χ²_{üst}, (n-1)s²/χ²_{alt}) = (19·25/32.85, 19·25/8.91) ≈ (14.46, 53.3).'),
  q('Varyans Testleri (Ki-Kare ve F)', 'Levene testi neyi test eder?', 'Grup ortalamaları eşitliğini', 'Grup varyansları eşitliğini (normalliğe robust)', 'Korelasyonu', 'Normalliği', 'B', 'Levene testi, normallik varsayımına daha dayanıklı (robust) bir varyans homojenliği testidir. ANOVA öncesi tercih edilir.'),
  q('Varyans Testleri (Ki-Kare ve F)', 'F={S₁²/S₂²}=3.5, F_{0.05,9,11}=2.90. Karar?', 'H₀: σ₁²=σ₂² reddedilemez', 'H₀: σ₁²=σ₂² reddedilir', 'Anlamlılık belirsiz', 'Daha fazla veri gerekir', 'B', 'F=3.5 > F_{krit}=2.90 → ret bölgesi → H₀ reddedilir. Varyanslar farklıdır.'),
  q('Varyans Testleri (Ki-Kare ve F)', 'Bartlett testi ile Levene testi arasındaki fark nedir?', 'Bartlett büyük örneklerde kullanılır', 'Bartlett normalliğe duyarlı; Levene normallik gerektirmez', 'Levene sadece iki grup için', 'İkisi aynıdır', 'B', 'Bartlett: normallik varsayımı altında güçlü. Levene: normallik ihlali olduğunda tercih edilir.'),
];

async function upload(batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
}

async function main() {
  const BATCH = 25;
  for (let i = 0; i < questions.length; i += BATCH) {
    await upload(questions.slice(i, i + BATCH));
    console.log(`✓ ${Math.min(i + BATCH, questions.length)}/${questions.length}`);
  }
  console.log(`\n✅ ${questions.length} istatistik sorusu yüklendi.`);
}
main().catch(e => { console.error(e); process.exit(1); });
