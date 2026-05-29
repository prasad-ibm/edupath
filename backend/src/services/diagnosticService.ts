import { query, queryOne } from '../db/pool';

export interface DiagnosticAnswer {
  questionId: string;
  difficulty: number;
  correct: boolean;
}

export interface DiagnosticResult {
  placementIndex: number;
  score: number;
}

export function computePlacement(answers: DiagnosticAnswer[]): DiagnosticResult {
  if (answers.length === 0) return { placementIndex: 0, score: 0 };

  const byDifficulty: Record<number, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!byDifficulty[a.difficulty]) byDifficulty[a.difficulty] = { correct: 0, total: 0 };
    byDifficulty[a.difficulty].total++;
    if (a.correct) byDifficulty[a.difficulty].correct++;
  }

  let masteredDifficulty = 0;
  for (const [diff, stats] of Object.entries(byDifficulty)) {
    if (stats.correct / stats.total >= 0.7 && parseInt(diff) > masteredDifficulty) {
      masteredDifficulty = parseInt(diff);
    }
  }

  const placementMap: Record<number, number> = { 0: 0, 1: 0, 2: 3, 3: 6 };
  const placementIndex = placementMap[masteredDifficulty] ?? 0;
  const totalCorrect = answers.filter((a) => a.correct).length;
  const score = Math.round((totalCorrect / answers.length) * 100);

  return { placementIndex, score };
}

export async function saveDiagnosticResult(
  userId: string,
  grade: number,
  subject: string,
  placementIndex: number
): Promise<void> {
  await query(
    `INSERT INTO diagnostic_results (user_id, grade, subject, placement_index, completed_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id, grade, subject) DO UPDATE SET
       placement_index = EXCLUDED.placement_index,
       completed_at    = NOW()`,
    [userId, grade, subject, placementIndex]
  );
}

export async function getDiagnosticResult(
  userId: string,
  grade: number,
  subject: string
): Promise<{ placementIndex: number } | null> {
  const row = await queryOne<{ placement_index: number }>(
    `SELECT placement_index FROM diagnostic_results
     WHERE user_id = $1 AND grade = $2 AND subject = $3`,
    [userId, grade, subject]
  );
  if (!row) return null;
  return { placementIndex: row.placement_index };
}
