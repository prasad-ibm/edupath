import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User } from '../types/user';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8];
const GRADE_LABELS: Record<number, string> = {
  1: '1st', 2: '2nd', 3: '3rd', 4: '4th',
  5: '5th', 6: '6th', 7: '7th', 8: '8th',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim(), grade }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();

      const user: User = {
        userId: data.user.userId,
        classlinkId: `local_${name.trim().toLowerCase().replace(/\s+/g, '_')}`,
        displayName: data.user.displayName,
        grade: data.user.grade,
      };

      setAuth(user, data.token);
      navigate('/dashboard');
    } catch {
      setError('Could not connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-6xl">🎓</div>
          <h1 className="text-3xl font-bold text-slate-800">EduPath</h1>
          <p className="text-slate-500 text-sm">
            Science &amp; Social Studies for Grades 1–8
          </p>
        </div>

        {/* Subject pills */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { emoji: '⚗️', label: 'Chemistry' },
            { emoji: '⚡', label: 'Physics' },
            { emoji: '🏛️', label: 'History' },
            { emoji: '🌍', label: 'Social Studies' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <span>{s.emoji}</span>
              <span className="text-slate-600 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
              autoFocus
            />
          </div>

          {/* Grade */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">Your Grade</label>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`
                    py-2 rounded-xl text-sm font-semibold border-2 transition-colors
                    ${grade === g
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                    }
                  `}
                >
                  {GRADE_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full font-semibold py-3 px-6 rounded-xl transition-colors shadow-md text-white
              ${loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-[#1e3a5f] hover:bg-[#162d4a] cursor-pointer'
              }
            `}
          >
            {loading ? 'Signing in…' : `Start Learning →`}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center">
          School login (ClassLink SSO) will be enabled for deployment.
        </p>
      </div>
    </div>
  );
}
