#!/usr/bin/env node
const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

const q = (exam_type, subject, topic, question_text, A, B, C, D, correct_answer, explanation) => ({
  exam_type, subject, topic, question_text,
  options_json: { A, B, C, D }, correct_answer, explanation, is_active: true,
});

const questions = [

  // ─── FİNANS TEORİSİ ───────────────────────────────────────────────────────

  // CAPM ve APT
  q('LEVEL_2','finans-teorisi','CAPM ve APT','CAPM\'e göre bir varlığın beklenen getirisi hangi formülle hesaplanır?','E(r)=α+βσ²','E(r)=rf+β[E(rm)-rf]','E(r)=rf+α·Cov(r,rm)','E(r)=rm·σ/σm','B','CAPM: E(r)=rf+β(E(rm)-rf). β=sistematik risk ölçüsü, (E(rm)-rf)=piyasa risk primi.'),
  q('LEVEL_2','finans-teorisi','CAPM ve APT','Beta değeri 1.5 olan bir hissenin piyasa risk primi %6 ve risksiz faiz %3 ise beklenen getirisi nedir?','%9','%12','%10','%13.5','B','E(r)=3+1.5×6=3+9=%12.'),
  q('LEVEL_2','finans-teorisi','CAPM ve APT','APT (Arbitraj Fiyatlama Teorisi) CAPM\'den nasıl ayrılır?','APT tek faktör kullanır','APT çok faktör kullanır ve piyasa portföyü varsayımına ihtiyaç duymaz','APT yalnızca sistematik riski ölçer','APT ve CAPM eşdeğerdir','B','APT: E(ri)=rf+Σβij·λj. Birden fazla makroekonomik faktör (enflasyon, faiz, GDP...) kullanır.'),
  q('LEVEL_2','finans-teorisi','CAPM ve APT','Güvenlik Piyasa Doğrusu (SML) üzerinde yer alan varlık için Alfa (α) nedir?','α > 0','α < 0','α = 0','α hesaplanamaz','C','SML üzerindeki varlık tam olarak fiyatlanmıştır. Alfa=0. Üzerinde α>0 (ucuz), altında α<0 (pahalı).'),
  q('LEVEL_2','finans-teorisi','CAPM ve APT','Diversifikasyon ile ortadan kaldırılabilen risk türü hangisidir?','Sistematik risk','Piyasa riski','Beta riski','Sistematik olmayan (spesifik) risk','D','Spesifik/idiosyncratic risk çeşitlendirme ile elimine edilir. Sistematik risk (beta) kaldırılamaz.'),

  // Faiz Oranı Modelleri
  q('LEVEL_2','finans-teorisi','Faiz Oranı Modelleri','Vasicek modeli hangi özelliğe sahiptir?','Faiz oranı sıfırın altına inemez','Ortalamaya dönüş (mean reversion) özelliği taşır','Faiz oranı lognormal dağılıma uyar','Faiz oynaklığı sabit değildir','B','dr = κ(θ-r)dt + σdW. κ: mean reversion hızı, θ: uzun dönem ortalama. Negatif faiz mümkündür.'),
  q('LEVEL_2','finans-teorisi','Faiz Oranı Modelleri','Cox-Ingersoll-Ross (CIR) modelinin Vasicek\'ten farkı nedir?','Ortalamaya dönüş yoktur','Oynaklık terimi √r içerir, faiz negatif olamaz','Tek faktörlü değildir','CIR deterministik bir modeldir','B','CIR: dr=κ(θ-r)dt+σ√r·dW. √r sayesinde r=0 iken oynaklık sıfırlanır, negatif faiz imkânsız.'),
  q('LEVEL_2','finans-teorisi','Faiz Oranı Modelleri','Getiri eğrisinin (yield curve) pozitif eğimli olması ne anlama gelir?','Kısa vadeli faizler uzun vadeliden yüksek','Uzun vadeli faizler kısa vadeliden yüksek','Tüm vadeler aynı faizi taşır','Ekonomi durgunluktadır','B','Normal (pozitif eğimli) getiri eğrisi: uzun vadeli risk primi ve enflasyon beklentisini yansıtır.'),
  q('LEVEL_2','finans-teorisi','Faiz Oranı Modelleri','Ho-Lee modeli nasıl sınıflandırılır?','Arbitraj içeren tek faktörlü model','Arbitrajsız (no-arbitrage) tek faktörlü model','Çok faktörlü stokastik model','Deterministik faiz modeli','B','Ho-Lee: dr=θ(t)dt+σdW. θ(t) mevcut getiri eğrisine kalibre edilir; piyasa tutarlıdır.'),
  q('LEVEL_2','finans-teorisi','Faiz Oranı Modelleri','Duration (süre) kavramı faiz oranı riski açısından ne ölçer?','Tahvilin nominal değeri','Tahvil fiyatının faize duyarlılığı (elastikiyet)','Kupon oranı','Vadeye kadar getiri','B','Modified Duration = -(1/P)·dP/di. Faiz 1 bp artarsa tahvil fiyatı yaklaşık MD kadar düşer.'),

  // Opsiyon Fiyatlaması (Black-Scholes)
  q('LEVEL_2','finans-teorisi','Opsiyon Fiyatlaması (B-S)','Black-Scholes modelinde Avrupa alım opsiyonunun (call) fiyatı hangi formülle bulunur?','C=S·N(d1)-K·e^{-rT}·N(d2)','C=K·N(d1)-S·N(d2)','C=S-K·e^{-rT}','C=S·N(d2)-K·N(d1)','A','BS: C=S·N(d1)-Ke^{-rT}·N(d2). d1=[ln(S/K)+(r+σ²/2)T]/(σ√T), d2=d1-σ√T.'),
  q('LEVEL_2','finans-teorisi','Opsiyon Fiyatlaması (B-S)','Put-Call paritesi hangi ilişkiyi ifade eder?','C+P=S+K','C-P=S-K·e^{-rT}','C+K·e^{-rT}=P+S','C=P','C','Avrupa opsiyonları için Put-Call paritesi: C+Ke^{-rT}=P+S. Arbitrajsız fiyatlamayı garantiler.'),
  q('LEVEL_2','finans-teorisi','Opsiyon Fiyatlaması (B-S)','Bir opsiyonun Delta\'sı nedir?','Opsiyonun zaman değeri','Opsiyon fiyatının dayanak varlık fiyatına göre türevi','Opsiyonun oynaklığa duyarlılığı','Faize duyarlılığı','B','Delta = ∂C/∂S. Alım opsiyonunda 0 ile 1 arasında; satım opsiyonunda -1 ile 0 arasında.'),
  q('LEVEL_2','finans-teorisi','Opsiyon Fiyatlaması (B-S)','Vega Yunanlısı neyi ölçer?','Fiyatın vadeye duyarlılığı','Fiyatın volatiliteye duyarlılığı','Delta\'nın fiyata göre değişimi','Fiyatın faize duyarlılığı','B','Vega = ∂C/∂σ. Oynaklık 1 birim arttığında opsiyon fiyatındaki değişimi ölçer.'),
  q('LEVEL_2','finans-teorisi','Opsiyon Fiyatlaması (B-S)','Black-Scholes\'de dayanak varlık fiyatı hangi süreci izler?','Poisson süreci','Geometrik Brownian Motion','Ornstein-Uhlenbeck süreci','Deterministik süreç','B','dS=μS·dt+σS·dW. Log-normal fiyat dağılımı varsayımı: ln(S_T) ~ Normal.'),

  // Portföy Teorisi (Markowitz)
  q('LEVEL_2','finans-teorisi','Portföy Teorisi (Markowitz)','Markowitz portföy teorisinde etkin sınır (efficient frontier) nedir?','En yüksek getiri veren portföy seti','Belirli bir risk düzeyi için maksimum getiri sağlayan portföyler kümesi','En düşük riskli portföy','Tüm mümkün portföylerin kümesi','B','Etkin sınır: verilen varyans için beklenen getiriyi maksimize eden portföyler. Alt kısım non-etkin.'),
  q('LEVEL_2','finans-teorisi','Portföy Teorisi (Markowitz)','İki varlıktan oluşan portföyün varyansı hangi formülle hesaplanır?','w1²σ1²+w2²σ2²','w1²σ1²+w2²σ2²+2w1w2σ12','w1σ1+w2σ2','(w1σ1+w2σ2)²','B','Var(p)=w1²σ1²+w2²σ2²+2w1w2Cov(r1,r2). Korelasyon düşükse çeşitlendirme faydası artar.'),
  q('LEVEL_2','finans-teorisi','Portföy Teorisi (Markowitz)','Sharpe oranı nasıl hesaplanır?','(E(r)-rf)/σ','(E(r)-rf)/β','E(r)/σ','(E(r)-rm)/σ','A','Sharpe = (E(rp)-rf)/σp. Risk başına fazla getiri; portföy performans ölçütü.'),
  q('LEVEL_2','finans-teorisi','Portföy Teorisi (Markowitz)','Minimum varyans portföyü (MVP) nedir?','En yüksek Sharpe oranlı portföy','En küçük standart sapmaya sahip portföy','Riskiz varlığı içeren portföy','Tüm yatırım evrenini içeren portföy','B','MVP: etkin sınırın en sol noktası. ∂Var(p)/∂w=0 çözümünden bulunur.'),
  q('LEVEL_2','finans-teorisi','Portföy Teorisi (Markowitz)','Sermaye Piyasa Doğrusu (CML) neden SML\'den farklıdır?','CML tüm varlıkları, SML sadece piyasa portföyünü gösterir','CML sistematik risk (beta), SML toplam risk (σ) kullanır','CML risksiz varlık + piyasa portföyü kombinasyonlarını; SML bireysel varlıkların β-getiri ilişkisini gösterir','Aralarında fark yoktur','C','CML: E(rp)=rf+(E(rm)-rf)·σp/σm. SML: E(ri)=rf+βi(E(rm)-rf). CML toplam risk, SML sistematik risk.'),

  // Stokastik Süreçler
  q('LEVEL_2','finans-teorisi','Stokastik Süreçler','Standart Brownian Motion (Wiener süreci) hangi özelliklere sahiptir?','W(0)=0; artışlar bağımsız; W(t)-W(s)~N(0,t-s)','W(0)=1; artışlar bağımlı; normal dağılım','W(t) kesikli zamanda tanımlı','W(t)~Poisson(λt)','A','BM özellikleri: W(0)=0, bağımsız artışlar, W(t)-W(s)~N(0,t-s), sürekli yollar.'),
  q('LEVEL_2','finans-teorisi','Stokastik Süreçler','Itô lemması ne amaçla kullanılır?','Deterministik diferansiyel denklem çözmek için','Stokastik diferansiyel denklemlerde fonksiyon dönüşümü için','Olasılık dağılımı bulma için','Matris tersi almak için','B','Itô: df=(∂f/∂t+μ∂f/∂x+½σ²∂²f/∂x²)dt+σ∂f/∂x·dW. BS denkleminin türetiminde kullanılır.'),
  q('LEVEL_2','finans-teorisi','Stokastik Süreçler','Martingale nedir?','E[X(t+s)|Ft]=X(s) koşulunu sağlayan süreç','Her adımda artan süreç','Sabit ortalamaya sahip süreç','Poisson sayma süreci','A','Martingale: gelecekteki beklenen değer mevcut değere eşit. Adil oyun analojisi.'),
  q('LEVEL_2','finans-teorisi','Stokastik Süreçler','Poisson süreci N(t) için E[N(t)] ve Var[N(t)] nedir?','λt ve λ²t²','λt ve λt','λ ve λ','λt ve 2λt','B','Poisson: E[N(t)]=λt, Var[N(t)]=λt. Ortalama=Varyans=λt.'),
  q('LEVEL_2','finans-teorisi','Stokastik Süreçler','Risk-nötr ölçüm (risk-neutral measure) türev fiyatlamada neden kullanılır?','Gerçek dünyadaki getirileri hesaplamak için','Tüm varlıkların risksiz faizle büyüdüğü varsayımıyla arbitrajsız fiyat bulmak için','Beklenen karı maksimize etmek için','Monte Carlo simülasyonu devre dışı bırakmak için','B','Q-ölçüm altında: E^Q[e^{-rT}·payoff]. Girsanov teoremi ile gerçek P ölçümünden Q\'ya geçilir.'),

  // ─── MUHASEBE ─────────────────────────────────────────────────────────────

  // Finansal Raporlama
  q('LEVEL_2','muhasebe','Finansal Raporlama','TFRS\'ye göre finansal tablolar hangi temel ilkeye dayanır?','Tarihi maliyet ilkesi','Gerçeğe uygun sunum (fair presentation) ilkesi','Muhafazakârlık ilkesi','Vergi esaslı muhasebe','B','TFRS: finansal tablolar gerçeğe uygun şekilde sunulmalı. İşlemlerin özü biçiminden önce gelir.'),
  q('LEVEL_2','muhasebe','Finansal Raporlama','Kapsamlı gelir tablosu (OCI) ile standart kâr/zarar tablosu arasındaki fark nedir?','OCI vergi içermez','OCI gerçekleşmemiş kazanç/kayıpları (aktüeryal kazançlar vb.) da içerir','OCI yalnızca nakit akışlarını gösterir','İkisi aynıdır','B','OCI: kâr/zarara dahil edilmeyen kalemler. Aktüeryal kazançlar, kur farkları, nakit akış hedge kazançları.'),
  q('LEVEL_2','muhasebe','Finansal Raporlama','Bilanço denkliği nedir?','Aktifler = Özkaynak','Aktifler = Pasifler + Özkaynak','Aktifler = Borçlar - Özkaynak','Gelirler = Giderler + Kâr','B','Aktifler = Yabancı Kaynaklar (Borçlar) + Özkaynak. Çift taraflı kayıt sisteminin temelidir.'),
  q('LEVEL_2','muhasebe','Finansal Raporlama','İşletmenin sürekliliği (going concern) varsayımı ne anlama gelir?','Şirket her yıl kâr etmek zorundadır','Finansal tablolar şirketin faaliyetlerine devam edeceği varsayımıyla hazırlanır','Şirket birleşme planlaması yapabilir','Şirketin tasfiyesi planlanmaktadır','B','Going concern: tablolar işletmenin öngörülebilir gelecekte faaliyetini sürdüreceği varsayımıyla hazırlanır.'),
  q('LEVEL_2','muhasebe','Finansal Raporlama','Gerçeğe uygun değer (fair value) nasıl tanımlanır?','Tarihi alış maliyeti','Piyasada ölçüm tarihinde elde edilecek satış fiyatı','Muhasebe tarafından belirlenen değer','Vergi değeri','B','TFRS 13: Fair value = çıkış fiyatı. Öncelik sırası: Seviye 1 (piyasa fiyatı), 2 (gözlemlenebilir), 3 (model).'),

  // IFRS 17
  q('LEVEL_2','muhasebe','IFRS 17 — Sigorta Sözleşmeleri','IFRS 17\'nin temel ölçüm modeli (GMM) kaç bileşenden oluşur?','2','3','4','5','C','GMM: (1) Gelecek nakit akışlarının tahmini, (2) Risk düzeltmesi, (3) Sözleşme hizmet marjı (CSM), (4) Zaman değeri.'),
  q('LEVEL_2','muhasebe','IFRS 17 — Sigorta Sözleşmeleri','IFRS 17\'de Sözleşme Hizmet Marjı (CSM) nedir?','Sigortacının beklenen zararı','Sözleşmede henüz kazanılmamış kâr; hizmet süresine yayılarak gelir yazılır','Hasar provizyon karşılığı','Reasürans geliri','B','CSM: sigorta sözleşmesinin başlangıçtaki kârlılığını temsil eder; hizmet süresi boyunca amorti edilir.'),
  q('LEVEL_2','muhasebe','IFRS 17 — Sigorta Sözleşmeleri','IFRS 17\'de prim geliri nasıl muhasebeleştirilir?','Alındığında gelir yazılır','Hizmet verildikçe (coverage period boyunca) gelir olarak yansıtılır','Prim ödeme tarihleri boyunca eşit dağıtılır','Hasarlar ödendiğinde gelir yazılır','B','IFRS 17 prim geliri yöntemi: sigorta hizmeti sağlandıkça gelir muhasebeleştirilir; nakit bazlı değil.'),
  q('LEVEL_2','muhasebe','IFRS 17 — Sigorta Sözleşmeleri','IFRS 17\'de risk düzeltmesi (risk adjustment) ne anlama gelir?','İskonto oranı düzeltmesi','Finansal olmayan risk için tazminat; belirsizliği taşıma maliyeti','Kur riski hedge düzeltmesi','Aktüeryal tablo düzeltmesi','B','Risk adjustment: sigorta sözleşmelerinde kalan finansal olmayan risk belirsizliğini azaltmak için gerekli tazminat.'),
  q('LEVEL_2','muhasebe','IFRS 17 — Sigorta Sözleşmeleri','PPA (Premium Allocation Approach) ne zaman kullanılabilir?','Her sigorta sözleşmesinde','Kısa vadeli sözleşmelerde (genellikle ≤1 yıl) veya sonuçlar GMM\'ye yakın olduğunda','Yalnızca hayat sigortasında','Reasürans sözleşmelerinde','B','PAA: kısa vadeli hayat dışı poliçelerde basitleştirilmiş ölçüm yaklaşımı. Prim esaslı ön yükümlülük.'),

  // Muhasebe Temelleri ve Bilanço
  q('LEVEL_2','muhasebe','Muhasebe Temelleri ve Bilanço','Dönen varlıklar ile duran varlıklar arasındaki temel ayrım nedir?','Değerlerine göre','12 ay içinde nakde dönüp dönmeyeceğine göre','Fiziksel olup olmadığına göre','Edinim yöntemine göre','B','Dönen varlık: ≤12 ay içinde nakit/kullanıma dönecek (nakit, alacaklar, stok). Duran: uzun vadeli varlıklar.'),
  q('LEVEL_2','muhasebe','Muhasebe Temelleri ve Bilanço','Mevduat sigortası şirketinin bilançosunda teknik karşılıklar hangi kısımda yer alır?','Aktif – Maddi duran varlıklar','Pasif – Uzun/kısa vadeli yükümlülükler','Özkaynak','Nazım hesaplar','B','Teknik karşılıklar (kazanılmamış primler, hasar karşılıkları vb.) sigortacı bilançosunda yükümlülük olarak gösterilir.'),
  q('LEVEL_2','muhasebe','Muhasebe Temelleri ve Bilanço','Tahakkuk esaslı muhasebede gelir ne zaman kaydedilir?','Nakit alındığında','Kazanıldığında (hizmet verildiğinde)','Fatura kesildiğinde','Vergi beyanında','B','Tahakkuk esası: gelir/gider ekonomik olay gerçekleştiğinde kaydedilir; nakit hareketinden bağımsız.'),
  q('LEVEL_2','muhasebe','Muhasebe Temelleri ve Bilanço','Özkaynak değişim tablosunun amacı nedir?','Nakit girişlerini göstermek','Dönem başı ile sonu özkaynak kalemlerindeki değişimleri açıklamak','Teknik karşılık hesaplamalarını sunmak','Vergi yükümlülüklerini raporlamak','B','Özkaynak tablosu: sermaye, yedekler, dağıtılmamış kâr ve OCI kalemlerindeki hareketi gösterir.'),

  // Sigorta Şirketleri Muhasebesi
  q('LEVEL_2','muhasebe','Sigorta Şirketleri Muhasebesi','Kazanılmamış primler karşılığı (KPK) nasıl hesaplanır?','Prim × hasar oranı','Yazılan primler × (kalan gün / toplam gün) şeklinde döneme ait kazanılmamış kısım','Toplam hasar / prim','Brüt prim - reasürans payı','B','KPK: yazılan primin bitirilmemiş kapsam dönemine ait kısmı. Pro-rata yöntem: P × (1-t/T).'),
  q('LEVEL_2','muhasebe','Sigorta Şirketleri Muhasebesi','IBNR (Incurred But Not Reported) karşılığının amacı nedir?','Gelecekteki prim gelirlerini tahmin etmek','Gerçekleşmiş ancak henüz ihbar edilmemiş hasarlar için karşılık ayırmak','Reasürans primlerini muhasebeleştirmek','Yatırım gelirlerini sınıflandırmak','B','IBNR: hasar meydana gelmiş ama sigortacıya henüz bildirilmemiş. Aktüeryal yöntemlerle tahmin edilir.'),
  q('LEVEL_2','muhasebe','Sigorta Şirketleri Muhasebesi','Kombine rasyo (combined ratio) nasıl hesaplanır?','Hasar oranı × prim','Hasar oranı + gider oranı','Prim / hasar','Net prim / brüt prim','B','Combined Ratio = Loss Ratio + Expense Ratio. CR < %100 teknik kâr; CR > %100 teknik zarar demektir.'),
  q('LEVEL_2','muhasebe','Sigorta Şirketleri Muhasebesi','Sigortacılık muhasebesi hangi özelliği nedeniyle genel işletme muhasebesinden ayrılır?','Kasa defteri tutmaz','Önce prim tahsil edilir, asıl maliyet (hasar) sonra gerçekleşir — ters üretim döngüsü','Gerçeğe uygun değer kullanmaz','Stok muhasebesi yapılmaz','B','Ters üretim döngüsü: sigorta şirketi önce premi alır; hasarın ne zaman ve ne kadar olacağı belirsizdir.'),

  // ─── RİSK ANALİZİ ─────────────────────────────────────────────────────────

  // Hasar Dağılımları
  q('LEVEL_2','risk-analizi','Hasar Dağılımları','Lognormal dağılım hasar modellemede neden tercih edilir?','Negatif hasar olasılığı yüksek','Sağa çarpık ve pozitif değerler alır; büyük hasarları modellemede uygundur','Simetrik ve hafif kuyruklu','Parametresi tek','B','Hasar miktarları X>0 ve sağa çarpık. Lognormal: ln(X)~N(μ,σ²). Sigorta hasarları için yaygın.'),
  q('LEVEL_2','risk-analizi','Hasar Dağılımları','Pareto dağılımının ağır kuyruk (heavy tail) özelliği ne anlama gelir?','Ortalama her zaman sonsuzdur','Büyük hasarların olasılığı üstel dağılıma göre daha yavaş azalır','Tüm momentler mevcuttur','Varyans sonsuzdur, ortalama sonlu','B','Pareto kuyruğu güç yasası (power law) ile azalır: P(X>x)=(θ/(x+θ))^α. Katastrofik riskler için uygun.'),
  q('LEVEL_2','risk-analizi','Hasar Dağılımları','Mean Excess Loss (MEL) fonksiyonu e(d) nedir?','P(X>d) olasılığı','E[X-d | X>d] — d tutarını aşan hasarlarda ortalama aşım','E[X]','Hasar sıklığı beklentisi','B','MEL: e(d)=E[X-d|X>d]. Üstel dağılımda sabit; Pareto\'da artan; sınırlı hasarda azalan.'),
  q('LEVEL_2','risk-analizi','Hasar Dağılımları','Karışım dağılımı (mixture distribution) hasar modellemede neden kullanılır?','Hesabı kolaylaştırmak için','Farklı hasar türlerini (küçük sık + büyük nadir) tek modelde birleştirmek için','Parametre sayısını azaltmak için','Sadece kesikli hasarlar için','B','Karışım: f(x)=p·f1(x)+(1-p)·f2(x). Örneğin %80 küçük Gamma + %20 büyük Pareto hasarları.'),
  q('LEVEL_2','risk-analizi','Hasar Dağılımları','Üstel dağılımın bellek-sız (memoryless) özelliği hasarcılıkta ne ifade eder?','Her hasar birbirinden bağımsız','P(X>s+t|X>s)=P(X>t); geçmiş hasarın büyüklüğü gelecekteki aşım olasılığını etkilemez','Hasar sıklığı sabit','Hasar miktarları eşit dağılır','B','Memoryless: e(d)=1/λ sabit. Hasar d\'yi aşmışsa ek aşım yine Exp(λ) dağılır.'),

  // Hasar Provizyonları (IBNR)
  q('LEVEL_2','risk-analizi','Hasar Provizyonları (IBNR)','Chain-Ladder yönteminde geliştirme faktörü (LDF) nasıl hesaplanır?','Sonraki dönem kümülatif hasarın önceki döneme oranı','Prim / Hasar','Hasar sayısı / Prim','Enflasyon düzeltmesi','A','LDF: f_k = ΣC_{i,k+1}/ΣC_{ik}. Kümülatif hasar üçgeninde her sütundan diğerine gelişim faktörü.'),
  q('LEVEL_2','risk-analizi','Hasar Provizyonları (IBNR)','Bornhuetter-Ferguson (BF) yöntemi Chain-Ladder\'dan farkı nedir?','BF sadece sıklık kullanır','BF başlangıç a priori tahminini (expected loss) Chain-Ladder ile ağırlıklı ortalama alarak birleştirir','BF sadece son kazanım yılını dikkate alır','Aralarında fark yoktur','B','BF: R_i = (1-1/CDF_i)·ELR·Premium + (1/CDF_i·mevcut gelişim). A priori + CL karması.'),
  q('LEVEL_2','risk-analizi','Hasar Provizyonları (IBNR)','Kazanım yılı (accident year) ile raporlama yılı (report year) arasındaki fark nedir?','Aynı kavramdır','Kazanım yılı hasarın gerçekleştiği yıl; raporlama yılı sigortacıya ihbar edildiği yıl','Raporlama yılı daha öncedir','Sadece hayat sigortasında kullanılır','B','IBNR analizi için ikisi farklı. Hasar 2022\'de gerçekleşir, 2024\'te ihbar edilirse: acc.year=2022, rep.year=2024.'),
  q('LEVEL_2','risk-analizi','Hasar Provizyonları (IBNR)','Hasar provizyonunun yetersiz (under-reserve) olması sigorta şirketi için ne sonuç doğurur?','Sermaye fazlası artar','Gelecekte rezerv artışı ve kâr azalması; ödeme gücü riski','Yüksek prim geliri','Vergi avantajı sağlar','B','Under-reserve: gerçekleşen hasarlar karşılıkları aşarsa gelecekte zarar yazılır ve sermaye erir.'),
  q('LEVEL_2','risk-analizi','Hasar Provizyonları (IBNR)','Cape Cod yönteminde Expected Loss Ratio (ELR) nasıl belirlenir?','Geçmiş yıl oranları ortalaması','Gerçekleşen hasarlar / Beklenen primler (kullanılan gelişim faktörleri dikkate alınarak)','Piyasa ortalaması','Sabit %65','B','Cape Cod ELR = ΣC_i / Σ(P_i·(1-1/CDF_i)). Veriden türetilen a priori; BF\'nin özel versiyonu.'),

  // Kredibilite Teorisi
  q('LEVEL_2','risk-analizi','Kredibilite Teorisi','Bühlmann kredibilite formülü P = Z·X̄ + (1-Z)·μ nedir?','X̄: piyasa ortalaması, μ: gözlem ortalaması','Z: kredibilite ağırlığı; X̄: gözlem ortalaması; μ: a priori (topluluğun) ortalaması','Z daima 1\'dir','μ hasar provizyonudur','B','Bühlmann: Z=n/(n+k), k=v/a (v: beklenen süreç var.; a: var. of hypothetical means). Bayes tahmininin doğrusal yaklaşımı.'),
  q('LEVEL_2','risk-analizi','Kredibilite Teorisi','Tam kredibilite standardı (full credibility standard) ne anlama gelir?','Z=0','Z=1; gözlem verisine tam güven','Varyans sonsuz','Veriye hiç güvenilmez','B','Tam kredibilite: Z=1 → yalnızca gözlem verisi kullanılır. Standart: n≥1082 hasar (hasar sayısı için %5 tolerans, %95 güven).'),
  q('LEVEL_2','risk-analizi','Kredibilite Teorisi','Bühlmann-Straub modeli Bühlmann\'dan nasıl farklıdır?','Hiç fark yoktur','Her gözleme farklı ağırlık (m_i) atanır; ağırlıklı ortalamayla Z hesaplanır','Sadece hayat sigortasına uygulanır','Bayes değil frekansçı yaklaşım','B','Bühlmann-Straub: m_i farklı maruz kalmalar için. Z=m/(m+k), m=Σm_i. Bileşik büyük veriler için.'),
  q('LEVEL_2','risk-analizi','Kredibilite Teorisi','Kredibilite teorisinin sigorta tarife uygulamasındaki amacı nedir?','Hasarları sıfıra indirmek','Bireysel deneyim ile topluluk deneyimini optimal şekilde ağırlıklandırarak güvenilir prim tahmini elde etmek','Prim bütçesini kısaltmak','Reasürans maliyetini hesaplamak','B','Aktüeryal tarife: kendi deneyim az ise topluluğa yak. Z küçük → μ ağır. Veri arttıkça Z→1.'),
  q('LEVEL_2','risk-analizi','Kredibilite Teorisi','İçsel (within-group) varyans v ve gruplar arası varyans a\'nın kredibilitedeki rolü nedir?','v arttıkça Z artar','a/v arttıkça Z artar; yüksek gruplar arası farklılık daha fazla bireysel deneyim ağırlığı demektir','v ve a eşit olursa Z=1','k=a/v','B','k=v/a. k küçük (a büyük/v küçük) → Z büyük. Gruplar çok farklıysa kendi deneyim daha değerli.'),

  // Reasürans Modelleri
  q('LEVEL_2','risk-analizi','Reasürans Modelleri','Excess of Loss (XL) reasüransının yapısı nasıldır?','Primler bölüşülür','Her hasar için belirlenen retention (M) üzerindeki kısım reasürör tarafından ödenir','Hasar sıklığı reasürör karşılar','Kota pay (yüzdelik) bölüşümü','B','XL: hasar X ise sigortacı min(X,M), reasürör min(X,M+L)-M öder. L: limit, M: muafiyet.'),
  q('LEVEL_2','risk-analizi','Reasürans Modelleri','Kota Pay (Quota Share) reasüransı nasıl işler?','Her hasar için ayrı müzakere','Belirli bir yüzde (%) prim ve hasar paylaşımı; tüm poliçelere aynı oran uygulanır','Sadece büyük hasarlar devredilir','Yıllık agrega limit içerir','B','Kota pay: reasürör %α prim alır, %α hasar öder. Basit ve eş zamanlı kapasite genişletme.'),
  q('LEVEL_2','risk-analizi','Reasürans Modelleri','Stop-Loss reasüransı kota paydan farkı nedir?','İkisi aynıdır','Stop-loss toplam yıllık hasar belirli bir eşiği geçtiğinde devreye girer; kota pay her hasara uygulanır','Stop-loss sadece kümülâtif poliçelerde','Kota pay sadece büyük hasarlar için','B','Aggregate XL / Stop-Loss: yıllık toplam hasar S > M olunca min(S-M, L) reasürörden tahsil edilir.'),
  q('LEVEL_2','risk-analizi','Reasürans Modelleri','Katastrofik XL (Cat XL) reasüransı ne için kullanılır?','Bireysel küçük hasarlar','Deprem, sel gibi çok sayıda hasara aynı anda neden olan olaylar','Sağlık sigortası','Uzun vadeli hayat teminatı','B','Cat XL: tek olay (occurrence) birden fazla poliçeye zarar verdiğinde kümülatif hasar için koruma.'),
  q('LEVEL_2','risk-analizi','Reasürans Modelleri','Reasüransın solvency açısından temel faydası nedir?','Prim geliri artırır','Peak risk düşürür, sermaye gereksinimini azaltır ve ödeme gücünü destekler','Küçük hasarları azaltır','Sigortalıya daha düşük prim sunar','B','Reasürans: büyük/katastrofik riskleri transfer ederek SCR azaltır; sermaye etkinliği sağlar.'),

  // Risk Ölçütleri (VaR/CVaR)
  q('LEVEL_2','risk-analizi','Risk Ölçütleri (VaR/CVaR)','%99 güven düzeyinde VaR (Value at Risk) ne anlama gelir?','Beklenen kayıp','Yalnızca %1 olasılıkla aşılabilecek maksimum kayıp miktarı','Gerçek hasar','Ortalama hasar','B','VaR(99%): P(X>VaR)=1%. Kayıp dağılımının 99. yüzdeliği. Basel/Solvency sermaye hesabında kullanılır.'),
  q('LEVEL_2','risk-analizi','Risk Ölçütleri (VaR/CVaR)','CVaR (Conditional VaR / Expected Shortfall) VaR\'dan neden daha iyi bir risk ölçütüdür?','Hesaplamak daha kolay','CVaR alt-toplamsal (sub-additive); VaR kuyruğun şeklini görmez, CVaR aşım durumundaki ortalama kaybı ölçer','CVaR her zaman VaR\'dan küçük','CVaR sadece normal dağılımda çalışır','B','CVaR = E[X | X>VaR]. Tutarlı risk ölçütü (coherent): monoton, homojen, alt-toplamsal, dönüştürme-değişmez.'),
  q('LEVEL_2','risk-analizi','Risk Ölçütleri (VaR/CVaR)','Tutarlı risk ölçütü (coherent risk measure) için hangi özellikler gereklidir?','Sadece alt-toplamlı olmak','Monotonluk, homojenlik, öteleme değişmezliği ve alt-toplamlılık','Sadece konvekslik','VaR tüm özellikleri sağlar','B','Artzner vd. (1999): coherent = monotone + positively homogeneous + translation invariant + subadditive.'),
  q('LEVEL_2','risk-analizi','Risk Ölçütleri (VaR/CVaR)','Normal dağılım X~N(μ,σ²) için VaR(α) formülü nedir?','μ+z_α·σ','μ-z_α·σ','z_α·σ','μ+σ','A','VaR(α)=μ+z_α·σ. α=%99 için z=2.326. Kayıp pozitif tanımlanırsa sağ kuyruk yüzdeliği.'),
  q('LEVEL_2','risk-analizi','Risk Ölçütleri (VaR/CVaR)','Solvency II SCR hesabında temel risk ölçütü hangisidir?','%95 VaR','%99.5 tek yıllık VaR','%99 CVaR','%99 TVaR','B','Solvency II SCR: 1 yıllık ufukta %99.5 VaR; ruinin bir yılda %0.5\'den az olması hedeflenir.'),

  // Toplam Hasar Modelleri
  q('LEVEL_2','risk-analizi','Toplam Hasar Modelleri','Bileşik dağılımda S = X1+X2+...+XN için E[S] formülü nedir?','E[N]·E[X]','E[N]+E[X]','E[N]·Var[X]','Var[N]·E[X]','A','E[S]=E[N]·E[X] (sıklık-şiddet bağımsızlığında).'),
  q('LEVEL_2','risk-analizi','Toplam Hasar Modelleri','Panjer özyineleme formülü ne için kullanılır?','Hasar rezervi hesaplamak','(a,b,0) sınıfındaki sıklık dağılımı ve hasar şiddeti verildiğinde toplam hasar dağılımını verimli hesaplamak','Monte Carlo simülasyonu','Maksimum olasılık tahmini','B','Panjer: p_n=(a+b/n)·p_{n-1}. Poisson, negatif binom ve binom bu sınıfa girer.'),
  q('LEVEL_2','risk-analizi','Toplam Hasar Modelleri','Kolektif risk modeli ile bireysel risk modeli arasındaki fark nedir?','Aynıdır','Bireysel: sabit sayıda poliçe, her poliçe için 0/1 hasar; kolektif: stokastik sayıda hasar, her birinin miktarı rassal','Kolektif model daha basit','Bireysel model sonsuz poliçe varsayar','B','Bireysel: S=ΣX_i (sabit n, her X_i bağımsız). Kolektif: S=ΣX_j, N rassal sayıda hasar.'),
  q('LEVEL_2','risk-analizi','Toplam Hasar Modelleri','Bileşik Poisson modelinde N~Poisson(λ) ve X_i bağımsız ise Var[S] nedir?','λ·E[X]','λ·E[X²]','λ·(E[X])²','λ²·Var[X]','B','Var[S]=E[N]·E[X²] (Poisson için). Çünkü E[N]=Var[N]=λ → Var[S]=λ·E[X²].'),
  q('LEVEL_2','risk-analizi','Toplam Hasar Modelleri','Stop-loss priminin (stop-loss premium) formülü E[max(S-d,0)] nedir ve bu ne anlama gelir?','d\'nin altındaki hasarların ortalaması','d\'yi aşan toplam hasarın beklenen değeri — pur riziko bazında agrega XL reasürans maliyeti','E[S]-d','d·P(S>d)','B','Stop-loss net prim: E[(S-d)_+] = ∫_d^∞ (s-d)f(s)ds. Katastrofik kapsam fiyatlamasında kullanılır.'),

  // ─── SİGORTA MATEMATİĞİ ──────────────────────────────────────────────────

  // Hayat Tabloları
  q('LEVEL_2','sigorta-matematigi','Hayat Tabloları','Hayat tablosunda q_x nedir?','x yaşındaki bireyin hayatta kalma olasılığı','x yaşındaki bireyin bir yıl içinde ölüm olasılığı','Beklenen yaşam süresi','l_x değeri','B','q_x = P(T_x ≤ 1) = 1-p_x. Tablo notasyonu: d_x = l_x·q_x ölüm sayısı.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Tabloları','_k|q_x sembollü gösterim ne anlama gelir?','x yaşındaki kişinin k yılda ölme olasılığı','x yaşındaki kişinin en az k yıl yaşayıp sonraki 1 yıl içinde ölme olasılığı','k yıllık hayatta kalma','k·q_x','B','_k|q_x = _k·p_x · q_{x+k} = P(k<T_x≤k+1). k yıl hayatta, ardından ölüm.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Tabloları','UDD (Uniform Distribution of Deaths) varsayımı ne demektir?','Ölümler yılın başında','Ölümler yıl içinde tekdüze (uniform) dağılmıştır; kesirli yaşlar için doğrusal interpolasyon','Tüm ölümler yılın sonunda','Ölüm kümülatif normal dağılır','B','UDD: _t·q_x = t·q_x (0<t<1). Kesirli yaş için yaygın interpolasyon. l_{x+t}=l_x-t·d_x.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Tabloları','Beklenen ömür e°_x (complete) nasıl tanımlanır?','∫_0^∞ t·f(t)dt','∫_0^∞ _t·p_x dt','Σ_{k=0}^∞ _k·p_x','∫_0^∞ μ_{x+t}dt','B','e°_x = E[T_x] = ∫_0^∞ _t·p_x dt. Curtate: e_x = Σ_{k=1}^∞ _k·p_x.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Tabloları','Kuvvet ölümü (force of mortality) μ_{x+t} nedir?','q_{x+t}','Anlık ölüm yoğunluğu: μ_{x+t}=-d/dt[ln _t·p_x]','1-p_x','l_{x+t}','B','μ_{x+t}: t anında hayatta olan x yaşındakilerin anlık ölüm hızı. _t·p_x=exp(-∫_0^t μ_{x+s}ds).'),

  // Hayat Sigortası Net Primleri
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Net Primleri','Whole life insurance (A_x) nedir?','x yaşında başlayan ve belirli süre ödenen anüite','Ölüm anında ödenen 1 birim tazminatın bugünkü aktüeryal değeri','Hayatta kalma anüitesi','Birikim poliçesi','B','A_x = E[v^{T_x}] = ∫_0^∞ v^t · _t·p_x · μ_{x+t} dt. Ömür boyu ölüm teminatı.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Net Primleri','Term insurance A_{x:n|}^1 ile endowment A_{x:n|} farkı nedir?','Aynı şeydir','Term: n yıl içinde ölüm olursa ödeme; endowment: n yıl içinde ölüm VEYA n yıl hayatta kalma','Term daha pahalı','Endowment sadece ölüm teminatı','B','A_{x:n|}^1: ölüm teminatı. A_{x:n|}=A_{x:n|}^1 + A_{x:n|}^{1} (pure endowment). İkinci terim hayatta kalma ödemesi.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Net Primleri','Net prim eşitliği (equivalence principle) nasıl kurulur?','APV(primler) > APV(faydalar)','APV(primler) = APV(faydalar)','APV(primler) = APV(faydalar) + güvenlik yükü','Net prim brüt prim ile aynıdır','B','Eşitlik ilkesi: E[PV primler] = E[PV faydalar]. Saf risk primini verir; kâr payı içermez.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Net Primleri','Whole life için yıllık ödenen net prim P_x formülü nedir?','A_x/ä_x','ä_x/A_x','d·A_x/(1-A_x)','A_x+d·ä_x','A','P_x = A_x / ä_x. ä_x: hayatta olduğu sürece yılın başında ödenen 1 birim anüite APV.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Net Primleri','i=%5 ve A_30=0.10 ise d ve ä_30 değerleri ve P_30 nedir?','d=0.0476, ä_30=(1-0.10)/0.0476≈18.9, P_30≈0.00529','d=0.05, ä_30=18, P_30=0.006','d=0.05, ä_30=20, P_30=0.005','Hesaplanamaz','A','d=i/(1+i)=0.05/1.05≈0.0476. ä_x=(1-A_x)/d. ä_30=(0.90)/0.0476≈18.9. P_30=0.10/18.9≈0.00529.'),

  // Hayat Sigortası Rezervleri
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Rezervleri','Prospektif (ileriye dönük) rezerv _k·V_x nedir?','Geçmişteki prim fazlasının birikmesi','Gelecekteki faydaların APV — gelecekteki primlerin APV\'si (k yıl sonraki bakış)','Ödenen tazminat toplamı','Brüt prim karşılığı','B','_k·V_x = A_{x+k} - P_x·ä_{x+k}. Şirketin k yıl sonra tutması gereken yükümlülük.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Rezervleri','Rekürsiyon formülü (_k·V_x + P_x)(1+i) = q_{x+k}·b + p_{x+k}·_{k+1}·V_x nedir?','Prim tahsilat formülü','Rezerv güncellemesi: mevcut rezerv + prim faizlenir; hasar ve bir sonraki rezerv için yeterli olmalı','Hasar frekansı hesabı','Anüite değeri','B','Rezerv rekürsiyon: dönem başı rezerv + prim, faizlenerek dönem sonu ölüm tazminatı ve hayatta kalanların rezervini karşılar.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Rezervleri','Retrospektif (geriye dönük) rezerv nedir?','Gelecek primlerin PV','Geçmişteki net primlerin birikimi — geçmişteki net maliyet','Brüt rezerv','IBNR karşılığı','B','Retrospektif: _k·V_x = PV(geçmiş primler) - PV(geçmiş faydalar). Denklik ilkesinde prospektif = retrospektif.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Rezervleri','Full preliminary term (FPT) rezervi standart net prim rezervinden neden düşüktür?','Faiz oranı daha yüksek','İlk yıl poliçe yenileme sigortası olarak değerlendirilir; birinci yıl rezervi sıfır','FPT prim yükü içerir','Ölüm hızı daha düşük','B','FPT: ilk yıl teminat için sanki tek yıl term; 2. yıl için whole life başlar. Net FPT rezerv < prospektif.'),
  q('LEVEL_2','sigorta-matematigi','Hayat Sigortası Rezervleri','Net NAAR (Net Amount at Risk) nedir?','Prim iadesi','Sigorta tazminatı — dönem sonu rezerv; sigortacının "gerçek" risk maruziyeti','Toplam birikim','APV(faydalar)','B','NAAR = b - _{k+1}·V. b tazminat, rezerv garantili değer. Maliyet of insurance = q·NAAR·v.'),

  // Çoklu Hayat Modelleri
  q('LEVEL_2','sigorta-matematigi','Çoklu Hayat Modelleri','Joint life status (T_{xy}) nedir?','İki hayattan sonuncusunun ömrü','İki hayattan ilkinin öldüğü andaki süre; min(T_x,T_y)','max(T_x,T_y)','T_x+T_y','B','T_{xy}=min(T_x,T_y). _t·p_{xy}=_t·p_x·_t·p_y (bağımsızlık). Status iki kişi hayattayken devam eder.'),
  q('LEVEL_2','sigorta-matematigi','Çoklu Hayat Modelleri','Last survivor status (T_{x̄ȳ}) nedir?','min(T_x,T_y)','max(T_x,T_y); son kişi ölene kadar devam','T_x+T_y','(T_x+T_y)/2','B','T_{x̄ȳ}=max(T_x,T_y). _t·p_{x̄ȳ}=_t·p_x+_t·p_y-_t·p_{xy}. Son survivor anüitesi.'),
  q('LEVEL_2','sigorta-matematigi','Çoklu Hayat Modelleri','Bağımlı hayat modelinde kopula (copula) ne amaçla kullanılır?','Hasar sıklığı modellemek','Bireysel ömür marjinal dağılımlarını bağımlılık yapısıyla birleştirmek','Faiz oranı modellemek','Reasürans hesabı','B','Sklar teoremi: F(s,t)=C(F_x(s),F_y(t)). Clayton, Gumbel kopulaları ortak ölüm (broken heart) etkisini yakalar.'),
  q('LEVEL_2','sigorta-matematigi','Çoklu Hayat Modelleri','Bağımlı çoklu hayat modelinde "broken heart syndrome" ne anlama gelir?','Finansal bağımlılık','Eşlerden biri ölünce diğerinin ölüm kuvveti artar — pozitif ölüm korelasyonu','Ölüm hızı azalır','Bağımsızlık varsayımı güçlenir','B','Broken heart: eşlerin ölüm hızları pozitif korelasyonlu. Bağımsızlık varsayımı anüite/rezerv değerini yanlış verir.'),
  q('LEVEL_2','sigorta-matematigi','Çoklu Hayat Modelleri','Ä_{xy} — joint life whole life insurance APV — için bağımsızlık varsayımında formül nedir?','A_x+A_y','A_x+A_y-A_{xy}','A_x·A_y','Ä_{x̄ȳ}','B','Last survivor insurance: Ä_{x̄ȳ}=A_x+A_y-A_{xy} (inklüzyon-ekskülüzyon). A_{xy}: joint life insurance.'),

  // Engellilik ve Hastalık Modelleri
  q('LEVEL_2','sigorta-matematigi','Engellilik ve Hastalık Modelleri','Engellilik modelinde üç durum (state) genellikle nelerdir?','Aktif, pasif, emekli','Sağlıklı (H), Engelli (D), Ölmüş (Dead)','Prim, rezerv, tazminat','Kısa, orta, uzun vadeli','B','3 durumlu disability model: H (healthy) → D (disabled) ↔ H, H→Dead, D→Dead. Rekover olabilir.'),
  q('LEVEL_2','sigorta-matematigi','Engellilik ve Hastalık Modelleri','Engellilik geçiş yoğunluğu (transition intensity) μ^{HD}_{x+t} nedir?','Engellilik olasılığı','x+t anında sağlıklıdan engelliye anlık geçiş hızı','Engellilik süresi','Hasar miktarı','B','μ^{HD}: t anında sağlıklıdan engelliye geçişin anlık hızı. Kolmogorov forward denklemleri bu yoğunluklarla.'),
  q('LEVEL_2','sigorta-matematigi','Engellilik ve Hastalık Modelleri','Sürekli engellilik geliri (disability annuity) nasıl değerlenir?','A_x gibi','∫_0^∞ v^t · _t·p_x^{HH} · μ^{HD}_{x+t} · ä_{x+t}^{DD} dt şeklinde bileşik hesap','Basit anüite formülü','Hayat tablosu yeterli','B','Engelli olduğunda başlayan anüite: APV = ∫ (sağlıklı hayatta kalma)·(engellilik geçiş yoğunluğu)·(engelli anüite) dt.'),
  q('LEVEL_2','sigorta-matematigi','Engellilik ve Hastalık Modelleri','Morbidite (hastalık) oranı nedir?','Ölüm oranı','Belirli bir dönemde bir popülasyonda hastalığa yakalanan birey oranı','Maluliyet sigortası prim oranı','Hastane gün sayısı','B','Morbidity rate = yeni vakalar (insidans) veya toplam vakalar (prevalans) / popülasyon. Sağlık tarife temel girdisi.'),
  q('LEVEL_2','sigorta-matematigi','Engellilik ve Hastalık Modelleri','Waiver of Premium (prim muafiyeti) poliçe rider\'ının aktüeryal değerlemesinde engellilik modelinin önemi nedir?','Sadece mortalite tablosu yeterli','Primin ne kadar süre ödenemeyeceğini (engellilik geçiş/iyileşme yoğunlukları) modellemek gerekir','Sadece faiz oranı etkili','Değerleme yapılmaz','B','Waiver rider: engellilik süresince prim muaf. APV(muaf prim) = ∫ prim × engellilik geçiş integrali. Çoklu durum modeli şart.'),

  // Kâr Analizi
  q('LEVEL_2','sigorta-matematigi','Kâr Analizi','Hayat sigortasında kâr testi (profit testing) nedir?','Hasar provizyonu hesabı','Brüt primlerle beklenen nakit akışlarını projekte ederek her dönem için kâr/zarar tahmini','Net prim hesabı','Rezerv güncellemesi','B','Profit test: her dönem için (prim+faiz-hasar-gider-rezerv artışı) hesaplanır. NPV(kâr)>0 → poliçe kârlı.'),
  q('LEVEL_2','sigorta-matematigi','Kâr Analizi','Profit margin (kâr marjı) poliçe analizinde nasıl tanımlanır?','Brüt prim / Net prim','PV(kârlar) / PV(primler) veya NPV(kâr)/APV(primler)','Toplam kâr / Toplam hasar','Gider oranı','B','Profit margin = Σ(Π_t·v^t·_t·p_x) / APV(primler). Pozitif ve yeterince büyük olmalı.'),
  q('LEVEL_2','sigorta-matematigi','Kâr Analizi','Surrender value (geri ödeme değeri) ve rezerv arasındaki ilişki nedir?','Her zaman eşit','Geri ödeme değeri genellikle rezervden düşük; sigortacı ihraç maliyetlerini karşılamak için kesinti yapar','Geri ödeme > rezerv her zaman','İkisi ilgisizdir','B','Surrender value ≤ Rezerv. Erken vazgeçme cezası (surrender charge) rezerv ile geri ödeme arasındaki farktır.'),
  q('LEVEL_2','sigorta-matematigi','Kâr Analizi','Internal Rate of Return (IRR) kâr testinde nasıl kullanılır?','Rezerv faizi oranı','Nakit akışlarının NPV=0 yaptığı iskonto oranı; beklenen faizin üstündeyse proje kârlı','Brüt prim indirim oranı','Hasar tahmini için','B','IRR: Σ Π_t·v^t·_t·p_x=0 çözer. IRR > hedef oran → poliçe kabul. Raporlama ölçütü.'),
  q('LEVEL_2','sigorta-matematigi','Kâr Analizi','Kâr analizinde "strain" (ilk yıl zorlaması) nedir?','Dönem sonu kâr','Birinci yılda ihraç maliyetleri (komisyon, tıbbi muayene vb.) brüt prim ve rezervi aşabilir; negatif kâr','Yıllık fayda maliyeti','Prim artışı','B','First year strain: Π_1 < 0 tipik. Kurulum maliyetleri yüksek. Sonraki yıllarda telafi edilmesi gerekir.'),

];

async function upload(batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
}

async function main() {
  console.log(`Toplam soru: ${questions.length}`);
  const BATCH = 20;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await upload(batch);
    console.log(`✓ ${Math.min(i + BATCH, questions.length)}/${questions.length} yüklendi`);
  }
  console.log('✅ LEVEL_2 seed tamamlandı!');
}

main().catch(e => { console.error(e); process.exit(1); });
