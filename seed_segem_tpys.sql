-- ================================================================
-- ActuReady — SEGEM TPYS Konu İçeriği + Soru Bankası
-- 01.08.2026 — Manuel yazılmıştır, AI API kullanılmamıştır.
-- ================================================================
BEGIN;

-- ================================================================
-- BÖLÜM 1: KONU İÇERİKLERİ
-- ================================================================

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'<h2>Sigorta Acentesi Kimdir?</h2>
<p>Sigorta acentesi; bir sözleşmeye dayanarak belirli bir sigorta şirketi adına sigorta sözleşmesi yapmaya ve sigorta işlemlerini yürütmeye yetkili kılınan gerçek veya tüzel kişidir (5684 sayılı Sigortacılık Kanunu, Md. 2).</p>

<h2>Yasal Dayanak</h2>
<ul>
  <li><strong>5684 Sigortacılık Kanunu</strong> — acentelik tanımı ve genel çerçeve</li>
  <li><strong>Sigorta Acenteleri Yönetmeliği</strong> — levha, kayıt, yükümlülükler</li>
  <li>Denetim: <strong>Hazine ve Maliye Bakanlığı (SEDDK)</strong></li>
  <li>Sicil: <strong>TOBB bünyesindeki Levha</strong></li>
</ul>

<h2>Faaliyete Başlama Şartları</h2>
<ul>
  <li>TOBB Levhasına kayıt zorunludur.</li>
  <li>Gerçek kişi acenteler için en az lise mezuniyeti şartı aranır.</li>
  <li>Teknik personel: <strong>SEGEM TPYS sınavından</strong> başarılı olmak zorunludur.</li>
  <li>Mesleki sorumluluk sigortası yaptırılması gerekir.</li>
</ul>

<h2>Acentenin Yükümlülükleri</h2>
<ul>
  <li>Sigortalıya ürün hakkında doğru ve eksiksiz bilgi vermek</li>
  <li>Tahsil ettiği primleri belirlenen sürede sigorta şirketine iletmek</li>
  <li>Kendi hesabına sigorta sözleşmesi yapamamak</li>
  <li>TOBB levhasına yıllık kayıt yaptırmak ve aidatını ödemek</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Acente = sigorta şirketini temsil eder; broker = sigortalıyı temsil eder.</li>
  <li>Levha → TOBB; denetim → SEDDK (Sigorta ve Özel Emeklilik Düzenleme ve Denetleme Kurumu).</li>
  <li>SEGEM: Sigorta Eğitim Merkezi — TOBB bünyesinde.</li>
  <li>TPYS belgesi olmadan teknik personel olarak çalışılamaz.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'<h2>Sigorta Branşları</h2>
<p>Türkiye''de sigortacılık iki ana kategoriye ayrılır:</p>

<h3>1. Hayat Sigortaları</h3>
<ul>
  <li>Hayat sigortası (term, birikimli)</li>
  <li>Bireysel emeklilik (BES)</li>
  <li>Sağlık sigortası (hayat dalı kapsamında da düzenlenebilir)</li>
</ul>

<h3>2. Hayat Dışı Sigortalar (Elementer)</h3>
<ul>
  <li><strong>Kaza:</strong> Trafik, kişisel kaza, işveren mali sorumluluk</li>
  <li><strong>Hastalık/Sağlık:</strong> Özel sağlık sigortası</li>
  <li><strong>Kara Araçları:</strong> Kasko</li>
  <li><strong>Yangın ve Doğal Afetler:</strong> Konut, işyeri, DASK</li>
  <li><strong>Nakliyat:</strong> Kargo, tekne</li>
  <li><strong>Sorumluluk:</strong> Üçüncü şahıs, ürün sorumluluğu</li>
  <li><strong>Mühendislik:</strong> İnşaat, makine montaj</li>
  <li><strong>Tarım:</strong> Bitki, hayvan, sera</li>
</ul>

<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>Prim:</strong> Sigortalının ödediği bedel</li>
  <li><strong>Tazminat:</strong> Sigorta şirketinin ödediği bedel</li>
  <li><strong>Sigorta bedeli:</strong> Poliçede belirtilen azami tazminat tutarı</li>
  <li><strong>Muafiyet:</strong> Sigortalının kendi üstlendiği hasar payı</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Zorunlu sigortalar: Trafik, DASK, deniz araçları zorunlu mali sorumluluk.</li>
  <li>Trafik sigortası = hayat dışı (kaza branşı). Kasko = hayat dışı (kara araçları).</li>
  <li>BES = hayat branşı değil, ayrı bir sistem; Emeklilik Gözetim Merkezi (EGM) denetler.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'<h2>Zorunlu Trafik Sigortası (Zorunlu Mali Sorumluluk)</h2>
<p>Motorlu taşıt işletenlerinin <strong>üçüncü şahıslara</strong> verebileceği bedensel ve maddi zararları karşılamak amacıyla yapılması zorunlu olan sigortadır.</p>
<ul>
  <li>Yasal dayanak: <strong>2918 sayılı Karayolları Trafik Kanunu</strong></li>
  <li>Sigortalanan risk: Araç sahibinin değil, <strong>karşı tarafın</strong> zararı</li>
  <li>Limitler: Hazine ve Maliye Bakanlığı tarafından her yıl belirlenir</li>
  <li>Tarifeyi belirleyen: Sigorta şirketleri (serbest tarife — 2015 sonrası)</li>
</ul>

<h2>Kasko Sigortası</h2>
<p>Sigortalının <strong>kendi aracının</strong> uğradığı hasarları karşılayan, zorunlu olmayan (ihtiyari) sigortadır.</p>
<ul>
  <li>Teminatlar: Çarpma, çarpışma, devrilme, yangın, hırsızlık, doğal afet</li>
  <li>Geniş kapsamlı kasko: Tüm teminatlar dahil</li>
  <li>Dar kapsamlı kasko: Seçilen teminatlar</li>
  <li><strong>Muafiyet:</strong> Belirlenen tutarın altındaki hasarlar sigortalı tarafından karşılanır</li>
</ul>

<h2>Temel Fark</h2>
<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
  <tr><th>Özellik</th><th>Trafik Sigortası</th><th>Kasko</th></tr>
  <tr><td>Zorunluluk</td><td>Zorunlu</td><td>İhtiyari</td></tr>
  <tr><td>Karşılanan zarar</td><td>Karşı tarafın zararı</td><td>Kendi aracının zararı</td></tr>
  <tr><td>Kapsam</td><td>Bedensel + maddi</td><td>Araca gelen hasarlar</td></tr>
</table>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Trafik sigortası poliçesiz araç kullanmak trafik cezası + aracın trafikten men sebebidir.</li>
  <li>Kasko hasarlarında <strong>kısmi hasar / tam hasar</strong> ayrımı önemlidir.</li>
  <li>Tam hasar eşiği: Hasar bedeli, aracın piyasa değerinin %70''ini aşıyorsa tam hasar sayılır (genel uygulama).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Konut ve Yangın Sigortaları','easy',
'<h2>DASK (Zorunlu Deprem Sigortası)</h2>
<p>Doğal Afet Sigortaları Kurumu (DASK) tarafından yönetilen, <strong>binalardaki deprem kaynaklı yapısal hasarları</strong> karşılayan zorunlu sigortadır.</p>
<ul>
  <li>Kapsam: Deprem, deprem sonrası yangın, patlama, tsunami, yer kayması</li>
  <li>Zorunluluk: Tapuya kayıtlı konutlar (hepsinde zorunlu)</li>
  <li>Limit: DASK tarafından belirlenen metrekare birim bedeli × alan</li>
  <li>DASK sigortasız ev için tapu devri yapılamaz.</li>
</ul>

<h2>Konut Sigortası (İhtiyari)</h2>
<p>DASK''ın ötesinde, evin içindeki eşyaları ve ek riskleri karşılar. Zorunlu değildir.</p>
<ul>
  <li>Teminatlar: Yangın, hırsızlık, su baskını, cam kırılması, üçüncü şahıs sorumluluk</li>
  <li>İçerik sigortası: Mobilya, eşya, elektronik alet</li>
</ul>

<h2>Yangın Sigortası</h2>
<ul>
  <li>En eski sigorta branşlarından biridir.</li>
  <li>Yangın, yıldırım, patlama temel teminatlarındandır.</li>
  <li>Ek teminatlarla genişletilebilir: sel, fırtına, deprem, terör.</li>
  <li>İşyeri yangın sigortası: Bina + içerik + iş durması</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>DASK = zorunlu; konut sigortası = ihtiyari.</li>
  <li>Deprem hasarını DASK karşılar; diğer doğal afetler ek teminat gerektirir.</li>
  <li>DASK tazminatı bina yapı bedeline göre hesaplanır, içerik dahil değildir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sağlık Sigortası Temel Bilgileri','easy',
'<h2>Özel Sağlık Sigortası</h2>
<p>Sigortalının hastalanması veya kaza geçirmesi durumunda oluşan tıbbi giderleri karşılamak amacıyla yapılan sigortadır.</p>

<h2>Temel Teminatlar</h2>
<ul>
  <li><strong>Yatarak tedavi:</strong> Hastane yatış, ameliyat, yoğun bakım giderleri</li>
  <li><strong>Ayakta tedavi:</strong> Poliklinik muayene, tahlil, görüntüleme</li>
  <li><strong>Diş tedavisi:</strong> Çekim, dolgu, kanal tedavisi (çoğunlukla ek teminat)</li>
  <li><strong>Doğum:</strong> Normal veya sezaryen doğum masrafları (bekleme süresi uygulanır)</li>
  <li><strong>Annelik:</strong> Hamilelik kontrolleri</li>
</ul>

<h2>Önemli Kavramlar</h2>
<ul>
  <li><strong>Bekleme süresi:</strong> Poliçe başlangıcından sonra belirli bir süre geçmeden teminat devreye girmez (örn. doğum için 270 gün).</li>
  <li><strong>Ön hastalık:</strong> Poliçe öncesi mevcut hastalıklar kapsam dışı olabilir.</li>
  <li><strong>Anlaşmalı hastane:</strong> Sigorta şirketinin protokol yaptığı hastaneler.</li>
  <li><strong>Katılım payı:</strong> Sigortalının karşıladığı sabit tutar/oran.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>SGK (Sosyal Güvenlik Kurumu) = kamusal; özel sağlık sigortası = tamamlayıcı veya ek güvence.</li>
  <li>Tamamlayıcı sağlık sigortası: SGK karşılamayan fark ücretlerini öder.</li>
  <li>Sağlık sigortasında hasar bildirim süresi çok önemlidir — genellikle 30 gün.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Hayat Sigortası Temel Bilgileri','easy',
'<h2>Hayat Sigortası Nedir?</h2>
<p>Sigortalının hayatına bağlı bir riskin (ölüm veya yaşama) gerçekleşmesi halinde lehtara belirli bir meblağ ödenmesini taahhüt eden sigortadır.</p>

<h2>Ürün Türleri</h2>
<ul>
  <li><strong>Süreli (Term) Hayat:</strong> Belirli süre içinde ölüm halinde tazminat ödenir. Süre sonunda poliçe biter, birikim yok.</li>
  <li><strong>Tam Hayat (Whole Life):</strong> Vefat ne zaman olursa olsun tazminat ödenir.</li>
  <li><strong>Birikimli Hayat (Endowment):</strong> Hem ölüm teminatı hem birikim bileşeni içerir. Süre sonunda sigortalı yaşıyorsa birikim geri ödenir.</li>
  <li><strong>Yatırıma Bağlı (Unit Linked):</strong> Prim fonlara yatırılır, değeri fon performansına göre değişir.</li>
</ul>

<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>Sigortalı:</strong> Hayatı teminat altına alınan kişi</li>
  <li><strong>Lehtar:</strong> Hasar/vefat halinde tazminatı alacak kişi</li>
  <li><strong>Riziko:</strong> Ölüm veya yaşama riski</li>
  <li><strong>Kurtarma değeri (teslim değeri):</strong> Poliçe iptalinde geri alınan tutar</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Hayat sigortasında sigortalı ile poliçe sahibi farklı kişi olabilir.</li>
  <li>Lehtar değişikliği sigortalının yazılı talebiyle yapılır.</li>
  <li>İntihar: Poliçe başlangıcından itibaren 2 yıl içindeki intihar teminat kapsamı dışındadır (genel kural).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sorumluluk ve Kaza Sigortaları','easy',
'<h2>Sorumluluk Sigortaları</h2>
<p>Sigortalının üçüncü kişilere verdiği bedensel veya maddi zararlar nedeniyle doğacak hukuki sorumluluğunu güvence altına alır.</p>

<h3>Başlıca Ürünler</h3>
<ul>
  <li><strong>İşveren Mali Sorumluluk:</strong> İşçi iş kazası/meslek hastalığı tazminatları</li>
  <li><strong>Üçüncü Şahıs Mali Sorumluluk:</strong> Üçüncü kişilere verilen zararlar</li>
  <li><strong>Mesleki Sorumluluk:</strong> Doktorlar, avukatlar, mali müşavirler, sigorta aracıları için</li>
  <li><strong>Ürün Sorumluluk:</strong> Üretilen ürünlerin neden olduğu zararlar</li>
</ul>

<h2>Kaza Sigortaları</h2>
<p>Sigortalının kendisine yönelik kaza risklerini kapsar.</p>
<ul>
  <li><strong>Ferdi Kaza Sigortası:</strong> Ölüm, sakatlık, tedavi masrafları</li>
  <li><strong>Grup Kaza:</strong> Şirketlerin çalışanları için toplu poliçe</li>
</ul>

<h2>Önemli İlkeler</h2>
<ul>
  <li>Sorumluluk sigortasında sigortalının kusuru ispat edilmelidir (kural olarak).</li>
  <li>Zorunlu sorumluluk sigortaları: Trafik, deniz araçları, tüp gaz, havacılık.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Mesleki sorumluluk sigortası sigorta acenteleri için zorunludur.</li>
  <li>Ferdi kaza sigortası hayat dışı sigorta branşıdır.</li>
  <li>Sorumluluk sigortasında mağdur (üçüncü kişi) doğrudan sigorta şirketine başvurabilir (Türk Hukukunda bazı zorunlu sigortalar için).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sigorta Sözleşmesi ve Tazminat Süreci','easy',
'<h2>Sigorta Sözleşmesinin Unsurları</h2>
<ul>
  <li><strong>Taraflar:</strong> Sigortacı (şirket) + Sigorta ettiren (poliçe sahibi)</li>
  <li><strong>Sigorta konusu:</strong> Güvence altına alınan menfaat veya kişi</li>
  <li><strong>Sigorta bedeli:</strong> Azami tazminat tutarı</li>
  <li><strong>Prim:</strong> Sigorta ettiren tarafından ödenen bedel</li>
  <li><strong>Sigorta süresi:</strong> Poliçenin geçerli olduğu dönem</li>
</ul>

<h2>Temel İlkeler</h2>
<ul>
  <li><strong>Sigortalanabilir menfaat:</strong> Sigortalının sigorta konusunda hukuki çıkarı olmalıdır.</li>
  <li><strong>Azami iyi niyet (Utmost Good Faith):</strong> Her iki taraf da tam ve doğru bilgi vermekle yükümlüdür.</li>
  <li><strong>Tazminat ilkesi:</strong> Sigorta, zararı karşılar; kâr elde ettirilmez.</li>
  <li><strong>Halefiyet (Rücu/Regres):</strong> Tazminatı ödeyen sigorta şirketi, zarara neden olan üçüncü kişiye karşı sigortalının haklarını kullanabilir.</li>
</ul>

<h2>Tazminat Süreci</h2>
<ol>
  <li>Hasarın oluşması ve sigorta şirketine bildirim (genellikle 5-30 gün içinde)</li>
  <li>Eksper incelemesi / hasar tespiti</li>
  <li>Belgelerin toplanması</li>
  <li>Hasar dosyasının değerlendirilmesi</li>
  <li>Tazminat ödemesi</li>
</ol>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Poliçe = sigorta sözleşmesinin belgesi.</li>
  <li>Bildirimi geciktirmek tazminat hakkını kaybettirebilir.</li>
  <li>Eksper: Bağımsız hasar değerleme uzmanı.</li>
  <li>Hasar ihbarı yapılmazsa veya geç yapılırsa sigorta şirketi tazminattan kaçınabilir.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Bireysel Emeklilik Sistemi (BES) Temelleri','easy',
'<h2>BES Nedir?</h2>
<p>Bireysel Emeklilik Sistemi (BES); çalışanların emeklilikleri için tasarruf yapmasını ve bu birikimlerini fon yatırımlarıyla değerlendirmesini sağlayan, gönüllü (ihtiyari) bir tamamlayıcı emeklilik sistemidir.</p>

<h2>Temel Özellikler</h2>
<ul>
  <li>Düzenleyici: <strong>Hazine ve Maliye Bakanlığı</strong></li>
  <li>Gözetim: <strong>Emeklilik Gözetim Merkezi (EGM)</strong></li>
  <li>Yürüten: Emeklilik şirketleri (sigorta şirketlerinden ayrı lisans gerektirir)</li>
  <li>Devlet katkısı: Katılımcının ödediği katkı payının <strong>%30''u</strong> devlet tarafından eklenir (üst limite kadar)</li>
</ul>

<h2>Emekliliğe Hak Kazanma</h2>
<ul>
  <li>En az <strong>10 yıl</strong> sistemde kalma</li>
  <li>En az <strong>56 yaşını</strong> doldurma</li>
</ul>

<h2>Çıkış Türleri</h2>
<ul>
  <li><strong>Emeklilik:</strong> Şartlar sağlandığında, vergi avantajlı</li>
  <li><strong>Erken çıkış:</strong> Şartlar sağlanmadan, kesintiler uygulanır (stopaj, devlet katkısı iade)</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>BES = ihtiyari; SGK = zorunlu. İkisi farklı sistemdir.</li>
  <li>Devlet katkısı: %30 — bu oran sınav sorusu olarak sıkça çıkar.</li>
  <li>İşveren katkısı da mümkündür (OKS — Otomatik Katılım Sistemi).</li>
  <li>OKS: İşverenler belirli çalışanlarını otomatik olarak BES''e dahil etmek zorundadır.</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

INSERT INTO topic_content (exam_type, subject, topic, difficulty, content_markdown) VALUES
('SEGEM_TPYS','mevzuat','Sigorta Etik ve Müşteri İlişkileri','easy',
'<h2>Sigorta Etiğinin Temelleri</h2>
<p>Sigortacılıkta etik; müşteri çıkarlarını ön planda tutmak, dürüst ve şeffaf davranmak, gizliliğe uymak ve mesleki standartlara sadık kalmak anlamına gelir.</p>

<h2>Acentenin Etik Yükümlülükleri</h2>
<ul>
  <li><strong>Doğruluk:</strong> Ürün hakkında yanıltıcı bilgi vermemek</li>
  <li><strong>Şeffaflık:</strong> Komisyon ve ücretleri açıklamak</li>
  <li><strong>Müşteri yararı:</strong> Müşteri ihtiyaçlarını kendi kazancının önüne koymak</li>
  <li><strong>Gizlilik:</strong> Müşteri bilgilerini üçüncü kişilere aktarmamak (KVKK uyumu)</li>
  <li><strong>Çıkar çatışması:</strong> Kişisel çıkarlar ile müşteri çıkarlarının çatıştığı durumları açıklamak</li>
</ul>

<h2>KVKK (Kişisel Verilerin Korunması Kanunu)</h2>
<ul>
  <li>Müşteri verileri yalnızca açık rıza ile işlenebilir.</li>
  <li>Sağlık verileri "özel nitelikli kişisel veri" olarak daha güçlü koruma altındadır.</li>
  <li>Veri ihlali durumunda 72 saat içinde bildirimi zorunludur.</li>
</ul>

<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Müşteriye yanlış ürün satmak (mis-selling) hem etik ihlali hem hukuki sorumluluktur.</li>
  <li>Sigorta sözleşmesi öncesi müşteriye "ön bilgilendirme formu" verilmelidir.</li>
  <li>Şikayet mercii: Sigorta Tahkim Komisyonu (mahkeme yerine hızlı çözüm).</li>
</ul>')

ON CONFLICT (exam_type, subject, topic) DO UPDATE SET content_markdown = EXCLUDED.content_markdown;

-- ================================================================
-- BÖLÜM 2: SORU BANKASI — SEGEM_TPYS
-- ================================================================

INSERT INTO question_bank (exam_type, subject, topic, difficulty, question_text, options_json, correct_answer, explanation) VALUES

-- ── Sigorta Acenteliği Mevzuatı ──────────────────────────────
('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Sigorta acenteliği faaliyetini düzenleyen temel yasal mevzuat aşağıdakilerden hangisidir?',
'{"A":{"text":"2918 sayılı Karayolları Trafik Kanunu"},"B":{"text":"5684 sayılı Sigortacılık Kanunu"},"C":{"text":"6361 sayılı Finansal Kiralama Kanunu"},"D":{"text":"4632 sayılı Bireysel Emeklilik Kanunu"}}',
'B',
'5684 sayılı Sigortacılık Kanunu, sigorta acentelerinin tanımını, kayıt ve faaliyet şartlarını düzenleyen temel mevzuattır.'),

('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Sigorta acentelerinin kaydedildiği levhayı tutan kurum aşağıdakilerden hangisidir?',
'{"A":{"text":"Hazine ve Maliye Bakanlığı"},"B":{"text":"Türkiye Sigorta Birliği"},"C":{"text":"TOBB (Türkiye Odalar ve Borsalar Birliği)"},"D":{"text":"Emeklilik Gözetim Merkezi"}}',
'C',
'Sigorta acenteleri, TOBB bünyesinde tutulan levhaya kayıt olmak zorundadır. Denetim ise Hazine ve Maliye Bakanlığı bünyesindeki SEDDK tarafından yapılır.'),

('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Aşağıdakilerden hangisi sigorta acentesi ile sigorta brokerinin temel farkını doğru ifade eder?',
'{"A":{"text":"Acente sigortalıyı; broker ise sigorta şirketini temsil eder"},"B":{"text":"Acente sigorta şirketini; broker ise sigortalıyı temsil eder"},"C":{"text":"Acente komisyon alır; broker almaz"},"D":{"text":"Acente sadece hayat sigortası; broker sadece hayat dışı satabilir"}}',
'B',
'Temel fark: Acente → sigorta şirketinin temsilcisi; Broker → sigortalının (müşterinin) temsilcisi. Bu nedenle broker daha bağımsız danışmanlık hizmeti verir.'),

('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Sigorta acentesinin yanında çalışacak teknik personelin sahip olması gereken belge aşağıdakilerden hangisidir?',
'{"A":{"text":"Aktüer Yeterlilik Belgesi"},"B":{"text":"TPYS (Teknik Personel Yeterlilik Sınavı) Belgesi"},"C":{"text":"CPA Muhasebe Sertifikası"},"D":{"text":"Lise Diploması yeterlidir, ek belge gerekmez"}}',
'B',
'Sigorta acentelerinde çalışan teknik personelin SEGEM tarafından düzenlenen TPYS sınavını geçerek yeterlilik belgesi alması zorunludur.'),

('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Sigorta acentesi kendi hesabına sigorta sözleşmesi akdedebilir mi?',
'{"A":{"text":"Evet, yetkili olduğu tüm branşlarda kendi hesabına sözleşme yapabilir"},"B":{"text":"Hayır, acente yalnızca temsil ettiği şirket adına sözleşme yapabilir"},"C":{"text":"Evet, ancak yalnızca hayat dışı branşlarda"},"D":{"text":"Hayır, ancak broker yetkisi alırsa yapabilir"}}',
'B',
'Sigorta acentesi, bağlı olduğu sigorta şirketinin temsilcisi sıfatıyla hareket eder. Kendi adına ve kendi hesabına sigorta sözleşmesi yapamaz.'),

('SEGEM_TPYS','mevzuat','Sigorta Acenteliği Mevzuatı','easy',
'Aşağıdaki ifadelerden hangisi mesleki sorumluluk sigortası açısından doğrudur?',
'{"A":{"text":"Sigorta acenteleri için mesleki sorumluluk sigortası isteğe bağlıdır"},"B":{"text":"Mesleki sorumluluk sigortası yalnızca brokerler için zorunludur"},"C":{"text":"Sigorta acenteleri mesleki sorumluluk sigortası yaptırmak zorundadır"},"D":{"text":"Mesleki sorumluluk sigortası yalnızca hayat branşı için geçerlidir"}}',
'C',
'Sigorta acenteleri, mesleki faaliyetleri nedeniyle doğabilecek zarar ve tazminat yükümlülüklerine karşı mesleki sorumluluk sigortası yaptırmakla yükümlüdür.'),

-- ── Sigorta Ürünleri ve Branşları ─────────────────────────────
('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'Aşağıdaki sigorta türlerinden hangisi zorunlu sigortalar arasında yer alır?',
'{"A":{"text":"Kasko sigortası"},"B":{"text":"Konut sigortası"},"C":{"text":"Zorunlu trafik (mali sorumluluk) sigortası"},"D":{"text":"Ferdi kaza sigortası"}}',
'C',
'Motorlu taşıt işletenleri için Zorunlu Mali Sorumluluk (trafik) sigortası yaptırma zorunluluğu 2918 sayılı Karayolları Trafik Kanunu ile düzenlenmiştir.'),

('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'Bireysel emeklilik sistemi (BES) hangi kategoride değerlendirilir?',
'{"A":{"text":"Hayat dışı sigortalar"},"B":{"text":"Kaza sigortaları"},"C":{"text":"Bağımsız emeklilik sistemi (hayat sigortasından ayrı)"},"D":{"text":"Sosyal güvenlik sistemi"}}',
'C',
'BES, hayat sigortasından ayrı olarak 4632 sayılı Bireysel Emeklilik Tasarruf ve Yatırım Sistemi Kanunu ile düzenlenen bağımsız bir emeklilik sistemidir.'),

('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'Kasko sigortası hangi sigorta branşına girer?',
'{"A":{"text":"Hayat sigortaları"},"B":{"text":"Sorumluluk sigortaları"},"C":{"text":"Kara araçları sigortası (hayat dışı)"},"D":{"text":"Nakliyat sigortaları"}}',
'C',
'Kasko, kara araçlarının kendisine gelen hasarları kapsayan hayat dışı sigorta branşıdır. Zorunlu trafik sigortası ise sorumluluk branşında yer alır.'),

('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'Aşağıdaki ifadelerden hangisi prim kavramını doğru tanımlar?',
'{"A":{"text":"Sigorta şirketinin hasar sonrasında ödediği tutardır"},"B":{"text":"Sigorta ettiren tarafından ödenen ve sigorta güvencesinin karşılığını oluşturan bedeldir"},"C":{"text":"Sigorta şirketinin yıllık kâr payıdır"},"D":{"text":"Poliçe sahibine ödenen faiz geliridir"}}',
'B',
'Prim; sigorta şirketinin teminat sağlaması karşılığında sigorta ettirenden tahsil ettiği bedeldir. Sigorta sözleşmesinin temel mali unsurudur.'),

('SEGEM_TPYS','mevzuat','Sigorta Ürünleri ve Branşları','easy',
'Sigorta bedeli ile sigorta değeri arasındaki ilişki bakımından hangisi doğrudur?',
'{"A":{"text":"Sigorta bedeli her zaman sigorta değerinden büyüktür"},"B":{"text":"Sigorta bedeli, tazminatta esas alınan azami tutardır; sigorta değeri ise sigorta konusunun gerçek değeridir"},"C":{"text":"Sigorta bedeli ve sigorta değeri eşdeğer kavramlardır"},"D":{"text":"Sigorta değeri, prim hesabında kullanılmaz"}}',
'B',
'Sigorta bedeli poliçede yazılı azami tazminat tutarıdır. Sigorta değeri ise hasar anındaki gerçek piyasa değeridir. Eksik sigorta durumunda ödeme orantılı olarak azalır.'),

-- ── Trafik ve Kasko Sigortaları ───────────────────────────────
('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'Zorunlu trafik sigortası hangi zararları karşılamaktadır?',
'{"A":{"text":"Yalnızca araç sahibinin kendi aracındaki hasarları"},"B":{"text":"Üçüncü şahıslara verilen bedensel ve maddi zararları"},"C":{"text":"Trafik cezalarını ve araç tamir masraflarını"},"D":{"text":"Yalnızca ölüm ve yaralanma tazminatlarını"}}',
'B',
'Zorunlu Mali Sorumluluk (trafik) sigortası; motorlu taşıt kazalarında üçüncü şahıslara verilen bedensel zararlar (ölüm, yaralanma) ile maddi zararları karşılar. Araç sahibinin kendi aracını değil, karşı tarafı kapsar.'),

('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'Kasko sigortası için aşağıdakilerden hangisi doğrudur?',
'{"A":{"text":"Tüm motorlu taşıtlar için zorunludur"},"B":{"text":"Yalnızca üçüncü şahıslara verilen hasarları karşılar"},"C":{"text":"İhtiyari bir sigortadır ve sigortalının kendi aracını kapsar"},"D":{"text":"Yalnızca hırsızlık riskini güvence altına alır"}}',
'C',
'Kasko ihtiyari bir sigortadır (zorunlu değildir). Sigortalının kendi aracında meydana gelen hasarları (çarpışma, yangın, hırsızlık, doğal afet vb.) güvence altına alır.'),

('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'Araçta tam hasar (totalling) durumu genel uygulamaya göre ne zaman oluşur?',
'{"A":{"text":"Aracın 1 veya daha fazla parçası hasar gördüğünde"},"B":{"text":"Hasar bedelinin aracın piyasa değerinin %70''ini aşması durumunda"},"C":{"text":"Hasar bedelinin piyasa değerin %30''unu aşması durumunda"},"D":{"text":"Yalnızca araç tamamen yanmışsa"}}',
'B',
'Türkiye''de genel uygulama: Hasar bedeli aracın o andaki piyasa değerinin %70''ini geçerse araç tam hasar sayılır ve piyasa değeri üzerinden tazminat ödenir.'),

('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'Trafik sigortasında "regres (rücu) hakkı" ne anlama gelir?',
'{"A":{"text":"Sigorta şirketinin primleri geri talep etme hakkı"},"B":{"text":"Tazminatı ödeyen sigorta şirketinin, zarara neden olan tarafa karşı hukuki başvuru hakkı"},"C":{"text":"Sigortalının hasarını yeniden değerlettirme hakkı"},"D":{"text":"Sigorta şirketinin poliçeyi iptal etme hakkı"}}',
'B',
'Regres (rücu/halefiyet): Sigorta şirketi tazminatı ödedikten sonra, kazaya kusurlu olarak neden olan üçüncü kişiye karşı sigortalının sahip olduğu hakları devralır ve bu kişiden ödediği tutarı geri talep edebilir.'),

('SEGEM_TPYS','mevzuat','Trafik ve Kasko Sigortaları','easy',
'Zorunlu trafik sigortası olmadan araç kullanan kişi hangi yaptırımla karşılaşır?',
'{"A":{"text":"Yalnızca para cezasıyla"},"B":{"text":"Yalnızca araç müsaderesiyle"},"C":{"text":"Para cezası ve aracın trafikten men edilmesiyle"},"D":{"text":"Yalnızca ehliyetin geçici olarak geri alınmasıyla"}}',
'C',
'Zorunlu trafik sigortası olmadan araç kullanan kişilere hem idari para cezası hem de araçlarının trafikten men edilmesi yaptırımları uygulanır.'),

-- ── Konut ve Yangın Sigortaları ───────────────────────────────
('SEGEM_TPYS','mevzuat','Konut ve Yangın Sigortaları','easy',
'DASK (Doğal Afet Sigortaları Kurumu) tarafından sunulan zorunlu deprem sigortası hangi hasarları karşılar?',
'{"A":{"text":"Yalnızca depreme bağlı yapısal bina hasarlarını"},"B":{"text":"Bina hasarları, mobilya ve eşya hasarları dahil tüm kayıpları"},"C":{"text":"Yalnızca deprem sonrası yangından kaynaklanan hasarları"},"D":{"text":"Deprem, sel, fırtına ve dolu gibi tüm doğal afet hasarlarını"}}',
'A',
'DASK, binanın yapısal unsurlarında (duvarlar, taşıyıcı sistem, çatı vb.) deprem sonucu oluşan hasarları karşılar. İçerik (mobilya, eşya) DASK kapsamına girmez; bu tür hasarlar ihtiyari konut sigortası ile güvence altına alınabilir.'),

('SEGEM_TPYS','mevzuat','Konut ve Yangın Sigortaları','easy',
'DASK sigortası ile ilgili aşağıdaki ifadelerden hangisi doğrudur?',
'{"A":{"text":"Tüm taşınmazlar için ihtiyaridir"},"B":{"text":"Yalnızca sahil kesimindeki konutlar için zorunludur"},"C":{"text":"Tapuya kayıtlı konutlar için zorunludur; sigortasız konutların tapusu devredilemez"},"D":{"text":"Yalnızca deprem riski yüksek bölgelerdeki konutlar için zorunludur"}}',
'C',
'DASK, tapuya kayıtlı tüm konutlar için zorunludur. DASK poliçesi olmayan konutların tapu devir işlemi gerçekleştirilemez.'),

('SEGEM_TPYS','mevzuat','Konut ve Yangın Sigortaları','easy',
'Yangın sigortasında standart (temel) teminat kapsamı aşağıdakilerden hangisidir?',
'{"A":{"text":"Yalnızca yangın"},"B":{"text":"Yangın, yıldırım ve patlama"},"C":{"text":"Yangın, deprem, sel ve hırsızlık"},"D":{"text":"Yangın, terör ve savaş"}}',
'B',
'Yangın sigortasında temel (standart) teminat paketi; yangın, yıldırım ve patlama risklerini kapsar. Deprem, sel, fırtına, hırsızlık gibi ek riskler ek teminat klozlarıyla poliçeye eklenir.'),

('SEGEM_TPYS','mevzuat','Konut ve Yangın Sigortaları','easy',
'İhtiyari konut sigortası ile DASK arasındaki temel fark nedir?',
'{"A":{"text":"DASK daha kapsamlı teminat sunar"},"B":{"text":"DASK zorunludur ve yalnızca yapısal bina hasarını karşılar; konut sigortası ihtiyari olup içerik ve ek riskleri de kapsar"},"C":{"text":"Konut sigortası devlet güvencesindedir; DASK özel sektör ürünüdür"},"D":{"text":"İkisi arasında teminat açısından fark yoktur"}}',
'B',
'DASK zorunlu olup sadece depreme bağlı yapısal bina hasarını güvence altına alır. İhtiyari konut sigortası ise yangın, hırsızlık, su baskını gibi riskleri ve içerik hasarını da kapsayabilir.'),

-- ── Sağlık Sigortası Temel Bilgileri ─────────────────────────
('SEGEM_TPYS','mevzuat','Sağlık Sigortası Temel Bilgileri','easy',
'"Bekleme süresi" kavramı sağlık sigortasında ne anlama gelir?',
'{"A":{"text":"Hasar başvurusunun sonuçlanması için beklenmesi gereken süre"},"B":{"text":"Poliçe başlangıcından itibaren belirli teminatların devreye girmesi için geçmesi gereken süre"},"C":{"text":"Anlaşmalı hastanede randevu için bekleme süresi"},"D":{"text":"Prim ödemesinin gecikme süresi"}}',
'B',
'Bekleme süresi; poliçe başlangıcından itibaren belirli teminatların (örn. doğum, kronik hastalık) kullanılabilmesi için geçmesi gereken minimum süredir. Bu süre dolmadan ilgili teminatlardan yararlanılamaz.'),

('SEGEM_TPYS','mevzuat','Sağlık Sigortası Temel Bilgileri','easy',
'"Tamamlayıcı sağlık sigortası" ne amaçla kullanılır?',
'{"A":{"text":"SGK tarafından karşılanmayan fark ücretlerini ve ilave hizmet bedellerini karşılamak için"},"B":{"text":"SGK sistemine alternatif olarak sunulan bağımsız bir güvence için"},"C":{"text":"Yalnızca diş tedavi masraflarını karşılamak için"},"D":{"text":"Emekli bireylerin ek sağlık giderlerini karşılamak için"}}',
'A',
'Tamamlayıcı sağlık sigortası; SGK kapsamında kalan ancak hastanelerin talep ettiği ilave ücretler (fark ücreti) ile SGK tarafından karşılanmayan hizmetleri güvence altına alır.'),

('SEGEM_TPYS','mevzuat','Sağlık Sigortası Temel Bilgileri','easy',
'Özel sağlık sigortasında "katılım payı" kavramı ne anlama gelir?',
'{"A":{"text":"Sigorta şirketinin prim gelirinden ayırdığı kar payı"},"B":{"text":"Sigortalının her hizmet kullanımında kendi cebinden ödediği sabit tutar veya oran"},"C":{"text":"SGK ve özel sigorta şirketleri arasında paylaşılan tutar"},"D":{"text":"Sigortalıya iade edilen hasarsızlık indirimi"}}',
'B',
'Katılım payı, sigortalının tıbbi hizmet aldığı her seferinde kendisinin ödemesi gereken sabit tutar veya masrafın belirli yüzdesine karşılık gelir. Bu uygulama gereksiz hizmet kullanımını azaltmayı amaçlar.'),

-- ── Hayat Sigortası Temel Bilgileri ──────────────────────────
('SEGEM_TPYS','mevzuat','Hayat Sigortası Temel Bilgileri','easy',
'Hayat sigortasında "lehtar" kimdir?',
'{"A":{"text":"Sigortayı satan acente"},"B":{"text":"Poliçeyi satın alan kişi"},"C":{"text":"Sigorta tazminatını almaya hak kazanan kişi"},"D":{"text":"Sigorta şirketinin yöneticisi"}}',
'C',
'Lehtar; sigortalının vefatı veya poliçede belirtilen riskin gerçekleşmesi halinde sigorta tazminatını almaya hak kazanan kişidir. Poliçe sahibi tarafından belirlenir ve sonradan değiştirilebilir.'),

('SEGEM_TPYS','mevzuat','Hayat Sigortası Temel Bilgileri','easy',
'Süreli hayat sigortası (term life) ile birikimli hayat sigortası (endowment) arasındaki temel fark nedir?',
'{"A":{"text":"Süreli sigorta birikim içerirken; birikimli sigorta içermez"},"B":{"text":"Birikimli sigorta hem ölüm teminatı hem birikim içerirken; süreli sigortada birikim yoktur"},"C":{"text":"Süreli sigorta daha pahalıdır"},"D":{"text":"İkisi arasında işlevsel fark yoktur"}}',
'B',
'Süreli (term) hayat sigortasında yalnızca belirlenen süre içinde ölüm halinde tazminat ödenir; birikim bileşeni yoktur. Birikimli sigortada ise hem ölüm teminatı hem de süre sonunda geri alınacak birikim bulunur.'),

('SEGEM_TPYS','mevzuat','Hayat Sigortası Temel Bilgileri','easy',
'Hayat sigortası poliçelerinde intiharın teminat kapsamındaki genel kuralı nedir?',
'{"A":{"text":"İntihar hiçbir zaman teminat kapsamına girmez"},"B":{"text":"İntihar her koşulda teminat kapsamındadır"},"C":{"text":"Poliçe başlangıcından itibaren genellikle 2 yıl içindeki intihar teminat dışıdır"},"D":{"text":"İntihar yalnızca 5 yıl sonra teminat kapsamına girer"}}',
'C',
'Türk Ticaret Kanunu hükümleri uyarınca, poliçenin başlangıç tarihinden itibaren ilk 2 yıl içinde gerçekleşen intihar ölümleri genel olarak teminat dışında tutulur. 2 yıl dolduktan sonra gerçekleşen intihar halinde tazminat ödenir.'),

-- ── Sigorta Sözleşmesi ve Tazminat Süreci ────────────────────
('SEGEM_TPYS','mevzuat','Sigorta Sözleşmesi ve Tazminat Süreci','easy',
'"Azami iyi niyet (utmost good faith)" ilkesi sigorta sözleşmesinde ne anlama gelir?',
'{"A":{"text":"Sigorta şirketinin her durumda tazminat ödemesi gerektiği"},"B":{"text":"Hem sigortacı hem sigortalının birbirine karşı tam ve doğru bilgi vermek zorunda olduğu"},"C":{"text":"Sigortalının primini zamanında ödemesi gerektiği"},"D":{"text":"Sigortacının prim iade hakkı"}}',
'B',
'Sigortacılığın temel ilkelerinden biri olan "azami iyi niyet" (uberrima fides), her iki tarafın da sözleşme kurulurken ve devamında birbirine karşı tam, doğru ve eksiksiz bilgi vermesini zorunlu kılar. Bu ilkenin ihlali sözleşmeyi geçersiz kılabilir.'),

('SEGEM_TPYS','mevzuat','Sigorta Sözleşmesi ve Tazminat Süreci','easy',
'Sigorta hukukunda "halefiyet (subrogation)" hakkı nedir?',
'{"A":{"text":"Sigortalının hasarını başka bir sigortacıya devretme hakkı"},"B":{"text":"Tazminatı ödeyen sigorta şirketinin, zarara neden olan üçüncü kişiye karşı sigortalı adına dava açma ve tazminat talep etme hakkı"},"C":{"text":"Sigortalının prim ödemesini erteleme hakkı"},"D":{"text":"Sigortacının poliçeyi başkasına devretme hakkı"}}',
'B',
'Halefiyet (subrogation/rücu): Sigorta şirketi, tazminat ödedikten sonra sigortalının yerine geçerek zarara neden olan üçüncü kişiye karşı dava ve talep haklarını kullanabilir. Bu sayede aynı zarara karşı çifte tazminat alınması engellenir.'),

('SEGEM_TPYS','mevzuat','Sigorta Sözleşmesi ve Tazminat Süreci','easy',
'Hasar bildiriminin geç yapılması durumunda sigortalı hangi riskle karşılaşabilir?',
'{"A":{"text":"Hasar miktarı otomatik olarak artar"},"B":{"text":"Sigorta şirketi tazminatı tamamen veya kısmen reddetme hakkı kazanabilir"},"C":{"text":"Prim iadesi alır"},"D":{"text":"Herhangi bir yaptırımla karşılaşmaz"}}',
'B',
'Poliçelerde genellikle hasarın belirli bir süre (5–30 gün) içinde sigorta şirketine bildirilmesi zorunludur. Bildirimin gecikmesi; delillerin yok olması ve sigorta şirketinin zarara uğraması halinde tazminatın azaltılmasına veya reddedilmesine neden olabilir.'),

-- ── BES Temelleri ─────────────────────────────────────────────
('SEGEM_TPYS','mevzuat','Bireysel Emeklilik Sistemi (BES) Temelleri','easy',
'BES''te devlet katkısı oranı ne kadardır?',
'{"A":{"text":"Katkı payının %10''u"},"B":{"text":"Katkı payının %20''si"},"C":{"text":"Katkı payının %25''i"},"D":{"text":"Katkı payının %30''u"}}',
'D',
'Devlet, BES katılımcısının ödediği katkı payının %30''unu devlet katkısı olarak katılımcının hesabına yatırır (belirlenen üst limite kadar). Bu oran BES''i cazip kılan temel teşvik unsurudur.'),

('SEGEM_TPYS','mevzuat','Bireysel Emeklilik Sistemi (BES) Temelleri','easy',
'BES''te emekliliğe hak kazanmak için minimum şartlar nelerdir?',
'{"A":{"text":"En az 5 yıl sistemde kalmak ve 50 yaşını doldurmak"},"B":{"text":"En az 10 yıl sistemde kalmak ve 56 yaşını doldurmak"},"C":{"text":"En az 15 yıl sistemde kalmak ve 60 yaşını doldurmak"},"D":{"text":"En az 10 yıl sistemde kalmak ve 65 yaşını doldurmak"}}',
'B',
'BES''te emeklilik hakkı; sistemde en az 10 yıl kalmak VE en az 56 yaşını doldurmak koşullarının birlikte sağlanmasıyla kazanılır.'),

('SEGEM_TPYS','mevzuat','Bireysel Emeklilik Sistemi (BES) Temelleri','easy',
'BES''in denetim ve gözetimini hangi kurum yapar?',
'{"A":{"text":"TOBB"},"B":{"text":"Hazine ve Maliye Bakanlığı (SEDDK)"},"C":{"text":"Emeklilik Gözetim Merkezi (EGM)"},"D":{"text":"Merkez Bankası"}}',
'C',
'BES''e katılımcıların fon bilgileri ve hareketleri Emeklilik Gözetim Merkezi (EGM) tarafından anlık olarak takip edilir. Düzenleme ve denetim yetkisi ise Hazine ve Maliye Bakanlığı''na bağlı SEDDK''dadır.'),

('SEGEM_TPYS','mevzuat','Bireysel Emeklilik Sistemi (BES) Temelleri','easy',
'Otomatik Katılım Sistemi (OKS) nedir?',
'{"A":{"text":"Tüm Türk vatandaşlarının otomatik olarak SGK''ya dahil edilmesi"},"B":{"text":"İşverenlerin belirli sayıda çalışanını otomatik olarak BES''e dahil etmesi zorunluluğu"},"C":{"text":"Sigorta şirketlerinin tüm çalışanlarına otomatik hayat sigortası sağlaması"},"D":{"text":"Emeklilik fonlarının otomatik olarak devlet tahvillerine yatırılması"}}',
'B',
'OKS (Otomatik Katılım Sistemi): Belirli büyüklükteki işverenlerin, çalışanlarını otomatik olarak BES''e dahil etmesi zorunludur. Çalışanlar sisteme alındıktan sonra 2 ay içinde cayma hakkını kullanabilir.'),

-- ── Sigorta Etik ve Müşteri İlişkileri ───────────────────────
('SEGEM_TPYS','mevzuat','Sigorta Etik ve Müşteri İlişkileri','easy',
'Sigorta acentesinin müşteriye yanlış veya yanıltıcı bilgi vermesi (mis-selling) hangi sonuçlara yol açabilir?',
'{"A":{"text":"Yalnızca yazılı uyarı alır"},"B":{"text":"Hem hukuki (tazminat) hem idari (lisans iptali vb.) yaptırımlarla karşılaşabilir"},"C":{"text":"Hiçbir yaptırım uygulanmaz, bu müşterinin sorumluluğundadır"},"D":{"text":"Yalnızca prim iadesi yapmakla yükümlü olur"}}',
'B',
'Mis-selling (yanlış satış); müşteriye uygun olmayan ürün satmak veya yanıltıcı bilgi vermektir. Bu durum hem hukuki tazminat sorumluluğuna hem de SEDDK tarafından lisans iptali gibi idari yaptırımlara yol açabilir.'),

('SEGEM_TPYS','mevzuat','Sigorta Etik ve Müşteri İlişkileri','easy',
'KVKK kapsamında "özel nitelikli kişisel veri" olarak değerlendirilen bilgi türü hangisidir?',
'{"A":{"text":"Müşterinin adı ve soyadı"},"B":{"text":"Müşterinin iletişim adresi"},"C":{"text":"Sağlık verileri ve biyometrik veriler"},"D":{"text":"Araç plakası"}}',
'C',
'KVKK''ya göre sağlık verileri, biyometrik veriler, ırk, din, siyasi görüş gibi bilgiler "özel nitelikli kişisel veri" sayılır ve işlenmesi açık rıza ile daha güçlü güvenceler gerektirir. Sigortacılıkta sağlık verileri bu kapsamda değerlendirilir.'),

('SEGEM_TPYS','mevzuat','Sigorta Etik ve Müşteri İlişkileri','easy',
'Sigorta Tahkim Komisyonu''nun temel işlevi nedir?',
'{"A":{"text":"Sigorta şirketlerini lisanslandırmak"},"B":{"text":"Sigorta primlerini belirlemek"},"C":{"text":"Sigortalı ile sigorta şirketi arasındaki uyuşmazlıklara mahkeme dışı hızlı çözüm sunmak"},"D":{"text":"Acenteleri denetlemek ve yaptırım uygulamak"}}',
'C',
'Sigorta Tahkim Komisyonu; sigortalılar ile sigorta şirketleri arasındaki tazminat uyuşmazlıklarını mahkeme sürecine gerek kalmadan, hızlı ve düşük maliyetle çözüme kavuşturmak amacıyla kurulmuştur.');

COMMIT;
