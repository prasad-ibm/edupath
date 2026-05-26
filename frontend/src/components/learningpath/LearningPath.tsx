import { useNavigate } from 'react-router-dom';
import { CourseMeta } from '../../types/content';
import { LessonProgress } from '../../types/progress';
import LessonCard from './LessonCard';

interface Props {
  meta: CourseMeta;
  progress: LessonProgress[];
  placementIndex: number;
}

export default function LearningPath({ meta, progress, placementIndex }: Props) {
  const navigate = useNavigate();

  function getStatus(lessonId: string, index: number): 'locked' | 'available' | 'in_progress' | 'passed' | 'failed' {
    if (index < placementIndex) {
      // Before placement — consider passed (skipped by diagnostic)
      return 'passed';
    }
    const p = progress.find((lp) => lp.lessonId === lessonId);
    if (!p || p.status === 'not_started') {
      // Available if previous lesson is passed or this is first unlocked lesson
      const prevId = meta.lessonSequence[index - 1];
      if (!prevId) return 'available'; // first lesson
      const prevProg = progress.find((lp) => lp.lessonId === prevId);
      if (prevProg?.status === 'passed' || index <= placementIndex) return 'available';
      return 'locked';
    }
    return p.status as 'in_progress' | 'passed' | 'failed';
  }

  function handleLessonClick(lessonId: string, status: string) {
    if (status === 'locked') return;
    navigate(`/lesson/${meta.grade}/${meta.subject}/${lessonId}`);
  }

  const passedCount = meta.lessonSequence.filter((id, i) => {
    const s = getStatus(id, i);
    return s === 'passed';
  }).length;

  return (
    <div className="space-y-4">
      {/* Course header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{meta.title}</h2>
          <p className="text-slate-500 text-sm">
            {passedCount} of {meta.lessonSequence.length} lessons completed
          </p>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28"
                fill="none" stroke="#3b82f6" strokeWidth="6"
                strokeDasharray={`${(passedCount / meta.lessonSequence.length) * 175.9} 175.9`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
              {Math.round((passedCount / meta.lessonSequence.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {meta.lessonSequence.map((lessonId, index) => {
          const status = getStatus(lessonId, index);
          const prog = progress.find((p) => p.lessonId === lessonId);
          return (
            <LessonCard
              key={lessonId}
              lessonId={lessonId}
              index={index}
              status={status}
              lastScore={prog?.lastScore ?? null}
              onClick={() => handleLessonClick(lessonId, status)}
            />
          );
        })}
      </div>
    </div>
  );
}
