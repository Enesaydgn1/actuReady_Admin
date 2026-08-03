# ActuReady — Seed Veritabanı Yükleme Talimatı

## Supabase Studio'da Çalıştırma Sırası

1. **Supabase Studio** → https://supabase.com/dashboard
2. Sol menü → **SQL Editor**
3. Aşağıdaki dosyaları sırayla kopyalayıp çalıştırın:

---

### Adım 1 — SEGEM TPYS (konu + sorular)
Dosya: `seed_segem_tpys.sql`
- 10 konu içeriği (HTML)
- ~35 soru

### Adım 2 — LEVEL_1 Finansal Matematik (konu + sorular)
Dosya: `seed_level1_finmat.sql`
- 18 konu içeriği (HTML)
- ~28 soru

### Adım 3 — LEVEL_1 İstatistik + Matematik (konu + sorular)
Dosya: `seed_level1_istatistik.sql`
- 14 istatistik konusu + 9 matematik konusu (HTML)
- ~30 soru

### Adım 4 — LEVEL_1 Mevzuat + Olasılık (konu + sorular)
Dosya: `seed_level1_mevzuat.sql`
- 9 mevzuat konusu + 3 olasılık konusu (HTML)
- ~16 soru

---

## Toplam İçerik

| Kategori | Konu İçeriği | Soru Sayısı |
|----------|-------------|-------------|
| SEGEM_TPYS | 10 | ~35 |
| LEVEL_1 Finansal Matematik | 18 | ~28 |
| LEVEL_1 İstatistik | 14 | ~22 |
| LEVEL_1 Matematik | 9 | ~10 |
| LEVEL_1 Mevzuat | 9 | ~12 |
| LEVEL_1 Olasılık | 3 | ~4 |
| **TOPLAM** | **63** | **~111** |

---

## Önemli Notlar

- Tüm dosyalar `ON CONFLICT DO UPDATE` kullanır → tekrar çalıştırmak güvenlidir.
- Sorular `is_active = TRUE` varsayılanıyla eklenir.
- LEVEL_2, LEVEL_3, LEVEL_4 için admin panelinin AI özelliği veya ek seed dosyaları gerekir.

## Sonraki Adımlar

1. Admin panelinde eklenen sorular doğrulanmalı (QuestionBankPage).
2. LEVEL_2 ve üzeri için admin panelindeki QuestionBankPage kullanılabilir.
3. Kalan boş topic_content'ler için admin panelindeki TopicContentPage ile içerik eklenebilir.
