import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiagnosticTest from '../components/diagnostic/DiagnosticTest';
import { DiagnosticData } from '../types/content';
import api from '../lib/api';

export default function DiagnosticPage() {
  const { grade, subject } = useParams<{ grade: string; subject: string }>();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDiagnostic() {
      try {
        const res = await api.get(`/diagnostic/${grade}/${subject}`);
        if (res.data.alreadyTaken) {
          navigate(`/course/${grade}/${subject}`);
          return;
        }
        setDiagnostic(res.data.diagnostic);
      } catch {
        setError('Failed to load diagnostic test.');
      } finally {
        setLoading(false);
      }
    }
    loadDiagnostic();
  }, [grade, subject, navigate]);

  async function handleComplete(answers: { questionId: string; difficulty: number; correct: boolean }[]) {
    try {
      await api.post(`/diagnostic/${grade}/${subject}/submit`, { answers });
      navigate(`/course/${grade}/${subject}`);
    } catch {
      navigate(`/course/${grade}/${subject}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !diagnostic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error || 'Diagnostic not found.'}</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 underline">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Placement Test</h1>
          <p className="text-slate-500 text-sm capitalize">
            Grade {grade} — {subject?.replace('_', ' ')}
          </p>
        </div>
        <DiagnosticTest diagnostic={diagnostic} onComplete={handleComplete} />
      </div>
    </div>
  );
}
