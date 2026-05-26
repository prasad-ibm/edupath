import { useCallback } from 'react';
import { useProgressStore } from '../store/progressStore';
import api from '../lib/api';
import { LessonStatus } from '../types/progress';

export function useProgress(grade: number, subject: string) {
  const { getProgress, setProgress, updateLesson } = useProgressStore();
  const progress = getProgress(grade, subject);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await api.get(`/progress/${grade}/${subject}`);
      setProgress(grade, subject, res.data.progress);
    } catch (err) {
      console.error('Fetch progress error:', err);
    }
  }, [grade, subject, setProgress]);

  const updateLessonStatus = useCallback(
    async (lessonId: string, status: LessonStatus, score?: number) => {
      // Optimistic update
      const existing = progress.find((p) => p.lessonId === lessonId);
      updateLesson(grade, subject, {
        lessonId,
        status,
        attempts: (existing?.attempts || 0) + (status !== 'in_progress' ? 1 : 0),
        lastScore: score ?? existing?.lastScore ?? null,
        completedAt: status === 'passed' ? new Date().toISOString() : null,
      });

      try {
        await api.post(`/progress/${grade}/${subject}/${lessonId}`, { status, score });
      } catch (err) {
        console.error('Update progress error:', err);
      }
    },
    [grade, subject, progress, updateLesson]
  );

  const getNextLesson = useCallback(
    (lessonSequence: string[]): string | null => {
      for (const lessonId of lessonSequence) {
        const p = progress.find((lp) => lp.lessonId === lessonId);
        if (!p || p.status === 'not_started' || p.status === 'in_progress' || p.status === 'failed') {
          return lessonId;
        }
      }
      return null; // All passed
    },
    [progress]
  );

  return { progress, fetchProgress, updateLessonStatus, getNextLesson };
}
