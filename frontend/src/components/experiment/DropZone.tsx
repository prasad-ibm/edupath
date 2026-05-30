import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Ingredient } from '../../types/content';

interface Props {
  droppedItems: Ingredient[];
  isActive: boolean;
  hasReaction: boolean;
}

const EMOJI_MAP: Record<string, string> = {
  ice_cube: '🧊', warm_water: '💧', water_glass: '🥤',
  sugar_cube: '🍬', sand: '🏖️', baking_soda: '🧂',
  vinegar: '🍶', oil: '🫙', red_food_coloring: '🔴', blue_food_coloring: '🔵',
};

export default function ReactionBeaker({ droppedItems, isActive, hasReaction }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'workspace' });

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Beaker */}
      <motion.div
        ref={setNodeRef}
        animate={{
          boxShadow: hasReaction
            ? ['0 0 20px rgba(251,191,36,0.8)', '0 0 40px rgba(251,191,36,0.4)', '0 0 20px rgba(251,191,36,0.8)']
            : isOver
            ? '0 0 30px rgba(99,102,241,0.7)'
            : '0 8px 30px rgba(0,0,0,0.4)',
        }}
        transition={{ duration: 1, repeat: hasReaction ? Infinity : 0 }}
        className="relative flex flex-col items-center justify-end overflow-hidden"
        style={{
          width: 120,
          height: 150,
          background: isOver
            ? 'linear-gradient(180deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.1) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          border: `2px solid ${isOver ? 'rgba(99,102,241,0.8)' : hasReaction ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: '4px 4px 20px 20px',
          backdropFilter: 'blur(4px)',
          transition: 'background 0.3s, border 0.3s',
        }}
      >
        {/* Top rim */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t"
          style={{ background: 'rgba(255,255,255,0.15)' }} />

        {/* Glass reflection */}
        <div className="absolute left-2 top-4 bottom-4 w-2 rounded-full opacity-20"
          style={{ background: 'linear-gradient(180deg, white, transparent)' }} />

        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
          animate={{
            height: droppedItems.length > 0 ? `${Math.min(droppedItems.length * 35, 100)}%` : '10%',
            background: hasReaction
              ? ['rgba(251,191,36,0.6)', 'rgba(234,88,12,0.6)', 'rgba(251,191,36,0.6)']
              : 'rgba(99,102,241,0.25)',
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Dropped ingredient emojis */}
        <div className="relative z-10 flex flex-wrap gap-1 justify-center p-2 pb-4">
          <AnimatePresence>
            {droppedItems.map((item) => (
              <motion.span
                key={item.id}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-xl drop-shadow-sm"
              >
                {EMOJI_MAP[item.id] ?? '🧪'}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty hint */}
        {droppedItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-center leading-snug px-2"
              style={{ color: 'rgba(148,163,184,0.8)' }}>
              {isOver ? '✨ Drop it!' : 'Drop here'}
            </p>
          </div>
        )}

        {/* Reaction bubbles */}
        {hasReaction && [0,1,2,3,4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6 + i * 2, height: 6 + i * 2,
              background: 'rgba(255,255,255,0.7)',
              left: `${15 + i * 15}%`, bottom: 8,
            }}
            animate={{ y: [-5, -100], opacity: [0.8, 0], scale: [1, 1.8] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, repeatDelay: 0.3 }}
          />
        ))}
      </motion.div>

      {/* Beaker stand */}
      <div className="rounded-sm" style={{
        width: 90, height: 8,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
        border: '1px solid rgba(255,255,255,0.1)',
      }} />
      <div className="rounded-full" style={{
        width: 70, height: 6,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
      }} />
    </div>
  );
}
