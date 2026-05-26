import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, isScienceLesson, ScienceLesson as ScienceLessonType, HumanitiesLesson as HumanitiesLessonType } from '../types/content';
import { LessonStep, AssessmentAnswer } from '../types/progress';
import ScienceLessonComponent from '../components/lesson/ScienceLesson';
import HumanitiesLessonComponent from '../components/lesson/HumanitiesLesson';
import { useSessionStore } from '../store/sessionStore';
import { useSession } from '../hooks/useSession';
import { useProgress } from '../hooks/useProgress';
import api from '../lib/api';

export default function LessonPage() {
  const { grade, subject, lessonId } = useParams<{ grade: string; subject: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialStep, setInitialStep] = useState<LessonStep>('content');
  const [initialStepData, setInitialStepData] = useState<Record<string, unknown>>({});

  const gradeNum = parseInt(grade || '1');
  const { startSession } = useSessionStore();
  const { advanceStep } = useSession();
  const { updateLessonStatus } = useProgress(gradeNum, subject || '');

  useEffect(() => {
    async function load() {
      try {
        // Load lesson content
        const lessonRes = await api.get(`/lessons/${grade}/${subject}/${lessonId}`);
        setLesson(lessonRes.data.lesson);

        // Try to resume session
        const sessionRes = await api.get(`/session/resume?grade=${grade}&subject=${subject}`);
        if (sessionRes.data.hasSession && sessionRes.data.session.lessonId === lessonId) {
          setInitialStep(sessionRes.data.session.step);
          setInitialStepData(sessionRes.data.session.stepData || {});
        }

        // Initialize session store
        startSession(gradeNum, subject || '', lessonId || '');

        // Mark lesson as in_progress
        await updateLessonStatus(lessonId || '', 'in_progress');
      } catch {
        // pass
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, subject, lessonId]);

  async function handleStepChange(step: LessonStep, data?: Record<string, unknown>) {
    await advanceStep(step, data);
  }

  async function handleComplete(answers: AssessmentAnswer[], score: number, passed: boolean) {
    // Save assessment result
    try {
      await api.post(`/progress/${grade}/${subject}/${lessonId}/assessment`, {
        answers,
        score,
        passed,
        attemptNumber: 1,
      });
    } catch {
      // pass
    }

    setTimeout(() => {
      if (passed) {
        navigate(`/course/${grade}/${subject}`);
      } else {
        // Restart lesson from beginning
        setInitialStep('content');
        setInitialStepData({});
        startSession(gradeNum, subject || '', lessonId || '');
      }
    }, 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div className="space-y-3">
          <p className="text-2xl">😕</p>
          <p className="text-slate-600">Lesson not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Lesson header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
            <p className="text-slate-500 text-sm capitalize">
              Grade {grade} · {subject?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Lesson content */}
        {isScienceLesson(lesson) ? (
          <ScienceLessonComponent
            lesson={lesson as ScienceLessonType}
            initialStep={initialStep}
            initialStepData={initialStepData}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
          />
        ) : (
          <HumanitiesLessonComponent
            lesson={lesson as HumanitiesLessonType}
            initialStep={initialStep}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
