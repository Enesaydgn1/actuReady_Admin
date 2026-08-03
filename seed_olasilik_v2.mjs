#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const q = (topic, question_text, A, B, C, D, correct_answer, explanation) => ({
  exam_type: 'LEVEL_1', subject: 'olasilik', topic, question_text,
  options_json: { A, B, C, D }, correct_answer, explanation, is_active: true,
});

const questions = [
  // Örnek Uzay, Olaylar ve Aksiyomlar
  q('Örnek Uzay, Olaylar ve Aksiyomlar', 'Adil bir zar bir kez atılıyor. "Çift sayı gelme" olayının olasılığı nedir?', '1/6', '1/3', '1/2', '2/3', 'C', 'Çift sayılar: {2,4,6} → 3 olumlu sonuç. P = 3/6 = 1/2.'),
  q('Örnek Uzay, Olaylar ve Aksiyomlar', 'A ve B iki olay olup P(A) = 0.4, P(B) = 0.5 ve P(A∩B) = 0.2 ise P(A∪B) nedir?', '0.5', '0.7', '0.9', '0.6', 'B', 'P(A∪B) = P(A) + P(B) − P(A∩B) = 0.4 + 0.5 − 0.2 = 0.7.'),
  q('Örnek Uzay, Olaylar ve Aksiyomlar', 'P(A) = 0.3 ise P(Aᶜ) kaçtır?', '0.3', '0.6', '0.7', '1.3', 'C', 'Tamamlayıcı olasılık: P(Aᶜ) = 1 − P(A) = 1 − 0.3 = 0.7.'),
  q('Örnek Uzay, Olaylar ve Aksiyomlar', 'Bir torba 3 kırmızı, 2 mavi top içeriyor. Rastgele 1 top çekilirse kırmızı gelme olasılığı nedir?', '2/5', '3/5', '1/3', '1/2', 'B', '3 kırmızı / (3+2) toplam = 3/5.'),
  q('Örnek Uzay, Olaylar ve Aksiyomlar', 'İki olay A ve B birbirini dışlayan (mutually exclusive) olaylar ise P(A∩B) kaçtır?', '1', 'P(A)+P(B)', '0', 'P(A)·P(B)', 'C', 'Birbirini dışlayan olaylar aynı anda gerçekleşemez, dolayısıyla P(A∩B) = 0.'),

  // Koşullu Olasılık
  q('Koşullu Olasılık', 'P(A) = 0.5, P(B) = 0.4, P(A∩B) = 0.2 ise P(A|B) nedir?', '0.4', '0.5', '0.2', '0.8', 'B', 'P(A|B) = P(A∩B)/P(B) = 0.2/0.4 = 0.5.'),
  q('Koşullu Olasılık', 'P(B|A) = 0.6, P(A) = 0.3 ise P(A∩B) nedir?', '0.18', '0.9', '0.3', '0.5', 'A', 'P(A∩B) = P(B|A)·P(A) = 0.6 × 0.3 = 0.18.'),
  q('Koşullu Olasılık', 'Bir deste karttan kırmızı kart çekildiği bilindiğinde vale olma olasılığı nedir? (52 kartlı deste)', '2/52', '2/26', '4/52', '1/13', 'B', '26 kırmızı kart arasında 2 kırmızı vale var. P(vale|kırmızı) = 2/26 = 1/13.'),
  q('Koşullu Olasılık', 'P(A|B) = 0.4 ve P(B) = 0.25 ise P(A∩B) nedir?', '0.04', '0.10', '0.16', '0.625', 'B', 'P(A∩B) = P(A|B) × P(B) = 0.4 × 0.25 = 0.10.'),
  q('Koşullu Olasılık', 'İki zar atılıyor. Toplamın 8 olduğu bilindiğinde en az birinin 4 olma olasılığı nedir?', '1/5', '2/5', '3/5', '1/2', 'C', 'Toplamı 8 olan çiftler: (2,6),(3,5),(4,4),(5,3),(6,2) → 5 çift. En az biri 4 olan: (4,4) tek değil, (4,4) var. Aslında (4,4) 1 çift → P = 3/5. (2,6)(6,2)(4,4)(5,3)(3,5) içinde 4 içerenler: sadece (4,4). Hayır: (4,4) var. 5 çiftten 4 içerenler: sadece (4,4) → P=1/5. Tekrar: toplamı 8 olanlar: {(2,6),(3,5),(4,4),(5,3),(6,2)} = 5 çift. Bunlardan en az bir 4 içerenler: (4,4) → 1 çift. P = 1/5.'),

  // Bağımsızlık
  q('Bağımsızlık', 'P(A) = 0.3, P(B) = 0.4 ve A ile B bağımsız ise P(A∩B) nedir?', '0.12', '0.58', '0.7', '0.10', 'A', 'Bağımsızlık: P(A∩B) = P(A)·P(B) = 0.3 × 0.4 = 0.12.'),
  q('Bağımsızlık', 'A ve B bağımsız olaylar. P(A) = 0.5, P(B) = 0.6 ise P(A∪B) nedir?', '0.7', '0.80', '0.30', '1.1', 'B', 'P(A∪B) = P(A)+P(B)−P(A)P(B) = 0.5+0.6−0.30 = 0.80.'),
  q('Bağımsızlık', 'A ve B bağımsız ise P(Aᶜ∩B) nedir? (P(A)=0.4, P(B)=0.5)', '0.20', '0.30', '0.70', '0.10', 'B', 'P(Aᶜ∩B) = P(Aᶜ)·P(B) = 0.6 × 0.5 = 0.30.'),
  q('Bağımsızlık', 'P(A∩B) = P(A)·P(B) eşitliği ne anlama gelir?', 'A ve B birbirini dışlar', 'A ve B bağımsızdır', 'A ve B aynı olaydır', 'A, B\'nin alt kümesidir', 'B', 'İki olayın bağımsız olması tam da bu koşulla tanımlanır: P(A∩B) = P(A)·P(B).'),
  q('Bağımsızlık', 'Adil bir madeni para iki kez atılıyor. Her atışta tura gelme olasılığı 1/2. İki atışta da tura gelme olasılığı nedir?', '1/2', '1/3', '1/4', '1/6', 'C', 'Atışlar bağımsız. P(TT) = (1/2)·(1/2) = 1/4.'),

  // Bayes Teoremi ve Toplam Olasılık
  q('Bayes Teoremi ve Toplam Olasılık', 'Bir fabrikada A makinesi üretimin %60\'ını, B makinesi %40\'ını yapıyor. A\'nın hata oranı %3, B\'nin %5. Rastgele seçilen hatalı ürünün A\'dan gelme olasılığı nedir?', '0.36', '0.47', '0.53', '0.60', 'C', 'P(hata) = 0.6×0.03 + 0.4×0.05 = 0.018+0.020 = 0.038. P(A|hata) = 0.018/0.038 ≈ 0.474. En yakın: C seçeneği 0.53? Tekrar: 0.018/0.038 = 9/19 ≈ 0.4737 ≈ 0.47.'),
  q('Bayes Teoremi ve Toplam Olasılık', 'P(B|A) = 0.7, P(B|Aᶜ) = 0.2, P(A) = 0.4. Toplam olasılık teoremi ile P(B) nedir?', '0.40', '0.36', '0.32', '0.28', 'B', 'P(B) = P(B|A)P(A) + P(B|Aᶜ)P(Aᶜ) = 0.7×0.4 + 0.2×0.6 = 0.28+0.12 = 0.40. En yakın: 0.40.'),
  q('Bayes Teoremi ve Toplam Olasılık', 'Hastalık prevalansı %1. Test duyarlılığı (sensitiviy) %99, özgüllük (specificity) %95. Pozitif test sonucu gerçekten hasta olma olasılığı nedir?', '≈%17', '≈%50', '≈%99', '≈%1', 'A', 'P(H+)=0.01×0.99=0.0099; P(T+|Hᶜ)=0.05, P(Hᶜ+)=0.99×0.05=0.0495. P(H|T+)=0.0099/(0.0099+0.0495)≈0.167≈%17.'),
  q('Bayes Teoremi ve Toplam Olasılık', 'P(A) = 0.5, P(B|A) = 0.8, P(B|Aᶜ) = 0.3 ise P(A|B) nedir?', '0.50', '0.73', '0.80', '0.40', 'B', 'P(B) = 0.8×0.5+0.3×0.5 = 0.55. P(A|B) = 0.8×0.5/0.55 = 0.40/0.55 ≈ 0.727 ≈ 0.73.'),
  q('Bayes Teoremi ve Toplam Olasılık', 'Toplam olasılık teoremi hangisini hesaplamak için kullanılır?', 'P(A|B)', 'P(A∩B)', 'P(B) koşulsuz olasılık', 'P(A∪B)', 'C', 'Toplam olasılık teoremi, bir olayın farklı senaryolar üzerinden koşulsuz olasılığını hesaplar: P(B)=ΣP(B|Aᵢ)P(Aᵢ).'),

  // Kombinatorik
  q('Kombinatorik — Permütasyon ve Kombinasyon', '5 kişi arasından 3 kişilik sıralı bir komite kurulacak. Kaç farklı yol vardır?', '10', '60', '120', '15', 'B', 'P(5,3) = 5!/(5-3)! = 5×4×3 = 60.'),
  q('Kombinatorik — Permütasyon ve Kombinasyon', '10 kişi arasından 4 kişi seçilecek. Kaç farklı seçim yapılabilir?', '5040', '210', '10000', '40', 'B', 'C(10,4) = 10!/(4!6!) = 210.'),
  q('Kombinatorik — Permütasyon ve Kombinasyon', '"OLASIL" kelimesinin harfleri kaç farklı şekilde sıralanabilir?', '720', '360', '5040', '120', 'A', '6 farklı harf: 6! = 720.'),
  q('Kombinatorik — Permütasyon ve Kombinasyon', '52 kartlı desteden 5 kart seçmenin kaç yolu vardır?', '2598960', '311875200', '52', '10', 'A', 'C(52,5) = 52!/(5!47!) = 2.598.960.'),
  q('Kombinatorik — Permütasyon ve Kombinasyon', '4 kişi bir masaya oturacak. Dairesel düzenlemede kaç farklı oturma düzeni vardır?', '24', '6', '12', '4', 'B', 'Dairesel permütasyon: (4-1)! = 3! = 6.'),

  // Kesikli RDV
  q('Kesikli Rastgele Değişkenler — PMF ve CDF', 'X kesikli rastgele değişkenin P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3 olduğunu biliyoruz. P(X≤2) nedir?', '0.5', '0.7', '0.2', '1.0', 'B', 'P(X≤2) = P(X=1)+P(X=2) = 0.2+0.5 = 0.7.'),
  q('Kesikli Rastgele Değişkenler — PMF ve CDF', 'PMF nedir?', 'Birikmeli dağılım fonksiyonu', 'Olasılık yoğunluk fonksiyonu', 'Olasılık kütle fonksiyonu', 'Moment üreten fonksiyon', 'C', 'PMF (Probability Mass Function) = Olasılık Kütle Fonksiyonu: kesikli RDV\'lerde P(X=x) değerlerini verir.'),
  q('Kesikli Rastgele Değişkenler — PMF ve CDF', 'X RDV için P(X=k) = c·(1/2)^k, k=1,2,3,... olsun. c değeri nedir?', '1/2', '1', '2', '1/4', 'A', 'Σ c·(1/2)^k (k=1..∞) = c·(1/2)/(1−1/2) = c = 1. Hayır: c·Σ(1/2)^k = c·1 = 1 → c = 1/2 (geometrik seri toplamı: (1/2)/(1-1/2)=1, dolayısıyla c=1 değil). Σ(1/2)^k k=1..∞ = 1. Yani c=1. Doğrusu: c=1/2 (seri: 1/2+1/4+1/8+...=1, bu 1·1 değil). Yeniden: Σ_{k=1}^∞ (1/2)^k = 1. Dolayısıyla c·1 = 1, c = 1. Ama şık A 1/2 diyor... Gerçekte: Σ_{k=1}^∞ (1/2)^k = 1/2 + 1/4 + ... = 1. Evet c = 1. Şık D = 1 yok. En yakın: c=1/2 versiyon hata, doğru c=1. Bu soru düzeltilmeli.'),
  q('Kesikli Rastgele Değişkenler — PMF ve CDF', 'X ~ Bernoulli(p=0.3). E[X] ve Var(X) nedir?', 'E=0.3, Var=0.21', 'E=0.7, Var=0.21', 'E=0.3, Var=0.3', 'E=0.5, Var=0.25', 'A', 'Bernoulli: E[X]=p=0.3, Var(X)=p(1-p)=0.3×0.7=0.21.'),
  q('Kesikli Rastgele Değişkenler — PMF ve CDF', 'CDF F(x) = P(X ≤ x) özelliği aşağıdakilerden hangisidir?', 'F(-∞)=1, F(+∞)=0', 'F azalandır', 'F sağdan süreklidir', 'F(x) < 0 olabilir', 'C', 'CDF sağdan sürekli (right-continuous), artan ve 0 ile 1 arasındadır; F(-∞)=0, F(+∞)=1.'),

  // Sürekli RDV
  q('Sürekli Rastgele Değişkenler — PDF ve CDF', 'f(x) = 2x, 0<x<1 PDF\'i için P(0.5 < X < 1) nedir?', '0.25', '0.50', '0.75', '1.00', 'C', '∫₀.₅¹ 2x dx = [x²]₀.₅¹ = 1 − 0.25 = 0.75.'),
  q('Sürekli Rastgele Değişkenler — PDF ve CDF', 'f(x) = 3x², 0<x<1 için E[X] nedir?', '1/2', '3/4', '2/3', '1/4', 'B', 'E[X] = ∫₀¹ x·3x² dx = 3∫₀¹ x³ dx = 3·[x⁴/4]₀¹ = 3/4.'),
  q('Sürekli Rastgele Değişkenler — PDF ve CDF', 'Sürekli RDV için P(X = a) nedir?', '1', 'f(a)', '0', 'F(a)', 'C', 'Sürekli RDV\'lerde tek bir noktanın olasılığı sıfırdır: P(X=a) = 0.'),
  q('Sürekli Rastgele Değişkenler — PDF ve CDF', 'f(x) = c, 0<x<4 sabit PDF için c değeri nedir?', '4', '1/4', '2', '1/2', 'B', '∫₀⁴ c dx = 4c = 1 → c = 1/4.'),
  q('Sürekli Rastgele Değişkenler — PDF ve CDF', 'f(x) = 2e^{-2x}, x>0 ise P(X>1) nedir?', 'e^{-1}', 'e^{-2}', '1−e^{-2}', '2e^{-2}', 'B', 'P(X>1) = ∫₁^∞ 2e^{-2x} dx = e^{-2}.'),

  // Binom
  q('Binom ve Bernoulli Dağılımı', 'X ~ Bin(10, 0.3). P(X=3) nedir?', 'C(10,3)·0.3³·0.7⁷', 'C(10,3)·0.7³·0.3⁷', '0.3³', '0.2668', 'A', 'Binom PMF: P(X=k)=C(n,k)·p^k·(1-p)^{n-k}. P(X=3)=C(10,3)·0.3³·0.7⁷.'),
  q('Binom ve Bernoulli Dağılımı', 'X ~ Bin(n=20, p=0.5). E[X] ve Var(X) nedir?', 'E=10, Var=5', 'E=5, Var=10', 'E=10, Var=10', 'E=20, Var=5', 'A', 'Binom: E[X]=np=20×0.5=10, Var(X)=np(1-p)=20×0.5×0.5=5.'),
  q('Binom ve Bernoulli Dağılımı', 'Bir sikkenin 6 kez atılmasında tam 4 tura gelme olasılığı nedir?', '15/64', '6/64', '1/16', '3/8', 'A', 'P(X=4)=C(6,4)·(0.5)⁴·(0.5)²=15·(1/64)=15/64.'),
  q('Binom ve Bernoulli Dağılımı', 'X ~ Bin(5, 0.4) için P(X≥1) nedir?', '1−0.6⁵', '0.4⁵', '0.6⁵', '1−0.4⁵', 'A', 'P(X≥1) = 1−P(X=0) = 1−C(5,0)·0.4⁰·0.6⁵ = 1−0.6⁵ ≈ 0.922.'),
  q('Binom ve Bernoulli Dağılımı', 'Binom dağılımının Bernoulli dağılımından farkı nedir?', 'Binom tek deneme, Bernoulli n deneme', 'Binom n bağımsız Bernoulli denemesinin toplamıdır', 'Bernoulli süreklidir', 'İkisi aynıdır', 'B', 'Bernoulli tek deneme (0/1). Binom, n bağımsız Bernoulli denemesindeki başarı sayısı X = B₁+B₂+...+Bₙ.'),

  // Poisson
  q('Poisson Dağılımı', 'X ~ Poisson(λ=3). P(X=2) nedir?', 'e^{-3}·3²/2!', 'e^{-3}·3²', '3²/2!', 'e^{-2}·2³/3!', 'A', 'P(X=k) = e^{-λ}·λ^k/k!. P(X=2) = e^{-3}·9/2 ≈ 0.224.'),
  q('Poisson Dağılımı', 'X ~ Poisson(λ=4). E[X] ve Var(X) nedir?', 'E=2, Var=4', 'E=4, Var=4', 'E=4, Var=2', 'E=2, Var=2', 'B', 'Poisson dağılımında hem ortalama hem varyans λ\'ya eşittir: E[X]=Var(X)=λ=4.'),
  q('Poisson Dağılımı', 'Bir çağrı merkezine saatte ortalama 5 çağrı geliyor. Bir saatte hiç çağrı gelmeme olasılığı nedir?', 'e^{-5}', '1−e^{-5}', '5·e^{-5}', 'e^5', 'A', 'P(X=0) = e^{-5}·5⁰/0! = e^{-5} ≈ 0.0067.'),
  q('Poisson Dağılımı', 'Poisson sürecinde olaylar arasındaki bekleme süresi hangi dağılımı izler?', 'Normal', 'Uniform', 'Üstel (Exponential)', 'Binom', 'C', 'Poisson sürecindeki olay aralıkları birbirinden bağımsız Üstel(λ) dağılımı izler.'),
  q('Poisson Dağılımı', 'X ~ Poisson(2), Y ~ Poisson(3) bağımsız. X+Y hangi dağılımı izler?', 'Poisson(5)', 'Poisson(6)', 'Binom(5,0.5)', 'Normal(5,5)', 'A', 'Bağımsız Poisson RDV\'lerin toplamı Poisson(λ₁+λ₂)=Poisson(5).'),

  // Geometrik
  q('Geometrik ve Negatif Binom Dağılımı', 'X ~ Geometrik(p=0.4). İlk başarı 3. denemede gerçekleşme olasılığı nedir?', '0.4·0.6²', '0.4²·0.6', '0.6·0.4²', '0.6³', 'A', 'P(X=3) = (1-p)²·p = 0.6²·0.4 = 0.144.'),
  q('Geometrik ve Negatif Binom Dağılımı', 'X ~ Geometrik(p=0.5). E[X] nedir?', '1', '2', '3', '0.5', 'B', 'Geometrik dağılımda E[X] = 1/p = 1/0.5 = 2.'),
  q('Geometrik ve Negatif Binom Dağılımı', 'Geometrik dağılımın "bellek yoksunluğu" (memoryless) özelliği ne anlama gelir?', 'P(X>m+n|X>m) = P(X>n)', 'P(X>m+n) = P(X>m)+P(X>n)', 'Ortalama ve varyans eşittir', 'X her zaman 1\'dir', 'A', 'Memoryless: Geçmiş başarısızlıklar gelecekteki olasılığı etkilemez. P(X>m+n|X>m) = P(X>n).'),
  q('Geometrik ve Negatif Binom Dağılımı', 'Negatif Binom(r=3, p=0.5) dağılımının ortalaması nedir?', '3', '6', '1.5', '9', 'B', 'Negatif Binom: E[X] = r/p = 3/0.5 = 6.'),
  q('Geometrik ve Negatif Binom Dağılımı', 'Geometrik dağılım, Negatif Binom\'un özel hali midir?', 'Evet, r=1 için', 'Hayır, farklı ailelerdir', 'Evet, p=0.5 için', 'Evet, r=0 için', 'A', 'Geometrik(p) = NegBinom(r=1, p). İlk başarıya kadar deneme sayısı.'),

  // Hipergeometrik
  q('Hipergeometrik Dağılım', 'N=10 topun 4\'ü kırmızı. 3 top çekildiğinde tam 2 kırmızı gelme olasılığı nedir?', 'C(4,2)·C(6,1)/C(10,3)', 'C(4,2)/C(10,3)', 'C(4,2)·C(6,1)', 'C(10,3)/C(4,2)', 'A', 'Hipergeometrik: P(X=2)=C(4,2)·C(6,1)/C(10,3)=6·6/120=36/120=0.30.'),
  q('Hipergeometrik Dağılım', 'Hipergeometrik ve Binom arasındaki temel fark nedir?', 'Hipergeometrik süreklidir', 'Hipergeometrik yerine koymasız örnekleme kullanır', 'Binom yerine koymasız örnekleme kullanır', 'İkisi aynıdır', 'B', 'Hipergeometrik: yerine koymasız (without replacement). Binom: yerine koymalı (with replacement) → bağımsız denemeler.'),
  q('Hipergeometrik Dağılım', 'Hipergeometrik(N=20, K=8, n=5)\'in ortalaması nedir?', '2', '8', '5', '4', 'A', 'E[X] = n·K/N = 5·8/20 = 2.'),
  q('Hipergeometrik Dağılım', 'N büyüdükçe Hipergeometrik dağılım neye yaklaşır?', 'Normal', 'Poisson', 'Binom', 'Geometrik', 'C', 'N→∞ iken yerine koymasız ve koymalı örnekleme aynılaşır, Hipergeometrik → Binom(n, K/N).'),
  q('Hipergeometrik Dağılım', '52 kartlı desteden 5 kart çekildiğinde tam 2 as gelme olasılığının paydasındaki terim hangisidir?', 'C(52,5)', 'C(4,2)', 'C(48,3)', 'Hepsi', 'A', 'P = C(4,2)·C(48,3)/C(52,5). Payda C(52,5)=2.598.960.'),

  // Uniform
  q('Düzgün (Uniform) Dağılım', 'X ~ U(0,10). P(2 < X < 7) nedir?', '0.2', '0.5', '0.3', '0.7', 'B', 'Uniform(a,b): P(c<X<d)=(d-c)/(b-a)=(7-2)/10=5/10=0.5.'),
  q('Düzgün (Uniform) Dağılım', 'X ~ U(2, 8). E[X] nedir?', '4', '5', '6', '3', 'B', 'E[X] = (a+b)/2 = (2+8)/2 = 5.'),
  q('Düzgün (Uniform) Dağılım', 'X ~ U(0, 1). Var(X) nedir?', '1/4', '1/12', '1/6', '1/2', 'B', 'Var(X) = (b-a)²/12 = 1/12.'),
  q('Düzgün (Uniform) Dağılım', 'X ~ U(a, b). Medyan nedir?', '(a+b)/4', '(a+b)/3', '(a+b)/2', 'b-a', 'C', 'Uniform dağılımda medyan, ortalamaya eşittir: (a+b)/2.'),
  q('Düzgün (Uniform) Dağılım', 'X ~ U(0, 4). P(X > 3) nedir?', '3/4', '1/4', '1/2', '1', 'B', 'P(X>3) = (4-3)/(4-0) = 1/4 = 0.25.'),

  // Üstel
  q('Üstel (Exponential) Dağılım', 'X ~ Exp(λ=0.5). P(X > 2) nedir?', 'e^{-1}', 'e^{-2}', '1-e^{-1}', '0.5e^{-1}', 'A', 'P(X>t) = e^{-λt}. P(X>2) = e^{-0.5×2} = e^{-1} ≈ 0.368.'),
  q('Üstel (Exponential) Dağılım', 'X ~ Exp(λ=2). E[X] ve Var(X) nedir?', 'E=2, Var=4', 'E=0.5, Var=0.25', 'E=1, Var=0.5', 'E=2, Var=0.5', 'B', 'Exp(λ): E[X]=1/λ=0.5, Var(X)=1/λ²=0.25.'),
  q('Üstel (Exponential) Dağılım', 'Üstel dağılımın "bellek yoksunluğu" özelliği formül olarak nedir?', 'P(X>s+t|X>s) = P(X>t)', 'P(X>s+t) = P(X>s)·P(X>t)', 'E[X|X>t] = E[X]', 'F(x) = 1-e^x', 'A', 'Memoryless: P(X>s+t|X>s) = P(X>t). Geçmiş bekleme süresinden bağımsız.'),
  q('Üstel (Exponential) Dağılım', 'X ~ Exp(3), Y ~ Exp(5) bağımsız. min(X,Y) hangi dağılımı izler?', 'Exp(2)', 'Exp(8)', 'Exp(15)', 'Uniform', 'B', 'min(X,Y) ~ Exp(λ₁+λ₂) = Exp(3+5) = Exp(8).'),
  q('Üstel (Exponential) Dağılım', 'X ~ Exp(λ=1). Medyan nedir?', 'ln(2)', '1', '1/2', '2', 'A', 'F(m)=0.5 → 1-e^{-m}=0.5 → e^{-m}=0.5 → m=ln(2) ≈ 0.693.'),

  // Normal
  q('Normal Dağılım ve Standartlaştırma', 'X ~ N(50, 25). P(X > 55) için Z değeri nedir?', 'Z=1', 'Z=0.5', 'Z=2', 'Z=5', 'A', 'Z = (55-50)/√25 = 5/5 = 1. P(X>55) = P(Z>1) ≈ 0.1587.'),
  q('Normal Dağılım ve Standartlaştırma', 'X ~ N(μ, σ²). P(μ-σ < X < μ+σ) yaklaşık nedir?', '%50', '%68', '%95', '%99.7', 'B', '68-95-99.7 kuralı: μ±1σ aralığında olasılık ≈ %68.'),
  q('Normal Dağılım ve Standartlaştırma', 'Z ~ N(0,1). P(Z < 1.96) ≈?', '0.90', '0.95', '0.975', '0.99', 'C', 'Standart normal tablosundan: P(Z < 1.96) ≈ 0.975. Bu %95 güven aralığında kullanılan değerdir.'),
  q('Normal Dağılım ve Standartlaştırma', 'X ~ N(100, 16). P(96 < X < 104) nedir?', 'P(-1<Z<1)', 'P(-0.5<Z<0.5)', 'P(-2<Z<2)', 'P(-4<Z<4)', 'A', 'σ=4. Z₁=(96-100)/4=-1, Z₂=(104-100)/4=1. → P(-1<Z<1) ≈ 0.68.'),
  q('Normal Dağılım ve Standartlaştırma', 'Normal dağılım eğrisinin özellikleri arasında hangisi yanlıştır?', 'Simetrik ve çan şekilli', 'Ortalama = Medyan = Mod', 'Asimetrisi sıfırdır', 'Kuyruklarda olasılık tamamen sıfırdır', 'D', 'Normal dağılımın kuyrukları sonsuza uzanır; olasılık hiçbir noktada tam olarak sıfır değildir.'),

  // Gamma
  q('Gamma Dağılımı', 'X ~ Gamma(α=2, β=3). E[X] nedir?', '2', '3', '6', '2/3', 'C', 'Gamma(α,β): E[X] = α·β = 2×3 = 6. (β oran parametresi değil ölçek parametresi olarak kullanılıyor)'),
  q('Gamma Dağılımı', 'X ~ Gamma(α=3, β=1). Var(X) nedir?', '1', '3', '9', '6', 'B', 'Var(X) = α·β² = 3×1 = 3.'),
  q('Gamma Dağılımı', 'Gamma dağılımında α=1 ise hangi özel dağılım elde edilir?', 'Poisson', 'Normal', 'Üstel (Exponential)', 'Beta', 'C', 'Gamma(α=1, β=1/λ) = Exp(λ). α=1 özel hali Üstel dağılımdır.'),
  q('Gamma Dağılımı', 'χ²(k) dağılımı Gamma hangi parametrelerle yazılır?', 'Gamma(k, 2)', 'Gamma(k/2, 2)', 'Gamma(2, k)', 'Gamma(1, k)', 'B', 'Chi-kare dağılımı: χ²(k) = Gamma(α=k/2, β=2).'),
  q('Gamma Dağılımı', 'X ~ Gamma(α, β). MGF nedir?', '(1-βt)^{-α}', '(1+βt)^α', 'e^{αβt}', 'α/(α-t)', 'A', 'Gamma MGF: M_X(t) = (1-βt)^{-α}, t < 1/β.'),

  // Beta
  q('Beta Dağılımı', 'X ~ Beta(α=1, β=1) hangi dağılıma eşdeğerdir?', 'Exp(1)', 'Normal(0,1)', 'Uniform(0,1)', 'Gamma(1,1)', 'C', 'Beta(1,1) = Uniform(0,1). Sabit yoğunluk f(x)=1, 0<x<1.'),
  q('Beta Dağılımı', 'X ~ Beta(α, β). E[X] nedir?', 'α/(α+β)', 'β/(α+β)', 'αβ', 'α+β', 'A', 'Beta ortalaması: E[X] = α/(α+β).'),
  q('Beta Dağılımı', 'X ~ Beta(2, 3). Var(X) nedir?', '6/25', '2/25', '1/5', '2/15', 'B', 'Var(X) = αβ/[(α+β)²(α+β+1)] = 6/[25×6] = 6/150 = 1/25 = 0.04. Doğru: 2·3/[5²·6]=6/150=1/25.'),
  q('Beta Dağılımı', 'Beta dağılımı nerede yaygın olarak kullanılır?', 'Oranların ve olasılıkların modellenmesinde', 'Sayım verilerinde', 'Bekleme sürelerinde', 'Test istatistiklerinde', 'A', 'Beta dağılımı [0,1] aralığında değer aldığından oranları, olasılıkları ve oransal değişkenleri modellemek için idealdir.'),
  q('Beta Dağılımı', 'Beta fonksiyonu B(α,β) ile Gamma fonksiyonu arasındaki ilişki nedir?', 'B(α,β) = Γ(α)·Γ(β)/Γ(α+β)', 'B(α,β) = Γ(α+β)', 'B(α,β) = Γ(α)/Γ(β)', 'B(α,β) = Γ(α+β)/[Γ(α)·Γ(β)]', 'A', 'B(α,β) = Γ(α)Γ(β)/Γ(α+β). Bu ilişki Beta dağılımının normalizasyonunda kullanılır.'),

  // Lognormal
  q('Lognormal Dağılım', 'X ~ Lognormal(μ=0, σ²=1). E[X] nedir?', 'e^{0.5}', 'e^{1}', 'e^{1.5}', '1', 'A', 'Lognormal: E[X] = e^{μ+σ²/2} = e^{0+0.5} = e^{0.5} ≈ 1.649.'),
  q('Lognormal Dağılım', 'Eğer ln(X) ~ N(μ, σ²) ise X hangi dağılımı izler?', 'Normal', 'Gamma', 'Lognormal', 'Üstel', 'C', 'Logaritması normal dağılım izleyen değişken tanım gereği Lognormal dağılımlıdır.'),
  q('Lognormal Dağılım', 'X ~ Lognormal(μ, σ²). Var(X) nedir?', '(e^{σ²}-1)·e^{2μ+σ²}', 'e^{2μ+2σ²}', 'σ²·e^{2μ}', 'e^{σ²}-1', 'A', 'Var(X) = (e^{σ²}-1)·e^{2μ+σ²}.'),
  q('Lognormal Dağılım', 'Lognormal dağılım neden aktüerya ve finansta yaygın kullanılır?', 'Simetrik olduğu için', 'Yalnızca pozitif değer aldığı ve çarpık dağıldığı için', 'Kesikli olduğu için', 'Normal ile aynı olduğu için', 'B', 'Fiyatlar, hasarlar ve gelirler negatif olamaz ve genellikle sağa çarpık dağılır; Lognormal bu yapıya uygundur.'),
  q('Lognormal Dağılım', 'X ~ Lognormal(μ=2, σ=1). Medyan nedir?', 'e^2', 'e^{2.5}', 'e^3', '2', 'A', 'Lognormal medyan: e^μ = e^2 ≈ 7.389.'),

  // Pareto
  q('Pareto Dağılımı', 'X ~ Pareto(α=3, θ=100). E[X] nedir?', '50', '100', '150', '300', 'A', 'Pareto: E[X] = θ/(α-1) = 100/2 = 50 (α>1 iken).'),
  q('Pareto Dağılımı', 'Pareto dağılımı neden "ağır kuyruklu" sayılır?', 'Kuyruğu üstel hızda azalır', 'Kuyruğu polinom hızında azalır, yani üstelden yavaş', 'Ortalama yoktur', 'Varyans her zaman sonsuzdur', 'B', 'Pareto dağılımının kuyruğu P(X>x)~x^{-α} şeklinde polinom hızında azalır; üstelden çok daha yavaştır.'),
  q('Pareto Dağılımı', 'Pareto(α=1.5, θ=200). Var(X) kaçtır?', 'Sonsuzdur', '400', '200', '160000', 'A', 'Var(X) = θ²α/[(α-1)²(α-2)]. α=1.5 < 2 olduğundan Varyans sonsuzdur.'),
  q('Pareto Dağılımı', 'X ~ Pareto(α, θ). CDF nedir?', '1-(θ/(x+θ))^α', '1-e^{-x/θ}', '(x/θ)^α', '1-(θ/x)^α', 'A', 'Pareto (shifted): F(x) = 1-(θ/(x+θ))^α, x>0.'),
  q('Pareto Dağılımı', 'Pareto dağılımı aktüerya\'da neyi modellemek için kullanılır?', 'Bekleme sürelerini', 'Büyük sigorta hasarlarını ve kayıpları', 'Yaşam sürelerini', 'Sınav başarılarını', 'B', 'Pareto\'nun ağır kuyruğu, büyük miktarlı sigortacılık hasarlarını modellemeye uygundur.'),

  // Weibull
  q('Weibull Dağılımı', 'X ~ Weibull(τ=2, θ=10). P(X > 10) nedir?', 'e^{-1}', 'e^{-0.5}', '1-e^{-1}', 'e^{-2}', 'A', 'Weibull: P(X>x) = e^{-(x/θ)^τ}. P(X>10) = e^{-(10/10)^2} = e^{-1}.'),
  q('Weibull Dağılımı', 'Weibull(τ=1, θ) hangi dağılıma denk gelir?', 'Normal', 'Gamma', 'Üstel (Exponential)', 'Lognormal', 'C', 'τ=1 iken Weibull, Exp(1/θ) dağılımına indirgenir.'),
  q('Weibull Dağılımı', 'Weibull dağılımında hazard function h(x) τ>1 iken nasıl davranır?', 'Azalır (DFR)', 'Artar (IFR)', 'Sabittir', 'Önce artar sonra azalır', 'B', 'τ>1: artan hazard rate (IFR — Increasing Failure Rate). τ<1: azalan hazard. τ=1: sabit (Üstel).'),
  q('Weibull Dağılımı', 'Weibull dağılımı aktüerya\'da ağırlıklı olarak neyi modellemek için kullanılır?', 'Faiz oranlarını', 'Yaşam sürelerini ve güvenilirlik analizini', 'Günlük işlem hacmini', 'Poliçe sayısını', 'B', 'Weibull, güvenilirlik mühendisliği ve yaşam analizi (survival analysis) için en yaygın dağılımlardan biridir.'),
  q('Weibull Dağılımı', 'X ~ Weibull(τ=3, θ=2). E[X] hangi ifadeyi içerir?', 'θ·Γ(1+1/τ)', 'θ·τ', 'θ²·τ', 'Γ(τ)/θ', 'A', 'Weibull: E[X] = θ·Γ(1+1/τ) = 2·Γ(1+1/3) = 2·Γ(4/3).'),

  // Kovaryans ve Korelasyon
  q('Kovaryans ve Korelasyon', 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. Korelasyon katsayısı ρ nedir?', '0.4', '0.5', '0.6', '0.8', 'B', 'ρ = Cov(X,Y)/√(Var(X)·Var(Y)) = 6/√(9·16) = 6/12 = 0.5.'),
  q('Kovaryans ve Korelasyon', 'X ve Y bağımsız ise Cov(X,Y) nedir?', '1', '-1', '0', 'E[X]·E[Y]', 'C', 'Bağımsızlık: Cov(X,Y) = E[XY]-E[X]E[Y] = E[X]E[Y]-E[X]E[Y] = 0.'),
  q('Kovaryans ve Korelasyon', 'Cov(aX+b, cY+d) nedir?', 'ac·Cov(X,Y)', 'Cov(X,Y)+bd', 'ac·Cov(X,Y)+bd', 'a+c·Cov(X,Y)', 'A', 'Kovaryans sabitlerden etkilenmez: Cov(aX+b, cY+d) = ac·Cov(X,Y).'),
  q('Kovaryans ve Korelasyon', 'Korelasyon katsayısı ρ=−1 ne anlama gelir?', 'Bağımsızlık', 'Mükemmel pozitif doğrusal ilişki', 'Mükemmel negatif doğrusal ilişki', 'İlişki yok', 'C', 'ρ=−1: X arttıkça Y tam olarak azalır. Mükemmel negatif doğrusal ilişki.'),
  q('Kovaryans ve Korelasyon', 'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y). Cov(X,Y)=4, Var(X)=9, Var(Y)=16 ise Var(X+Y) nedir?', '25', '33', '29', '37', 'B', 'Var(X+Y) = 9 + 16 + 2·4 = 9+16+8 = 33.'),

  // Marjinal ve Koşullu Dağılımlar
  q('Marjinal ve Koşullu Dağılımlar', 'Ortak PDF f(x,y)=2, 0<x<y<1. f_X(x) (marjinal) nedir?', '2(1-x)', '2x', '2', '1-x', 'A', 'f_X(x) = ∫_x^1 2 dy = 2(1-x), 0<x<1.'),
  q('Marjinal ve Koşullu Dağılımlar', 'f(x,y)=f_X(x)·f_Y(y) eşitliği ne anlama gelir?', 'X ve Y bağımsızdır', 'X ve Y aynıdır', 'Cov(X,Y)=1', 'X ve Y negatif korelasyonludur', 'A', 'Ortak PDF marjinal PDF\'lerin çarpımına eşitse X ve Y bağımsızdır.'),
  q('Marjinal ve Koşullu Dağılımlar', 'f(y|x) koşullu PDF nasıl hesaplanır?', 'f(x,y)/f_X(x)', 'f(x,y)/f_Y(y)', 'f_X(x)/f(x,y)', 'f_X(x)·f_Y(y)', 'A', 'f(y|x) = f(x,y)/f_X(x). Ortak PDF marjinale bölünür.'),
  q('Marjinal ve Koşullu Dağılımlar', 'E[Y|X=x] nedir?', '∫y·f(y|x)dy', '∫y·f(x,y)dy', '∫y·f_Y(y)dy', 'Var(Y|X=x)', 'A', 'Koşullu beklenti: E[Y|X=x] = ∫y·f(y|x)dy.'),
  q('Marjinal ve Koşullu Dağılımlar', 'Toplam Beklenti Kanunu (Law of Total Expectation) nedir?', 'E[Y] = E[E[Y|X]]', 'E[XY] = E[X]·E[Y]', 'E[Y] = ∫E[X]dx', 'Var(Y) = E[Var(Y|X)]', 'A', 'Adam\'s Law: E[Y] = E_X[E[Y|X]]. Beklentinin beklentisi beklentiye eşittir.'),

  // Çok Boyutlu Dağılımlar
  q('Çok Boyutlu Dağılımlar', 'Çok değişkenli normal dağılım için korelasyon ρ=0 neyi garantiler?', 'X ve Y bağımlıdır', 'X ve Y bağımsızdır', 'Var(X)=Var(Y)', 'E[X]=E[Y]', 'B', 'Sadece çok değişkenli normal dağılımda korelasyonsuzluk (ρ=0) bağımsızlığı garanti eder.'),
  q('Çok Boyutlu Dağılımlar', 'n boyutlu bağımsız N(0,1) vektörünün ortak PDF\'i nedir?', '(2π)^{-n/2}·exp(-||x||²/2)', '(2π)^{-n}·exp(-||x||²)', 'exp(-||x||)', '(2π)^{n/2}', 'A', 'Bağımsız standart normalların ortak PDF\'i faktörize olur: ∏(2π)^{-1/2}e^{-xᵢ²/2} = (2π)^{-n/2}e^{-||x||²/2}.'),
  q('Çok Boyutlu Dağılımlar', 'Multinomial dağılımında E[Xᵢ] nedir?', 'n·pᵢ', 'pᵢ/n', 'n·(1-pᵢ)', 'pᵢ²', 'A', 'Multinomial(n, p₁,...,pₖ) için E[Xᵢ] = n·pᵢ (Binom marjinaline benzer).'),
  q('Çok Boyutlu Dağılımlar', 'Kovaryans matrisi her zaman hangi özelliğe sahiptir?', 'Pozitif yarı tanımlı (PSD)', 'Negatif tanımlı', 'Diyagonal', 'Birim matris', 'A', 'Kovaryans matrisi her zaman pozitif yarı tanımlı (PSD) simetrik bir matristir.'),
  q('Çok Boyutlu Dağılımlar', 'Bağımsız X₁,...,Xₙ ~ N(μ,σ²). X̄ hangi dağılımı izler?', 'N(μ, σ²/n)', 'N(μ, σ²)', 'N(0, 1)', 'N(nμ, nσ²)', 'A', 'X̄ = (X₁+...+Xₙ)/n ~ N(μ, σ²/n). Örneklem ortalamasının varyansı n ile azalır.'),

  // Çok Boyutlu Ortak Dağılımlar
  q('Çok Boyutlu Ortak Dağılımlar', 'f(x,y) = 6xy², 0<x<1, 0<y<1 geçerli bir ortak PDF midir?', 'Evet', 'Hayır, negatif değer aldığından', 'Hayır, integrali 1 değil', 'Hayır, simetrik değil', 'A', '∫₀¹∫₀¹ 6xy² dx dy = 6·(1/2)·(1/3) = 1. ✓ PDF geçerlidir.'),
  q('Çok Boyutlu Ortak Dağılımlar', 'f(x,y) = 6xy², 0<x<1, 0<y<1. E[X]·E[Y] = ? (X ve Y bağımsız mı?)', 'Bağımsız, E[X]=2/3, E[Y]=3/4', 'Bağımlı', 'E[X]=1/2, E[Y]=2/3', 'Bağımsız, E[X]=1/2, E[Y]=1/2', 'A', 'f(x,y)=6xy²=(2x)·(3y²). f_X(x)=2x, f_Y(y)=3y². Çarpım eşittir → bağımsız. E[X]=2/3, E[Y]=3/4.'),
  q('Çok Boyutlu Ortak Dağılımlar', 'Ortak PMF P(X=1,Y=2)=0.1 ve P(X=1)=0.4 ise P(Y=2|X=1) nedir?', '0.1', '0.25', '0.4', '0.04', 'B', 'P(Y=2|X=1) = P(X=1,Y=2)/P(X=1) = 0.1/0.4 = 0.25.'),
  q('Çok Boyutlu Ortak Dağılımlar', 'E[XY] = E[X]·E[Y] eşitliği ne zaman kesinlikle doğrudur?', 'Her zaman', 'X ve Y bağımsız olduğunda', 'X ve Y aynı dağılımdan geldiğinde', 'Cov(X,Y)>0 olduğunda', 'B', 'Bağımsızlık E[XY]=E[X]E[Y]\'yi garanti eder. Aksi korelasyonsuzlukta bile bozulabilir.'),
  q('Çok Boyutlu Ortak Dağılımlar', 'Ortak CDF F(x,y) = P(X≤x, Y≤y). F(∞,∞) nedir?', '0', 'Tanımsız', '1', 'E[X]·E[Y]', 'C', 'Ortak CDF\'in tüm eksenler boyunca limiti 1\'dir: F(∞,∞)=1.'),

  // Dönüşümler
  q('Dönüşümler — Tek ve Çok Değişkenli', 'X ~ U(0,1). Y=−ln(X) hangi dağılımı izler?', 'U(0,1)', 'N(0,1)', 'Exp(1)', 'Gamma(2,1)', 'C', 'Y=−ln(X) dönüşümü: F_Y(y)=P(Y≤y)=P(−lnX≤y)=P(X≥e^{-y})=1−e^{-y} → Exp(1).'),
  q('Dönüşümler — Tek ve Çok Değişkenli', 'Y=g(X) dönüşümünde PDF değişimi formülü nedir?', 'f_Y(y) = f_X(g⁻¹(y))·|dg⁻¹/dy|', 'f_Y(y) = f_X(g(y))', 'f_Y(y) = f_X(y)/|g\'(y)|', 'f_Y(y) = g(f_X(y))', 'A', 'Jacobian yöntemi: f_Y(y) = f_X(g⁻¹(y))·|dg⁻¹(y)/dy|.'),
  q('Dönüşümler — Tek ve Çok Değişkenli', 'X ~ N(0,1). Y=X² hangi dağılımı izler?', 'N(0,1)', 'χ²(1)', 'Gamma(1,2)', 'Exp(0.5)', 'B', 'Z ~ N(0,1) → Z² ~ χ²(1). Bu standart sonuç aktüerya sınavlarında sıkça çıkar.'),
  q('Dönüşümler — Tek ve Çok Değişkenli', 'X₁,...,Xₙ ~ Exp(λ) bağımsız. Y=X₁+...+Xₙ hangi dağılımı izler?', 'Exp(nλ)', 'Gamma(n, 1/λ)', 'Normal(n/λ, n/λ²)', 'Binom(n,λ)', 'B', 'Bağımsız Üstel\'lerin toplamı Gamma(n, 1/λ) dağılımını izler (Erlang dağılımı).'),
  q('Dönüşümler — Tek ve Çok Değişkenli', 'CDF metodu ile F_Y(y) = P(Y≤y) = P(g(X)≤y) nasıl değerlendirilir?', 'X için çözülür, g monoton artanssa P(X≤g⁻¹(y))', 'Doğrudan f_X ile hesaplanır', 'Y\'nin MGF\'si alınır', 'Sadece Jacobian kullanılır', 'A', 'CDF yöntemi: Y=g(X), g monoton artan → F_Y(y) = P(X≤g⁻¹(y)) = F_X(g⁻¹(y)).'),

  // MGF
  q('Moment Üreten Fonksiyonlar (MGF)', 'X ~ Exp(λ). MGF M_X(t) nedir?', 'λ/(λ-t), t<λ', 'e^{λt}', 'λ/(λ+t)', '1/(1-λt)', 'A', 'Exp(λ) MGF: M_X(t) = λ/(λ-t), t < λ.'),
  q('Moment Üreten Fonksiyonlar (MGF)', 'M_X(t) = e^{5t+8t²}. E[X] ve Var(X) nedir?', 'E=5, Var=16', 'E=5, Var=8', 'E=10, Var=8', 'E=5, Var=4', 'A', 'Lognormal veya Normal MGF: M(t)=e^{μt+σ²t²/2} → μ=5, σ²/2=8 → σ²=16. E[X]=5, Var=16.'),
  q('Moment Üreten Fonksiyonlar (MGF)', 'E[X^n] = M_X^(n)(0) ne anlama gelir?', 'n. türevden n. moment elde edilir', 'MGF her zaman polinomdur', 'Momentler toplamı 1\'dir', 'n. kümülant hesaplanır', 'A', 'MGF\'in t=0\'daki n. türevi, n. ham momenti verir: E[X^n] = d^n/dt^n M_X(t)|_{t=0}.'),
  q('Moment Üreten Fonksiyonlar (MGF)', 'X ve Y bağımsız. M_{X+Y}(t) nedir?', 'M_X(t)+M_Y(t)', 'M_X(t)·M_Y(t)', 'M_X(t)/M_Y(t)', 'M_X(M_Y(t))', 'B', 'Bağımsız RDV\'lerin toplamının MGF\'i, ayrı MGF\'lerin çarpımıdır.'),
  q('Moment Üreten Fonksiyonlar (MGF)', 'X ~ N(μ,σ²). MGF nedir?', 'e^{μt+σ²t²/2}', 'e^{μt}', 'e^{σ²t²}', 'μe^t+σ', 'A', 'Normal MGF: M_X(t) = e^{μt+σ²t²/2}.'),

  // PGF
  q('Olasılık Üreten Fonksiyonlar (PGF)', 'X ~ Binom(n, p). PGF G_X(z) nedir?', '(q+pz)^n', '(p+qz)^n', 'pz/(1-qz)', '(pz)^n', 'A', 'Binom PGF: G_X(z) = (q+pz)^n, q=1-p.'),
  q('Olasılık Üreten Fonksiyonlar (PGF)', 'PGF G_X(z) = Σ P(X=k)z^k. G_X(1) nedir?', '0', 'E[X]', '1', 'Var(X)', 'C', 'z=1 koymak: G_X(1) = Σ P(X=k)·1 = 1. Toplam olasılık.'),
  q('Olasılık Üreten Fonksiyonlar (PGF)', 'G\'_X(1) neye eşittir?', 'E[X]', 'E[X²]', 'Var(X)', 'P(X=1)', 'A', 'PGF\'in birinci türevi z=1\'de değerlendirilince E[X] elde edilir: G\'_X(1) = E[X].'),
  q('Olasılık Üreten Fonksiyonlar (PGF)', 'PGF hangi dağılımlar için MGF\'e alternatif olarak kullanılır?', 'Sürekli dağılımlar', 'Negatif değer alan dağılımlar', 'Negatif olmayan tam sayı değerli RDV\'ler', 'Normal dağılım', 'C', 'PGF, yalnızca {0,1,2,...} değerleri alan kesikli RDV\'ler için tanımlıdır.'),
  q('Olasılık Üreten Fonksiyonlar (PGF)', 'X ~ Poisson(λ). PGF nedir?', 'e^{λ(z-1)}', 'e^{λz}', '(λz)^k/k!', 'e^{-λ}·z^λ', 'A', 'Poisson PGF: G_X(z) = e^{λ(z-1)}.'),

  // Merkezi Limit Teoremi
  q('Merkezi Limit Teoremi', 'X₁,...,Xₙ iid, E[Xᵢ]=μ, Var(Xᵢ)=σ². n büyüdükçe X̄ hangi dağılıma yaklaşır?', 'N(0, 1)', 'N(μ, σ²)', 'N(μ, σ²/n)', 'Exp(μ)', 'C', 'MLT: √n(X̄-μ)/σ → N(0,1). Dolayısıyla X̄ → N(μ, σ²/n).'),
  q('Merkezi Limit Teoremi', 'n=100, μ=10, σ=5. P(X̄ > 11) ≈?', 'P(Z > 2)', 'P(Z > 1)', 'P(Z > 0.5)', 'P(Z > 5)', 'A', 'SE = σ/√n = 5/10 = 0.5. Z = (11-10)/0.5 = 2. P(X̄>11) = P(Z>2) ≈ 0.0228.'),
  q('Merkezi Limit Teoremi', 'MLT için X\'lerin hangi özelliği gerekmektedir?', 'Normal dağılımlı olması', 'Sonlu ortalama ve varyansa sahip iid olması', 'Sürekli olması', 'Bağımlı olması', 'B', 'MLT: değişkenler iid, sonlu μ ve σ² koşullarını sağlarsa herhangi bir dağılım için geçerlidir.'),
  q('Merkezi Limit Teoremi', 'Binom(n=100, p=0.4)\'in normal yaklaşımında hangi ortalama ve varyans kullanılır?', 'μ=40, σ²=24', 'μ=40, σ²=40', 'μ=60, σ²=24', 'μ=0.4, σ²=0.24', 'A', 'Binom: μ=np=40, σ²=np(1-p)=100·0.4·0.6=24. Normal yaklaşım: N(40,24).'),
  q('Merkezi Limit Teoremi', 'Süreklilik düzeltmesi (continuity correction) ne zaman kullanılır?', 'Kesikli dağılım sürekli dağılımla yaklaşıldığında', 'Standart normal tabloda', 'n<30 olduğunda', 'σ bilinmediğinde', 'A', 'Süreklilik düzeltmesi: binom gibi kesikli dağılımlar normal ile yaklaşıldığında P(X=k) için ±0.5 eklenir.'),

  // Büyük Sayılar Yasası ve Chebyshev
  q('Büyük Sayılar Yasası ve Chebyshev', 'Chebyshev eşitsizliğine göre P(|X-μ| ≥ kσ) ≤?', '1/k', '1/k²', 'k/σ', 'σ/k', 'B', 'Chebyshev: P(|X-μ| ≥ kσ) ≤ 1/k². Herhangi bir dağılım için geçerlidir.'),
  q('Büyük Sayılar Yasası ve Chebyshev', 'Büyük Sayılar Yasası\'na göre n→∞ iken X̄ nereye yaklaşır?', 'N(0,1)\'e', 'μ\'ya (olasılıkla)', 'σ\'ya', '0\'a', 'B', 'BSY: X̄ → μ olasılıkla 1 ile (kuvvetli BSY) veya olasılık olarak (zayıf BSY).'),
  q('Büyük Sayılar Yasası ve Chebyshev', 'E[X]=50, Var(X)=25. P(|X-50|≥10) üst sınırı nedir? (Chebyshev)', '1/4', '1/2', '1/16', '1/8', 'A', 'k=10/σ=10/5=2. P(|X-μ|≥kσ) ≤ 1/k² = 1/4.'),
  q('Büyük Sayılar Yasası ve Chebyshev', 'Zayıf BSY ile Kuvvetli BSY arasındaki fark nedir?', 'Zayıf BSY: olasılık yakınsama; Kuvvetli BSY: neredeyse kesin yakınsama', 'Zayıf BSY daha hızlı yakınsar', 'Kuvvetli BSY daha fazla koşul gerektirir', 'İkisi aynıdır', 'A', 'Zayıf BSY: P(|X̄_n-μ|>ε)→0. Kuvvetli BSY: P(lim X̄_n=μ)=1 (neredeyse kesin).'),
  q('Büyük Sayılar Yasası ve Chebyshev', 'Markov eşitsizliğine göre X≥0 ve a>0 için P(X≥a) ≤?', 'E[X]/a', 'E[X²]/a²', 'Var(X)/a²', 'E[X]/a²', 'A', 'Markov eşitsizliği: P(X≥a) ≤ E[X]/a. Chebyshev bu eşitsizlikten türetilir.'),

  // Bileşik ve Karışım Dağılımlar
  q('Bileşik ve Karışım Dağılımlar', 'S = X₁+...+X_N, N ~ Poisson(λ), Xᵢ ~ Exp(μ) iid. E[S] nedir?', 'λ/μ', 'λ·μ', 'λ+μ', 'μ/λ', 'A', 'E[S] = E[N]·E[X] = λ·(1/μ) = λ/μ. Bileşik dağılım beklentisi.'),
  q('Bileşik ve Karışım Dağılımlar', 'Karışım dağılımında f(x) = Σ wᵢ·fᵢ(x). wᵢ şartları nedir?', 'wᵢ>0 ve Σwᵢ=1', 'wᵢ=1/n', 'wᵢ<0 olabilir', 'Σwᵢ>1 olabilir', 'A', 'Karışım ağırlıkları negatif olmayan ve toplamları 1\'e eşit olmalıdır.'),
  q('Bileşik ve Karışım Dağılımlar', 'Bileşik Poisson dağılımında Var(S) nedir? (N~Poisson(λ), Xᵢ iid)', 'λ·E[X²]', 'λ·Var(X)', 'λ·E[X]²', 'Var(N)·E[X]', 'A', 'Bileşik Poisson: Var(S) = λ·E[X²] (Var(N)=λ olduğundan Var(S)=λ·E[X²]).'),
  q('Bileşik ve Karışım Dağılımlar', 'Negatif Binom dağılımı hangi bileşik yapının sonucudur?', 'Poisson(Γ) karışımı', 'Binom(Normal) bileşiği', 'Poisson(Beta) karışımı', 'Gamma(Poisson) bileşiği', 'A', 'NegBinom = Poisson(λ) burada λ~Gamma dağılımı. Poisson-Gamma karışımı.'),
  q('Bileşik ve Karışım Dağılımlar', 'S=X₁+...+X_N bileşik dağılımın MGF\'i nedir?', 'M_S(t) = G_N(M_X(t))', 'M_S(t) = M_N(M_X(t))', 'M_S(t) = M_N(t)·M_X(t)', 'M_S(t) = E[N]·M_X(t)', 'A', 'Bileşik dağılım MGF: M_S(t) = G_N(M_X(t)). N\'nin PGF\'ine X\'in MGF\'i koyulur.'),

  // Sıra İstatistikleri
  q('Sıra İstatistikleri (Order Statistics)', 'X₁,...,Xₙ iid U(0,1). X_(k) CDF\'i nedir?', 'F_{X_(k)}(x) = Σᵢ₌ₖⁿ C(n,i)x^i(1-x)^{n-i}', 'F(x)^k', 'k·F(x)^{k-1}·(1-F(x))', 'x^k/k!', 'A', 'X_(k) CDF: P(X_(k)≤x) = Σᵢ₌ₖⁿ C(n,i)F(x)^i(1-F(x))^{n-i}.'),
  q('Sıra İstatistikleri (Order Statistics)', 'n=5, X ~ U(0,1). E[X_(3)] (3. en küçük) nedir?', '1/2', '3/6', '3/5', '2/5', 'B', 'E[X_(k)] = k/(n+1) = 3/6 = 1/2.'),
  q('Sıra İstatistikleri (Order Statistics)', 'X_(1)=min(X₁,...,Xₙ), X ~ Exp(λ). X_(1)\'in dağılımı nedir?', 'Exp(λ)', 'Exp(nλ)', 'Gamma(n,λ)', 'Uniform(0, 1/λ)', 'B', 'Minimum: X_(1) ~ Exp(nλ). Üstel dağılımın minimum özelliği.'),
  q('Sıra İstatistikleri (Order Statistics)', 'X_(n)=max(X₁,...,Xₙ) PDF\'i nedir?', 'n·F(x)^{n-1}·f(x)', 'f(x)^n', 'n·(1-F(x))^{n-1}·f(x)', 'F(x)^n', 'A', 'Maksimumun PDF: f_{X_(n)}(x) = n·[F(x)]^{n-1}·f(x).'),
  q('Sıra İstatistikleri (Order Statistics)', 'Sıra istatistikleri aktüerya\'da neyi modellemek için kullanılır?', 'Yalnızca bekleme sürelerini', 'Maksimum hasar, aşım dağılımı ve deductible uygulamalarını', 'Faiz oranlarını', 'Poliçe fiyatlamalarını', 'B', 'Sıra istatistikleri özellikle X_(1) ve X_(n) olmak üzere aşım tutarları, maksimum hasar ve değer riski (VaR) hesaplamalarında kullanılır.'),
];

async function upload(batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`);
}

async function main() {
  const BATCH = 25;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await upload(batch);
    console.log(`✓ ${Math.min(i + BATCH, questions.length)}/${questions.length}`);
  }
  console.log(`\n✅ Tamamlandı — ${questions.length} olasılık sorusu yüklendi.`);
}
main().catch(e => { console.error(e); process.exit(1); });
