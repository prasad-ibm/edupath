import { supabase } from '../db/supabaseClient';

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
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, status, attempts, last_score, completed_at')
    .eq('user_id', userId)
    .eq('grade', grade)
    .eq('subject', subject)
    .order('lesson_id');

  if (error) throw error;
  return (data || []).map((row) => ({
    lessonId: row.lesson_id,
    status: row.status as LessonStatus,
    attempts: row.attempts,
    lastScore: row.last_score,
    completedAt: row.completed_at,
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
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      grade,
      subject,
      lesson_id: lessonId,
      status,
      last_score: score ?? null,
      completed_at: status === 'passed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
      attempts: status === 'in_progress' ? undefined : undefined, // handled by increment below
    },
    { onConflict: 'user_id,grade,subject,lesson_id' }
  );
  if (error) throw error;
}

export async function incrementAttempts(
  userId: string,
  grade: number,
  subject: string,
  lessonId: string
): Promise<void> {
  await supabase.rpc('increment_attempts', {
    p_user_id: userId,
    p_grade: grade,
    p_subject: subject,
    p_lesson_id: lessonId,
  });
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
  const { error } = await supabase.from('assessment_results').insert({
    user_id: userId,
    lesson_id: lessonId,
    grade,
    subject,
    attempt_number: attemptNumber,
    answers,
    score,
    passed,
  });
  if (error) throw error;
}
