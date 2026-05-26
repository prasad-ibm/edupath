import { supabase } from '../db/supabaseClient';

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
  const { error } = await supabase.from('session_state').upsert(
    {
      user_id: userId,
      grade,
      subject,
      lesson_id: lessonId,
      step,
      step_data: stepData,
      saved_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,grade,subject' }
  );
  if (error) throw error;
}

export async function resumeSession(
  userId: string,
  grade: number,
  subject: string
): Promise<SessionState | null> {
  const { data, error } = await supabase
    .from('session_state')
    .select('lesson_id, step, step_data, saved_at')
    .eq('user_id', userId)
    .eq('grade', grade)
    .eq('subject', subject)
    .single();

  if (error || !data) return null;
  return {
    lessonId: data.lesson_id,
    step: data.step as LessonStep,
    stepData: data.step_data || {},
    savedAt: data.saved_at,
  };
}

export async function clearSession(
  userId: string,
  grade: number,
  subject: string
): Promise<void> {
  await supabase
    .from('session_state')
    .delete()
    .eq('user_id', userId)
    .eq('grade', grade)
    .eq('subject', subject);
}
