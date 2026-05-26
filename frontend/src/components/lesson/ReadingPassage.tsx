import { ReadingPassage as ReadingPassageType } from '../../types/content';

interface Props {
  passage: ReadingPassageType;
  onContinue: () => void;
}

export default function ReadingPassage({ passage, onContinue }: Props) {
  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2">
        <span className="text-amber-600">📖</span>
        <span className="text-amber-800 text-sm font-medium">Read the passage below, then answer the questions.</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Passage header */}
        <div className="bg-slate-800 px-6 py-4">
          <h3 className="text-white font-bold text-lg">{passage.title}</h3>
        </div>

        {/* Passage text */}
        <div className="px-6 py-5 leading-relaxed text-slate-700 text-base whitespace-pre-wrap max-h-[420px] overflow-y-auto">
          {passage.text}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          I've Read It →
        </button>
      </div>
    </div>
  );
}
