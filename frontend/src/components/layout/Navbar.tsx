import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Subject } from '../../types/content';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8];
const SUBJECTS: { value: Subject; label: string }[] = [
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'physics', label: 'Physics' },
  { value: 'history', label: 'History' },
  { value: 'social_studies', label: 'Social Studies' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, selectedGrade, selectedSubject, setSelectedGrade, setSelectedSubject } =
    useAuthStore();

  function handleGradeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const grade = parseInt(e.target.value);
    setSelectedGrade(grade);
    setSelectedSubject(null);
    navigate('/dashboard');
  }

  function handleSubjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const subject = e.target.value as Subject;
    setSelectedSubject(subject);
    if (selectedGrade) {
      navigate(`/course/${selectedGrade}/${subject}`);
    }
  }

  return (
    <nav className="bg-[#1e3a5f] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo / App Name */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <span className="text-2xl">🎓</span>
        <span className="font-bold text-lg tracking-tight">EduPath</span>
      </div>

      {/* Right side — dropdowns + user */}
      <div className="flex items-center gap-3">
        {/* Subject Dropdown */}
        <select
          value={selectedSubject || ''}
          onChange={handleSubjectChange}
          className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
          aria-label="Select subject"
        >
          <option value="" disabled className="text-gray-800">
            Subject
          </option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value} className="text-gray-800">
              {s.label}
            </option>
          ))}
        </select>

        {/* Grade Dropdown */}
        <select
          value={selectedGrade || ''}
          onChange={handleGradeChange}
          className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
          aria-label="Select grade"
        >
          <option value="" disabled className="text-gray-800">
            Grade
          </option>
          {GRADES.map((g) => (
            <option key={g} value={g} className="text-gray-800">
              Grade {g}
            </option>
          ))}
        </select>

        {/* Student name */}
        {user && (
          <span className="text-sm text-white/80 hidden md:block">
            👤 {user.displayName}
          </span>
        )}
      </div>
    </nav>
  );
}
