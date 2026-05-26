import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Subject } from '../types/content';

const SUBJECTS: { value: Subject; label: string; emoji: string; color: string }[] = [
  { value: 'chemistry', label: 'Chemistry', emoji: '⚗️', color: 'from-purple-500 to-purple-700' },
  { value: 'physics', label: 'Physics', emoji: '⚡', color: 'from-yellow-500 to-orange-500' },
  { value: 'history', label: 'History', emoji: '🏛️', color: 'from-amber-600 to-amber-800' },
  { value: 'social_studies', label: 'Social Studies', emoji: '🌍', color: 'from-green-500 to-teal-600' },
];

const GRADE_LABELS: Record<number, string> = {
  1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade', 4: '4th Grade',
  5: '5th Grade', 6: '6th Grade', 7: '7th Grade', 8: '8th Grade',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, selectedGrade, setSelectedSubject } = useAuthStore();
  const grade = selectedGrade || user?.grade || 1;

  function openCourse(subject: Subject) {
    setSelectedSubject(subject);
    navigate(`/course/${grade}/${subject}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500">
            {GRADE_LABELS[grade]} — Pick a subject to continue learning
          </p>
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map((s) => (
            <button
              key={s.value}
              onClick={() => openCourse(s.value)}
              className={`
                bg-gradient-to-br ${s.color}
                text-white rounded-2xl p-6
                flex flex-col items-start gap-3
                shadow-md hover:shadow-xl
                transition-all duration-200 hover:-translate-y-1
                text-left cursor-pointer
              `}
            >
              <span className="text-4xl">{s.emoji}</span>
              <div>
                <div className="font-bold text-xl">{s.label}</div>
                <div className="text-white/70 text-sm mt-0.5">Grade {grade}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
