import { useState } from 'react';
import { HumanitiesLesson as HumanitiesLessonType } from '../../types/content';
import { AssessmentAnswer, LessonStep } from '../../types/progress';
import LessonContent from './LessonContent';
import ReadingPassage from './ReadingPassage';
import QuestionBlock from '../questions/QuestionBlock';
import FinalAssessment from './FinalAssessment';

interface Props {
  lesson: HumanitiesLessonType;
  initialStep?: LessonStep;
  onStepChange: (step: LessonStep, data?: Record<string, unknown>) => void;
  onComplete: (answers: AssessmentAnswer[], score: number, passed: boolean) => void;
}

const STEPS: LessonStep[] = ['content', 'reading', 'comprehension', 'assessment'];
const STEP_LABELS: Record<LessonStep, string> = {
  content: 'Lesson', reading: 'Reading', comprehension: 'Questions', assessment: 'Assessment',
  experiment: 'Experiment', practice: 'Practice',
};

export default function HumanitiesLesson({
  lesson, initialStep = 'content', onStepChange, onComplete,
}: Props) {
  const [currentStep, setCurrentStep] = useState<LessonStep>(initialStep);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<string, { correct: boolean; attempts: number }>>({});

  function goToStep(step: LessonStep, data?: Record<string, unknown>) {
    setCurrentStep(step);
    onStepChange(step, data);
  }

  const stepIndex = STEPS.indexOf(currentStep);
  const totalQuestions = lesson.comprehensionQuestions.length;
  const comprehensionComplete = Object.keys(comprehensionAnswers).length === totalQuestions;

  return (
    <div className="space-y-6">
      {/* Step progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 h-2 rounded-full transition-colors ${
              i <= stepIndex ? 'bg-amber-500' : 'bg-slate-200'
            }`} />
            {i < STEPS.length - 1 && (
              <div className={`w-2 h-2 rounded-full ${i < stepIndex ? 'bg-amber-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 -mt-2">
        {STEPS.map((step) => (
          <span key={step} className={currentStep === step ? 'text-amber-600 font-semibold' : ''}>
            {STEP_LABELS[step]}
          </span>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 'content' && (
        <LessonContent
          content={lesson.content}
          onContinue={() => goToStep('reading')}
        />
      )}

      {currentStep === 'reading' && (
        <ReadingPassage
          passage={lesson.readingPassage}
          onContinue={() => goToStep('comprehension')}
        />
      )}

      {currentStep === 'comprehension' && (
        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 text-lg">📝 Comprehension Questions</h3>
          <p className="text-slate-500 text-sm">
            Answer questions about the passage. You have up to 3 tries per question.
          </p>
          {lesson.comprehensionQuestions.map((q, i) => (
            <QuestionBlock
              key={q.id}
              question={q}
              index={i}
              onAnswer={(qId, correct, attempts) =>
                setComprehensionAnswers((prev) => ({ ...prev, [qId]: { correct, attempts } }))
              }
            />
          ))}
          <div className="flex justify-end">
            <button
              onClick={() => goToStep('assessment')}
              disabled={!comprehensionComplete}
              className={`font-semibold px-6 py-3 rounded-xl transition-colors ${
                comprehensionComplete
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Take Final Assessment →
            </button>
          </div>
        </div>
      )}

      {currentStep === 'assessment' && (
        <FinalAssessment
          assessment={lesson.finalAssessment}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
