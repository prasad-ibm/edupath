import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinalAssessment as FinalAssessmentType, Question } from '../../types/content';
import { AssessmentAnswer } from '../../types/progress';

interface Props {
  assessment: FinalAssessmentType;
  onComplete: (answers: AssessmentAnswer[], score: number, passed: boolean) => void;
}

export default function FinalAssessment({ assessment, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const allAnswered = assessment.questions.every((q) => answers[q.id]);

  function handleSelect(questionId: string, optionId: string) {
    if (submitted) return;
    if (answers[questionId]) return; // one try only
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function handleSubmit() {
    const results: AssessmentAnswer[] = assessment.questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || '',
      correct: answers[q.id] === q.correctId,
    }));

    const correct = results.filter((r) => r.correct).length;
    const scoreVal = Math.round((correct / assessment.questions.length) * 100);
    const passedVal = scoreVal >= assessment.passingScore;

    setScore(scoreVal);
    setPassed(passedVal);
    setSubmitted(true);
    onComplete(results, scoreVal, passedVal);
  }

  function getOptionStyle(question: Question, optionId: string): string {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ';
    const selected = answers[question.id];

    if (!submitted) {
      if (selected === optionId) return base + 'border-blue-500 bg-blue-50 text-blue-800';
      if (selected) return base + 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60';
      return base + 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
    }

    // After submit: show correct/incorrect
    if (optionId === question.correctId) return base + 'border-green-500 bg-green-50 text-green-800';
    if (selected === optionId) return base + 'border-red-400 bg-red-50 text-red-700';
    return base + 'border-slate-200 bg-white text-slate-400 opacity-50';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 text-white rounded-2xl p-5 flex items-center gap-3">
        <span className="text-3xl">📝</span>
        <div>
          <h3 className="font-bold text-lg">Final Assessment</h3>
          <p className="text-slate-300 text-sm">
            One attempt per question • {assessment.passingScore}% to pass
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-slate-800 font-medium">{question.prompt}</p>
            </div>
            <div className="space-y-2 pl-10">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(question.id, opt.id)}
                  disabled={!!answers[question.id] || submitted}
                  className={getOptionStyle(question, opt.id)}
                >
                  <span className="font-bold text-slate-400 mr-2">{opt.id.toUpperCase()}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`
              font-semibold px-8 py-3 rounded-xl transition-colors shadow-sm
              ${allAnswered
                ? 'bg-slate-800 hover:bg-slate-900 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            Submit Assessment
          </button>
        </div>
      )}

      {/* Score reveal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 text-center space-y-3 ${
              passed ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'
            }`}
          >
            <div className="text-5xl">{passed ? '🎉' : '😕'}</div>
            <div className={`text-4xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {score}%
            </div>
            <div className={`font-semibold text-lg ${passed ? 'text-green-800' : 'text-red-800'}`}>
              {passed ? 'You passed! Great work!' : `You need ${assessment.passingScore}% to pass.`}
            </div>
            {!passed && (
              <p className="text-red-600 text-sm">
                Review the lesson and try again. You've got this!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
