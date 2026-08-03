-- ================================================================
-- ActuReady — LEVEL_1 Mevzuat + Olasılık Konu İçeriği + Sorular
-- 01.08.2026 — Manuel yazılmıştır.
-- ================================================================
BEGIN;

-- ================================================================
-- KONU İÇERİKLERİ — MEVZUAT
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Sigortanın Tanımı ve İşlevleri','easy',
'<h2>Sigortanın Tanımı</h2>
<p>Sigorta; belirsiz bir riskin gerçekleşmesi halinde uğranılacak zararı, pek çok kişinin bir araya gelerek primlerini bir havuzda toplamasıyla karşılayan bir risk transfer ve paylaşım mekanizmasıdır.</p>

<h2>Sigortanın İşlevleri</h2>
<ul>
  <li><strong>Risk transferi:</strong> Bireyden sigorta şirketine riski devretmek</li>
  <li><strong>Risk havuzlama:</strong> Benzer riskleri bir araya getirerek istatistiksel yasaların çalışmasını sağlamak</li>
  <li><strong>Güvence ve planlama:</strong> Kişi ve işletmelerin geleceği planlamasına imkân tanımak</li>
  <li><strong>Ekonomik işlev:</strong> Toplanan primler yatırıma yönlendirilerek ekonomiye kaynak sağlanır</li>
  <li><strong>Tasarruf işlevi:</strong> Birikimli hayat ve BES ürünleri aracılığıyla</li>
</ul>

<h2>Sigortalanabilirlik Koşulları</h2>
<ul>
  <li>Risk belirsiz ve gelecekte gerçekleşebilir olmalı</li>
  <li>Sigortalının ölçülebilir maddi çıkarı olmalı</li>
  <li>Risk tesadüfi olmalı (kasıtlı değil)</li>
  <li>Risk homojen ve bağımsız olaylardan oluşan büyük kitlelerde bulunmalı</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Sigorta "büyük sayılar kanununa" dayanır.</li>
  <li>Sigorta tazminat ilkesi gereği kâr aracı değil, zarar telafi aracıdır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Temel Sigorta İlkeleri','easy',
'<h2>Sigortanın 6 Temel İlkesi</h2>
<ol>
  <li><strong>Sigortalanabilir Menfaat:</strong> Sigortalının sigorta konusu üzerinde korunmaya değer hukuki ve ekonomik çıkarı olmalıdır.</li>
  <li><strong>Azami İyi Niyet (Utmost Good Faith):</strong> Taraflar birbirine karşı tam dürüst olmalı; bilinen her önemli bilgiyi açıklamalıdır.</li>
  <li><strong>Tazminat İlkesi:</strong> Sigorta, gerçek zararı karşılar; sigortalı zararından fazla tazminat alamaz.</li>
  <li><strong>Halefiyet (Subrogation):</strong> Tazminatı ödeyen sigortacı, zararı veren üçüncü kişiye karşı sigortalının yerine geçer.</li>
  <li><strong>Katılım (Contribution):</strong> Aynı riziko için birden fazla sigorta varsa şirketler hasarı orantılı karşılar.</li>
  <li><strong>Yakın Sebep (Proximate Cause):</strong> Hasarın en etkin ve doğrudan nedeni belirlenerek teminat kapsamı değerlendirilir.</li>
</ol>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>En sık sorulan: Tazminat ilkesi + halefiyet ilkesi.</li>
  <li>Çifte sigorta: İki şirket de tazminat ödeyemez; katkı ilkesi uygulanır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Sigortacılık Kanunu (5684) Temel İlkeleri','medium',
'<h2>5684 Sayılı Sigortacılık Kanunu</h2>
<p>2007 yılında yürürlüğe giren bu kanun, Türkiye''de sigortacılığın temel yasal çerçevesini oluşturur.</p>

<h2>Temel Düzenlemeler</h2>
<ul>
  <li>Sigorta şirketleri ve reasürans şirketlerinin kuruluş ve faaliyet esasları</li>
  <li>Sigorta aracıları (acente, broker) düzenlemeleri</li>
  <li>Teknik karşılıklar ve varlık yönetimi esasları</li>
  <li>Denetim ve yaptırım hükümleri</li>
</ul>

<h2>Düzenleyici Kurum</h2>
<ul>
  <li><strong>SEDDK</strong> (Sigorta ve Özel Emeklilik Düzenleme ve Denetleme Kurumu): 2020''de Hazine''den ayrılarak bağımsız düzenleyici kurum oldu.</li>
  <li><strong>Türkiye Sigorta Birliği (TSB):</strong> Sektörün öz-düzenleyici kuruluşu</li>
  <li><strong>TOBB Levhası:</strong> Acentelerin kaydı</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>SEDDK denetim + lisans yetkisine sahip.</li>
  <li>Sigorta şirketleri anonim şirket veya kooperatif şeklinde kurulabilir.</li>
  <li>Minimum sermaye şartları SEDDK tarafından belirlenir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Türkiye''de Aktüerlik Mesleği ve Yetkilendirme','medium',
'<h2>Aktüerlik Mesleği</h2>
<p>Aktüerler; sigortacılık, emeklilik ve finans sektörlerinde matematiksel ve istatistiksel yöntemlerle risk değerlendirmesi ve fiyatlandırma yapan uzman kişilerdir.</p>

<h2>Türkiye''de Aktüer Unvanları</h2>
<ul>
  <li><strong>Stajyer Aktüer:</strong> Aktüerlik 1. Seviye sınavı + 1 yıl staj</li>
  <li><strong>Yardımcı Aktüer:</strong> Aktüerlik 2. Seviye sınavı</li>
  <li><strong>Aktüer:</strong> Aktüerlik 3. Seviye sınavı + toplam 3 yıl deneyim</li>
  <li><strong>Aktüer (Sicil):</strong> 4. Seviye + ek deneyim → SEDDK sicil tescili</li>
</ul>

<h2>Sorumlu Aktüer</h2>
<ul>
  <li>Sigorta şirketleri sorumlu aktüer atamak zorundadır.</li>
  <li>Hayat branşı ve elementer branş için ayrı sorumlu aktüer zorunluluğu olabilir.</li>
  <li>Sorumlu aktüer teknik karşılıkları onaylar ve solvency hesaplarını yapar.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Aktüerlik sınavları SEDDK gözetiminde Türkiye Aktüerler Derneği koordinasyonunda yapılır.</li>
  <li>Sınav seviyeleri: 1, 2, 3, 4 (sırasıyla artan zorluk).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Risk Kavramı ve Risk Yönetimi','easy',
'<h2>Risk Nedir?</h2>
<p>Risk; beklenen sonuçtan sapma olasılığıdır. Sigortacılıkta risk, öngörülemeyen kayıp veya hasar ihtimali olarak tanımlanır.</p>

<h2>Risk Türleri</h2>
<ul>
  <li><strong>Saf risk:</strong> Yalnızca kayıp veya durumu koruma ihtimali (sigorta edilebilir)</li>
  <li><strong>Spekülatif risk:</strong> Kazanç veya kayıp ihtimali (genellikle sigorta edilemez)</li>
  <li><strong>Sistematik (piyasa) riski:</strong> Tüm sistemi etkileyen, çeşitlendirmeyle giderilemeyen risk</li>
  <li><strong>Sistematik olmayan risk:</strong> Çeşitlendirmeyle azaltılabilir risk</li>
</ul>

<h2>Risk Yönetimi Süreci</h2>
<ol>
  <li>Risk tanımlama</li>
  <li>Risk değerlendirme (olasılık × şiddet)</li>
  <li>Risk azaltma stratejisi seçimi (kaçınma, azaltma, transfer, kabul)</li>
  <li>Uygulama ve izleme</li>
</ol>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Sigorta = risk transferi aracıdır.</li>
  <li>Saf risk (pure risk) sigortanın konusudur; spekülatif risk değildir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Reasürans Temel Kavramları','medium',
'<h2>Reasürans Nedir?</h2>
<p>Sigorta şirketinin üstlendiği risklerin bir bölümünü başka bir sigorta şirketine (reasürör) devretmesidir. "Sigortacının sigortası" olarak da bilinir.</p>

<h2>Reasürans Türleri</h2>
<h3>Proportional (Orantılı)</h3>
<ul>
  <li><strong>Kota payı (Quota Share):</strong> Tüm risklerin sabit oranı devredilir.</li>
  <li><strong>Hâsılat fazlası (Surplus):</strong> Belirli tutarı aşan kısmı devredilir.</li>
</ul>
<h3>Non-Proportional (Orantısız)</h3>
<ul>
  <li><strong>XL (Excess of Loss):</strong> Hasar belirli eşiği aştığında devreye girer.</li>
  <li><strong>Stop Loss:</strong> Toplam hasar oranı belirli eşiği aşarsa devreye girer.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Reasürans, sözleşme (treaty) veya ihtiyari (facultative) olabilir.</li>
  <li>XL reasürans, büyük bireysel hasarlardan koruma sağlar.</li>
  <li>Poliçe sahibinin reasürörle doğrudan ilişkisi yoktur.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Hasar ve Tazminat','easy',
'<h2>Hasar Süreci</h2>
<ol>
  <li><strong>Hasar oluşumu:</strong> Teminatlı risk gerçekleşir</li>
  <li><strong>Hasar bildirimi:</strong> Sigortalı şirkete bildirir (genellikle 5-30 gün)</li>
  <li><strong>Hasar tespiti:</strong> Eksper incelemesi</li>
  <li><strong>Hasar dosyası:</strong> Belgeler tamamlanır</li>
  <li><strong>Tazminat ödemesi</strong></li>
</ol>

<h2>Önemli Kavramlar</h2>
<ul>
  <li><strong>Eksper:</strong> Bağımsız hasar değerleme uzmanı</li>
  <li><strong>IBNR (Incurred But Not Reported):</strong> Oluşmuş ama bildirilmemiş hasarlar</li>
  <li><strong>Hasar ödeme karşılığı:</strong> Şirketin bilinen açık hasarlar için ayırdığı rezerv</li>
  <li><strong>Tam hasar:</strong> Hasar bedeli, sigorta değerinin büyük kısmını aşıyorsa</li>
  <li><strong>Kısmi hasar:</strong> Hasarın onarılabilir olduğu durum</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Eksik sigorta: Sigorta bedeli < gerçek değer → orantılı ödeme yapılır.</li>
  <li>Aşkın sigorta: Sigorta bedeli > gerçek değer → tazminat gerçek zararı aşamaz.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Makroekonomik Göstergeler (GSYİH, Enflasyon)','easy',
'<h2>GSYİH (GDP)</h2>
<p>Bir ülkede belirli bir dönemde (genellikle 1 yıl) üretilen tüm nihai mal ve hizmetlerin toplam piyasa değeridir.</p>
<ul>
  <li><strong>Harcama yöntemi:</strong> GSYİH = C + I + G + (X−M)</li>
  <li><strong>Reel GSYİH:</strong> Fiyat değişimleri arındırılmış</li>
  <li><strong>Nominal GSYİH:</strong> Cari fiyatlarla ölçülen</li>
</ul>

<h2>Enflasyon</h2>
<p>Genel fiyat düzeyinin sürekli artmasıdır.</p>
<ul>
  <li><strong>TÜFE (CPI):</strong> Tüketici fiyatları endeksi</li>
  <li><strong>ÜFE (PPI):</strong> Üretici fiyatları endeksi</li>
  <li><strong>Deflasyon:</strong> Genel fiyat düzeyinin düşmesi</li>
  <li><strong>Stagflasyon:</strong> Durgunluk + enflasyon bir arada</li>
</ul>

<h2>Sigortacılığa Etkisi</h2>
<ul>
  <li>Enflasyon hasar ödemelerini artırır → aktüeryal tahminleri zorlaştırır</li>
  <li>Faiz oranları genellikle enflasyonla birlikte artar → yatırım gelirleri etkiler</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>GSYİH büyüme oranı ekonomik sağlığın temel göstergesidir.</li>
  <li>Enflasyon = para değer kaybı = reel satın alma gücü azalır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','mevzuat','Temel Ekonomi Kavramları (Arz, Talep, Denge)','easy',
'<h2>Arz ve Talep</h2>
<ul>
  <li><strong>Talep yasası:</strong> Fiyat arttıkça talep edilen miktar azalır (ters ilişki)</li>
  <li><strong>Arz yasası:</strong> Fiyat arttıkça arz edilen miktar artar (doğru ilişki)</li>
  <li><strong>Denge fiyatı:</strong> Arz = Talep noktasında oluşan fiyat</li>
</ul>

<h2>Esneklik</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Fiyat esnekliği = %ΔQ / %ΔP<br>
  |Ed| > 1 → esnek talep<br>
  |Ed| < 1 → esnek olmayan talep
</div>

<h2>Sigortacılığa Bağlantı</h2>
<ul>
  <li>Zorunlu sigortalar (trafik, DASK) fiyat esnekliği düşük ürünlerdir.</li>
  <li>İhtiyari sigortalar prim değişimine daha duyarlıdır.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Piyasa başarısızlıkları: Dışsallıklar, kamu malları, asimetrik bilgi → sigortacılıkta ahlaki tehlike ve ters seçim buna girer.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- KONU İÇERİKLERİ — OLASILIK
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','olasilik','Rastgele Değişkenler ve Beklenen Değer','easy',
'<h2>Rastgele Değişken</h2>
<p>Olası sonuçları sayısal değerlere dönüştüren fonksiyondur. İki türü vardır:</p>
<ul>
  <li><strong>Kesikli (Discrete):</strong> Sayılabilir değer alır. Örn: X = zar sayısı</li>
  <li><strong>Sürekli (Continuous):</strong> Aralık içinde herhangi bir değer alır. Örn: X = bekleme süresi</li>
</ul>

<h2>Olasılık Yoğunluk Fonksiyonu (pdf)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Kesikli: Σ P(X=x) = 1<br>
  Sürekli: ∫_{-∞}^{∞} f(x) dx = 1, f(x) ≥ 0
</div>

<h2>Beklenen Değer</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  E[X] = Σ x·P(X=x) &nbsp; [kesikli]<br>
  E[X] = ∫ x·f(x) dx &nbsp; [sürekli]<br>
  E[g(X)] = Σ g(x)·P(X=x)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>E[c] = c (sabitin beklentisi kendisidir)</li>
  <li>E[X+Y] = E[X] + E[Y] (bağımsızlık gerekmez)</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','olasilik','Önemli Eşitsizlikler (Chebyshev, Markov)','medium',
'<h2>Markov Eşitsizliği</h2>
<p>X ≥ 0 ve E[X] mevcut ise herhangi a > 0 için:</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(X ≥ a) ≤ E[X] / a
</div>

<h2>Chebyshev Eşitsizliği</h2>
<p>Herhangi bir k > 0 için:</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  P(|X − μ| ≥ k·σ) ≤ 1/k²<br><br>
  Eşdeğer: P(|X − μ| < k·σ) ≥ 1 − 1/k²
</div>

<h2>Örnek</h2>
<p>k=2 için: P(|X−μ| < 2σ) ≥ 1 − 1/4 = 0,75 (en az %75 olasılık)</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Chebyshev kesin dağılım bilgisi olmadan çalışır (dağılımdan bağımsız alt sınır).</li>
  <li>Normal dağılım için daha güçlü sonuçlar elde edilebilir.</li>
  <li>k=3 için: ≥ %88,9 (Chebyshev) vs %99,7 (Normal)</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','olasilik','Olasılık Teorisi Temelleri','easy',
'<h2>Olasılığın Yorumları</h2>
<ul>
  <li><strong>Frekansçı (Klasik):</strong> Uzun vadeli göreli frekans → P(A) = Olumlu sonuç / Toplam sonuç</li>
  <li><strong>Öznel (Bayesçi):</strong> Kişisel inanç derecesi</li>
  <li><strong>Aksiyomatik (Kolmogorov):</strong> Matematiksel tanım</li>
</ul>

<h2>Kümülatif Dağılım Fonksiyonu (CDF)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  F(x) = P(X ≤ x)<br>
  0 ≤ F(x) ≤ 1<br>
  F(−∞) = 0; F(+∞) = 1<br>
  F monoton artandır.
</div>

<h2>Hayatta Kalma Fonksiyonu</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  S(x) = P(X > x) = 1 − F(x)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>S(x) aktüerlikte hayatta kalma fonksiyonu (survival function) olarak yoğun kullanılır.</li>
  <li>f(x) = F''(x) → pdf, CDF''nin türevi</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- SORU BANKASI — LEVEL_1 Mevzuat
-- ================================================================

INSERT INTO question_bank (exam_type, subject, topic, difficulty, question_text, options_json, correct_answer, explanation) VALUES

('LEVEL_1','mevzuat','Sigortanın Tanımı ve İşlevleri','easy',
'Sigortanın "büyük sayılar kanununa" dayanması ne anlama gelir?',
'{"A":{"text":"Sigorta şirketinin büyük sermayeye ihtiyaç duyduğu"},"B":{"text":"Homojen risk grubundaki kişi sayısı arttıkça fiili hasar oranının beklenen değere yaklaşacağı"},"C":{"text":"Daha büyük poliçelerin daha az prim ödeyeceği"},"D":{"text":"Büyük şirketlerin küçüklerden daha az hasar ödeyeceği"}}',
'B',
'Büyük sayılar kanunu: Gözlem sayısı yeterince büyük olduğunda gerçekleşen oran, teorik olasılığa yaklaşır. Sigorta şirketleri çok sayıda poliçe tutarak hasar oranlarını güvenilir şekilde tahmin edebilir.'),

('LEVEL_1','mevzuat','Temel Sigorta İlkeleri','easy',
'Tazminat ilkesi sigortacılıkta ne anlama gelir?',
'{"A":{"text":"Sigortalı her hasarda tazminat alır"},"B":{"text":"Sigorta şirketi her durumda tam primini iade eder"},"C":{"text":"Tazminat, gerçek zararı aşamaz; sigorta kazanç aracı değildir"},"D":{"text":"Sigortalı, hasarın tamamını önce karşılar sonra şirketten geri alır"}}',
'C',
'Tazminat (indemnity) ilkesi: Sigorta, sigortalıyı hasardan önceki ekonomik durumuna geri döndürür; sigortalı zararından fazla tazminat alamaz. Aşkın sigorta ödenerek kazanç sağlanamaz.'),

('LEVEL_1','mevzuat','Temel Sigorta İlkeleri','medium',
'Halefiyet (subrogation) ilkesi gereği aşağıdakilerden hangisi gerçekleşir?',
'{"A":{"text":"Sigortalı iki farklı şirketten aynı riziko için tazminat alabilir"},"B":{"text":"Sigorta şirketi tazminat ödemesinin ardından zararı veren üçüncü şahsa karşı hukuki başvuru hakkı kazanır"},"C":{"text":"Sigortalı, sigorta bedelinin üzerinde bir tazminat talep edebilir"},"D":{"text":"Sigorta şirketi hasar bedelini ödemek zorunda değildir"}}',
'B',
'Halefiyet: Sigorta şirketi tazminatı öder ve sigortalının yerine geçerek zararı meydana getiren üçüncü kişiye karşı rücu hakkı kazanır. Bu ilke, çifte tazminat alınmasını engeller.'),

('LEVEL_1','mevzuat','Risk Kavramı ve Risk Yönetimi','easy',
'Aşağıdakilerden hangisi "saf risk" (pure risk) örneğidir?',
'{"A":{"text":"Hisse senedi yatırımından zarar etme riski"},"B":{"text":"Ev yangını riski"},"C":{"text":"Döviz kuru riski"},"D":{"text":"Ticari bir girişimde başarısız olma riski"}}',
'B',
'Saf risk: Yalnızca kayıp veya mevcut durumun korunması ihtimalini içerir; kazanç olasılığı yoktur. Ev yangını, trafik kazası, ölüm gibi riskler saf riske örnektir ve sigorta kapsamına girebilir. Spekülatif risklerde kazanç da mümkündür.'),

('LEVEL_1','mevzuat','Sigortacılık Kanunu (5684) Temel İlkeleri','medium',
'Türkiye''de sigorta şirketlerini denetleme ve lisanslama yetkisine sahip bağımsız düzenleyici kurum hangisidir?',
'{"A":{"text":"Türkiye Sigorta Birliği (TSB)"},"B":{"text":"TOBB"},"C":{"text":"SEDDK (Sigorta ve Özel Emeklilik Düzenleme ve Denetleme Kurumu)"},"D":{"text":"Bankacılık Düzenleme ve Denetleme Kurumu (BDDK)"}}',
'C',
'SEDDK (2020''de bağımsız kurum olarak kurulmuştur), 5684 sayılı Sigortacılık Kanunu çerçevesinde sigorta ve özel emeklilik şirketlerini lisanslar ve denetler.'),

('LEVEL_1','mevzuat','Türkiye''de Aktüerlik Mesleği ve Yetkilendirme','medium',
'Türkiye''de "Aktüer" unvanını kazanmak için aşağıdaki şartların hangisi doğrudur?',
'{"A":{"text":"Yalnızca 1. Seviye sınavını geçmek yeterlidir"},"B":{"text":"En az 3. Seviye sınavlarını tamamlamak ve 3 yıl deneyim kazanmak gereklidir"},"C":{"text":"Doktora derecesi zorunludur"},"D":{"text":"Herhangi bir sınav şartı yoktur; yalnızca iş deneyimi yeterlidir"}}',
'B',
'Türkiye''de "Aktüer" unvanı için Aktüerlik 3. Seviye sınavlarının tamamlanması ve gerekli deneyim şartının karşılanması gerekmektedir.'),

('LEVEL_1','mevzuat','Reasürans Temel Kavramları','medium',
'XL (Excess of Loss) reasürans sözleşmesinde reasürörün sorumluluğu ne zaman başlar?',
'{"A":{"text":"Her hasar için sabit bir oran"},"B":{"text":"Belirlenen hasar eşiğini aşan kısım için"},"C":{"text":"Hasar tutarından bağımsız olarak her zaman"},"D":{"text":"Yalnızca toplam hasar oranı belirli eşiği aşınca"}}',
'B',
'XL (Fazlası Hasar) reasürans: Her bir hasar için, retention (önce sigorta şirketinin üstlendiği kısım) aşıldıktan sonra reasürör devreye girer. Örneğin retention = 1.000.000 TL, limit = 5.000.000 TL ise 2.000.000 TL hasar için sigorta şirketi 1M, reasürör 1M öder.'),

('LEVEL_1','mevzuat','Hasar ve Tazminat','easy',
'Eksik sigorta (underinsurance) durumunda tazminat nasıl hesaplanır?',
'{"A":{"text":"Tazminat her durumda tam hasar bedeli kadar ödenir"},"B":{"text":"Sigorta şirketi ödeme yapmaz"},"C":{"text":"Tazminat, sigorta bedeli/sigorta değeri oranıyla çarpılarak orantılı ödeme yapılır"},"D":{"text":"Sigortalı tüm hasar bedelini kendi karşılar"}}',
'C',
'Eksik sigorta kuralı (average clause): Sigorta bedeli gerçek değerden düşükse tazminat = Hasar × (Sigorta Bedeli / Gerçek Değer). Örneğin: Gerçek değer 100.000, sigorta bedeli 80.000, hasar 40.000 ise tazminat = 40.000 × (80/100) = 32.000 TL.'),

-- ── Olasılık soruları ─────────────────────────────────────────
('LEVEL_1','olasilik','Rastgele Değişkenler ve Beklenen Değer','easy',
'Bir para atılıyor: Yazı gelirse X = 2, Tura gelirse X = −1. E[X] nedir?',
'{"A":{"text":"0,5"},"B":{"text":"1"},"C":{"text":"0"},"D":{"text":"−0,5"}}',
'A',
'E[X] = 2 × (1/2) + (−1) × (1/2) = 1 − 0,5 = 0,5.'),

('LEVEL_1','olasilik','Varyans ve Standart Sapma','easy',
'X için E[X] = 5 ve E[X²] = 30 ise SD(X) (standart sapma) nedir?',
'{"A":{"text":"√5"},"B":{"text":"5"},"C":{"text":"25"},"D":{"text":"√25"}}',
'A',
'Var(X) = E[X²] − (E[X])² = 30 − 25 = 5. SD(X) = √5.'),

('LEVEL_1','olasilik','Önemli Eşitsizlikler (Chebyshev, Markov)','medium',
'E[X] = 10 ve Var(X) = 4 olan bir dağılım için Chebyshev eşitsizliğine göre P(|X−10| ≥ 4) için bir üst sınır nedir?',
'{"A":{"text":"0,50"},"B":{"text":"0,25"},"C":{"text":"0,75"},"D":{"text":"0,10"}}',
'B',
'Chebyshev: P(|X−μ| ≥ k·σ) ≤ 1/k². Burada σ = √4 = 2, k·σ = 4 → k = 2. P(|X−10| ≥ 4) ≤ 1/2² = 1/4 = 0,25.'),

('LEVEL_1','olasilik','Olasılık Teorisi Temelleri','easy',
'F(x) = P(X ≤ x) fonksiyonunun özellikleri arasında hangisi yer almaz?',
'{"A":{"text":"0 ≤ F(x) ≤ 1"},"B":{"text":"F(+∞) = 1"},"C":{"text":"F monoton artan bir fonksiyondur"},"D":{"text":"F sürekli türevlenebilir olmak zorundadır"}}',
'D',
'CDF her zaman türevlenebilir olmak zorunda değildir. Kesikli dağılımlarda CDF basamaklı (step function) bir yapıdadır ve türevlenemeyen süreksizlik noktaları bulunur. Diğer üç seçenek CDF''nin zorunlu özellikleridir.'),

('LEVEL_1','mevzuat','Makroekonomik Göstergeler (GSYİH, Enflasyon)','easy',
'Bir ekonomide enflasyon oranının yükselmesi sigorta şirketleri açısından aşağıdaki etkilerden hangisine neden olur?',
'{"A":{"text":"Hasar ödemelerinin gerçek değeri artar ve aktuaryal tahminler zorlaşır"},"B":{"text":"Sigorta primlerinin düşmesine yol açar"},"C":{"text":"Reasürans ihtiyacını azaltır"},"D":{"text":"Hasar ödemelerinin azalmasını sağlar"}}',
'A',
'Enflasyon hasar tutarlarını artırır (araç, inşaat, tıp maliyetleri yükselir). Bu durum geçmiş verilere dayalı aktüeryal tahminleri zorlaştırır ve şirketlerin yeterli rezerv tutmasını gerektirir.');

COMMIT;
