import { useState } from 'react';
import { ScienceLesson as ScienceLessonType } from '../../types/content';
import { AssessmentAnswer, LessonStep } from '../../types/progress';
import LessonContent from './LessonContent';
import ExperimentWorkspace from '../experiment/ExperimentWorkspace';
import QuestionBlock from '../questions/QuestionBlock';
import FinalAssessment from './FinalAssessment';

interface Props {
  lesson: ScienceLessonType;
  initialStep?: LessonStep;
  initialStepData?: Record<string, unknown>;
  onStepChange: (step: LessonStep, data?: Record<string, unknown>) => void;
  onComplete: (answers: AssessmentAnswer[], score: number, passed: boolean) => void;
}

const STEPS: LessonStep[] = ['content', 'experiment', 'practice', 'assessment'];
const STEP_LABELS: Record<LessonStep, string> = {
  content: 'Lesson', experiment: 'Experiment', practice: 'Practice', assessment: 'Assessment',
  reading: 'Reading', comprehension: 'Questions',
};

export default function ScienceLesson({
  lesson, initialStep = 'content', initialStepData = {}, onStepChange, onComplete,
}: Props) {
  const [currentStep, setCurrentStep] = useState<LessonStep>(initialStep);
  const [experimentDone, setExperimentDone] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, { correct: boolean; attempts: number }>>({});

  function goToStep(step: LessonStep, data?: Record<string, unknown>) {
    setCurrentStep(step);
    onStepChange(step, data);
  }

  const stepIndex = STEPS.indexOf(currentStep);
  const totalPractice = lesson.practiceQuestions.length;
  const practiceComplete = Object.keys(practiceAnswers).length === totalPractice;

  return (
    <div className="space-y-6">
      {/* Step progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 h-2 rounded-full transition-colors ${
              i <= stepIndex ? 'bg-blue-500' : 'bg-slate-200'
            }`} />
            {i < STEPS.length - 1 && (
              <div className={`w-2 h-2 rounded-full ${i < stepIndex ? 'bg-blue-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 -mt-2">
        {STEPS.map((step) => (
          <span key={step} className={currentStep === step ? 'text-blue-600 font-semibold' : ''}>
            {STEP_LABELS[step]}
          </span>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 'content' && (
        <LessonContent
          content={lesson.content}
          onContinue={() => goToStep('experiment')}
        />
      )}

      {currentStep === 'experiment' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">⚗️ Lab Experiment</h3>
          <ExperimentWorkspace
            experiment={lesson.experiment}
            initialDroppedItems={(initialStepData.droppedItems as string[]) || []}
            onComplete={(dropped) => {
              setExperimentDone(true);
              onStepChange('experiment', { droppedItems: dropped });
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={() => goToStep('practice')}
              disabled={!experimentDone}
              className={`font-semibold px-6 py-3 rounded-xl transition-colors ${
                experimentDone
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Practice →
            </button>
          </div>
        </div>
      )}

      {currentStep === 'practice' && (
        <div className="space-y-5">
          <h3 className="font-bold text-slate-800 text-lg">✏️ Practice Questions</h3>
          <p className="text-slate-500 text-sm">
            Answer the questions below. You have up to 3 tries per question.
          </p>
          {lesson.practiceQuestions.map((q, i) => (
            <QuestionBlock
              key={q.id}
              question={q}
              index={i}
              onAnswer={(qId, correct, attempts) =>
                setPracticeAnswers((prev) => ({ ...prev, [qId]: { correct, attempts } }))
              }
            />
          ))}
          <div className="flex justify-end">
            <button
              onClick={() => goToStep('assessment')}
              disabled={!practiceComplete}
              className={`font-semibold px-6 py-3 rounded-xl transition-colors ${
                practiceComplete
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
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
