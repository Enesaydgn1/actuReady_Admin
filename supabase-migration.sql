-- ============================================================
-- ActuReady Admin Panel — Supabase Migration
-- SQL Editor'da çalıştırın
-- ============================================================

-- 1. user_profiles'a is_admin kolonu
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- İlk admin'i kendiniz olarak atayın:
-- UPDATE user_profiles SET is_admin = TRUE WHERE user_id = 'your-user-uuid-here';

-- ============================================================
-- 2. question_bank — Admin'in oluşturduğu statik soru bankası
-- ============================================================
CREATE TABLE IF NOT EXISTS question_bank (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type       TEXT NOT NULL,          -- LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, SEGEM_TPYS
  subject         TEXT NOT NULL,          -- matematik, istatistik, mevzuat, olasilik, ...
  topic           TEXT NOT NULL,          -- konunun adı
  difficulty      TEXT NOT NULL DEFAULT 'medium',  -- easy | medium | hard
  question_text   TEXT NOT NULL,
  options_json    JSONB NOT NULL DEFAULT '{}',  -- { "A": "...", "B": "...", "C": "...", "D": "..." }
  correct_answer  TEXT NOT NULL,          -- "A", "B", "C" veya "D"
  explanation     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Herkes okuyabilir (frontend), sadece admin yazabilir
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "question_bank_read" ON question_bank FOR SELECT USING (true);
CREATE POLICY "question_bank_admin_write" ON question_bank FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- 3. topic_content — Admin'in yazdığı konu içerikleri
-- ============================================================
CREATE TABLE IF NOT EXISTS topic_content (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type        TEXT NOT NULL,
  subject          TEXT NOT NULL,
  topic            TEXT NOT NULL,
  content_markdown TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (exam_type, subject, topic)
);

ALTER TABLE topic_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topic_content_read" ON topic_content FOR SELECT USING (true);
CREATE POLICY "topic_content_admin_write" ON topic_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================================
-- 4. exam_calendar — Admin'in girdiği sınav takvimi
-- ============================================================
CREATE TABLE IF NOT EXISTS exam_calendar (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type   TEXT NOT NULL,     -- LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, SEGEM_TPYS
  label       TEXT NOT NULL,     -- "Aktüerlik L1 Bahar Sınavı"
  event_date  DATE NOT NULL,
  event_type  TEXT NOT NULL DEFAULT 'exam',  -- exam | registration | result | deadline
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exam_calendar_read" ON exam_calendar FOR SELECT USING (true);
CREATE POLICY "exam_calendar_admin_write" ON exam_calendar FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );
