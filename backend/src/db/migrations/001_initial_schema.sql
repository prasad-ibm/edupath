-- =====================================================
-- EduPath — Initial Schema
-- Run once against your Railway PostgreSQL database.
-- Railway Dashboard → your Postgres plugin → Query tab → paste and run.
-- =====================================================

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classlink_id   TEXT UNIQUE NOT NULL,
  display_name   TEXT NOT NULL,
  grade          SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 8),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Diagnostic Results ───────────────────────────────────────────────────────
-- One record per student per (grade, subject).
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade             SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 8),
  subject           TEXT NOT NULL CHECK (subject IN ('chemistry','physics','history','social_studies')),
  placement_index   SMALLINT NOT NULL DEFAULT 0,
  completed_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, grade, subject)
);

-- ─── Lesson Progress ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade         SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 8),
  subject       TEXT NOT NULL CHECK (subject IN ('chemistry','physics','history','social_studies')),
  lesson_id     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started','in_progress','passed','failed')),
  attempts      SMALLINT DEFAULT 0,
  last_score    NUMERIC(5,2),
  completed_at  TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, grade, subject, lesson_id)
);

-- ─── Session State ───────────────────────────────────────────────────────────
-- Saves exactly where a student left off.
CREATE TABLE IF NOT EXISTS session_state (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade       SMALLINT NOT NULL,
  subject     TEXT NOT NULL,
  lesson_id   TEXT NOT NULL,
  step        TEXT NOT NULL CHECK (step IN ('content','experiment','practice','reading','comprehension','assessment')),
  step_data   JSONB DEFAULT '{}',
  saved_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, grade, subject)
);

-- ─── Assessment Results ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id       TEXT NOT NULL,
  grade           SMALLINT NOT NULL,
  subject         TEXT NOT NULL,
  attempt_number  SMALLINT NOT NULL DEFAULT 1,
  answers         JSONB NOT NULL,
  score           NUMERIC(5,2) NOT NULL,
  passed          BOOLEAN NOT NULL,
  taken_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user    ON lesson_progress(user_id, grade, subject);
CREATE INDEX IF NOT EXISTS idx_session_state_user      ON session_state(user_id, grade, subject);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_user         ON diagnostic_results(user_id, grade, subject);
