#!/usr/bin/env node
// fix_mismatches.mjs

const SUPABASE_URL = 'https://vxnohqhaomaleftnlpyl.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bm9ocWhhb21hbGVmdG5scHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk5MTExNywiZXhwIjoyMDkwNTY3MTE3fQ.H8I4h1Ogu2s3aKc7FX3CTpprZktAUmoxGFSCRqzYAeY';

async function sbPatch(filter, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?${filter}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`PATCH [${res.status}]: ${await res.text()}`);
}

async function sbUpsert(records) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/topic_content?on_conflict=exam_type,subject,topic`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(records)
  });
  if (!res.ok) throw new Error(`UPSERT [${res.status}]: ${await res.text()}`);
}

// ─── 1. PATCH: Soru güncellemeleri ────────────────────────────────────────────

const patches = [
  {
    filter: 'exam_type=eq.LEVEL_1&subject=eq.matematik&topic=eq.Basit%20Faiz',
    body: { subject: 'finansal-matematik', topic: 'Basit Faiz ve Basit İskonto' },
    label: '[1] matematik/Basit Faiz → finansal-matematik/Basit Faiz ve Basit İskonto'
  },
  {
    filter: 'exam_type=eq.LEVEL_1&subject=eq.matematik&topic=eq.Bile%C5%9Fik%20Faiz',
    body: { subject: 'finansal-matematik', topic: 'Bileşik Faiz' },
    label: '[2] matematik/Bileşik Faiz → finansal-matematik/Bileşik Faiz'
  },
  {
    filter: 'exam_type=eq.LEVEL_1&subject=eq.matematik&topic=eq.Amortisman%20ve%20Bor%C3%A7%20%C3%96deme%20Planlar%C4%B1',
    body: { subject: 'finansal-matematik', topic: 'Amortisman ve Borç Ödeme Planları' },
    label: '[3] matematik/Amortisman ve Borç Ödeme Planları → finansal-matematik/Amortisman ve Borç Ödeme Planları'
  },
  {
    filter: 'exam_type=eq.LEVEL_1&subject=eq.mevzuat&topic=eq.Sigorta%C3%A7%C4%B1l%C4%B1k%20Kanunu%20Temel%20%C4%B0lkeleri',
    body: { topic: 'Sigortacılık Kanunu (5684) Temel İlkeleri' },
    label: '[4] mevzuat/Sigortacılık Kanunu Temel İlkeleri → Sigortacılık Kanunu (5684) Temel İlkeleri'
  },
  {
    filter: 'exam_type=eq.LEVEL_1&subject=eq.olasilik&topic=eq.Varyans%20ve%20Standart%20Sapma',
    body: { topic: 'Beklenti, Varyans ve Standart Sapma' },
    label: '[5] olasilik/Varyans ve Standart Sapma → Beklenti, Varyans ve Standart Sapma'
  }
];

// ─── 2. UPSERT: topic_content kayıtları ───────────────────────────────────────

const topicContents = [
  // ── istatistik (8 kayıt) ──────────────────────────────────────────────────
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Olasılık Teorisi',
    difficulty: 'easy',
    content_markdown: `<h2>Olasılık Teorisi Temelleri</h2>
<p>Olasılık; bir deneyin sonuçlarının uzun vadeli göreli frekansını ölçer. Kolmogorov aksiyomlarına dayanır.</p>
<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>Örnek Uzay (S):</strong> Deneyin tüm olası sonuçları</li>
  <li><strong>Olay (A):</strong> S'nin bir alt kümesi</li>
  <li><strong>Tamamlayıcı (Aᶜ):</strong> A dışında kalan sonuçlar</li>
</ul>
<h2>Kolmogorov Aksiyomları</h2>
<ul>
  <li>0 ≤ P(A) ≤ 1</li>
  <li>P(S) = 1</li>
  <li>A ∩ B = ∅ ise P(A ∪ B) = P(A) + P(B)</li>
</ul>
<h2>Önemli Kurallar</h2>
<ul>
  <li><strong>Toplama Kuralı:</strong> P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</li>
  <li><strong>Çarpım Kuralı:</strong> P(A ∩ B) = P(A) · P(B|A)</li>
  <li><strong>Bağımsızlık:</strong> P(A ∩ B) = P(A) · P(B)</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>P(Aᶜ) = 1 − P(A)</li>
  <li>Karşılıklı dışlayan olaylar: P(A ∩ B) = 0</li>
  <li>Bağımsız olaylar: P(B|A) = P(B)</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Kesikli Olasılık Dağılımları',
    difficulty: 'easy',
    content_markdown: `<h2>Kesikli Olasılık Dağılımları</h2>
<p>Sayılabilir değerler alan rastgele değişkenlerin dağılımlarıdır. PMF ve CDF ile tanımlanır.</p>
<h2>Temel Tanımlar</h2>
<ul>
  <li><strong>PMF:</strong> p(x) = P(X = x) ≥ 0, Σp(x) = 1</li>
  <li><strong>CDF:</strong> F(x) = P(X ≤ x) = Σ_{k≤x} p(k)</li>
  <li><strong>Beklenen Değer:</strong> E[X] = Σ x·p(x)</li>
  <li><strong>Varyans:</strong> Var(X) = E[X²] − (E[X])²</li>
</ul>
<h2>Önemli Dağılımlar</h2>
<ul>
  <li><strong>Bernoulli(p):</strong> P(X=1)=p, E[X]=p, Var=p(1-p)</li>
  <li><strong>Binom(n,p):</strong> P(X=k)=C(n,k)pᵏ(1-p)ⁿ⁻ᵏ, E[X]=np, Var=np(1-p)</li>
  <li><strong>Poisson(λ):</strong> P(X=k)=e⁻ᵏλᵏ/k!, E[X]=Var=λ</li>
  <li><strong>Geometrik(p):</strong> P(X=k)=p(1-p)ᵏ⁻¹, E[X]=1/p</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Binom → büyük n küçük p → Poisson yaklaşımı: λ=np</li>
  <li>Geometrik: hafızasız özellik — P(X>m+n|X>m) = P(X>n)</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Sürekli Olasılık Dağılımları',
    difficulty: 'easy',
    content_markdown: `<h2>Sürekli Olasılık Dağılımları</h2>
<p>Sayılamayan değer kümesinde tanımlı rastgele değişkenlerin dağılımlarıdır. PDF ile tanımlanır.</p>
<h2>Temel Tanımlar</h2>
<ul>
  <li><strong>PDF:</strong> f(x) ≥ 0, ∫f(x)dx = 1</li>
  <li><strong>CDF:</strong> F(x) = P(X ≤ x) = ∫_{−∞}^{x} f(t)dt</li>
  <li><strong>Beklenen Değer:</strong> E[X] = ∫ x·f(x)dx</li>
  <li><strong>Varyans:</strong> Var(X) = E[X²] − (E[X])²</li>
</ul>
<h2>Önemli Dağılımlar</h2>
<ul>
  <li><strong>Düzgün U(a,b):</strong> f(x)=1/(b-a), E=( a+b)/2, Var=(b-a)²/12</li>
  <li><strong>Normal N(μ,σ²):</strong> çan eğrisi, E=μ, Var=σ²</li>
  <li><strong>Üstel Exp(λ):</strong> f(x)=λe⁻ˡˣ, E=1/λ, Var=1/λ²</li>
  <li><strong>Gamma(α,β):</strong> E=α/β, Var=α/β²</li>
  <li><strong>Beta(α,β):</strong> [0,1] üzerinde, E=α/(α+β)</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Sürekli X için P(X=a) = 0, her zaman</li>
  <li>Üstel dağılım da hafızasızdır: P(X>s+t|X>s) = P(X>t)</li>
  <li>Normal standartlaştırma: Z = (X−μ)/σ</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Geometrik ve Negatif Binom Dağılımı',
    difficulty: 'easy',
    content_markdown: `<h2>Geometrik Dağılım</h2>
<p>İlk başarı için gereken deneme sayısını modelleyen kesikli dağılımdır.</p>
<h2>Formüller</h2>
<ul>
  <li><strong>PMF:</strong> P(X=k) = p(1−p)^(k−1), k = 1,2,3,...</li>
  <li><strong>E[X]</strong> = 1/p</li>
  <li><strong>Var(X)</strong> = (1−p)/p²</li>
  <li><strong>Hafızasızlık:</strong> P(X &gt; m+n | X &gt; m) = P(X &gt; n)</li>
</ul>
<h2>Negatif Binom Dağılımı</h2>
<p>r-inci başarı için gereken deneme sayısını modelleyen dağılımdır (Geometrik, r=1 özel halidir).</p>
<ul>
  <li><strong>PMF:</strong> P(X=k) = C(k−1, r−1) · p^r · (1−p)^(k−r)</li>
  <li><strong>E[X]</strong> = r/p</li>
  <li><strong>Var(X)</strong> = r(1−p)/p²</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Geometrik: sadece p parametresi var, 1/p = ortalama deneme sayısı</li>
  <li>Negatif Binom = r adet bağımsız Geometrik değişkenin toplamı</li>
  <li>MGF: M(t) = (pe^t / (1−(1−p)e^t))^r</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Lognormal ve Beta Dağılımı',
    difficulty: 'easy',
    content_markdown: `<h2>Lognormal Dağılım</h2>
<p>Eğer Y = ln(X) ~ N(μ, σ²) ise X lognormal dağılımlıdır. Pozitif değer alan sürekli dağılımdır.</p>
<h2>Lognormal Formüller</h2>
<ul>
  <li><strong>E[X]</strong> = e^(μ + σ²/2)</li>
  <li><strong>Var(X)</strong> = e^(2μ+σ²) · (e^(σ²) − 1)</li>
  <li><strong>Medyan:</strong> e^μ</li>
  <li><strong>Mod:</strong> e^(μ−σ²)</li>
</ul>
<h2>Beta Dağılımı</h2>
<p>[0,1] aralığında tanımlıdır. Oran ve olasılık modellemede kullanılır.</p>
<h2>Beta Formüller</h2>
<ul>
  <li><strong>PDF:</strong> f(x) = x^(α−1)(1−x)^(β−1) / B(α,β)</li>
  <li><strong>E[X]</strong> = α/(α+β)</li>
  <li><strong>Var(X)</strong> = αβ / [(α+β)²(α+β+1)]</li>
  <li>Beta(1,1) = Düzgün U(0,1)</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Lognormal sağa çarpık, sigorta hasar tutarı modellemede çok kullanılır</li>
  <li>X ~ Lognormal → ln(X) ~ Normal → z-table kullanılabilir</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Momentler ve Moment Üreten Fonksiyon',
    difficulty: 'easy',
    content_markdown: `<h2>Momentler</h2>
<p>k-inci moment: E[Xᵏ] = Σ xᵏ p(x) (kesikli) veya ∫ xᵏ f(x)dx (sürekli)</p>
<h2>Merkezi Momentler</h2>
<ul>
  <li><strong>1. Moment (Ortalama):</strong> μ = E[X]</li>
  <li><strong>2. Merkezi Moment (Varyans):</strong> σ² = E[(X−μ)²] = E[X²] − μ²</li>
  <li><strong>3. Merkezi Moment:</strong> Çarpıklık (skewness)</li>
  <li><strong>4. Merkezi Moment:</strong> Basıklık (kurtosis)</li>
</ul>
<h2>Moment Üreten Fonksiyon (MGF)</h2>
<div style="background:#1e293b;padding:12px;border-radius:8px;margin:8px 0">
  <code style="color:#7dd3fc">M_X(t) = E[e^(tX)]</code>
</div>
<ul>
  <li>k-inci moment: M_X^(k)(0) = E[Xᵏ] (t=0'da k-inci türev)</li>
  <li>Bağımsız X,Y: M_{X+Y}(t) = M_X(t) · M_Y(t)</li>
</ul>
<h2>Önemli MGF'ler</h2>
<ul>
  <li><strong>Normal N(μ,σ²):</strong> M(t) = exp(μt + σ²t²/2)</li>
  <li><strong>Poisson(λ):</strong> M(t) = exp(λ(e^t−1))</li>
  <li><strong>Üstel(λ):</strong> M(t) = λ/(λ−t), t &lt; λ</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>MGF bir dağılımı benzersiz belirler (varsa)</li>
  <li>Momentler yöntemi: teorik E[Xᵏ] = örneklem momentine eşitle</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Örnekleme Teorisi',
    difficulty: 'easy',
    content_markdown: `<h2>Örnekleme Teorisi</h2>
<p>Ana kütleden (population) alınan örnekler üzerinden evren hakkında çıkarım yapma yöntemidir.</p>
<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>Ana Kütle:</strong> İncelemek istediğimiz tüm birimler</li>
  <li><strong>Örneklem:</strong> Seçilen n gözlem</li>
  <li><strong>İstatistik:</strong> Örneklemden hesaplanan büyüklük (X̄, S²)</li>
  <li><strong>Parametre:</strong> Ana kütle büyüklüğü (μ, σ²)</li>
</ul>
<h2>Örnekleme Dağılımları</h2>
<ul>
  <li><strong>X̄ ~ N(μ, σ²/n)</strong> (ana kütle normal veya n büyük ise)</li>
  <li><strong>Merkezi Limit Teoremi:</strong> n≥30 olduğunda X̄ yaklaşık normaldir</li>
  <li><strong>(n−1)S²/σ² ~ χ²(n−1)</strong> (normal ana kütlede)</li>
  <li><strong>(X̄−μ)/(S/√n) ~ t(n−1)</strong></li>
</ul>
<h2>Örnekleme Yöntemleri</h2>
<ul>
  <li><strong>Basit Rastgele Örnekleme:</strong> Her birimin eşit seçilme şansı</li>
  <li><strong>Tabakalı Örnekleme:</strong> Alt gruplardan orantılı seçim</li>
  <li><strong>Küme Örneklemesi:</strong> Grupların tamamı seçilir</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Standart hata = σ/√n (örneklem ortalamasının standart sapması)</li>
  <li>n arttıkça örneklem ortalaması daha kararlı (daha küçük SE)</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'istatistik',
    topic: 'Varyans Analizi (ANOVA)',
    difficulty: 'easy',
    content_markdown: `<h2>Varyans Analizi (ANOVA)</h2>
<p>Birden fazla grup ortalamasının eşit olup olmadığını test eder. H₀: μ₁ = μ₂ = ... = μₖ</p>
<h2>Tek Yönlü ANOVA</h2>
<ul>
  <li><strong>SS_toplam</strong> = SS_gruplar arası + SS_gruplar içi</li>
  <li><strong>SS_B</strong> = Σ nᵢ(Ȳᵢ − Ȳ)² (gruplar arası)</li>
  <li><strong>SS_W</strong> = ΣΣ (Yᵢⱼ − Ȳᵢ)² (gruplar içi)</li>
</ul>
<div style="background:#1e293b;padding:12px;border-radius:8px;margin:8px 0">
  <code style="color:#7dd3fc">F = MS_B / MS_W = (SS_B/(k−1)) / (SS_W/(N−k))</code>
</div>
<ul>
  <li>k = grup sayısı, N = toplam gözlem</li>
  <li>F ~ F(k−1, N−k) dağılımına göre test edilir</li>
</ul>
<h2>Karar</h2>
<ul>
  <li>F &gt; F_{α,k-1,N-k} ise H₀ reddedilir → en az bir grup farklı</li>
  <li>ANOVA anlamlıysa hangi grupların farklı olduğunu bulmak için post-hoc test (Tukey vb.)</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>ANOVA varsayımları: normallik, varyans homojenliği, bağımsızlık</li>
  <li>MS = SS / df (serbestlik derecesi)</li>
  <li>F istatistiği her zaman pozitiftir</li>
</ul>`
  },

  // ── mevzuat (6 kayıt) ─────────────────────────────────────────────────────
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Sigorta Acenteliği ve Brokerlik Mevzuatı',
    difficulty: 'easy',
    content_markdown: `<h2>Sigorta Acentesi ve Broker: Farklar</h2>
<table style="width:100%;border-collapse:collapse">
  <tr style="background:#1e293b">
    <th style="padding:8px;text-align:left">Özellik</th>
    <th style="padding:8px;text-align:left">Acente</th>
    <th style="padding:8px;text-align:left">Broker</th>
  </tr>
  <tr>
    <td style="padding:8px">Temsil ettiği</td>
    <td style="padding:8px">Sigorta şirketi</td>
    <td style="padding:8px">Sigortalı</td>
  </tr>
  <tr style="background:#1e293b">
    <td style="padding:8px">Yetki belgesi</td>
    <td style="padding:8px">TOBB Levhası</td>
    <td style="padding:8px">Hazine Lisansı</td>
  </tr>
  <tr>
    <td style="padding:8px">Sözleşme yapabilir mi?</td>
    <td style="padding:8px">Evet (şirket adına)</td>
    <td style="padding:8px">Hayır (aracıdır)</td>
  </tr>
</table>
<h2>Yasal Dayanak</h2>
<ul>
  <li><strong>5684 sayılı Sigortacılık Kanunu</strong> — acentelik ve brokerlik tanımları</li>
  <li><strong>Sigorta Acenteleri Yönetmeliği</strong> — levha, eğitim, yükümlülükler</li>
  <li>Denetim: <strong>SEDDK</strong></li>
</ul>
<h2>Brokerlik Gereksinimleri</h2>
<ul>
  <li>En az 4 yıllık lisans mezuniyeti</li>
  <li>Hazine izni ve sigortacılık deneyimi</li>
  <li>Mesleki sorumluluk sigortası zorunlu</li>
  <li>Sürekli mesleki eğitim yükümlülüğü</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Acente = şirketi temsil → Broker = sigortalıyı temsil</li>
  <li>Acente sözleşme yapabilir; broker sadece aracılık eder</li>
  <li>Her ikisi de SEDDK denetimine tabidir</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Sigorta Branşları ve Sınıflandırması',
    difficulty: 'easy',
    content_markdown: `<h2>Sigorta Sınıflandırması</h2>
<p>Türk sigortacılık mevzuatında sigortalar iki ana kategoriye ayrılır:</p>
<h2>Hayat Sigortaları</h2>
<ul>
  <li><strong>Hayat:</strong> Ölüm, yaşama, karma poliçeler</li>
  <li><strong>Sağlık:</strong> Hastalık, kaza sigortaları</li>
  <li><strong>BES:</strong> Bireysel emeklilik sistemi</li>
  <li>Uzun vadeli, birikim bileşeni olabilir</li>
</ul>
<h2>Hayat Dışı (Elementer) Sigortalar</h2>
<ul>
  <li><strong>Yangın:</strong> Konut, işyeri, deprem eklentisi</li>
  <li><strong>Kara Araçları:</strong> Kasko (ihtiyari), TRAFİK (zorunlu)</li>
  <li><strong>Sorumluluk:</strong> Mali sorumluluk, mesleki sorumluluk</li>
  <li><strong>Kaza:</strong> Bireysel kaza, işveren sorumluluk</li>
  <li><strong>Nakliyat:</strong> Deniz, hava, kara taşımacılığı</li>
  <li><strong>Tarım:</strong> Ürün, hayvan, sera</li>
</ul>
<h2>Zorunlu Sigortalar (Örnekler)</h2>
<ul>
  <li>Zorunlu Trafik Sigortası (KTK Md. 91)</li>
  <li>Zorunlu Deprem Sigortası (DASK)</li>
  <li>Zorunlu Mesleki Sorumluluk Sigortaları</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Hayat sigortaları → Hazine izni gerektiren ayrı ruhsat</li>
  <li>Bir şirket hem hayat hem hayat dışı branşta faaliyet gösteremez</li>
  <li>TOBB levhasındaki acenteler belirlenen branşlarla sınırlıdır</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Sigorta Sözleşmesi ve Tarafları',
    difficulty: 'easy',
    content_markdown: `<h2>Sigorta Sözleşmesi</h2>
<p>Sigorta sözleşmesi; sigortacının bir prim karşılığında sigortalıya teminat verdiği sözleşmedir (TTK Md. 1401).</p>
<h2>Taraflar</h2>
<ul>
  <li><strong>Sigortacı:</strong> Riski üstlenen sigorta şirketi</li>
  <li><strong>Sigorta Ettiren:</strong> Sözleşmeyi yapan, prim ödeyen kişi</li>
  <li><strong>Sigortalı:</strong> Teminat altına alınan kişi/varlık</li>
  <li><strong>Lehtar:</strong> Tazminat veya bedeli alacak kişi</li>
</ul>
<h2>Sözleşmenin Unsurları</h2>
<ul>
  <li><strong>Prim:</strong> Sigorta bedeli karşılığında ödenen ücret</li>
  <li><strong>Teminat:</strong> Sigortacının üstlendiği risk/bedel</li>
  <li><strong>Risk:</strong> Gerçekleşme ihtimali olan zarar olayı</li>
  <li><strong>Poliçe:</strong> Sözleşmeyi kanıtlayan belge</li>
</ul>
<h2>Temel İlkeler</h2>
<ul>
  <li><strong>İyiniyet:</strong> Taraflar eksiksiz bilgi vermek zorunda</li>
  <li><strong>Sigortalanabilir Menfaat:</strong> Sigortalının riski üzerinde ekonomik çıkarı olmalı</li>
  <li><strong>Tazminat:</strong> Sigorta zarar sigortalarında zenginleştirme aracı değil</li>
  <li><strong>Halefiyet:</strong> Tazminat ödeyen sigortacı, sigortalının haklarına halef olur</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Sigorta ettiren ≠ sigortalı olabilir (örn. işveren işçisini sigortalatır)</li>
  <li>Poliçe; sözleşmeyi ispat belgesidir, sözleşmenin kendisi değil</li>
  <li>Bildirim yükümlülüğünü ihlal → sigorta tazminatı azalabilir veya düşebilir</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Sigortacılık Kanunu (5684) Temel İlkeleri',
    difficulty: 'easy',
    content_markdown: `<h2>5684 Sayılı Sigortacılık Kanunu</h2>
<p>Türk sigorta sektörünü düzenleyen temel kanundur (2007). Sigortacılık faaliyetlerinin ilkelerini, denetimini ve yaptırımlarını belirler.</p>
<h2>Temel İlkeler</h2>
<ul>
  <li><strong>Ruhsat Zorunluluğu:</strong> Sigorta faaliyeti için Hazine iznine ihtiyaç vardır</li>
  <li><strong>Teknik Yeterlilik:</strong> Şirketler aktüeryal değerleme ve rezerv tutma yükümlülüğü altındadır</li>
  <li><strong>Tüketici Koruması:</strong> Sigortalı hakları güvence altında (itiraz, şikayet mekanizmaları)</li>
  <li><strong>Şeffaflık:</strong> Finansal bilgilerin kamuoyuyla paylaşımı</li>
</ul>
<h2>Denetim Yapısı</h2>
<ul>
  <li><strong>SEDDK</strong> (Sigorta ve Özel Emeklilik Düzenleme ve Denetleme Kurumu) — 2023'te kuruldu</li>
  <li>Önceden Hazine ve Maliye Bakanlığı bünyesinde idi</li>
  <li>Lisanslama, denetleme, yaptırım yetkisi</li>
</ul>
<h2>Güvence Fonu</h2>
<ul>
  <li>İflas eden sigorta şirketlerinin sigortalılarını korumak için kurulur</li>
  <li>Zorunlu sigortalarda (Trafik, DASK) ödeme güvencesi sağlar</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>5684 = Sigortacılık Kanunu, 4632 = Bireysel Emeklilik Kanunu</li>
  <li>Sigorta şikayetleri: önce şirket → sonra Sigorta Tahkim Komisyonu</li>
  <li>Reasürans: riskin başka sigorta şirketlerine devredilmesi</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Para Politikası ve Merkez Bankacılığı',
    difficulty: 'easy',
    content_markdown: `<h2>Para Politikası</h2>
<p>Para politikası; merkez bankasının para arzını ve faiz oranlarını yöneterek ekonomik istikrarı sağlamayı hedefleyen politikalar bütünüdür.</p>
<h2>Para Politikası Araçları</h2>
<ul>
  <li><strong>Politika Faizi:</strong> TCMB'nin bankalara verdiği kısa vadeli borçlanma faizi</li>
  <li><strong>Zorunlu Karşılık Oranı:</strong> Bankaların mevduattan merkez bankasında tutmak zorunda olduğu pay</li>
  <li><strong>Açık Piyasa İşlemleri (APİ):</strong> Tahvil alım/satımı ile piyasadaki para miktarının ayarlanması</li>
</ul>
<h2>Genişleyici ve Daraltıcı Para Politikası</h2>
<ul>
  <li><strong>Genişleyici:</strong> Faiz ↓, zorunlu karşılık ↓, tahvil al → para arzı ↑, ekonomiyi canlandırır</li>
  <li><strong>Daraltıcı:</strong> Faiz ↑, zorunlu karşılık ↑, tahvil sat → para arzı ↓, enflasyonu düşürür</li>
</ul>
<h2>TCMB ve Sigortacılık</h2>
<ul>
  <li>Enflasyon oranı → sigorta primlerini ve rezervlerin gerçek değerini etkiler</li>
  <li>Faiz oranları → sigorta şirketlerinin yatırım gelirlerini belirler</li>
  <li>Döviz kuru → uluslararası reasürans primleri ve hasar ödemelerini etkiler</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>TCMB temel hedefi: fiyat istikrarı (düşük enflasyon)</li>
  <li>Yüksek enflasyon → uzun vadeli sigorta poliçelerinde satın alma gücü kaybı</li>
  <li>Faiz ↑ → tahvil fiyatları ↓ (ters ilişki)</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Maliye Politikası ve Bütçe',
    difficulty: 'easy',
    content_markdown: `<h2>Maliye Politikası</h2>
<p>Devletin vergi, harcama ve borçlanma kararlarıyla ekonomiyi yönetme politikasıdır.</p>
<h2>Maliye Politikası Araçları</h2>
<ul>
  <li><strong>Vergi Politikası:</strong> Vergi oranları ve türleri</li>
  <li><strong>Kamu Harcamaları:</strong> Yatırım, transfer ödemeleri, cari harcamalar</li>
  <li><strong>Bütçe Dengesi:</strong> Gelir − Gider = Bütçe dengesi</li>
</ul>
<h2>Bütçe Türleri</h2>
<ul>
  <li><strong>Denkleşik Bütçe:</strong> Gelir = Gider</li>
  <li><strong>Bütçe Açığı:</strong> Gelir &lt; Gider → borçlanma ile finanse edilir</li>
  <li><strong>Bütçe Fazlası:</strong> Gelir &gt; Gider → borç azaltımı</li>
</ul>
<h2>Genişleyici ve Daraltıcı Maliye Politikası</h2>
<ul>
  <li><strong>Genişleyici:</strong> Harcama ↑ veya Vergi ↓ → toplam talep ↑ (durgunlukta)</li>
  <li><strong>Daraltıcı:</strong> Harcama ↓ veya Vergi ↑ → toplam talep ↓ (enflasyonda)</li>
</ul>
<h2>Sigortacılık ile İlişkisi</h2>
<ul>
  <li>KDV, BSMV: sigorta işlemlerindeki vergisel yükümlülükler</li>
  <li>Vergi teşvikleri: BES katkı paylarında gelir vergisi indirimi</li>
  <li>Kamu açıkları → faiz ↑ → sigorta şirketlerinin yatırım getirileri değişir</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Çarpan etkisi: kamu harcamalarındaki 1 birim artış GDP'yi 1'den fazla artırır</li>
  <li>BES: devlet katkısı maliye politikasının sigortacılığa etkisine örnektir</li>
</ul>`
  },
  {
    exam_type: 'LEVEL_1',
    subject: 'mevzuat',
    topic: 'Dış Ticaret ve Döviz Kurları',
    difficulty: 'easy',
    content_markdown: `<h2>Dış Ticaret</h2>
<p>Ülkeler arasındaki mal ve hizmet alışverişidir. Dış ticaret dengesi, ekonomik politikanın önemli göstergesidir.</p>
<h2>Temel Kavramlar</h2>
<ul>
  <li><strong>İhracat:</strong> Yurt dışına mal/hizmet satışı → döviz girişi</li>
  <li><strong>İthalat:</strong> Yurt dışından mal/hizmet alımı → döviz çıkışı</li>
  <li><strong>Dış Ticaret Dengesi:</strong> İhracat − İthalat</li>
  <li><strong>Cari Denge:</strong> Mal, hizmet, gelir ve transferlerin net dengesi</li>
</ul>
<h2>Döviz Kurları</h2>
<ul>
  <li><strong>Nominal Kur:</strong> İki para birimi arasındaki değişim oranı (TL/USD)</li>
  <li><strong>Reel Kur:</strong> Enflasyon etkisi arındırılmış kur</li>
  <li><strong>TL Değer Kaybı (Devalüasyon):</strong> İhracatı ucuzlatır, ithalatı pahalılaştırır</li>
</ul>
<h2>Sigortacılık ile İlişkisi</h2>
<ul>
  <li>Reasürans primleri genellikle USD veya EUR cinsinden ödenir</li>
  <li>Döviz kuru dalgalanmaları sigorta şirketlerinin döviz pozisyonunu etkiler</li>
  <li>İthal mal hasarları kur farkından etkilenir (örn. araç parçaları)</li>
</ul>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>TL değer kaybı → reasürans maliyetleri TL bazında artar</li>
  <li>Kur riski: sigorta şirketleri döviz varlık-yükümlülük dengesini yönetmeli</li>
  <li>Nakliyat sigortaları dış ticaretle doğrudan ilişkilidir</li>
</ul>`
  },

  // ── olasilik (1 kayıt) ────────────────────────────────────────────────────
  {
    exam_type: 'LEVEL_1',
    subject: 'olasilik',
    topic: 'Koşullu Dağılımlar ve Koşullu Beklentiler',
    difficulty: 'easy',
    content_markdown: `<h2>Koşullu Dağılımlar</h2>
<p>X bilindiğinde Y'nin nasıl dağıldığını gösteren dağılımlar.</p>
<h2>Kesikli Durum</h2>
<ul>
  <li><strong>Koşullu PMF:</strong> p_{Y|X}(y|x) = P(X=x, Y=y) / P(X=x)</li>
  <li><strong>Koşullu Beklenti:</strong> E[Y|X=x] = Σ y · p_{Y|X}(y|x)</li>
</ul>
<h2>Sürekli Durum</h2>
<ul>
  <li><strong>Koşullu PDF:</strong> f_{Y|X}(y|x) = f_{X,Y}(x,y) / f_X(x)</li>
  <li><strong>Koşullu Beklenti:</strong> E[Y|X=x] = ∫ y · f_{Y|X}(y|x) dy</li>
  <li><strong>Koşullu Varyans:</strong> Var(Y|X=x) = E[Y²|X=x] − (E[Y|X=x])²</li>
</ul>
<h2>Toplam Beklenti Yasası</h2>
<div style="background:#1e293b;padding:12px;border-radius:8px;margin:8px 0">
  <code style="color:#7dd3fc">E[Y] = E[E[Y|X]]</code>
</div>
<h2>Toplam Varyans Yasası</h2>
<div style="background:#1e293b;padding:12px;border-radius:8px;margin:8px 0">
  <code style="color:#7dd3fc">Var(Y) = E[Var(Y|X)] + Var(E[Y|X])</code>
</div>
<h2>Sınav İpuçları ⭐</h2>
<ul>
  <li>Bağımsız X,Y ise: f_{Y|X}(y|x) = f_Y(y)</li>
  <li>E[E[Y|X]] = E[Y] (yasa her zaman geçerlidir)</li>
  <li>Karma dağılımlar ve kredibilite teorisinde çok kullanılır</li>
</ul>`
  }
];

// ─── Ana akış ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== fix_mismatches.mjs başlatılıyor ===\n');

  // 1. PATCH işlemleri
  console.log('--- BÖLÜM 1: Soru güncellemeleri (PATCH) ---');
  for (const p of patches) {
    try {
      await sbPatch(p.filter, p.body);
      console.log(`✓ ${p.label}`);
    } catch (err) {
      console.error(`✗ ${p.label}\n  HATA: ${err.message}`);
    }
  }

  // 2. UPSERT işlemi
  console.log('\n--- BÖLÜM 2: topic_content upsert (POST) ---');
  console.log(`Toplam ${topicContents.length} kayıt gönderiliyor...`);
  try {
    await sbUpsert(topicContents);
    console.log(`✓ ${topicContents.length} kayıt başarıyla upsert edildi.`);
    console.log('  Dağılım:');
    const bySubject = topicContents.reduce((acc, r) => {
      acc[r.subject] = (acc[r.subject] || 0) + 1;
      return acc;
    }, {});
    for (const [subj, count] of Object.entries(bySubject)) {
      console.log(`    ${subj}: ${count} kayıt`);
    }
  } catch (err) {
    console.error(`✗ Upsert başarısız!\n  HATA: ${err.message}`);
  }

  console.log('\n=== Tamamlandı ===');
}

main().catch(err => {
  console.error('Beklenmeyen hata:', err);
  process.exit(1);
});
