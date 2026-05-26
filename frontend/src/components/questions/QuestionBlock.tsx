import { useState } from 'react';
import { Question } from '../../types/content';
import FeedbackHint from './FeedbackHint';

type QuestionState = 'unanswered' | 'correct_first' | 'correct_second' | 'revealed';

interface Props {
  question: Question;
  index: number;
  onAnswer: (questionId: string, correct: boolean, attempts: number) => void;
  disabled?: boolean;
}

export default function QuestionBlock({ question, index, onAnswer, disabled = false }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState<QuestionState>('unanswered');
  const [showHint, setShowHint] = useState(false);

  function handleSelect(optionId: string) {
    if (disabled || state !== 'unanswered' && state !== 'correct_second') return;
    if (attempts >= 2 && state !== 'unanswered') return;

    const newAttempts = attempts + 1;
    const correct = optionId === question.correctId;
    setSelected(optionId);
    setAttempts(newAttempts);

    if (correct) {
      const newState = newAttempts === 1 ? 'correct_first' : 'correct_second';
      setState(newState);
      setShowHint(false);
      onAnswer(question.id, true, newAttempts);
    } else {
      if (newAttempts >= 2) {
        // Third wrong attempt — reveal answer
        setState('revealed');
        setShowHint(false);
        onAnswer(question.id, false, newAttempts);
      } else {
        // First wrong attempt — show hint, allow retry
        setShowHint(true);
        // Reset selection so student can try again
        setTimeout(() => setSelected(null), 600);
      }
    }
  }

  function getOptionStyle(optionId: string): string {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ';

    if (state === 'revealed') {
      if (optionId === question.correctId) {
        return base + 'border-red-400 bg-red-50 text-red-800';
      }
      if (optionId === selected) {
        return base + 'border-red-300 bg-red-50/50 text-red-600 opacity-60';
      }
      return base + 'border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed';
    }

    if (state === 'correct_first') {
      if (optionId === selected) return base + 'border-green-500 bg-green-50 text-green-800';
      return base + 'border-slate-200 bg-white text-slate-400 opacity-50 cursor-not-allowed';
    }

    if (state === 'correct_second') {
      if (optionId === selected) return base + 'border-yellow-500 bg-yellow-50 text-yellow-800';
      return base + 'border-slate-200 bg-white text-slate-400 opacity-50 cursor-not-allowed';
    }

    if (optionId === selected) {
      return base + 'border-red-300 bg-red-50 text-red-700 animate-shake';
    }

    return base + 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
  }

  function getQuestionBorderColor(): string {
    switch (state) {
      case 'correct_first': return 'border-l-green-500';
      case 'correct_second': return 'border-l-yellow-500';
      case 'revealed': return 'border-l-red-500';
      default: return 'border-l-slate-300';
    }
  }

  function getStatusBadge() {
    switch (state) {
      case 'correct_first':
        return <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">✓ Correct</span>;
      case 'correct_second':
        return <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">✓ Correct (2nd try)</span>;
      case 'revealed':
        return <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">✗ Answer revealed</span>;
      default:
        return null;
    }
  }

  const isDone = state !== 'unanswered';

  return (
    <div className={`bg-white rounded-2xl border-l-4 ${getQuestionBorderColor()} shadow-sm p-5 space-y-4`}>
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <p className="text-slate-800 font-medium leading-snug">{question.prompt}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Options */}
      <div className="space-y-2 pl-10">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={isDone || disabled}
            className={getOptionStyle(opt.id)}
          >
            <span className="font-bold text-slate-400 mr-2">{opt.id.toUpperCase()}.</span>
            {opt.text}
          </button>
        ))}
      </div>

      {/* Hint */}
      {showHint && question.hint && (
        <div className="pl-10">
          <FeedbackHint hint={question.hint} />
        </div>
      )}

      {/* Revealed answer label */}
      {state === 'revealed' && (
        <div className="pl-10 text-sm text-red-600 font-medium">
          ✗ The correct answer was:{' '}
          <strong>{question.options.find((o) => o.id === question.correctId)?.text}</strong>
        </div>
      )}
    </div>
  );
}
