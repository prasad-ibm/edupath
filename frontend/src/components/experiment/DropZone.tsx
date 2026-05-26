import { useDroppable } from '@dnd-kit/core';
import { Ingredient } from '../../types/content';

interface Props {
  droppedItems: string[];
  ingredients: Ingredient[];
}

export default function DropZone({ droppedItems, ingredients }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'workspace' });

  const droppedIngredients = ingredients.filter((i) => droppedItems.includes(i.id));

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] rounded-xl border-2 border-dashed p-4
        flex flex-wrap gap-3 items-center
        transition-colors duration-200
        ${isOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-slate-300 bg-white'
        }
      `}
    >
      {droppedIngredients.length === 0 ? (
        <p className={`text-sm w-full text-center transition-colors ${isOver ? 'text-blue-500' : 'text-slate-400'}`}>
          {isOver ? '⬇️ Drop here!' : 'Drag ingredients here'}
        </p>
      ) : (
        droppedIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
          >
            {ingredient.icon ? (
              <img src={ingredient.icon} alt={ingredient.label} className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-xl">{ingredient.label.charAt(0)}</span>
            )}
            <span className="text-sm font-medium text-blue-700">{ingredient.label}</span>
          </div>
        ))
      )}
    </div>
  );
}
