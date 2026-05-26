import { supabase } from '../db/supabaseClient';

export interface DiagnosticAnswer {
  questionId: string;
  difficulty: number;
  correct: boolean;
}

export interface DiagnosticResult {
  placementIndex: number;
  score: number;
}

/**
 * Server-authoritative placement computation.
 * Returns the lesson index the student should start from.
 */
export function computePlacement(answers: DiagnosticAnswer[]): DiagnosticResult {
  if (answers.length === 0) return { placementIndex: 0, score: 0 };

  // Group by difficulty
  const byDifficulty: Record<number, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!byDifficulty[a.difficulty]) byDifficulty[a.difficulty] = { correct: 0, total: 0 };
    byDifficulty[a.difficulty].total++;
    if (a.correct) byDifficulty[a.difficulty].correct++;
  }

  // Find highest difficulty where student scored >= 70%
  let masteredDifficulty = 0;
  for (const [diff, stats] of Object.entries(byDifficulty)) {
    const rate = stats.correct / stats.total;
    if (rate >= 0.7 && parseInt(diff) > masteredDifficulty) {
      masteredDifficulty = parseInt(diff);
    }
  }

  // Map difficulty to lesson start index
  // difficulty 0 (failed all) → start from 0
  // difficulty 1 → start from 0
  // difficulty 2 → start from 3
  // difficulty 3 → start from 6
  const placementMap: Record<number, number> = { 0: 0, 1: 0, 2: 3, 3: 6 };
  const placementIndex = placementMap[masteredDifficulty] ?? 0;

  const totalCorrect = answers.filter((a) => a.correct).length;
  const score = Math.round((totalCorrect / answers.length) * 100);

  return { placementIndex, score };
}

/**
 * Save diagnostic result to DB (upsert — one per user/grade/subject)
 */
export async function saveDiagnosticResult(
  userId: string,
  grade: number,
  subject: string,
  placementIndex: number
): Promise<void> {
  const { error } = await supabase.from('diagnostic_results').upsert(
    {
      user_id: userId,
      grade,
      subject,
      placement_index: placementIndex,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,grade,subject' }
  );
  if (error) throw error;
}

/**
 * Get existing diagnostic result if already taken
 */
export async function getDiagnosticResult(
  userId: string,
  grade: number,
  subject: string
): Promise<{ placementIndex: number } | null> {
  const { data, error } = await supabase
    .from('diagnostic_results')
    .select('placement_index')
    .eq('user_id', userId)
    .eq('grade', grade)
    .eq('subject', subject)
    .single();

  if (error || !data) return null;
  return { placementIndex: data.placement_index };
}
