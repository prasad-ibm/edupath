import { useState } from 'react';
import { DiagnosticQuestion } from '../../types/content';

interface Props {
  question: DiagnosticQuestion;
  onAnswer: (questionId: string, correct: boolean) => void;
}

export default function DiagnosticQuestion({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(optionId: string) {
    if (selected) return;
    setSelected(optionId);
    const correct = optionId === question.correctId;
    onAnswer(question.id, correct);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <p className="text-slate-800 font-semibold text-base leading-snug">{question.prompt}</p>
      <div className="space-y-2">
        {question.options.map((opt) => {
          let style = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ';
          if (!selected) {
            style += 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
          } else if (opt.id === selected) {
            style += 'border-blue-500 bg-blue-50 text-blue-800';
          } else {
            style += 'border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed';
          }
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={!!selected} className={style}>
              <span className="font-bold text-slate-400 mr-2">{opt.id.toUpperCase()}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
