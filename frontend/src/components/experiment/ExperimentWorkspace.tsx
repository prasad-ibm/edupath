/**
 * ExperimentWorkspace — Redesigned drag-onto-ingredient mechanic.
 *
 * Layout: draggable item(s) on the LEFT shelf → drag onto the BASE ingredient
 * on the right (which is the drop target).  When a valid combination lands,
 * AnimationStage fires below.
 */
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Experiment, ExperimentCombination, Ingredient } from '../../types/content';
import DraggableIngredient from './DraggableIngredient';
import MaterialModel from './MaterialModel';
import AnimationStage from './AnimationStage';

interface Props {
  experiment: Experiment;
  initialDroppedItems?: string[];
  onComplete?: (items: string[]) => void;
}

/** The ingredient that appears in the most combinations is the base/target. */
function findBaseId(ingredients: Ingredient[], combinations: ExperimentCombination[]): string {
  const counts: Record<string, number> = {};
  for (const c of combinations) {
    for (const id of c.requiredItems) counts[id] = (counts[id] ?? 0) + 1;
  }
  let best = { id: combinations[0].requiredItems[combinations[0].requiredItems.length - 1], n: 0 };
  for (const [id, n] of Object.entries(counts)) {
    if (n > best.n) best = { id, n };
  }
  return best.id;
}

// ─── Drop target (the base ingredient) ────────────────────────────────────────
function DroppableBase({
  ingredient,
  isActive,
  isReacted,
}: {
  ingredient: Ingredient;
  isActive: boolean;
  isReacted: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: ingredient.id });

  const glowColor = isReacted
    ? 'rgba(251,191,36,0.9)'
    : isOver
    ? 'rgba(99,102,241,0.9)'
    : isActive
    ? 'rgba(99,102,241,0.4)'
    : 'rgba(255,255,255,0.1)';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* drop target ring */}
      <motion.div
        ref={setNodeRef}
        animate={{
          boxShadow: isOver
            ? `0 0 0 4px ${glowColor}, 0 0 30px ${glowColor}`
            : isReacted
            ? [`0 0 0 3px rgba(251,191,36,0.8), 0 0 24px rgba(251,191,36,0.6)`,
               `0 0 0 5px rgba(251,191,36,0.4), 0 0 40px rgba(251,191,36,0.3)`,
               `0 0 0 3px rgba(251,191,36,0.8), 0 0 24px rgba(251,191,36,0.6)`]
            : isActive
            ? `0 0 0 3px ${glowColor}, 0 0 20px ${glowColor}`
            : '0 0 0 2px rgba(255,255,255,0.08)',
        }}
        transition={{ duration: 1.2, repeat: isReacted ? Infinity : 0 }}
        className="rounded-2xl p-3 flex flex-col items-center"
        style={{
          background: isOver
            ? 'rgba(99,102,241,0.15)'
            : isReacted
            ? 'rgba(251,191,36,0.1)'
            : 'rgba(255,255,255,0.04)',
          transition: 'background 0.25s',
        }}
      >
        <MaterialModel id={ingredient.id} size={112} />
      </motion.div>

      {/* hint arrow when dragging */}
      <AnimatePresence>
        {isActive && !isReacted && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-indigo-300 text-lg"
          >
            ⬆ drop here
          </motion.span>
        )}
      </AnimatePresence>

      <span
        className="text-xs font-bold text-center leading-tight max-w-[110px] px-2 py-0.5 rounded-full"
        style={{ color: 'rgba(226,232,240,0.95)', background: 'rgba(0,0,0,0.4)' }}
      >
        {ingredient.label}
      </span>
    </div>
  );
}

// ─── Main workspace ───────────────────────────────────────────────────────────
export default function ExperimentWorkspace({ experiment, initialDroppedItems = [], onComplete }: Props) {
  const baseId = findBaseId(experiment.ingredients, experiment.combinations);
  const baseIngredient = experiment.ingredients.find(i => i.id === baseId)!;
  const draggableIngredients = experiment.ingredients.filter(i => i.id !== baseId);

  const [activeIngredient, setActiveIngredient] = useState<Ingredient | null>(null);
  const [matchedCombo, setMatchedCombo] = useState<ExperimentCombination | null>(() => {
    if (initialDroppedItems.length < 2) return null;
    return experiment.combinations.find(c =>
      c.requiredItems.every(id => initialDroppedItems.includes(id))
    ) ?? null;
  });
  // Track which draggable items have already triggered a reaction (so they grey out)
  const [usedIds, setUsedIds] = useState<string[]>(() => initialDroppedItems);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function handleDragStart(e: DragStartEvent) {
    const ing = experiment.ingredients.find(i => i.id === e.active.id);
    setActiveIngredient(ing ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveIngredient(null);
    const { active, over } = e;
    if (!over || over.id !== baseId) return;

    const draggedId = active.id as string;
    if (usedIds.includes(draggedId)) return; // already used

    const combo = experiment.combinations.find(c =>
      c.requiredItems.includes(draggedId) && c.requiredItems.includes(baseId)
    );

    if (combo) {
      setMatchedCombo(combo);
      const next = [...usedIds, draggedId];
      setUsedIds(next);
      onComplete?.(combo.requiredItems);
    }
  }

  function handleReset() {
    setMatchedCombo(null);
    setUsedIds([]);
  }

  const availableDraggables = draggableIngredients.filter(i => !usedIds.includes(i.id));
  const hasMultipleOptions = draggableIngredients.length > 1;

  return (
    <div className="space-y-5">
      {/* instructions */}
      <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
        <span className="text-indigo-400 text-lg flex-shrink-0">🔬</span>
        <p className="text-indigo-100 text-sm font-medium">{experiment.instructions}</p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ── Lab Table ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 60%, #0a0f1e 100%)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
            minHeight: 300,
          }}
        >
          {/* surface sheen */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(130deg, rgba(255,255,255,0.03) 0%, transparent 55%)' }} />

          {/* lab label */}
          <div className="absolute top-3 left-4 opacity-40">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">⚗ Lab Bench</span>
          </div>

          <div className="relative z-10 p-5 pt-10 flex flex-col md:flex-row items-center gap-8 justify-center">

            {/* ── Draggable items (shelf) ── */}
            <div className="flex flex-col gap-3 items-center">
              {hasMultipleOptions && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  ← Try each one
                </p>
              )}
              <div
                className="rounded-xl p-4 flex flex-row flex-wrap gap-6 items-end justify-center min-w-[120px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.25)',
                  minHeight: 140,
                }}
              >
                {availableDraggables.length === 0 ? (
                  <p className="text-slate-500 text-sm self-center">All used!</p>
                ) : (
                  availableDraggables.map(ing => (
                    <DraggableIngredient key={ing.id} ingredient={ing} />
                  ))
                )}
              </div>
            </div>

            {/* ── Arrow ── */}
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl text-slate-500 hidden md:block select-none"
            >
              →
            </motion.div>

            {/* ── Base / drop target ── */}
            <DroppableBase
              ingredient={baseIngredient}
              isActive={!!activeIngredient}
              isReacted={!!matchedCombo}
            />
          </div>

          {/* table front edge */}
          <div className="h-5 w-full"
            style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }} />
        </div>

        {/* drag overlay – shows a floating copy while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeIngredient && (
            <DraggableIngredient ingredient={activeIngredient} isOverlay />
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Reaction animation ── */}
      <AnimatePresence>
        {matchedCombo && (
          <AnimationStage
            animationKey={matchedCombo.animationKey}
            resultLabel={matchedCombo.resultLabel}
          />
        )}
      </AnimatePresence>

      {/* reset */}
      {usedIds.length > 0 && (
        <button
          onClick={handleReset}
          className="text-sm text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
        >
          ↺ Reset experiment
        </button>
      )}
    </div>
  );
}
