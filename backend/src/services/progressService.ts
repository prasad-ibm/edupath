import { query, queryOne } from '../db/pool';

export type LessonStatus = 'not_started' | 'in_progress' | 'passed' | 'failed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  attempts: number;
  lastScore: number | null;
  completedAt: string | null;
}

export async function getLearningPath(
  userId: string,
  grade: number,
  subject: string
): Promise<LessonProgress[]> {
  const rows = await query<{
    lesson_id: string;
    status: string;
    attempts: number;
    last_score: string | null;
    completed_at: string | null;
  }>(
    `SELECT lesson_id, status, attempts, last_score, completed_at
     FROM lesson_progress
     WHERE user_id = $1 AND grade = $2 AND subject = $3
     ORDER BY lesson_id`,
    [userId, grade, subject]
  );
  return rows.map((r) => ({
    lessonId: r.lesson_id,
    status: r.status as LessonStatus,
    attempts: r.attempts,
    lastScore: r.last_score !== null ? parseFloat(r.last_score) : null,
    completedAt: r.completed_at,
  }));
}

export async function upsertLessonProgress(
  userId: string,
  grade: number,
  subject: string,
  lessonId: string,
  status: LessonStatus,
  score?: number
): Promise<void> {
  await query(
    `INSERT INTO lesson_progress (user_id, grade, subject, lesson_id, status, last_score, attempts, completed_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 1, $7, NOW())
     ON CONFLICT (user_id, grade, subject, lesson_id) DO UPDATE SET
       status      = EXCLUDED.status,
       last_score  = COALESCE(EXCLUDED.last_score, lesson_progress.last_score),
       attempts    = lesson_progress.attempts + 1,
       completed_at = CASE WHEN EXCLUDED.status = 'passed' THEN NOW() ELSE lesson_progress.completed_at END,
       updated_at  = NOW()`,
    [userId, grade, subject, lessonId, status, score ?? null, status === 'passed' ? new Date().toISOString() : null]
  );
}

export async function saveAssessmentResult(
  userId: string,
  lessonId: string,
  grade: number,
  subject: string,
  answers: { questionId: string; selectedOption: string; correct: boolean }[],
  score: number,
  passed: boolean,
  attemptNumber: number
): Promise<void> {
  await query(
    `INSERT INTO assessment_results (user_id, lesson_id, grade, subject, attempt_number, answers, score, passed)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [userId, lessonId, grade, subject, attemptNumber, JSON.stringify(answers), score, passed]
  );
}
