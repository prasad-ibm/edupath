import { query, queryOne } from '../db/pool';

export type LessonStep = 'content' | 'experiment' | 'practice' | 'reading' | 'comprehension' | 'assessment';

export interface SessionState {
  lessonId: string;
  step: LessonStep;
  stepData: Record<string, unknown>;
  savedAt: string;
}

export async function saveSession(
  userId: string,
  grade: number,
  subject: string,
  lessonId: string,
  step: LessonStep,
  stepData: Record<string, unknown>
): Promise<void> {
  await query(
    `INSERT INTO session_state (user_id, grade, subject, lesson_id, step, step_data, saved_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id, grade, subject) DO UPDATE SET
       lesson_id = EXCLUDED.lesson_id,
       step      = EXCLUDED.step,
       step_data = EXCLUDED.step_data,
       saved_at  = NOW()`,
    [userId, grade, subject, lessonId, step, JSON.stringify(stepData)]
  );
}

export async function resumeSession(
  userId: string,
  grade: number,
  subject: string
): Promise<SessionState | null> {
  const row = await queryOne<{
    lesson_id: string;
    step: string;
    step_data: Record<string, unknown>;
    saved_at: string;
  }>(
    `SELECT lesson_id, step, step_data, saved_at
     FROM session_state
     WHERE user_id = $1 AND grade = $2 AND subject = $3`,
    [userId, grade, subject]
  );
  if (!row) return null;
  return {
    lessonId: row.lesson_id,
    step: row.step as LessonStep,
    stepData: row.step_data || {},
    savedAt: row.saved_at,
  };
}

export async function clearSession(
  userId: string,
  grade: number,
  subject: string
): Promise<void> {
  await query(
    `DELETE FROM session_state WHERE user_id = $1 AND grade = $2 AND subject = $3`,
    [userId, grade, subject]
  );
}
