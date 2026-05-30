import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiagnosticData, DiagnosticQuestion } from '../../types/content';
import {
  createAdaptiveState,
  pickNextQuestion,
  processAnswer,
  AdaptiveState,
} from '../../lib/adaptive';
import DiagnosticQuestion_ from './DiagnosticQuestion';

interface Props {
  diagnostic: DiagnosticData;
  onComplete: (answers: AdaptiveState['answers']) => void;
}

export default function DiagnosticTest({ diagnostic, onComplete }: Props) {
  const [state, setState] = useState<AdaptiveState>(createAdaptiveState);
  const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (state.isComplete) return;
    const next = pickNextQuestion(state, diagnostic.questions);
    if (!next && state.questionsAnswered > 0) {
      // All available questions exhausted — complete the diagnostic
      onComplete(state.answers);
      return;
    }
    setCurrentQuestion(next);
  }, [state, diagnostic.questions, onComplete]);

  function handleAnswer(questionId: string, correct: boolean) {
    const question = diagnostic.questions.find((q) => q.id === questionId);
    if (!question) return;

    setShowTransition(true);
    setTimeout(() => {
      const newState = processAnswer(state, questionId, correct, question.difficulty);
      setState(newState);
      setShowTransition(false);

      if (newState.isComplete) {
        onComplete(newState.answers);
      }
    }, 600);
  }

  const progress = (state.questionsAnswered / 12) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Placement Test</h3>
          <span className="text-sm text-slate-500">
            Question {state.questionsAnswered + 1} of ~12
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-slate-400">
          This test adapts to your level to find the best starting point for you.
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {!showTransition && currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <DiagnosticQuestion_
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}
        {showTransition && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-32"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
