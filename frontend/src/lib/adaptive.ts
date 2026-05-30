import { DiagnosticQuestion } from '../types/content';

export interface AdaptiveState {
  currentDifficulty: 1 | 2 | 3;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  answeredIds: string[];           // plain array — reliable in React state
  answers: { questionId: string; difficulty: number; correct: boolean }[];
  questionsAnswered: number;
  stableCount: number;
  lastDifficulty: number;
  isComplete: boolean;
}

export const MAX_QUESTIONS = 12;
export const STABLE_THRESHOLD = 4;

export function createAdaptiveState(): AdaptiveState {
  return {
    currentDifficulty: 1,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    answeredIds: [],
    answers: [],
    questionsAnswered: 0,
    stableCount: 0,
    lastDifficulty: 1,
    isComplete: false,
  };
}

/**
 * Pick the next question to show based on current difficulty.
 * Avoids previously answered questions.
 */
export function pickNextQuestion(
  state: AdaptiveState,
  questions: DiagnosticQuestion[]
): DiagnosticQuestion | null {
  const answered = new Set(state.answeredIds);
  const available = questions.filter(
    (q) => q.difficulty === state.currentDifficulty && !answered.has(q.id)
  );
  if (available.length === 0) {
    // Fall back to any unanswered question regardless of difficulty
    const fallback = questions.filter((q) => !answered.has(q.id));
    return fallback[0] ?? null;
  }
  return available[0];
}

/**
 * Process a student answer and update adaptive state.
 * Returns new state (immutable update).
 */
export function processAnswer(
  state: AdaptiveState,
  questionId: string,
  correct: boolean,
  difficulty: number
): AdaptiveState {
  const newAnswers = [...state.answers, { questionId, difficulty, correct }];
  const newAnsweredIds = [...state.answeredIds, questionId];
  const questionsAnswered = state.questionsAnswered + 1;

  let { consecutiveCorrect, consecutiveWrong, currentDifficulty, stableCount } = state;

  if (correct) {
    consecutiveCorrect++;
    consecutiveWrong = 0;
    if (consecutiveCorrect >= 2) {
      currentDifficulty = Math.min(3, currentDifficulty + 1) as 1 | 2 | 3;
      consecutiveCorrect = 0;
    }
  } else {
    consecutiveWrong++;
    consecutiveCorrect = 0;
    if (consecutiveWrong >= 2) {
      currentDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
      consecutiveWrong = 0;
    }
  }

  // Track stability
  if (currentDifficulty === state.lastDifficulty) {
    stableCount++;
  } else {
    stableCount = 0;
  }

  // Termination condition
  const isComplete =
    questionsAnswered >= MAX_QUESTIONS || stableCount >= STABLE_THRESHOLD;

  return {
    ...state,
    currentDifficulty,
    consecutiveCorrect,
    consecutiveWrong,
    answeredIds: newAnsweredIds,
    answers: newAnswers,
    questionsAnswered,
    stableCount,
    lastDifficulty: currentDifficulty,
    isComplete,
  };
}

/**
 * Compute client-side placement estimate.
 * Server is authoritative — this is just for immediate UI feedback.
 */
export function computeClientPlacement(
  answers: { questionId: string; difficulty: number; correct: boolean }[]
): number {
  const byDiff: Record<number, { correct: number; total: number }> = {};
  for (const a of answers) {
    if (!byDiff[a.difficulty]) byDiff[a.difficulty] = { correct: 0, total: 0 };
    byDiff[a.difficulty].total++;
    if (a.correct) byDiff[a.difficulty].correct++;
  }

  let mastered = 0;
  for (const [diff, stats] of Object.entries(byDiff)) {
    if (stats.correct / stats.total >= 0.7 && parseInt(diff) > mastered) {
      mastered = parseInt(diff);
    }
  }

  const map: Record<number, number> = { 0: 0, 1: 0, 2: 3, 3: 6 };
  return map[mastered] ?? 0;
}
