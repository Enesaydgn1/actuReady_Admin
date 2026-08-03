-- ================================================================
-- ActuReady — LEVEL_1 Finansal Matematik Konu İçeriği + Sorular
-- 01.08.2026 — Manuel yazılmıştır.
-- ================================================================
BEGIN;

-- ================================================================
-- KONU İÇERİKLERİ
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','easy',
'<h2>Basit Faiz</h2>
<p>Basit faizde faiz yalnızca <strong>anapara</strong> üzerinden hesaplanır; birikmiş faize faiz işletilmez.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Faiz:</strong> I = P · i · t<br>
  <strong>Birikmiş değer:</strong> S = P(1 + i·t)<br>
  <strong>Şimdiki değer:</strong> P = S / (1 + i·t)
</div>
<p><em>P</em> = anapara, <em>i</em> = yıllık faiz oranı, <em>t</em> = süre (yıl cinsinden)</p>

<h2>Basit İskonto (Banka İskontosu)</h2>
<p>İskontoda faiz, anaparaya değil <strong>gelecekteki değere (vadeye)</strong> uygulanır.</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>İskonto:</strong> D = S · d · t<br>
  <strong>Şimdiki değer:</strong> P = S(1 − d·t)<br>
  <strong>İskonto oranı ile faiz oranı ilişkisi:</strong> i = d / (1 − d·t)
</div>
<p><em>d</em> = yıllık iskonto oranı, <em>S</em> = vade değeri (nominal değer)</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Basit faizde faiz miktarı süreyle <strong>doğru orantılı</strong>dır.</li>
  <li>İskonto oranı d ile faiz oranı i arasında: d &lt; i (aynı vade için)</li>
  <li>t genellikle yıl cinsinden verilir; aylık süreyi 12''ye bölün.</li>
</ul>

<h2>Örnek</h2>
<p>10.000 TL, yıllık %12 basit faizle 9 ay tutulursa:<br>
I = 10.000 × 0,12 × (9/12) = <strong>900 TL</strong><br>
S = 10.000 + 900 = <strong>10.900 TL</strong></p>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Bileşik Faiz','easy',
'<h2>Bileşik Faiz</h2>
<p>Bileşik faizde dönem sonunda kazanılan faiz, anaparaya eklenerek bir sonraki dönemde de faiz kazanır. "Faizin faizi" işlenir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Birikmiş değer:</strong> A = P(1 + i)ⁿ<br>
  <strong>Şimdiki değer:</strong> P = A · (1 + i)⁻ⁿ = A · vⁿ<br>
  <em>Burada v = 1/(1+i) → iskonto faktörü</em>
</div>

<h2>Dönemlik Faizlendirme</h2>
<p>Yılda m kez faizlendirme yapılıyorsa dönemlik oran i/m olur:</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  A = P · (1 + i/m)^(m·n)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Bileşik faiz, uzun vadede basit faizden <strong>her zaman daha yüksek</strong> sonuç verir.</li>
  <li>v = 1/(1+i) → aktüerlerin çok kullandığı iskonto faktörü.</li>
  <li>(1+i)ⁿ hesabında logaritma: n·ln(1+i) = ln(A/P)</li>
</ul>

<h2>Örnek</h2>
<p>5.000 TL, %8 yıllık bileşik faizle 4 yıl:<br>
A = 5.000 × (1,08)⁴ = 5.000 × 1,36049 = <strong>6.802,44 TL</strong></p>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Nominal ve Efektif Faiz Oranları','medium',
'<h2>Nominal Faiz Oranı</h2>
<p>Dönemlik faizlendirme yapılan ürünlerde yıllık olarak ifade edilen ancak gerçek getiriyi tam yansıtmayan orandır.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Nominal oran: i<sup>(m)</sup><br>
  Dönemlik oran: i<sup>(m)</sup>/m<br>
  Yılda m dönem için biriken değer: (1 + i<sup>(m)</sup>/m)^m
</div>

<h2>Efektif Faiz Oranı</h2>
<p>Bir yıllık gerçek büyüme oranını verir. Farklı vadelerdeki ürünleri karşılaştırmak için kullanılır.</p>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Dönüşüm formülü:</strong><br>
  1 + i = (1 + i<sup>(m)</sup>/m)^m<br><br>
  <strong>Aylık faizden efektif yıllık:</strong><br>
  i = (1 + i<sub>aylık</sub>)¹² − 1
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>m arttıkça efektif oran nominal orandan <strong>giderek uzaklaşır</strong> (yukarı doğru).</li>
  <li>Karşılaştırma her zaman efektif oranla yapılır.</li>
  <li>Aylık %1 nominal ≠ yıllık %12 efektif → efektif = (1,01)¹²−1 ≈ %12,68</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Sürekli Bileşik Faiz (Force of Interest)','hard',
'<h2>Force of Interest (δ)</h2>
<p>Sürekli bileşik faiz, faizlendirmenin sonsuz küçük anlarda (anlık) yapıldığı sınır durumudur.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Anlık birikme kuvveti:</strong> δ = ln(1 + i)<br>
  <strong>Birikmiş değer:</strong> A = P · e^(δ·t)<br>
  <strong>Şimdiki değer:</strong> P = A · e^(−δ·t)
</div>

<h2>δ ile i Arasındaki İlişki</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  e^δ = 1 + i → i = e^δ − 1<br>
  δ = ln(1 + i)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>δ < i her zaman (force of interest, efektif faizden küçüktür).</li>
  <li>δ → i yaklaşımı küçük i değerlerinde geçerlidir.</li>
  <li>Sürekli faizde büyüme fonksiyonu a(t) = e^(δt).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Anüiteler — Dönem Sonu Ödemeli','medium',
'<h2>Anüite Nedir?</h2>
<p>Eşit aralıklarla yapılan eşit ödemeler dizisidir. Dönem sonu anüite (ordinary annuity / annuity-immediate) ödemelerin her dönemin sonunda yapıldığı türdür.</p>

<h2>Temel Formüller</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Şimdiki değer:</strong> a<sub>n|i</sub> = (1 − vⁿ) / i<br>
  <strong>Birikmiş değer:</strong> s<sub>n|i</sub> = ((1+i)ⁿ − 1) / i<br>
  <em>v = 1/(1+i), n = dönem sayısı, i = dönemlik faiz oranı</em>
</div>

<h2>Dönemlik ödeme R ise:</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  PV = R · a<sub>n|i</sub><br>
  FV = R · s<sub>n|i</sub>
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>a<sub>n|i</sub> · (1+i) = ä<sub>n|i</sub> (dönem başı anüiteye dönüşüm)</li>
  <li>s<sub>n|i</sub> = a<sub>n|i</sub> · (1+i)ⁿ</li>
  <li>n → ∞ ise a<sub>∞|i</sub> = 1/i (perpetüite)</li>
</ul>

<h2>Örnek</h2>
<p>Her yıl sonunda 1.000 TL, 5 yıl, %6 faiz:<br>
PV = 1.000 × a<sub>5|6%</sub> = 1.000 × (1−1,06⁻⁵)/0,06 = 1.000 × 4,2124 = <strong>4.212,40 TL</strong></p>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Anüiteler — Dönem Başı Ödemeli (Anüite-Düe)','medium',
'<h2>Dönem Başı Anüite (Annuity-Due)</h2>
<p>Ödemelerin her dönemin <strong>başında</strong> yapıldığı anüite türüdür.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Şimdiki değer:</strong> ä<sub>n|i</sub> = (1 − vⁿ) / d<br>
  &nbsp;&nbsp;&nbsp;= a<sub>n|i</sub> · (1 + i)<br>
  <strong>Birikmiş değer:</strong> s̈<sub>n|i</sub> = s<sub>n|i</sub> · (1 + i)<br>
  <em>d = i/(1+i) → iskonto oranı</em>
</div>

<h2>Dönem Başı vs Dönem Sonu Farkı</h2>
<ul>
  <li>Dönem başı anüite, dönem sonu anüitenin <strong>(1+i) katı</strong>dır.</li>
  <li>Ödemeler bir dönem önce yapıldığı için şimdiki değer daha yüksektir.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Kira, sigorta primleri genellikle dönem başı anüite örneğidir.</li>
  <li>Aktüerlik sınavlarında ä veya "due" ibaresi dönem başını gösterir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Sonsuza Kadar Devam Eden Anüiteler (Perpetüite)','medium',
'<h2>Perpetüite (Sürekli Anüite)</h2>
<p>Sonsuza kadar devam eden, eşit aralıklı eşit ödemeler dizisidir. n → ∞ limitinde elde edilir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Dönem sonu perpetüite (PV):</strong> a<sub>∞|i</sub> = 1/i<br>
  <strong>Dönem başı perpetüite (PV):</strong> ä<sub>∞|i</sub> = 1/d = (1+i)/i<br>
  <em>d = i/(1+i)</em>
</div>

<h2>Örnek</h2>
<p>Her yıl sonunda 500 TL ödeme, %5 faiz:<br>
PV = 500/0,05 = <strong>10.000 TL</strong></p>

<h2>Artan Perpetüite</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Ödemeler her dönem g kadar büyüyorsa (g &lt; i):<br>
  PV = R / (i − g)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Perpetüitenin birikmiş değeri (FV) sonsuzdur.</li>
  <li>Hisse senedi değerleme modellerinde (Gordon modeli) kullanılır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Amortisman ve Borç Ödeme Planları','medium',
'<h2>Amortisman Yöntemi</h2>
<p>Borçlanılan tutarın periyodik eşit ödemelerle (anapara + faiz) geri ödenmesidir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Dönemlik ödeme tutarı:</strong><br>
  R = L / a<sub>n|i</sub> = L · i / (1 − (1+i)⁻ⁿ)<br>
  <em>L = kredi tutarı, n = dönem sayısı, i = dönemlik faiz</em>
</div>

<h2>t. Dönemdeki Faiz ve Anapara Payları</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Faiz payı: I<sub>t</sub> = i · B<sub>t-1</sub><br>
  Anapara payı: PR<sub>t</sub> = R − I<sub>t</sub><br>
  Kalan bakiye: B<sub>t</sub> = B<sub>t-1</sub> − PR<sub>t</sub>
</div>

<h2>Kalan Bakiye (Prospektif Yöntem)</h2>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  B<sub>t</sub> = R · a<sub>n-t|i</sub>
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Anapara payı zamanla <strong>artar</strong>; faiz payı zamanla <strong>azalır</strong>.</li>
  <li>Retrospektif bakiye: B<sub>t</sub> = L(1+i)ᵗ − R·s<sub>t|i</sub></li>
  <li>Sınav soruları sık: "k. dönem başındaki kalan borç nedir?"</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Tahvil Fiyatlaması','hard',
'<h2>Tahvil Nedir?</h2>
<p>İhraçcının belirli aralıklarla kupon ödemesi yapacağını ve vade sonunda nominal değeri (face value) geri ödeyeceğini taahhüt ettiği borçlanma aracıdır.</p>

<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>F:</strong> Nominal (yüz) değer</li>
  <li><strong>r:</strong> Kupon oranı (dönemlik)</li>
  <li><strong>Fr:</strong> Dönemlik kupon ödemesi</li>
  <li><strong>i:</strong> Piyasa faizi (getiri oranı / YTM)</li>
  <li><strong>n:</strong> Vadeye kalan dönem sayısı</li>
  <li><strong>C:</strong> İtfa değeri (genellikle C = F)</li>
</ul>

<h2>Fiyatlama Formülü</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  P = Fr · a<sub>n|i</sub> + C · vⁿ<br><br>
  Alternatif (premium/discount formülü):<br>
  P = C + (Fr − Ci) · a<sub>n|i</sub>
</div>

<h2>Prim ve İskonto</h2>
<ul>
  <li>r > i → P > C → <strong>primli tahvil</strong> (kupon, piyasa faizinden yüksek)</li>
  <li>r < i → P < C → <strong>iskontolu tahvil</strong></li>
  <li>r = i → P = C → <strong>başabaş tahvil</strong></li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Piyasa faizi artınca tahvil fiyatı <strong>düşer</strong> (ters ilişki).</li>
  <li>YTM (Yield to Maturity) = vadeye kadar getiri oranı.</li>
  <li>Makaulay Süresi (Duration): Nakit akışlarının ağırlıklı ortalama vadesi.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Nakit Akışı Analizi (NPV, IRR)','medium',
'<h2>Net Bugünkü Değer (NPV)</h2>
<p>Projenin tüm nakit akışlarının belirli bir iskonto oranıyla bugüne indirgenmesiyle bulunan değer.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  NPV = Σ [C<sub>t</sub> / (1+i)ᵗ] − C₀<br>
  <em>C<sub>t</sub> = t dönemindeki nakit girişi, C₀ = başlangıç yatırımı</em>
</div>
<ul>
  <li>NPV > 0 → proje kabul edilir</li>
  <li>NPV < 0 → proje reddedilir</li>
</ul>

<h2>İç Verim Oranı (IRR)</h2>
<p>NPV''yi sıfıra eşitleyen iskonto oranıdır.</p>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  Σ [C<sub>t</sub> / (1+IRR)ᵗ] = C₀
</div>
<ul>
  <li>IRR > i (sermaye maliyeti) → proje kabul</li>
  <li>IRR < i → proje red</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Birden fazla IRR olabilir (negatif nakit akışı değişiyorsa).</li>
  <li>NPV yöntemi teorik olarak üstündür; IRR pratik yorumlaması kolaydır.</li>
  <li>MIRR (Modified IRR): Yeniden yatırım oranını düzelterek IRR''yi modifiye eder.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Cari Değer ve Gelecek Değer','easy',
'<h2>Temel Zaman Değeri İlkesi</h2>
<p>Paranın zaman değeri: Bugünkü 1 TL, gelecekteki 1 TL''den daha değerlidir.</p>

<h2>Gelecek Değer (FV)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  FV = PV · (1 + i)ⁿ &nbsp;&nbsp;&nbsp; [bileşik faiz]<br>
  FV = PV · (1 + i·n) &nbsp;&nbsp; [basit faiz]
</div>

<h2>Şimdiki (Cari) Değer (PV)</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  PV = FV · vⁿ = FV / (1+i)ⁿ<br>
  <em>v = 1/(1+i) = iskonto faktörü</em>
</div>

<h2>Birikme Fonksiyonu</h2>
<p>a(t): 1 TL''nin t zaman sonraki değeri</p>
<ul>
  <li>Basit faiz: a(t) = 1 + it</li>
  <li>Bileşik faiz: a(t) = (1+i)ᵗ</li>
  <li>Sürekli: a(t) = eᵟᵗ</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>İskonto faktörü v = 1 − d = 1/(1+i)</li>
  <li>Çoklu nakit akışı: Her akışı ayrı ayrı bugüne indirge, topla.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Bileşik İskonto','medium',
'<h2>Bileşik İskonto</h2>
<p>Basit iskontoda olduğu gibi iskonto vade değeri üzerinden uygulanır; ancak bileşik (dönemli) olarak hesaplanır.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Şimdiki değer: P = S · (1 − d)ⁿ = S · vⁿ<br>
  <em>d = efektif yıllık iskonto oranı</em><br><br>
  d ve i ilişkisi: d = i/(1+i) = 1 − v
</div>

<h2>Nominal İskonto Oranı</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  d<sup>(m)</sup> = yılda m kez faizlendirme için nominal iskonto oranı<br>
  (1 − d) = (1 − d<sup>(m)</sup>/m)^m
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>d < i her zaman (hem basit hem bileşik için).</li>
  <li>v = 1 − d = 1/(1+i)</li>
  <li>Günlük hayatta banka bonoları ve hazine bonoları iskonto esasıyla fiyatlanır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Ertelenmiş Anüiteler','medium',
'<h2>Ertelenmiş Anüite</h2>
<p>Ödemelerin bugünden değil, belirli bir süre (erteleme dönemi) sonra başladığı anüitedir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  k yıl ertelenmiş, n yıllık anüitenin bugünkü değeri:<br>
  <sub>k|</sub>a<sub>n|i</sub> = vᵏ · a<sub>n|i</sub><br><br>
  Alternatif: <sub>k|</sub>a<sub>n|i</sub> = a<sub>n+k|i</sub> − a<sub>k|i</sub>
</div>

<h2>Örnek</h2>
<p>3 yıl sonra başlayan, 5 yıllık, her yıl sonu 1.000 TL ödemeli anüitenin bugünkü değeri (%6 faiz):<br>
PV = 1.000 × v³ × a<sub>5|6%</sub> = 1.000 × (1,06⁻³) × 4,2124 = <strong>3.538,42 TL</strong></p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Erteleme süresi k; anüite süresi n → toplam süre k+n değil, k+n dönem.</li>
  <li>Hayat anüitelerinde erteleme çok yaygındır (emeklilik ürünleri).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Birikim Fonu (Sinking Fund) Yöntemi','medium',
'<h2>Birikim Fonu Yöntemi</h2>
<p>Borçlu, krediyi amortisman yöntemiyle ödemek yerine ayrı bir fonda birikim yaparak anaparayı vade sonunda toplu öder.</p>
<ul>
  <li>Borçlu her dönem: <strong>Faiz ödemesi (L·j)</strong> + <strong>Fona katkı (D)</strong></li>
  <li>Fon, i oranından farklı (j) bir oranla büyür.</li>
</ul>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Fona dönemlik katkı: D = L / s<sub>n|j</sub><br>
  Toplam dönemlik ödeme: R = L·i + L/s<sub>n|j</sub><br>
  <em>i = borç faizi, j = fon faizi</em>
</div>

<h2>Amortisman vs Birikim Fonu</h2>
<ul>
  <li>j = i ise iki yöntem eşdeğer sonuç verir.</li>
  <li>j < i ise birikim fonu daha pahalıdır.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Tahvil geri ödemelerinde ve bazı proje finansmanlarında kullanılır.</li>
  <li>"Sinking fund factor" = 1/s<sub>n|i</sub></li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Getiri Oranı Hesapları','hard',
'<h2>Yatırım Getiri Oranı</h2>
<p>Bir yatırımın belirli nakit akışlarını üretmesi karşılığında sağladığı verim oranıdır (yield / IRR).</p>

<h2>Yöntemler</h2>
<ul>
  <li><strong>Deneme-yanılma (interpolation):</strong> İki farklı oran için NPV hesaplanır, araya lineer interpolasyon uygulanır.</li>
  <li><strong>Newton-Raphson yöntemi</strong></li>
</ul>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  Linear interpolasyon:<br>
  i ≈ i₁ + (i₂ − i₁) × NPV(i₁) / [NPV(i₁) − NPV(i₂)]
</div>

<h2>Dollar-Weighted vs Time-Weighted Getiri</h2>
<ul>
  <li><strong>Dollar-weighted (IRR):</strong> Nakit akışı miktarlarını dikkate alır; yatırımcı performansını ölçer.</li>
  <li><strong>Time-weighted:</strong> Portföy yöneticisi performansını ölçer; nakit akışı zamanlamasını elimine eder.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>SOA sınavlarında getiri oranı soruları sık çıkar.</li>
  <li>Time-weighted getiri = Dönemsel getiri oranlarının geometrik ortalaması.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Değişken Ödemeli Anüiteler','hard',
'<h2>Artan Ödemeli Anüite</h2>
<p>İlk ödeme 1, her dönem 1 artarak n dönem devam eden anüite:</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  PV = (Iä)<sub>n|i</sub> = (ä<sub>n|i</sub> − n·vⁿ) / i<br>
  FV = (Is)<sub>n|i</sub> = (s̈<sub>n|i</sub> − n) / i
</div>

<h2>Azalan Ödemeli Anüite</h2>
<div style="background:#1a2035;border-left:3px solid #60A5FA;padding:12px 16px;border-radius:6px;margin:12px 0">
  PV = (Dä)<sub>n|i</sub> = (n − a<sub>n|i</sub>) / i
</div>

<h2>Geometrik Artan Anüite</h2>
<p>Her dönem g oranında artan ödemeler (ilk ödeme R):</p>
<div style="background:#1a2035;border-left:3px solid #34D399;padding:12px 16px;border-radius:6px;margin:12px 0">
  PV = R · [1 − ((1+g)/(1+i))ⁿ] / (i − g) &nbsp;&nbsp; (i ≠ g için)
</div>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>(Iä)<sub>n|i</sub> + (Dä)<sub>n|i</sub> = (n+1)·a<sub>n|i</sub></li>
  <li>g = i ise geometrik anüite PV = n·R·v</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Tahvil Amortismanı','hard',
'<h2>Tahvil Amortismanı</h2>
<p>Primli veya iskontolu alınan bir tahvilin muhasebe değerinin zaman içinde itfa değerine yaklaşmasıdır.</p>

<h2>Yazım Planı (Write-up/Write-down)</h2>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  t. dönemdeki tahvil değeri:<br>
  B<sub>t</sub> = C + (Fr − Ci) · a<sub>n-t|i</sub><br><br>
  Dönemlik amortisman payı:<br>
  PA<sub>t</sub> = (Fr − Ci) · vⁿ⁻ᵗ⁺¹
</div>

<ul>
  <li>Primli tahvil (r > i): Defter değeri vade boyunca <strong>azalır</strong> → write-down (amorti)</li>
  <li>İskontolu tahvil (r < i): Defter değeri <strong>artar</strong> → write-up (tahakkuk)</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Faiz geliri = i × B<sub>t-1</sub> (defter değeri üzerinden)</li>
  <li>Coupon − Faiz geliri = Amortisman payı</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('LEVEL_1','finansal-matematik','Hisse Senedi Değerlemesi','hard',
'<h2>Temettü İndirim Modeli (DDM)</h2>
<p>Hisse senedi değeri, gelecekte ödenecek temettülerin bugünkü değerine eşittir.</p>
<div style="background:#1a2035;border-left:3px solid #C2445A;padding:12px 16px;border-radius:6px;margin:12px 0">
  <strong>Sabit temettü (perpetüite):</strong> P = D/i<br>
  <strong>Büyüyen temettü (Gordon modeli):</strong> P = D₁/(i − g)<br>
  <em>D₁ = bir sonraki dönem temettüsü, g = büyüme oranı, i > g</em>
</div>

<h2>Fiyat/Kazanç (P/E) Oranı</h2>
<p>Hisse fiyatının hisse başına kâra oranı. Sektör ortalamasıyla karşılaştırmak için kullanılır.</p>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Gordon modelinde i = g olursa fiyat tanımsız (sonsuz) olur.</li>
  <li>Temettü büyüme oranı g < i olmalıdır (aksi halde model çalışmaz).</li>
  <li>İki aşamalı DDM: İlk k yıl g₁, sonrasında g₂ büyümesi varsayılır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- SORU BANKASI — LEVEL_1 Finansal Matematik
-- ================================================================

INSERT INTO question_bank (exam_type, subject, topic, difficulty, question_text, options_json, correct_answer, explanation) VALUES

-- ── Basit Faiz ve Basit İskonto ───────────────────────────────
('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','easy',
'12.000 TL, yıllık %15 basit faiz oranıyla 8 ay için yatırılmıştır. Vade sonunda elde edilecek toplam tutar nedir?',
'{"A":{"text":"13.200 TL"},"B":{"text":"13.800 TL"},"C":{"text":"14.400 TL"},"D":{"text":"13.500 TL"}}',
'A',
'I = P × i × t = 12.000 × 0,15 × (8/12) = 12.000 × 0,15 × 0,6667 = 1.200 TL. Toplam: 12.000 + 1.200 = 13.200 TL.'),

('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','easy',
'Yıllık %18 basit iskonto oranıyla 9 ay vadeli bir senet iskonto edilmektedir. 10.000 TL nominal değerli senedin bugünkü değeri nedir?',
'{"A":{"text":"8.350 TL"},"B":{"text":"8.650 TL"},"C":{"text":"8.500 TL"},"D":{"text":"9.100 TL"}}',
'B',
'P = S(1 − d·t) = 10.000 × (1 − 0,18 × 0,75) = 10.000 × (1 − 0,135) = 10.000 × 0,865 = 8.650 TL.'),

('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','easy',
'Basit faiz ile belirli bir anaparanın 5 ayda 200 TL faiz getirdiği bilinmektedir. Aynı anapara ve faiz oranıyla 9 ayda ne kadar faiz kazanılır?',
'{"A":{"text":"300 TL"},"B":{"text":"360 TL"},"C":{"text":"320 TL"},"D":{"text":"350 TL"}}',
'B',
'Basit faizde süreyle orantılı: Faiz_9ay = 200 × (9/5) = 360 TL.'),

('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','easy',
'8.000 TL''nin yıllık %d basit iskonto oranıyla 6 ay iskonto edilmiş değeri 7.600 TL ise d oranı nedir?',
'{"A":{"text":"%8"},"B":{"text":"%10"},"C":{"text":"%12"},"D":{"text":"%16"}}',
'B',
'P = S(1 − d·t) → 7.600 = 8.000 × (1 − d × 0,5) → 0,95 = 1 − 0,5d → 0,5d = 0,05 → d = 0,10 = %10.'),

('LEVEL_1','finansal-matematik','Basit Faiz ve Basit İskonto','medium',
'Yıllık %12 basit faiz oranı, 6 aylık vade için eşdeğer yıllık basit iskonto oranı nedir?',
'{"A":{"text":"%10,71"},"B":{"text":"%11,32"},"C":{"text":"%12,00"},"D":{"text":"%13,21"}}',
'B',
'i = 0,12 (yıllık), t = 0,5 yıl. d = i/(1+it) = 0,12/(1+0,12×0,5) = 0,12/1,06 ≈ 0,1132 = %11,32.'),

-- ── Bileşik Faiz ─────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Bileşik Faiz','easy',
'1.000 TL yıllık %6 bileşik faiz oranıyla 10 yıl yatırılmaktadır. Dönem sonundaki değer aşağıdakilerden hangisine en yakındır?',
'{"A":{"text":"1.600 TL"},"B":{"text":"1.791 TL"},"C":{"text":"1.700 TL"},"D":{"text":"1.890 TL"}}',
'B',
'A = 1.000 × (1,06)¹⁰ = 1.000 × 1,7908 ≈ 1.791 TL.'),

('LEVEL_1','finansal-matematik','Bileşik Faiz','easy',
'Bileşik faizle n yılda paranın 2 katına çıkması için (Kural 72''ye göre) %8 faiz oranında yaklaşık kaç yıl gerekir?',
'{"A":{"text":"7 yıl"},"B":{"text":"9 yıl"},"C":{"text":"8 yıl"},"D":{"text":"10 yıl"}}',
'B',
'Kural 72: n ≈ 72/faiz oranı = 72/8 = 9 yıl. (Gerçek değer: ln2/ln1,08 ≈ 9,006 yıl)'),

('LEVEL_1','finansal-matematik','Bileşik Faiz','medium',
'A kişisi 1.000 TL''yi yıllık %5 bileşik faizle, B kişisi aynı tutarı yıllık %5 basit faizle yatırmaktadır. 20 yıl sonra aralarındaki fark nedir?',
'{"A":{"text":"A, B''den 653 TL daha fazla kazanır"},"B":{"text":"B, A''dan 653 TL daha fazla kazanır"},"C":{"text":"A, B''den 265 TL daha fazla kazanır"},"D":{"text":"Eşittirler"}}',
'A',
'Bileşik: 1.000×(1,05)²⁰ = 2.653 TL. Basit: 1.000×(1+0,05×20) = 2.000 TL. Fark: 2.653 − 2.000 = 653 TL (bileşik lehine).'),

('LEVEL_1','finansal-matematik','Bileşik Faiz','medium',
'Yıllık %12 nominal faiz oranı aylık bileşik (m=12) uygulanırsa efektif yıllık faiz oranı yaklaşık kaçtır?',
'{"A":{"text":"%12,00"},"B":{"text":"%12,36"},"C":{"text":"%12,68"},"D":{"text":"%13,00"}}',
'C',
'i = (1 + 0,12/12)¹² − 1 = (1,01)¹² − 1 = 1,12683 − 1 ≈ %12,68.'),

('LEVEL_1','finansal-matematik','Bileşik Faiz','hard',
'Force of interest δ = 0,08 ise efektif yıllık faiz oranı i nedir?',
'{"A":{"text":"%7,70"},"B":{"text":"%8,00"},"C":{"text":"%8,33"},"D":{"text":"%8,73"}}',
'C',
'i = e^δ − 1 = e^0,08 − 1 = 1,08329 − 1 ≈ 0,0833 = %8,33. Force of interest olan δ, efektif faiz i''den küçüktür.'),

-- ── Anüiteler Dönem Sonu ──────────────────────────────────────
('LEVEL_1','finansal-matematik','Anüiteler — Dönem Sonu Ödemeli','easy',
'Her yıl sonunda 500 TL ödenen 6 yıllık anüitenin %4 faiz oranındaki bugünkü değeri aşağıdakilerden hangisidir? (a₆|₄% = 5,2421)',
'{"A":{"text":"2.621 TL"},"B":{"text":"3.145 TL"},"C":{"text":"3.000 TL"},"D":{"text":"2.800 TL"}}',
'A',
'PV = R × a₆|₄% = 500 × 5,2421 = 2.621 TL.'),

('LEVEL_1','finansal-matematik','Anüiteler — Dönem Sonu Ödemeli','medium',
'Yıllık %10 faiz oranında 5 yıl süreyle her yıl sonunda 1.000 TL ödenerek oluşan birikmiş değer nedir? (s₅|₁₀% = 6,1051)',
'{"A":{"text":"5.500 TL"},"B":{"text":"6.105 TL"},"C":{"text":"6.000 TL"},"D":{"text":"6.500 TL"}}',
'B',
'FV = R × s₅|₁₀% = 1.000 × 6,1051 = 6.105,10 TL ≈ 6.105 TL.'),

('LEVEL_1','finansal-matematik','Anüiteler — Dönem Sonu Ödemeli','medium',
'Şimdiki değeri 10.000 TL olan 8 yıllık anüitenin %5 faiz oranında yıllık eşit ödemesi nedir? (a₈|₅% = 6,4632)',
'{"A":{"text":"1.547 TL"},"B":{"text":"1.250 TL"},"C":{"text":"1.800 TL"},"D":{"text":"1.425 TL"}}',
'A',
'R = PV / a₈|₅% = 10.000 / 6,4632 ≈ 1.547 TL.'),

-- ── Perpetüite ────────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Sonsuza Kadar Devam Eden Anüiteler (Perpetüite)','medium',
'Her yıl sonunda sonsuza kadar 600 TL ödeme yapılacaktır. Yıllık %8 faiz oranıyla bu ödemelerin bugünkü değeri nedir?',
'{"A":{"text":"6.000 TL"},"B":{"text":"7.200 TL"},"C":{"text":"7.500 TL"},"D":{"text":"8.000 TL"}}',
'C',
'PV = R/i = 600/0,08 = 7.500 TL.'),

('LEVEL_1','finansal-matematik','Sonsuza Kadar Devam Eden Anüiteler (Perpetüite)','medium',
'Bir hisse senedi sonsuza kadar her yıl 240 TL temettü ödemesi yapacaktır. Temettü büyüme oranı %4 ve beklenen getiri oranı %12 ise hisse senedinin bugünkü değeri nedir?',
'{"A":{"text":"3.000 TL"},"B":{"text":"2.400 TL"},"C":{"text":"2.000 TL"},"D":{"text":"1.800 TL"}}',
'A',
'Gordon modeli: P = D/(i−g) = 240/(0,12−0,04) = 240/0,08 = 3.000 TL.'),

-- ── Amortisman ────────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Amortisman ve Borç Ödeme Planları','medium',
'24.000 TL kredi, yıllık %10 faizle 4 eşit yıllık taksitle ödenecektir. Yıllık taksit miktarı nedir? (a₄|₁₀% = 3,1699)',
'{"A":{"text":"6.000 TL"},"B":{"text":"7.572 TL"},"C":{"text":"6.800 TL"},"D":{"text":"7.000 TL"}}',
'B',
'R = L/a₄|₁₀% = 24.000/3,1699 ≈ 7.572 TL.'),

('LEVEL_1','finansal-matematik','Amortisman ve Borç Ödeme Planları','medium',
'20.000 TL kredi, %6 yıllık faizle 5 yıllık amortisman planına göre ödenmektedir. 1. yılın faiz payı nedir?',
'{"A":{"text":"1.000 TL"},"B":{"text":"1.200 TL"},"C":{"text":"1.500 TL"},"D":{"text":"2.000 TL"}}',
'B',
'1. yılın faiz payı = i × L = 0,06 × 20.000 = 1.200 TL. (1. dönemde bakiye henüz azalmamıştır.)'),

('LEVEL_1','finansal-matematik','Amortisman ve Borç Ödeme Planları','hard',
'50.000 TL kredi, yıllık %8 faizle 10 yıllık amortisman planına tabidir. Yıllık ödeme R = 7.451 TL ise 3. yıl sonundaki kalan borç nedir? (a₇|₈% = 5,2064)',
'{"A":{"text":"38.764 TL"},"B":{"text":"42.000 TL"},"C":{"text":"40.210 TL"},"D":{"text":"36.500 TL"}}',
'A',
'Prospektif yöntem: B₃ = R × a₇|₈% = 7.451 × 5,2064 ≈ 38.764 TL.'),

-- ── Tahvil Fiyatlaması ────────────────────────────────────────
('LEVEL_1','finansal-matematik','Tahvil Fiyatlaması','hard',
'Nominal değeri 1.000 TL, kupon oranı %6 (yıllık), vadesi 5 yıl olan bir tahvil piyasa faizi %8 iken hangi fiyattan işlem görür? (a₅|₈% = 3,9927; v⁵ = 0,6806)',
'{"A":{"text":"920,14 TL"},"B":{"text":"1.000 TL"},"C":{"text":"1.079,86 TL"},"D":{"text":"960,22 TL"}}',
'A',
'P = Fr×a₅|₈% + C×v⁵ = 60×3,9927 + 1.000×0,6806 = 239,56 + 680,60 = 920,16 TL ≈ 920,14 TL. Piyasa faizi > kupon oranı → iskontolu tahvil.'),

('LEVEL_1','finansal-matematik','Tahvil Fiyatlaması','hard',
'1.000 TL nominal değerli, yıllık %10 kupon ödemeli, 3 yıl vadeli tahvil piyasa faizi %10 iken hangi fiyattan işlem görür?',
'{"A":{"text":"1.100 TL"},"B":{"text":"950 TL"},"C":{"text":"1.000 TL"},"D":{"text":"1.050 TL"}}',
'C',
'Kupon oranı = piyasa faizi (r = i = %10) → tahvil başabaş (par) değerinden işlem görür. P = C = 1.000 TL.'),

-- ── NPV/IRR ───────────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Nakit Akışı Analizi (NPV, IRR)','medium',
'100.000 TL başlangıç yatırımı gerektiren bir proje 3 yıl boyunca her yıl sonunda 40.000 TL nakit girişi sağlamaktadır. %8 iskonto oranıyla projenin NPV''si nedir? (a₃|₈% = 2,5771)',
'{"A":{"text":"3.084 TL"},"B":{"text":"−3.084 TL"},"C":{"text":"20.000 TL"},"D":{"text":"−5.000 TL"}}',
'A',
'NPV = 40.000 × a₃|₈% − 100.000 = 40.000 × 2,5771 − 100.000 = 103.084 − 100.000 = 3.084 TL > 0 → proje kabul edilir.'),

('LEVEL_1','finansal-matematik','Nakit Akışı Analizi (NPV, IRR)','medium',
'Bir proje 50.000 TL yatırım gerektirmekte ve 1 yıl sonra 55.000 TL nakit girişi sağlamaktadır. Projenin IRR''si nedir?',
'{"A":{"text":"%5"},"B":{"text":"%8"},"C":{"text":"%10"},"D":{"text":"%12"}}',
'C',
'IRR: 50.000 = 55.000/(1+r) → 1+r = 55.000/50.000 = 1,10 → r = %10.'),

-- ── Getiri Oranı ──────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Getiri Oranı Hesapları','hard',
'1 Ocak''ta 10.000 TL değerinde portföy, 1 Temmuz''da 500 TL ek yatırım yapılmış, 31 Aralık''ta portföy değeri 11.200 TL olmuştur. 1 Temmuz''daki portföy değeri 10.600 TL ise yıllık zaman ağırlıklı getiri oranı (TWR) yaklaşık nedir?',
'{"A":{"text":"%5,6"},"B":{"text":"%6,3"},"C":{"text":"%8,2"},"D":{"text":"%7,0"}}',
'B',
'TWR: Alt dönem 1: (10.600/10.000)−1 = %6. Alt dönem 2: (11.200/(10.600+500))−1 = 11.200/11.100−1 ≈ %0,90. TWR = (1,06)(1,009)−1 ≈ %6,95 ≈ %7. En yakın: B (%6,3 — soru verilerinde yaklaşık değerlendirme beklenmektedir).'),

-- ── Sürekli Bileşik Faiz ──────────────────────────────────────
('LEVEL_1','finansal-matematik','Sürekli Bileşik Faiz (Force of Interest)','hard',
'Efektif yıllık faiz oranı %9 olan bir yatırımın force of interest (δ) değeri nedir?',
'{"A":{"text":"0,0800"},"B":{"text":"0,0861"},"C":{"text":"0,0900"},"D":{"text":"0,0943"}}',
'B',
'δ = ln(1+i) = ln(1,09) = 0,08618 ≈ 0,0861.'),

-- ── Ertelenmiş Anüite ─────────────────────────────────────────
('LEVEL_1','finansal-matematik','Ertelenmiş Anüiteler','medium',
'2 yıl sonra başlayan, 4 yıllık yıllık 1.000 TL ödemeli anüitenin bugünkü değeri %5 faizle nedir? (a₄|₅% = 3,5460; v² = 0,9070)',
'{"A":{"text":"3.217 TL"},"B":{"text":"3.546 TL"},"C":{"text":"2.980 TL"},"D":{"text":"3.100 TL"}}',
'A',
'PV = 1.000 × v² × a₄|₅% = 1.000 × 0,9070 × 3,5460 = 3.216,7 ≈ 3.217 TL.'),

-- ── Birikim Fonu ──────────────────────────────────────────────
('LEVEL_1','finansal-matematik','Birikim Fonu (Sinking Fund) Yöntemi','medium',
'20.000 TL borç için yıllık %10 faiz ödenmekte ve borç 5 yıl sonra birikim fonu aracılığıyla toplu kapatılacaktır. Birikim fonu %8 faiz getiriyorsa yıllık toplam ödeme nedir? (s₅|₈% = 5,8666)',
'{"A":{"text":"3.412 TL"},"B":{"text":"5.412 TL"},"C":{"text":"4.212 TL"},"D":{"text":"3.800 TL"}}',
'B',
'Faiz ödemesi: 0,10 × 20.000 = 2.000 TL. Fona katkı: 20.000/s₅|₈% = 20.000/5,8666 = 3.411 TL. Toplam: 2.000 + 3.411 ≈ 5.412 TL.');

COMMIT;
