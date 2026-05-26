interface Props {
  lessonId: string;
  index: number;
  status: 'locked' | 'available' | 'in_progress' | 'passed' | 'failed';
  lastScore: number | null;
  onClick: () => void;
}

const STATUS_CONFIG = {
  locked:      { icon: '🔒', label: 'Locked',      bg: 'bg-slate-50',  border: 'border-slate-200', text: 'text-slate-400' },
  available:   { icon: '▶️',  label: 'Start',       bg: 'bg-white',     border: 'border-blue-200',  text: 'text-slate-700' },
  in_progress: { icon: '📖', label: 'Continue',    bg: 'bg-blue-50',   border: 'border-blue-400',  text: 'text-blue-700'  },
  passed:      { icon: '✅',  label: 'Passed',      bg: 'bg-green-50',  border: 'border-green-400', text: 'text-green-700' },
  failed:      { icon: '🔄',  label: 'Try Again',   bg: 'bg-red-50',    border: 'border-red-300',   text: 'text-red-700'   },
};

export default function LessonCard({ lessonId, index, status, lastScore, onClick }: Props) {
  const config = STATUS_CONFIG[status];
  const isClickable = status !== 'locked';

  // Format lessonId to a human title
  const title = lessonId
    .replace(/_g\d+_l\d+/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || `Lesson ${index + 1}`;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`
        w-full text-left rounded-xl border-2 px-4 py-4
        flex items-center gap-4 transition-all duration-150
        ${config.bg} ${config.border}
        ${isClickable ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : 'cursor-not-allowed opacity-60'}
      `}
    >
      {/* Lesson number */}
      <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
        status === 'passed' ? 'bg-green-100 text-green-700' :
        status === 'failed' ? 'bg-red-100 text-red-700' :
        'bg-slate-100 text-slate-600'
      }`}>
        {index + 1}
      </span>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${config.text}`}>{title}</p>
        {lastScore !== null && (
          <p className="text-xs text-slate-400 mt-0.5">Last score: {lastScore}%</p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-base">{config.icon}</span>
        <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
      </div>
    </button>
  );
}
