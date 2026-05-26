export type Subject = 'chemistry' | 'physics' | 'history' | 'social_studies';

export interface Diagram {
  src: string;
  alt: string;
}

export interface LessonContent {
  text: string;
  diagrams: Diagram[];
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: AnswerOption[];
  correctId: string;
  hint?: string; // only for practice questions
}

// ─── Experiment (Chemistry & Physics) ───────────────────
export interface Ingredient {
  id: string;
  label: string;
  icon: string;
}

export interface ExperimentCombination {
  requiredItems: string[];
  animationKey: string;
  resultLabel: string;
}

export interface Experiment {
  instructions: string;
  ingredients: Ingredient[];
  combinations: ExperimentCombination[];
}

// ─── Reading Passage (History & Social Studies) ──────────
export interface ReadingPassage {
  title: string;
  text: string;
}

// ─── Final Assessment ────────────────────────────────────
export interface FinalAssessment {
  passingScore: number; // e.g. 70
  questions: Question[];
}

// ─── Full Lesson ─────────────────────────────────────────
export interface ScienceLesson {
  id: string;
  title: string;
  grade: number;
  subject: 'chemistry' | 'physics';
  content: LessonContent;
  experiment: Experiment;
  practiceQuestions: Question[];
  finalAssessment: FinalAssessment;
}

export interface HumanitiesLesson {
  id: string;
  title: string;
  grade: number;
  subject: 'history' | 'social_studies';
  content: LessonContent;
  readingPassage: ReadingPassage;
  comprehensionQuestions: Question[];
  finalAssessment: FinalAssessment;
}

export type Lesson = ScienceLesson | HumanitiesLesson;

export function isScienceLesson(lesson: Lesson): lesson is ScienceLesson {
  return lesson.subject === 'chemistry' || lesson.subject === 'physics';
}

// ─── Course Metadata ─────────────────────────────────────
export interface CourseMeta {
  grade: number;
  subject: Subject;
  title: string;
  lessonSequence: string[]; // lesson IDs in order
}

// ─── Diagnostic ──────────────────────────────────────────
export interface DiagnosticQuestion {
  id: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: AnswerOption[];
  correctId: string;
}

export interface DiagnosticData {
  grade: number;
  subject: string;
  questions: DiagnosticQuestion[];
}
