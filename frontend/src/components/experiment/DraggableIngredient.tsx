import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Ingredient } from '../../types/content';

interface Props {
  ingredient: Ingredient;
}

export default function DraggableIngredient({ ingredient }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-2 bg-white border-2 rounded-xl px-3 py-2
        shadow-sm select-none transition-shadow duration-150
        ${isDragging ? 'border-blue-400 shadow-lg' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}
      `}
    >
      {ingredient.icon ? (
        <img src={ingredient.icon} alt={ingredient.label} className="w-8 h-8 object-contain" />
      ) : (
        <span className="text-2xl">{ingredient.label.charAt(0)}</span>
      )}
      <span className="text-sm font-medium text-slate-700">{ingredient.label}</span>
    </div>
  );
}
