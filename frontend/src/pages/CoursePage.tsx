import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LearningPath from '../components/learningpath/LearningPath';
import { CourseMeta } from '../types/content';
import { useProgress } from '../hooks/useProgress';
import api from '../lib/api';

export default function CoursePage() {
  const { grade, subject } = useParams<{ grade: string; subject: string }>();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<CourseMeta | null>(null);
  const [placementIndex, setPlacementIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const gradeNum = parseInt(grade || '1');
  const { progress, fetchProgress } = useProgress(gradeNum, subject || '');

  useEffect(() => {
    async function load() {
      try {
        // Check if diagnostic taken
        const diagRes = await api.get(`/diagnostic/${grade}/${subject}`);
        if (!diagRes.data.alreadyTaken) {
          navigate(`/diagnostic/${grade}/${subject}`);
          return;
        }
        setPlacementIndex(diagRes.data.placementIndex);

        // Load course meta
        const metaRes = await api.get(`/lessons/${grade}/${subject}/meta`);
        setMeta(metaRes.data.meta);

        // Load progress
        await fetchProgress();
      } catch {
        // If no diagnostic content yet, just load meta
        try {
          const metaRes = await api.get(`/lessons/${grade}/${subject}/meta`);
          setMeta(metaRes.data.meta);
          await fetchProgress();
        } catch {
          // pass
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [grade, subject, navigate, fetchProgress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div className="space-y-3">
          <p className="text-2xl">📚</p>
          <p className="text-slate-600">Course content coming soon for Grade {grade} {subject?.replace('_', ' ')}!</p>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 underline text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <LearningPath meta={meta} progress={progress} placementIndex={placementIndex} />
      </div>
    </div>
  );
}
