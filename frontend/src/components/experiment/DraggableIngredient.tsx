import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Ingredient } from '../../types/content';
import MaterialModel from './MaterialModel';

interface Props {
  ingredient: Ingredient;
  isOverlay?: boolean;
}

export default function DraggableIngredient({ ingredient, isOverlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.25 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isOverlay ? 50 : undefined,
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? { cursor: 'grabbing' } : style}
      {...(isOverlay ? {} : { ...listeners, ...attributes })}
      className="select-none flex flex-col items-center gap-2"
    >
      <motion.div
        whileHover={!isDragging && !isOverlay ? { scale: 1.12, y: -4 } : {}}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <MaterialModel id={ingredient.id} size={isOverlay ? 96 : 84} noFloat={isOverlay || isDragging} />
      </motion.div>

      <span
        className="text-xs font-bold text-center leading-tight max-w-[90px] px-2 py-0.5 rounded-full"
        style={{
          color: 'rgba(226,232,240,0.95)',
          background: 'rgba(0,0,0,0.35)',
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {ingredient.label}
      </span>
    </div>
  );
}
