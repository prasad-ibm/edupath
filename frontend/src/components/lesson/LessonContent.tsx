import { LessonContent as LessonContentType } from '../../types/content';

interface Props {
  content: LessonContentType;
  onContinue: () => void;
}

export default function LessonContent({ content, onContinue }: Props) {
  return (
    <div className="space-y-6">
      {/* Text content */}
      <div className="prose prose-slate max-w-none">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 leading-relaxed text-slate-700 text-base whitespace-pre-wrap">
          {content.text}
        </div>
      </div>

      {/* Diagrams */}
      {content.diagrams && content.diagrams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.diagrams.map((diagram, i) => (
            <figure key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <img
                src={diagram.src}
                alt={diagram.alt}
                className="w-full object-contain max-h-48"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <figcaption className="text-center text-xs text-slate-400 px-3 py-2">
                {diagram.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
