export type LessonStatus = 'not_started' | 'in_progress' | 'passed' | 'failed';
export type LessonStep = 'content' | 'experiment' | 'practice' | 'reading' | 'comprehension' | 'assessment';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  attempts: number;
  lastScore: number | null;
  completedAt: string | null;
}

export interface SessionState {
  lessonId: string;
  step: LessonStep;
  stepData: Record<string, unknown>;
  savedAt: string;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOption: string;
  correct: boolean;
}
