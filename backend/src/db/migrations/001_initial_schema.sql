-- =====================================================
-- ClassLink Educational App — Initial Schema
-- Run this in your Supabase SQL editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS
-- Populated from ClassLink OAuth + OneRoster
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classlink_id   TEXT UNIQUE NOT NULL,
  display_name   TEXT NOT NULL,
  grade          SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 8),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DIAGNOSTIC RESULTS
-- One record per user per (grade, subject) combo
-- =====================================================
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade             SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 8),
  subject           TEXT NOT NULL CHECK (subject IN ('chemistry','physics','history','social_studies')),
  placement_index   SMALLINT NOT NULL DEFAULT 0,
  completed_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, grade, subject)
);

-- =====================================================
-- LESSON PROGRESS
-- Tracks per-lesson status for each student
-- =====================================================
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

-- =====================================================
-- SESSION STATE
-- Save/resume — one active session per (user, grade, subject)
-- =====================================================
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

-- =====================================================
-- ASSESSMENT RESULTS
-- Every attempt at a final assessment is recorded
-- =====================================================
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

-- =====================================================
-- ROW LEVEL SECURITY
-- All tables locked down to owner only
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Backend uses service role key — these policies apply to anon/authenticated roles
-- For service role, RLS is bypassed by default. These policies protect direct client access.
CREATE POLICY "Users see own record" ON users
  FOR ALL USING (id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Own diagnostic results" ON diagnostic_results
  FOR ALL USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Own lesson progress" ON lesson_progress
  FOR ALL USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Own session state" ON session_state
  FOR ALL USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY "Own assessment results" ON assessment_results
  FOR ALL USING (user_id::text = current_setting('app.current_user_id', true));

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id, grade, subject);
CREATE INDEX IF NOT EXISTS idx_session_state_user ON session_state(user_id, grade, subject);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id, lesson_id);
