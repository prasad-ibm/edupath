import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Ingredient } from '../../types/content';

interface Props {
  ingredient: Ingredient;
  isOverlay?: boolean;
}

// Visual mapping for each ingredient ID
const INGREDIENT_VISUALS: Record<string, { emoji: string; topColor: string; bottomColor: string; glowColor: string }> = {
  ice_cube:         { emoji: '🧊', topColor: '#bae6fd', bottomColor: '#7dd3fc', glowColor: 'rgba(125,211,252,0.5)' },
  warm_water:       { emoji: '💧', topColor: '#93c5fd', bottomColor: '#3b82f6', glowColor: 'rgba(59,130,246,0.5)' },
  water_glass:      { emoji: '🥤', topColor: '#a5f3fc', bottomColor: '#22d3ee', glowColor: 'rgba(34,211,238,0.4)' },
  sugar_cube:       { emoji: '🍬', topColor: '#fde68a', bottomColor: '#f59e0b', glowColor: 'rgba(245,158,11,0.5)' },
  sand:             { emoji: '🏖️', topColor: '#fde68a', bottomColor: '#d97706', glowColor: 'rgba(217,119,6,0.4)' },
  baking_soda:      { emoji: '🧂', topColor: '#e2e8f0', bottomColor: '#94a3b8', glowColor: 'rgba(148,163,184,0.5)' },
  vinegar:          { emoji: '🍶', topColor: '#d9f99d', bottomColor: '#84cc16', glowColor: 'rgba(132,204,22,0.5)' },
  oil:              { emoji: '🫙', topColor: '#fef08a', bottomColor: '#eab308', glowColor: 'rgba(234,179,8,0.5)' },
  red_food_coloring:{ emoji: '🔴', topColor: '#fca5a5', bottomColor: '#ef4444', glowColor: 'rgba(239,68,68,0.5)' },
  blue_food_coloring:{ emoji: '🔵', topColor: '#93c5fd', bottomColor: '#3b82f6', glowColor: 'rgba(59,130,246,0.5)' },
};

const DEFAULT_VISUAL = { emoji: '🧪', topColor: '#c4b5fd', bottomColor: '#8b5cf6', glowColor: 'rgba(139,92,246,0.5)' };

export default function DraggableIngredient({ ingredient, isOverlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
  });

  const visual = INGREDIENT_VISUALS[ingredient.id] ?? DEFAULT_VISUAL;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const containerStyle = isOverlay ? {} : style;

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={containerStyle}
      {...(isOverlay ? {} : { ...listeners, ...attributes })}
      className="select-none flex flex-col items-center gap-2"
    >
      <motion.div
        whileHover={!isDragging ? { y: -6, scale: 1.05 } : {}}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex flex-col items-center"
      >
        {/* 3D container body */}
        <div
          className="relative rounded-2xl flex items-center justify-center"
          style={{
            width: 72,
            height: 80,
            background: `linear-gradient(145deg, ${visual.topColor} 0%, ${visual.bottomColor} 100%)`,
            boxShadow: `
              0 8px 20px ${visual.glowColor},
              0 2px 4px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.6),
              inset 0 -2px 4px rgba(0,0,0,0.1)
            `,
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          {/* Glass reflection */}
          <div
            className="absolute top-2 left-2 rounded-full opacity-60"
            style={{
              width: 18,
              height: 18,
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            }}
          />
          {/* Emoji */}
          <span className="text-3xl relative z-10 drop-shadow-sm">{visual.emoji}</span>
        </div>

        {/* 3D shadow base */}
        <div
          className="rounded-full mt-1"
          style={{
            width: 60,
            height: 10,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Label */}
      <span
        className="text-xs font-semibold text-center leading-tight max-w-[80px]"
        style={{ color: 'rgba(226,232,240,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
      >
        {ingredient.label}
      </span>
    </div>
  );
}
