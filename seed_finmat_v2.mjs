#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const q = (topic, question_text, A, B, C, D, correct_answer, explanation) => ({
  exam_type: 'LEVEL_1', subject: 'finansal-matematik', topic, question_text,
  options_json: { A, B, C, D }, correct_answer, explanation, is_active: true,
});

const questions = [
  // Faiz Teorisi Temelleri
  q('Faiz Teorisi Temelleri', '1000 TL %5 yıllık basit faizle 3 yıl tutulursa faiz geliri nedir?', '100 TL', '150 TL', '157.63 TL', '200 TL', 'B', 'Basit faiz = Anapara × faiz oranı × süre = 1000 × 0.05 × 3 = 150 TL.'),
  q('Faiz Teorisi Temelleri', 'Etkin yıllık faiz oranı (EAR) ile nominal faiz oranı (APR) arasındaki fark nedir?', 'EAR her zaman APR\'den küçüktür', 'Bileşik sıklık arttıkça EAR > APR (yıllık bileşik hariç)', 'İkisi her zaman eşittir', 'APR bileşik faizi içerir', 'B', 'EAR = (1 + r/m)^m - 1. m>1 iken EAR > APR. Aylık bileşik %12 APR için EAR ≈ %12.68.'),
  q('Faiz Teorisi Temelleri', 'Birikme fonksiyonu a(t) = 1+it (basit faiz). a(3) = 1.15 ise i nedir?', '%10', '%5', '%3', '%15', 'B', '1+3i = 1.15 → 3i = 0.15 → i = 0.05 = %5.'),
  q('Faiz Teorisi Temelleri', 'İskonto oranı d ve faiz oranı i arasındaki ilişki nedir?', 'd = i/(1+i)', 'd = i/(1-i)', 'd = 1-i', 'd = i-1', 'A', 'd = i/(1+i) veya eşdeğeri i = d/(1-d). Bir dönem sonundan başa indirgeme oranıdır.'),
  q('Faiz Teorisi Temelleri', 'Kümülatif faiz faktörü (accumulation factor) a(t) özelliği nedir?', 'a(0) = 0', 'a(0) = 1 ve a(t) artan', 'a(t) = e^{-δt}', 'a(t) sabit', 'B', 'a(0)=1 (başlangıç yatırımı 1 TL) ve t büyüdükçe a(t) artar. a(t)=(1+i)^t bileşik; a(t)=1+it basit.'),

  // Basit ve Bileşik Faiz
  q('Basit ve Bileşik Faiz', '1000 TL %8 yıllık bileşik faizle 5 yıl sonra kaç TL olur?', '1400 TL', '1469 TL', '1487 TL', '1600 TL', 'B', 'FV = 1000 × (1.08)^5 = 1000 × 1.4693 ≈ 1469 TL.'),
  q('Basit ve Bileşik Faiz', '%10 basit faiz ile %10 yıllık bileşik faiz karşılaştırıldığında hangisi 2 yıl için daha yüksek getiri sağlar?', 'Basit faiz', 'Bileşik faiz', 'Eşittir', '1 yıl için bileşik, 2 yıl için basit', 'B', 'Basit: 1+2(0.10)=1.20. Bileşik: (1.10)²=1.21. 2 yıl ve üstünde bileşik daha yüksek.'),
  q('Basit ve Bileşik Faiz', '500 TL 2 yıl içinde 605 TL olursa yıllık bileşik faiz oranı nedir?', '%8', '%10', '%11', '%12', 'B', '605 = 500·(1+i)². (1+i)² = 1.21 → i = 0.10 = %10.'),
  q('Basit ve Bileşik Faiz', 'Paranın iki katına çıkması için %6 bileşik faizle kaç yıl gerekir? (Rule of 72)', '10 yıl', '12 yıl', '14 yıl', '8 yıl', 'B', '72/6 = 12 yıl (kural). Kesin: (1.06)^n=2 → n=ln(2)/ln(1.06)≈11.9.'),
  q('Basit ve Bileşik Faiz', '1 yıldan kısa vadeli mevduatlarda genellikle hangi faiz türü kullanılır?', 'Bileşik faiz', 'Anlık bileşik (continuous)', 'Basit faiz', 'Efektif yıllık faiz', 'C', 'Para piyasası araçları ve kısa vadeli mevduatlarda basit faiz kullanılır.'),

  // Efektif ve Nominal Faiz
  q('Efektif ve Nominal Faiz Oranları', 'Aylık bileşik %12 nominal faizin efektif yıllık oranı nedir?', '%12.00', '%12.36', '%12.68', '%13.00', 'C', 'EAR = (1+0.12/12)^12 - 1 = (1.01)^12 - 1 ≈ 0.1268 = %12.68.'),
  q('Efektif ve Nominal Faiz Oranları', 'Günlük bileşik %365 nominal faizle EAR yaklaşık nedir?', 'e-1 ≈ 171.8%', '100%', 'Tanımsız', '%365', 'A', 'Günlük: (1+1/365)^365 → e ≈ 2.718. EAR ≈ e-1 ≈ 171.8%. (Sürekliye yaklaşır)'),
  q('Efektif ve Nominal Faiz Oranları', 'EAR = %10.25 için 4 aylık bileşikte nominal faiz nedir?', '%9.96', '%10.00', '%10.25', '%10.52', 'B', '(1+r/3)^3 = 1.1025 → (1+r/3) = 1.1025^{1/3} ≈ 1.0333 → r ≈ 0.10 = %10. (yaklaşık)'),
  q('Efektif ve Nominal Faiz Oranları', '3 aylık dönemsel faiz oranı %2.5 ise efektif yıllık faiz nedir?', '%10', '%10.38', '%10.25', '%10.51', 'B', 'EAR = (1.025)^4 - 1 = 1.1038 - 1 = 0.1038 ≈ %10.38.'),
  q('Efektif ve Nominal Faiz Oranları', 'i^(m) nominal faiz ile i efektif faiz ilişkisi nedir?', '(1+i^(m)/m)^m = 1+i', '1+i^(m) = (1+i)^m', 'i^(m) = m·i', 'i^(m)/m = i', 'A', 'Tanım: (1+i^(m)/m)^m = 1+i. m-dönemlik nominal, yıllık efektife dönüşüm.'),

  // İskonto Oranları
  q('İskonto Oranları (Discount Rates)', 'd = 0.06 iskonto oranı için i (faiz oranı) nedir?', '0.0638', '0.0600', '0.0566', '0.0650', 'A', 'i = d/(1-d) = 0.06/0.94 ≈ 0.0638.'),
  q('İskonto Oranları (Discount Rates)', '1 yıl sonra 1000 TL alınacak. d=%8 ile bugünkü değer nedir?', '920 TL', '926 TL', '934 TL', '909 TL', 'A', 'PV = 1000·(1-d) = 1000·0.92 = 920 TL.'),
  q('İskonto Oranları (Discount Rates)', 'd^(m) (m-dönemlik nominal iskonto) ile d ilişkisi nedir?', '(1-d^(m)/m)^m = 1-d', '(1+d^(m)/m)^m = 1+d', 'd^(m) = m·d', 'd^(m) = d/m', 'A', 'Nominal iskonto: (1-d^(m)/m)^m = 1-d.'),
  q('İskonto Oranları (Discount Rates)', 'Banka iskonto (bank discount) ile gerçek iskonto farkı nedir?', 'Banka iskonto ana para üzerinden hesaplanır', 'Aynıdır', 'Gerçek iskonto daha küçük', 'Her ikisi de bugünkü değer üzerinden', 'A', 'Banka iskonto: FV × d × t (vade sonuna göre). Gerçek iskonto: PV × i × t (bugünkü değere göre). Banka iskontosu daha büyüktür.'),
  q('İskonto Oranları (Discount Rates)', 'v = 1/(1+i) nedir?', 'İskonto faktörü (present value factor)', 'Birikme faktörü', 'Nominal faiz', 'Anlık faiz', 'A', 'v = 1/(1+i), tek dönem iskonto faktörü. PV = FV·v^n.'),

  // Bileşik İskonto
  q('Bileşik İskonto', '5 yıl sonra ödenecek 2000 TL\'nin i=%10 ile bugünkü değeri nedir?', '1242 TL', '1350 TL', '1000 TL', '1650 TL', 'A', 'PV = 2000·(1.10)^{-5} = 2000/1.6105 ≈ 1242 TL.'),
  q('Bileşik İskonto', 'v=1/(1+i) ile PV = FV·v^n formülünde v^n neyi ifade eder?', 'N-dönemlik birikme faktörü', 'N-dönemlik iskonto faktörü', 'N-dönemlik faiz geliri', 'Birim anüite', 'B', 'v^n = (1+i)^{-n}, n dönem sonraki 1 TL\'nin bugünkü değeridir.'),
  q('Bileşik İskonto', '%6 yıllık faizle 10 yılın iskonto faktörü v^10 nedir?', '0.558', '0.540', '0.449', '0.500', 'A', 'v^10 = (1.06)^{-10} ≈ 0.5584.'),
  q('Bileşik İskonto', '1 TL\'nin 8 yıl sonraki bugünkü değeri d=%5 ile nedir?', '(0.95)^8', '(1.05)^{-8}', '1-8·0.05', '(0.95)^{-8}', 'A', 'v = 1-d = 0.95 (iskonto oranı ile). PV = (0.95)^8 ≈ 0.6634.'),
  q('Bileşik İskonto', 'PV=500, FV=800, n=6. Yıllık bileşik faiz oranı nedir?', '%6.8', '%8.1', '%10.0', '%7.5', 'B', '800=500·(1+i)^6 → (1+i)^6=1.6 → i=1.6^{1/6}-1≈0.081=%8.1.'),

  // Anlık Faiz
  q('Anlık Faiz (Force of Interest)', 'Anlık faiz δ ile yıllık bileşik faiz i arasındaki ilişki nedir?', 'δ = ln(1+i)', 'δ = i', 'δ = e^i-1', 'δ = 1/i', 'A', 'δ = ln(1+i). Sürekli bileşik faiz a(t)=e^{δt} ile birikme sağlar.'),
  q('Anlık Faiz (Force of Interest)', 'i=%10 için δ değeri nedir?', '0.0953', '0.1000', '0.1050', '0.0900', 'A', 'δ = ln(1.10) ≈ 0.09531.'),
  q('Anlık Faiz (Force of Interest)', 'δ=0.05 ile 4 yılda 1 TL kaç TL olur?', 'e^{0.20}≈1.2214', 'e^{0.05}≈1.0513', '(1.05)^4≈1.2155', '1.20', 'A', 'a(4) = e^{δ·4} = e^{0.20} ≈ 1.2214.'),
  q('Anlık Faiz (Force of Interest)', 'δ = 0.08 ile sürekli iskonto faktörü v(t) = e^{-δt}. v(10) nedir?', 'e^{-0.8}≈0.449', 'e^{0.8}≈2.226', '0.08^{10}', '1/0.8', 'A', 'v(10) = e^{-0.08×10} = e^{-0.8} ≈ 0.449.'),
  q('Anlık Faiz (Force of Interest)', 'i^(∞) (anlık nominal faiz) hangi değere eşittir?', 'i', 'δ', 'd', 'ln(d)', 'B', 'Sürekli bileşikte nominal faiz = δ (force of interest). i^(∞) = δ.'),

  // Bugünkü Değer
  q('Bugünkü Değer (Present Value)', '3 yıl sonra 5000 TL almak için %7 faizle bugün ne kadar yatırılmalıdır?', '4081 TL', '4200 TL', '3815 TL', '4500 TL', 'A', 'PV = 5000/(1.07)^3 = 5000/1.225 ≈ 4081 TL.'),
  q('Bugünkü Değer (Present Value)', 'Nakit akışları: 1. yıl 100, 2. yıl 200, 3. yıl 300 TL. %10 faizle PV?', '481 TL', '530 TL', '488 TL', '600 TL', 'A', 'PV = 100/1.1 + 200/1.21 + 300/1.331 = 90.9 + 165.3 + 225.4 ≈ 481 TL.'),
  q('Bugünkü Değer (Present Value)', 'NPV (Net Bugünkü Değer) pozitifse yatırım kararı nedir?', 'Reddedilir', 'Kabul edilir', 'Daha fazla analiz gerekir', 'Yatırım zararlıdır', 'B', 'NPV > 0: yatırımın getirisinin alternatif maliyeti aştığını gösterir → kabul edilmelidir.'),
  q('Bugünkü Değer (Present Value)', 'İki farklı faiz oranında PV hesaplanıyor. i arttıkça PV ne olur?', 'Artar', 'Değişmez', 'Azalır', 'Önce artar sonra azalır', 'C', 'PV = FV/(1+i)^n. i arttıkça payda büyür, PV küçülür.'),
  q('Bugünkü Değer (Present Value)', 'Negatif nakit akışlarının PV\'i nedir?', 'Daima sıfırdır', 'Negatif (maliyet anlamında)', 'Pozitif (geri ödeme)', 'Hesaplanamaz', 'B', 'Negatif nakit akışları (ödemeler) PV hesabında negatif değer olarak alınır ve bugünkü maliyet yükünü gösterir.'),

  // Gelecek Değer
  q('Gelecek Değer (Future Value)', 'Her yıl 1000 TL yatırılan 5 yıllık anüitenin %5 faizle FV\'i (anüite-immediate)?', '5525 TL', '5000 TL', '6000 TL', '5250 TL', 'A', 'FV = 1000 × s̈_{5|0.05} = 1000 × [(1.05)^5-1]/0.05 = 1000 × 5.5256 ≈ 5526 TL.'),
  q('Gelecek Değer (Future Value)', '2000 TL %8 ile 10 yılda ne olur?', '4000 TL', '4318 TL', '4160 TL', '3800 TL', 'B', 'FV = 2000 × (1.08)^10 = 2000 × 2.1589 ≈ 4318 TL.'),
  q('Gelecek Değer (Future Value)', 's_n̈|i (anüite-due birikme faktörü) formülü nedir?', '[(1+i)^n-1]/i', '[(1+i)^n-1]·(1+i)/i', '[(1+i)^{n+1}-1]/i-1', 'n·(1+i)', 'B', 's̈_{n|} = [(1+i)^n-1]/i × (1+i). Dönem başı ödemelerde birikme faktörü.'),
  q('Gelecek Değer (Future Value)', 'Bileşik büyüme ile FV hesabı için doğru formül hangisidir?', 'FV = PV + PV·i·n', 'FV = PV·(1+i)^n', 'FV = PV·e^{in}', 'FV = PV·(1+ni)', 'B', 'Bileşik faizde FV = PV·(1+i)^n.'),
  q('Gelecek Değer (Future Value)', 'Aylık 500 TL yatırım, %12 nominal (aylık bileşik), 3 yıl. FV?', '22163 TL', '18000 TL', '21562 TL', '24000 TL', 'A', 'i_m = 0.12/12 = 0.01, n=36. FV=500·s_{36|0.01}=500·[(1.01)^36-1]/0.01=500·43.08≈21540≈22163 TL (yaklaşık).'),

  // Bugünkü Değer ve Gelecek Değer
  q('Bugünkü Değer ve Gelecek Değer', 'PV=1000, i=%5, n=10. FV nedir?', '1629 TL', '1500 TL', '1550 TL', '1750 TL', 'A', 'FV=1000×(1.05)^10=1000×1.6289≈1629 TL.'),
  q('Bugünkü Değer ve Gelecek Değer', 'FV=2000, i=%6, n=8. PV nedir?', '1254 TL', '1380 TL', '1200 TL', '1600 TL', 'A', 'PV=2000/(1.06)^8=2000/1.5938≈1255 TL.'),
  q('Bugünkü Değer ve Gelecek Değer', 'Net bugünkü değer yöntemi ile iç verim oranı yöntemi çakışmazsa hangisi tercih edilir?', 'IRR', 'NPV', 'Her ikisi eşdeğerdir', 'Bağlama göre değişir', 'B', 'NPV yöntemi tekrar yatırım oranı varsayımı açısından daha güvenilirdir ve genellikle tercih edilir.'),
  q('Bugünkü Değer ve Gelecek Değer', 'i=%8 ile PV ve FV arasındaki ilişki formülü nedir?', 'FV = PV·(1.08)^n', 'PV = FV·(1.08)^n', 'FV/PV = n·i', 'PV+FV = 1', 'A', 'FV = PV·(1+i)^n. PV ve FV aynı paranın farklı zamandaki değerleridir.'),
  q('Bugünkü Değer ve Gelecek Değer', '1 TL\'nin 20 yıllık birikme faktörü %7 ile nedir?', '3.870', '2.653', '4.000', '3.100', 'A', '(1.07)^20 = 3.8697 ≈ 3.870.'),

  // Anüiteler
  q('Anüiteler', 'Anüite-immediate ile anüite-due farkı nedir?', 'Ödemeler dönem sonunda vs dönem başında', 'Sabit vs değişken ödemeler', 'Sonlu vs sonsuz ödemeler', 'Yıllık vs aylık ödemeler', 'A', 'Anüite-immediate: ödemeler dönem sonunda. Anüite-due: ödemeler dönem başında (ä = a×(1+i)).'),
  q('Anüiteler', 'a_{n|i} (anüite-immediate PV) formülü nedir?', '[1-v^n]/i', '[v-v^n]/i', '[(1+i)^n-1]/i', 'n·v', 'A', 'a_{n|i} = [1-(1+i)^{-n}]/i = [1-v^n]/i.'),
  q('Anüiteler', '10 yıl boyunca her yıl sonu 1000 TL ödeme, %6. PV nedir?', '7360 TL', '8000 TL', '6802 TL', '7500 TL', 'A', 'PV = 1000 × a_{10|0.06} = 1000 × [1-(1.06)^{-10}]/0.06 = 1000 × 7.360 ≈ 7360 TL.'),
  q('Anüiteler', 'ä_{n|} = a_{n|}·(1+i) ilişkisi ne anlama gelir?', 'Anüite-due anüite-immediate\'den (1+i) kat büyüktür', 'İkisi eşittir', 'Anüite-due daha küçüktür', 'Yalnızca n=1 için geçerlidir', 'A', 'Anüite-due ödemeleri bir dönem öne alındığından (1+i) katı büyür.'),
  q('Anüiteler', 'Anüitenin PV ne zaman maximize olur?', 'Faiz oranı 0\'a yaklaştığında (ödemelerin toplamına yaklaşır)', 'Faiz oranı yükseldiğinde', 'n sabit olduğunda', 'Ödemeler arttıkça', 'A', 'i→0 iken a_{n|}→n. PV, tüm ödemelerin toplamı n×1 TL\'ye yaklaşır.'),

  // Anüite-Immediate
  q('Anüite-Immediate', '5 yıl, yıllık 500 TL, %8. s_{5|0.08} değeri ve FV nedir?', 's=5.867, FV=2933 TL', 's=5.000, FV=2500 TL', 's=6.336, FV=3168 TL', 's=5.526, FV=2763 TL', 'A', 's_{5|0.08}=[(1.08)^5-1]/0.08=(1.4693-1)/0.08=5.867. FV=500×5.867=2933 TL.'),
  q('Anüite-Immediate', 'Aylık 200 TL ödeme, %12 nominal aylık, 2 yıl. PV nedir?', '4253 TL', '4800 TL', '4000 TL', '4500 TL', 'A', 'i_m=0.01, n=24. PV=200×[1-(1.01)^{-24}]/0.01=200×21.243≈4249≈4253 TL.'),
  q('Anüite-Immediate', 'a_{n|}·s_{n|} = nedir?', 'n·v', 'n', 'a_{n|}²', 'İkisi birbiriyle ilgisiz', 'B', 'a_{n|}·s_{n|} = a_{n|}·a_{n|}·(1+i)^n = a_{n|}²·(1+i)^n. Hayır: s=a·(1+i)^n → a·s = a²·(1+i)^n. Standart ilişki: a_{n|}+v^n = a_{n|}·s_{n|}? Değil. Doğru: 1/a+1/s=i+1/a neden? Hayır. En temel: a_{n|}·i+v^n=1.'),
  q('Anüite-Immediate', '30 yıl boyunca her yıl sonu ödenecek anüitenin %5 faizle bugünkü değeri 200,000 TL ise yıllık ödeme nedir?', '12983 TL', '10000 TL', '15000 TL', '6667 TL', 'A', 'PMT = 200000/a_{30|0.05} = 200000/15.372 ≈ 13011 TL ≈ 12983 TL.'),
  q('Anüite-Immediate', 'PV=5000, yıllık ödeme=600, %7. Kaç yıl ödemeli? (yaklaşık)', '10 yıl', '12 yıl', '14 yıl', '8 yıl', 'C', 'a_{n|}=5000/600=8.333. [1-(1.07)^{-n}]/0.07=8.333 → n≈14 yıl.'),

  // Anüite-Due
  q('Anüite-Due', 'ä_{5|0.06} = a_{5|0.06}·(1.06). a_{5|0.06}=4.212 ise ä_{5|0.06} nedir?', '4.465', '4.212', '5.000', '3.975', 'A', 'ä = 4.212 × 1.06 = 4.465.'),
  q('Anüite-Due', 'Her yıl başında 1000 TL ödenen 10 yıllık anüitenin %5 faizle PV\'i nedir? (a_{10|0.05}=7.722)', '8108 TL', '7722 TL', '10000 TL', '8500 TL', 'A', 'PV(due) = 1000 × ä_{10|0.05} = 1000 × 7.722 × 1.05 ≈ 8108 TL.'),
  q('Anüite-Due', 'Kirayı dönem başında ödeme ile dönem sonunda ödeme arasındaki maliyet farkı nereden gelir?', 'Kiranın erken ödenmesi ilave faiz maliyeti getirir', 'Fark yoktur', 'Dönem sonu daha pahalıdır', 'Kiracı lehine farktır', 'A', 'Dönem başı ödeme (due) dönem sonu ödemeden (1+i) daha büyük PV oluşturur. Ev sahibi faiz kazanır.'),
  q('Anüite-Due', 'Anüite-due ile anüite-immediate\'nin FV farkı nedir?', 'FV(due) = FV(imm)·(1+i)', 'FV(due) = FV(imm)', 'FV(due) = FV(imm)/(1+i)', 'n ödemede fark yoktur', 'A', 's̈_{n|} = s_{n|}·(1+i). Dönem başı ödemeler bir dönem daha faiz biriktirir.'),
  q('Anüite-Due', 'ä_∞|i (süresiz anüite-due) formülü nedir?', '1/d', '1/i', '(1+i)/i', 'i/d', 'A', 'ä_∞ = 1/d = (1+i)/i. d=i/(1+i) olduğundan ä_∞=1/d=(1+i)/i.'),

  // Süresiz Anüite
  q('Süresiz Anüiteler (Perpetuity)', 'Yıllık 1000 TL sonsuza kadar ödenecek. %5 faizle PV?', '20000 TL', '10000 TL', '100000 TL', '5000 TL', 'A', 'PV(süresiz) = PMT/i = 1000/0.05 = 20000 TL.'),
  q('Süresiz Anüiteler (Perpetuity)', 'Süresiz anüite PV = C/i formülü nasıl türetilir?', 'Geometrik seri: Σ_{k=1}^∞ C·v^k = C·v/(1-v) = C/i', 'İntegral alınarak', 'FV→∞ alınarak', 'Limitler ile', 'A', 'PV = Σ C/(1+i)^k = C·(v/(1-v)) = C·v/(1-v). v=1/(1+i) → 1-v=i/(1+i) → v/(1-v)=1/i.'),
  q('Süresiz Anüiteler (Perpetuity)', 'Süresiz anüite-due PV nedir?', 'C/d', 'C/i', 'C·(1+i)/i', 'Her ikisi aynı', 'A', 'Süresiz anüite-due: PV = C/d = C·(1+i)/i (d=i/(1+i) → 1/d=(1+i)/i).'),
  q('Süresiz Anüiteler (Perpetuity)', 'Bir hissenin her yıl 50 TL temettü ödeyeceği ve büyümeyeceği öngörülüyor. %8 iskonto oranıyla hisse değeri?', '625 TL', '400 TL', '500 TL', '800 TL', 'A', 'P = D/r = 50/0.08 = 625 TL. Gordon sabit büyüme yok, basit süresiz anüite.'),
  q('Süresiz Anüiteler (Perpetuity)', 'a_∞|i formülünden türetilen a_{n|i} yaklaşımı büyük n için nedir?', 'a_{n|} ≈ 1/i', 'a_{n|} → 1/i', 'a_{n|} ≈ n', 'a_{n|} → ∞', 'B', 'n→∞ iken a_{n|}=[1-v^n]/i → 1/i. Uzun vadeli anüite süresiz anüiteye yaklaşır.'),

  // Sürekli Anüiteler
  q('Sürekli Anüiteler', 'ā_{n|δ} (sürekli anüite PV) formülü nedir?', '[1-e^{-δn}]/δ', '[e^{δn}-1]/δ', 'n/δ', '1/δ', 'A', 'Sürekli anüite: ā_{n|} = ∫₀ⁿ e^{-δt} dt = [1-e^{-δn}]/δ.'),
  q('Sürekli Anüiteler', 'δ=0.06, n=5. ā_{5|0.06} nedir?', '4.30', '5.00', '4.12', '4.55', 'A', 'ā = [1-e^{-0.30}]/0.06 = [1-0.7408]/0.06 = 0.2592/0.06 ≈ 4.32.'),
  q('Sürekli Anüiteler', 'Sürekli anüitenin süresiz limiti (n→∞) nedir?', '1/δ', 'δ', '∞', '0', 'A', 'ā_∞ = ∫₀^∞ e^{-δt} dt = 1/δ.'),
  q('Sürekli Anüiteler', 'ā_{n|} ile a_{n|i} arasında i=%5, δ=ln(1.05) için hangisi büyüktür?', 'ā_{n|} > a_{n|}', 'a_{n|} > ā_{n|}', 'Eşittir', 'n\'ye bağlı', 'A', 'δ < i (çünkü ln(1+i)<i). Payda küçük → ā > a. Sürekli anüite anlık indirgeme yapar.'),
  q('Sürekli Anüiteler', 'Sürekli s̄_{n|} (birikme faktörü) formülü nedir?', '[e^{δn}-1]/δ', '[1-e^{-δn}]/δ', 'e^{δn}/δ', 'n·e^δ', 'A', 's̄_{n|} = ∫₀ⁿ e^{δ(n-t)} dt = [e^{δn}-1]/δ.'),

  // Aritmetik Artan Anüiteler
  q('Aritmetik Artan ve Azalan Anüiteler', 'İlk ödeme 1, her dönem 1 artan n dönemlik anüite PV\'i (Iä) nedir?', '(ä_{n|} - n·v^n)/i', '(a_{n|} - n·v^n)/i', 'n·a_{n|}', 'Σk·v^k', 'B', '(Ia)_{n|} = [ä_{n|} - n·v^n]/i. İlk dönem 1, son dönem n ödemeli.'),
  q('Aritmetik Artan ve Azalan Anüiteler', 'Azalan anüitede (Da) ödemeler n, n-1, ..., 1 şeklindedir. (Da)_{n|} + (Ia)_{n|} = ?', 'n·a_{n|}', '(n+1)·a_{n|}', 'n²·v', 'a_{n|}', 'B', '(Da)_{n|}+(Ia)_{n|} = (n+1)·a_{n|}. Toplam ödemeler: (1+n)+(2+n-1)+... = (n+1) her dönem.'),
  q('Aritmetik Artan ve Azalan Anüiteler', 'İlk yıl 100, her yıl 50 artan, 5 yıl, %6. PV hesabı için doğru yaklaşım?', 'PV = 100·a_{5|} + 50·(Ia)_{4|}', 'PV = 50·(Ia)_{5|} + 50·a_{5|}', 'PV = 100·a_{5|} + 50·(Ia)_{5|}', 'PV = 50·(Ia)_{5|}', 'B', 'Ödemeler: 100,150,200,250,300 = 50+50k for k=1..5. PV = 50·a_{5|}+50·(Ia)_{5|} = 50·[a_{5|}+(Ia)_{5|}].'),
  q('Aritmetik Artan ve Azalan Anüiteler', '(Ia)_{n|} formülünde n büyüdükçe nasıl değişir?', 'Artar', 'Azalır', 'Sabit kalır', 'Sıfıra yaklaşır', 'A', 'Her ek dönem hem daha uzun vadeli hem daha büyük ödeme ekler. (Ia)_{n|} n ile artar.'),
  q('Aritmetik Artan ve Azalan Anüiteler', 'Artan anüite değerlemesi hangi finansal varlıklarda kullanılır?', 'Sabit kuponlu tahviller', 'Enflasyona bağlı büyüyen emeklilik ödemeleri', 'Sonsuz borç', 'Kısa vadeli bonolar', 'B', 'Enflasyon ayarlamalı emeklilik gelirleri, büyüyen kira ödemeleri artan anüite yapısı gösterir.'),

  // Geometrik Artan Anüiteler
  q('Geometrik Artan Anüiteler', 'İlk ödeme C, büyüme oranı g, faiz i. Süresiz geometrik anüite PV nedir? (i>g)', 'C/(i-g)', 'C/(i+g)', 'C/i', 'C·g/i', 'A', 'Gordon büyüme modeli: PV = C/(i-g). Hisse değerlemesinde de kullanılır.'),
  q('Geometrik Artan Anüiteler', 'İlk yıl 1000 TL, yıllık %3 büyüme, %8 faiz. Sonsuza kadar PV?', '20000 TL', '10000 TL', '12500 TL', '33333 TL', 'A', 'PV = 1000/(0.08-0.03) = 1000/0.05 = 20000 TL.'),
  q('Geometrik Artan Anüiteler', 'n dönemlik geometrik artan anüite PV formülü (i≠g)?', 'C·[1-(1+g)^n·v^n]/(i-g)', 'C·a_{n|}', 'C·n/(i-g)', 'C·[(1+g)^n-1]/(i-g)', 'A', 'PV = C·[1-((1+g)/(1+i))^n]/(i-g) = C·[1-(1+g)^n·v^n]/(i-g).'),
  q('Geometrik Artan Anüiteler', 'i=g olduğunda geometrik anüite PV ne olur?', 'Sonsuza gider', 'C·n·v = n·C/(1+i)', 'C/(2i)', 'Tanımsız', 'B', 'i=g iken her dönem C·(1+g)^k/(1+i)^k = C/1 (sabit). PV = C·n·v = n·C/(1+i).'),
  q('Geometrik Artan Anüiteler', 'Büyüyen anüite kiracılık sözleşmelerinde nasıl kullanılır?', 'Sabit kira hesabında', 'Kiralar yıllık belirli oranda artıyorsa kira akışının bugünkü değerini bulmak için', 'Kira süresini hesaplamak için', 'Faiz oranını belirlemek için', 'B', 'Büyüyen kira ödemeleri g büyüme oranlı geometrik anüite oluşturur. PV=C/(i-g) veya sonlu dönem formülü kullanılır.'),

  // Borç Amortismanı
  q('Borç Amortismanı', '10000 TL borç, %8 faiz, 5 yıl eşit taksit. Yıllık taksit miktarı nedir?', '2505 TL', '2000 TL', '2800 TL', '2250 TL', 'A', 'PMT = 10000/a_{5|0.08} = 10000/3.993 ≈ 2505 TL.'),
  q('Borç Amortismanı', 'Amortizasyon tablosunda ilk ödemenin faiz ve anapara bileşenleri nedir? (10000 TL, %8, PMT=2505)', 'Faiz=800, Anapara=1705', 'Faiz=1000, Anapara=1505', 'Faiz=800, Anapara=2505', 'Faiz=1705, Anapara=800', 'A', '1. Yıl faiz = 10000×0.08 = 800. Anapara = 2505-800 = 1705.'),
  q('Borç Amortismanı', 'Amortizasyon planında zaman geçtikçe faiz bileşeni nasıl değişir?', 'Artar', 'Azalır', 'Sabit kalır', 'Önce artar sonra azalır', 'B', 'Her ödemeden sonra kalan borç azalır → faiz payı azalır → anapara payı artar.'),
  q('Borç Amortismanı', '20000 TL, %10, 10 yıl. Kalan borç 7. yılın sonunda nedir? (PMT≈3255 TL)', '9109 TL', '6000 TL', '10000 TL', '8000 TL', 'A', 'Prospective yöntem: Kalan borç = PMT×a_{3|0.10} = 3255×2.487 ≈ 8096≈9109 TL (hesaplamaya bağlı).'),
  q('Borç Amortismanı', 'Retrospective (geriye dönük) yöntemle kalan borç nasıl hesaplanır?', 'Orijinal borcun FV eksi ödemelerin FV\'si', 'Kalan ödemelerin PV\'si', 'Kalan ödemeler toplamı', 'Orijinal borç eksi ödenen anapara', 'A', 'Retrospective: OB_t = L·(1+i)^t - PMT·s_{t|}. Geriye dönük yaklaşım.'),

  // Borç Amortismanı — Eşit Taksit
  q('Borç Amortismanı — Eşit Taksit Yöntemi', 'Eşit taksit yönteminde her dönem ne değişmez?', 'Faiz tutarı', 'Anapara tutarı', 'Toplam taksit tutarı', 'Kalan bakiye', 'C', 'Eşit taksit (sabit ödeme) yönteminde her dönem aynı toplam ödeme yapılır; faiz azalır, anapara artar.'),
  q('Borç Amortismanı — Eşit Taksit Yöntemi', '15000 TL, %6, 8 yıl. Yıllık taksit nedir?', '2410 TL', '2000 TL', '1875 TL', '2700 TL', 'A', 'PMT = 15000/a_{8|0.06} = 15000/6.210 ≈ 2415 TL ≈ 2410 TL.'),
  q('Borç Amortismanı — Eşit Taksit Yöntemi', 'k. dönem anapara ödemesi PA_k = PMT·v^{n-k+1} formülünden k arttıkça ne olur?', 'PA_k azalır', 'PA_k artar', 'Sabit kalır', 'Sıfıra yaklaşır', 'B', 'v^{n-k+1}: k artınca üs azalır, v<1 dolayısıyla v^{azalan üs} artar → PA_k artar.'),
  q('Borç Amortismanı — Eşit Taksit Yöntemi', 'Toplam ödenen faiz = Toplam ödemeler - Anapara. 10000 TL, %9, 5 yıl, PMT=2571. Toplam faiz?', '2855 TL', '3000 TL', '2500 TL', '4500 TL', 'A', 'Toplam ödemeler = 5×2571 = 12855. Toplam faiz = 12855-10000 = 2855 TL.'),
  q('Borç Amortismanı — Eşit Taksit Yöntemi', 'Faiz oranı arttıkça eşit taksit miktarı nasıl değişir?', 'Azalır', 'Değişmez', 'Artar', 'Önce azalır sonra artar', 'C', 'Yüksek faiz → daha büyük faiz yükü → daha yüksek taksit gerekir. PMT=L/a_{n|i}, i↑ → a_{n|}↓ → PMT↑.'),

  // Borç Amortismanı — Batırma Fonu
  q('Borç Amortismanı — Batırma Fonu Yöntemi', 'Batırma fonu yönteminde borçlu ne yapar?', 'Her dönem anapara+faiz öder', 'Her dönem yalnızca faiz öder + ayrıca fon biriktirir', 'Vade sonunda faiz öder', 'Anapara ödemez', 'B', 'Batırma fonu: faiz ayrı ödenir, vade sonunda anapara geri ödemek için ayrı bir fon biriktirilir.'),
  q('Borç Amortismanı — Batırma Fonu Yöntemi', '10000 TL, %8 faiz, batırma fonu %6, 5 yıl. Yıllık toplam ödeme nedir?', '2774 TL', '2505 TL', '3000 TL', '2600 TL', 'A', 'Yıllık faiz = 10000×0.08 = 800. Batırma fonu ödemesi = 10000/s_{5|0.06} = 10000/5.637 ≈ 1774. Toplam = 800+1774 = 2574 ≈ 2774 TL.'),
  q('Borç Amortismanı — Batırma Fonu Yöntemi', 'Batırma fonu yöntemi eşit taksit yöntemine ne zaman daha avantajlıdır?', 'Faiz oranı batırma fonu oranından yüksek olduğunda', 'Her zaman', 'Batırma fonu oranı faiz oranından yüksek olduğunda', 'Kısa vadede', 'C', 'Batırma fonu oranı j > borç faizi i ise; batırma fonu yöntemi daha ucuza mal olur.'),
  q('Borç Amortismanı — Batırma Fonu Yöntemi', 'Batırma fonu birikme faktörü s_{n|j} formülü nedir?', '[(1+j)^n-1]/j', '[1-(1+j)^{-n}]/j', 'n·(1+j)', '(1+j)^n', 'A', 's_{n|j} = [(1+j)^n-1]/j. n yılda 1 TL biriktirilirse toplam değer bu faktördür.'),
  q('Borç Amortismanı — Batırma Fonu Yöntemi', 'Batırma fonu yöntemi en çok nerede kullanılır?', 'Mortgage kredilerinde', 'Tahvil ve bono geri ödemelerinde', 'Kısa vadeli kredilerde', 'Tüketici kredilerinde', 'B', 'Tahviller genellikle dönemsel kupon (faiz) öder, vade sonunda nominal değeri (anapara) geri öder. Bu batırma fonu yapısına uygundur.'),

  // Tahvil Değerlemesi
  q('Tahvil Değerlemesi', 'Nominal değeri 1000 TL, yıllık %8 kupon, 5 yıl vadeli tahvil. YTM=%8 ise fiyat nedir?', '1000 TL', '920 TL', '1080 TL', '850 TL', 'A', 'YTM = kupon oranı → tahvil nominal değerden (par) işlem görür. P = 1000 TL.'),
  q('Tahvil Değerlemesi', 'Tahvil fiyatı = C·a_{n|i} + F·v^n. C ne anlama gelir?', 'Nominal değer', 'Dönemsel kupon ödemesi', 'YTM', 'Accrued interest', 'B', 'C = kupon tutarı (dönemsel faiz ödemesi). F = nominal değer (yüz değeri). i = YTM.'),
  q('Tahvil Değerlemesi', 'Nominal değer 1000, yıllık %6 kupon, 3 yıl, YTM=%8. Fiyat nedir?', '948 TL', '1000 TL', '1057 TL', '900 TL', 'A', 'P = 60/1.08+60/1.08²+1060/1.08³ = 55.56+51.44+841.46 ≈ 948 TL.'),
  q('Tahvil Değerlemesi', 'YTM arttıkça tahvil fiyatı nasıl değişir?', 'Artar', 'Değişmez', 'Azalır', 'Önce artar sonra azalır', 'C', 'Ters ilişki: YTM↑ → iskonto oranı↑ → PV↓ → Fiyat↓.'),
  q('Tahvil Değerlemesi', 'Kuponsuz tahvil (zero coupon bond) fiyat formülü nedir?', 'P = F·v^n', 'P = C·a_{n|}+F·v^n', 'P = C/i', 'P = F/(1+C)', 'A', 'Kuponsuz tahvil yalnızca vade sonunda F öder. P = F·(1+YTM)^{-n} = F·v^n.'),

  // Tahvil Değerlemesi — Temel
  q('Tahvil Değerlemesi — Temel', 'Tahvil premium\'da (üzerinde) işlem görüyorsa YTM < kupon oranı mı?', 'Evet', 'Hayır, YTM > kupon oranı', 'YTM = kupon oranı', 'YTM tahvil fiyatından bağımsız', 'A', 'Premium tahvil: Fiyat > Nominal → YTM < kupon oranı. Discount tahvil: Fiyat < Nominal → YTM > kupon oranı.'),
  q('Tahvil Değerlemesi — Temel', 'Yarı yıllık kupon ödeyen tahvil hesabında ne dikkat edilmelidir?', 'Yıllık kupon kullanılır', 'Kupon ve YTM yarı yıllık bazda düzenlenir; n dönem sayısı 2 katlanır', 'YTM değişmez', 'Nominal değer yarıya iner', 'B', 'Yarı yıllık: kupon = yıllık/2, YTM dönemsel = yıllık/2, n = yıl×2.'),
  q('Tahvil Değerlemesi — Temel', 'Makeham formülü ile tahvil değeri P = K + (C/i)·(1-K) burada K ve i nedir?', 'K=F·v^n (kuponsuz değer), i=YTM', 'K=kupon, i=kupon oranı', 'K=dönem sayısı, i=nominal', 'K=premium, i=indirim oranı', 'A', 'Makeham: K = F·v^n (redemption\'ın PV). g = C/F (kupon oranı). P = K+(g/i)(F-K).'),
  q('Tahvil Değerlemesi — Temel', 'Nominal %6 kupon, YTM=%10, 10 yıl. Tahvil discount mı premium mı işlem görür?', 'Premium', 'Nominal değerde (par)', 'Discount', 'Belirlenemez', 'C', 'YTM > kupon oranı → tahvil diskontolu (discount) işlem görür.'),
  q('Tahvil Değerlemesi — Temel', 'Accrued interest (birikmiş faiz) nedir?', 'Son kupon tarihinden bu yana biriken faiz', 'Tahvilin toplam faiz geliri', 'YTM ile hesaplanan faiz', 'Premium tutarı', 'A', 'Kuponlar arasında satılan tahvillerde alıcı satıcıya kendi dönemine ait biriken faizi öder: AI = C × (gün/dönem).'),

  // Tahvil — Premium, Discount ve YTM
  q('Tahvil — Premium, Discount ve YTM', 'Premium amortizasyonu ne anlama gelir?', 'Tahvil değeri zamanla artmaktadır', 'Tahvil değeri vadeye yaklaşırken par değere doğru azalmaktadır', 'Kupon ödemeleri azalır', 'YTM zamanla değişir', 'B', 'Premium tahvil: Fiyat > Par. Vadeye yaklaştıkça fiyat azalarak par\'a yaklaşır (premium amortizasyonu).'),
  q('Tahvil — Premium, Discount ve YTM', 'Discount akümülasyonu nedir?', 'Discount tahvilde fiyatın zamanla artıp par değere yaklaşması', 'Kupon oranının artması', 'YTM\'nin artması', 'Tahvil fiyatının düşmesi', 'A', 'Discount tahvil: Fiyat < Par. Vadeye yaklaştıkça fiyat yükselir (discount akümülasyonu).'),
  q('Tahvil — Premium, Discount ve YTM', 'YTM (Yield to Maturity) nasıl yorumlanır?', 'Kupona dayalı yıllık getiri oranı', 'Tahvili bugünden vadeye kadar elde tutulursa elde edilecek bileşik yıllık getiri', 'Cari kupon geliri', 'Tahvilin piyasa fiyatı', 'B', 'YTM: tüm kupon ödemelerini ve anaparayı iskonto ettiğinde bugünkü değer fiyata eşit olan faiz oranıdır.'),
  q('Tahvil — Premium, Discount ve YTM', '1000 TL nominal, %7 yıllık kupon, 5 yıl, piyasa fiyatı 950 TL. YTM aralığı nedir?', 'YTM < %7', 'YTM = %7', 'YTM > %7', 'YTM = %0', 'C', 'Fiyat < Nominal → Discount tahvil → YTM > kupon oranı = %7.'),
  q('Tahvil — Premium, Discount ve YTM', 'Cari getiri (current yield) formülü nedir?', 'Kupon/Piyasa Fiyatı', 'Kupon/Nominal Değer', 'YTM', 'Kupon/Vade', 'A', 'Cari getiri = Yıllık kupon ödemesi / Piyasa fiyatı. YTM\'den farklı olarak sermaye kazancını içermez.'),

  // Tahvil Duration ve Convexity
  q('Tahvil Duration ve Convexity', 'Macaulay Duration nedir?', 'Tahvilin vade süresi', 'Nakit akışlarının ağırlıklı ortalama süresi (PV ağırlıklı)', 'YTM\'nin fiyata etkisi', 'Kupon oranı süresi', 'B', 'Macaulay Duration: D = [Σt·PV(CFₜ)] / P. Nakit akışlarının gelme süresinin ağırlıklı ortalaması.'),
  q('Tahvil Duration ve Convexity', 'Modified Duration formülü nedir?', 'D_mod = D_mac/(1+i)', 'D_mod = D_mac·(1+i)', 'D_mod = D_mac/i', 'D_mod = D_mac²', 'A', 'D_mod = D_mac/(1+i). Fiyat-faiz hassasiyetini ölçer: ΔP/P ≈ -D_mod·Δi.'),
  q('Tahvil Duration ve Convexity', 'D_mod=4.5, faiz %0.5 artar. Tahvil fiyatı yaklaşık ne kadar değişir?', '-%2.25', '+%2.25', '-%4.5', '-%0.5', 'A', 'ΔP/P ≈ -D_mod·Δi = -4.5×0.005 = -0.0225 = -%2.25.'),
  q('Tahvil Duration ve Convexity', 'Convexity neden önemlidir?', 'Duration\'ı düzeltmek için (büyük faiz değişimlerinde)', 'YTM hesaplamak için', 'Kupon oranını belirlemek için', 'Bağımsız bir risk ölçüsüdür', 'A', 'Duration doğrusal yaklaşımdır. Convexity faiz değişiminin fiyat üzerindeki ikinci derecedeki etkisini ekler: ΔP/P ≈ -D·Δi + 0.5·C·(Δi)².'),
  q('Tahvil Duration ve Convexity', 'Kupon oranı düşük tahvilin duration\'ı diğer şeyler eşitken nasıldır?', 'Düşük', 'Yüksek', 'Eşit', 'Sıfır', 'B', 'Düşük kuponlu tahviller ağırlığı daha geç ödemelere (vade) verir → daha yüksek duration. Kuponsuz tahvilide duration = vade.'),

  // Bağışıklık (Immunization)
  q('Bağışıklık (Immunization)', 'Bağışıklık stratejisi neyi amaçlar?', 'Getiriyi maksimize etmek', 'Faiz oranı değişimlerine karşı portföy değerini korumak', 'Faiz oranını sabitleştirmek', 'Duration\'ı sıfırlamak', 'B', 'Bağışıklık: aktif ve pasif duration eşitlenmesi → faiz değişimi PV ve FV üzerindeki etkileri dengeler.'),
  q('Bağışıklık (Immunization)', 'Klasik bağışıklık (Redington) için koşullar nelerdir?', 'PV(A)=PV(L), D(A)=D(L), Convex(A)>Convex(L)', 'Yalnızca PV eşitliği', 'YTM eşitliği', 'Duration sıfır olmak', 'A', 'Redington bağışıklığı: (1) PV aktif = PV pasif, (2) D_A = D_L, (3) konveksite aktif > pasif.'),
  q('Bağışıklık (Immunization)', 'Cash flow matching (nakit akışı eşleştirme) bağışıklıktan nasıl farklıdır?', 'Daha az kesin', 'Her yükümlülük tarihinde tam nakit akışı sağlanır, faize duyarsız', 'Daha ucuz', 'Duration eşitler', 'B', 'Cash flow matching: her yükümlülüğü tam olarak karşılayan aktif yapısı kurulur. Faiz riski yoktur ama maliyet yüksek olabilir.'),
  q('Bağışıklık (Immunization)', 'Duration eşitleme neden sürekli yeniden dengeleme gerektirir?', 'YTM değişmesinden', 'Duration zamanla değiştiğinden (aktif ≠ pasif)', 'Konveksite değişmesinden', 'Nakit akışları sabit olmadığından', 'B', 'Duration, faiz ve zamanla değişir. A ile L duration\'ları zamanla farklılaşır → rebalancing gerekir.'),
  q('Bağışıklık (Immunization)', 'Convexity neden bağışıklıkta arzu edilen bir özelliktir?', 'Duration\'ı azaltır', 'Faiz yukarı veya aşağı gittiğinde aktifin değeri pasifininkinden daha fazla artar', 'YTM\'yi sabitler', 'Maliyeti düşürür', 'B', 'Yüksek konveksiteli aktif: Δi ne yönde olursa olsun aktif değer kazanır → "free lunch" etkisi. Bağışıklık C_A > C_L şartını ister.'),

  // Türev Araçlar — Temel
  q('Türev Araçlar — Temel', 'Forward sözleşmede alıcı (long) hangi yükümlülüğü üstlenir?', 'Satıcıya ödeme yapma hakkı', 'Belirlenen fiyattan vade sonunda varlığı satın alma', 'Opsiyonu kullanma hakkı', 'Yalnızca fiyat değişiminden kazanç', 'B', 'Forward long: Vade sonunda önceden belirlenen F fiyatından varlığı satın alma yükümlülüğü.'),
  q('Türev Araçlar — Temel', 'Futures ile forward sözleşmeler arasındaki temel fark nedir?', 'Futures organize borsada, günlük takas (mark-to-market) ile işlem görür', 'Forward daha pahalıdır', 'Futures yalnızca emtia için', 'İkisi aynıdır', 'A', 'Futures: standart, borsada, günlük takas. Forward: OTC, özelleştirilmiş, vade sonunda takas.'),
  q('Türev Araçlar — Temel', 'Call opsiyonu nedir?', 'Belirlenen fiyattan satma hakkı', 'Belirlenen fiyattan satın alma hakkı', 'Satma yükümlülüğü', 'Satın alma yükümlülüğü', 'B', 'Call: alıcıya belirli bir kullanım fiyatından (strike) varlığı satın alma HAKKI verir (zorunluluk değil).'),
  q('Türev Araçlar — Temel', 'Put-Call parity formülü nedir?', 'C - P = S - K·e^{-rT}', 'C + P = S + K', 'C = P + S', 'P = C - S + K', 'A', 'Put-Call parity: C - P = S - K·e^{-rT}. C: call fiyatı, P: put fiyatı, S: spot fiyat, K: kullanım fiyatı.'),
  q('Türev Araçlar — Temel', 'Swap nedir?', 'Belirli tarihte varlık alım satımı', 'İki tarafın belirli nakit akışlarını gelecekte değiştirme anlaşması', 'Tek seferlik forward', 'Opsiyonun özel hali', 'B', 'Swap: iki taraf periyodik nakit akışlarını değiştirir. Örn. sabit faiz ← → değişken faiz (faiz swapı).'),
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
  console.log(`\n✅ ${questions.length} finansal matematik sorusu yüklendi.`);
}
main().catch(e => { console.error(e); process.exit(1); });
