import { create } from 'zustand';
import { LessonProgress } from '../types/progress';

interface ProgressState {
  // Map key: `${grade}_${subject}`
  progressMap: Record<string, LessonProgress[]>;
  setProgress: (grade: number, subject: string, progress: LessonProgress[]) => void;
  updateLesson: (grade: number, subject: string, update: LessonProgress) => void;
  getProgress: (grade: number, subject: string) => LessonProgress[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: {},

  setProgress: (grade, subject, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [`${grade}_${subject}`]: progress },
    })),

  updateLesson: (grade, subject, update) =>
    set((state) => {
      const key = `${grade}_${subject}`;
      const existing = state.progressMap[key] || [];
      const idx = existing.findIndex((p) => p.lessonId === update.lessonId);
      const updated =
        idx >= 0
          ? [...existing.slice(0, idx), update, ...existing.slice(idx + 1)]
          : [...existing, update];
      return { progressMap: { ...state.progressMap, [key]: updated } };
    }),

  getProgress: (grade, subject) => get().progressMap[`${grade}_${subject}`] || [],
}));
