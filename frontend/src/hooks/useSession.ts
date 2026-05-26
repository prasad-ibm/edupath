import { useCallback, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import api from '../lib/api';
import { LessonStep } from '../types/progress';

export function useSession() {
  const { session, isSaving, updateStep, updateStepData, markSaved, setSaving, clearSession } =
    useSessionStore();

  const save = useCallback(async () => {
    if (!session) return;
    setSaving(true);
    try {
      const res = await api.post('/session/save', {
        grade: session.grade,
        subject: session.subject,
        lessonId: session.lessonId,
        step: session.step,
        stepData: session.stepData,
      });
      markSaved(res.data.savedAt);
    } catch (err) {
      console.error('Session save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [session, setSaving, markSaved]);

  const advanceStep = useCallback(
    async (newStep: LessonStep, newStepData?: Record<string, unknown>) => {
      updateStep(newStep, newStepData);
      // Auto-save on step transition
      if (session) {
        setSaving(true);
        try {
          const res = await api.post('/session/save', {
            grade: session.grade,
            subject: session.subject,
            lessonId: session.lessonId,
            step: newStep,
            stepData: newStepData || {},
          });
          markSaved(res.data.savedAt);
        } catch (err) {
          console.error('Auto-save on step transition failed:', err);
        } finally {
          setSaving(false);
        }
      }
    },
    [session, updateStep, setSaving, markSaved]
  );

  // Auto-save on tab/window close using sendBeacon
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!session) return;
      const data = JSON.stringify({
        grade: session.grade,
        subject: session.subject,
        lessonId: session.lessonId,
        step: session.step,
        stepData: session.stepData,
      });
      // sendBeacon for reliable tab-close saving
      navigator.sendBeacon('/session/save', new Blob([data], { type: 'application/json' }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  return {
    session,
    isSaving,
    save,
    advanceStep,
    updateStepData,
    clearSession,
  };
}
