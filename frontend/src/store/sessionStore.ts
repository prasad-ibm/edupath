import { create } from 'zustand';
import { LessonStep } from '../types/progress';

interface ActiveSession {
  grade: number;
  subject: string;
  lessonId: string;
  step: LessonStep;
  stepData: Record<string, unknown>;
  lastSaved: string | null;
  isDirty: boolean; // unsaved changes exist
}

interface SessionStoreState {
  session: ActiveSession | null;
  isSaving: boolean;

  startSession: (grade: number, subject: string, lessonId: string, step?: LessonStep) => void;
  updateStep: (step: LessonStep, stepData?: Record<string, unknown>) => void;
  updateStepData: (data: Record<string, unknown>) => void;
  markSaved: (savedAt: string) => void;
  setSaving: (saving: boolean) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  session: null,
  isSaving: false,

  startSession: (grade, subject, lessonId, step = 'content') =>
    set({
      session: {
        grade,
        subject,
        lessonId,
        step,
        stepData: {},
        lastSaved: null,
        isDirty: false,
      },
    }),

  updateStep: (step, stepData = {}) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, step, stepData, isDirty: true }
        : null,
    })),

  updateStepData: (data) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, stepData: { ...state.session.stepData, ...data }, isDirty: true }
        : null,
    })),

  markSaved: (savedAt) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, lastSaved: savedAt, isDirty: false }
        : null,
    })),

  setSaving: (saving) => set({ isSaving: saving }),

  clearSession: () => set({ session: null, isSaving: false }),
}));
