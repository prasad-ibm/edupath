import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { Experiment, ExperimentCombination, Ingredient } from '../../types/content';
import DraggableIngredient from './DraggableIngredient';
import ReactionBeaker from './DropZone';
import AnimationStage from './AnimationStage';

interface Props {
  experiment: Experiment;
  initialDroppedItems?: string[];
  onComplete?: (droppedItems: string[]) => void;
}

function resolveExperiment(
  droppedItems: string[],
  combinations: ExperimentCombination[]
): ExperimentCombination | null {
  return (
    combinations.find(
      (combo) =>
        combo.requiredItems.length === droppedItems.length &&
        combo.requiredItems.every((item) => droppedItems.includes(item))
    ) ?? null
  );
}

export default function ExperimentWorkspace({ experiment, initialDroppedItems = [], onComplete }: Props) {
  const [droppedItems, setDroppedItems] = useState<string[]>(initialDroppedItems);
  const [activeIngredient, setActiveIngredient] = useState<Ingredient | null>(null);
  const [matchedCombo, setMatchedCombo] = useState<ExperimentCombination | null>(() =>
    resolveExperiment(initialDroppedItems, experiment.combinations)
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const ingredient = experiment.ingredients.find((i) => i.id === event.active.id);
    setActiveIngredient(ingredient ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveIngredient(null);
    const { active, over } = event;

    if (over?.id === 'workspace' && !droppedItems.includes(active.id as string)) {
      const newDropped = [...droppedItems, active.id as string];
      setDroppedItems(newDropped);

      const combo = resolveExperiment(newDropped, experiment.combinations);
      setMatchedCombo(combo);

      if (combo) {
        onComplete?.(newDropped);
      }
    }
  }

  function handleReset() {
    setDroppedItems([]);
    setMatchedCombo(null);
  }

  const availableIngredients = experiment.ingredients.filter(
    (i) => !droppedItems.includes(i.id)
  );

  const droppedIngredients = experiment.ingredients.filter(
    (i) => droppedItems.includes(i.id)
  );

  return (
    <div className="space-y-4">
      {/* Instructions banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-start gap-2">
        <span className="text-indigo-500 text-lg flex-shrink-0">📋</span>
        <p className="text-indigo-800 text-sm font-medium">{experiment.instructions}</p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ── Lab Table ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            minHeight: 280,
          }}
        >
          {/* Table surface sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
            }}
          />

          {/* Lab label */}
          <div className="absolute top-3 left-4 flex items-center gap-2 opacity-50">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">⚗ Lab Bench</span>
          </div>

          <div className="relative z-10 p-6 pt-10 flex flex-col md:flex-row items-start md:items-center gap-8">

            {/* ── Ingredients shelf ── */}
            <div className="flex-1 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                🧪 Ingredients — drag into the beaker
              </p>

              {/* Shelf surface */}
              <div
                className="relative rounded-xl p-4 flex flex-wrap gap-5 items-end justify-start min-h-[120px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {/* Shelf edge line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 rounded-b-xl"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                />

                {availableIngredients.length === 0 ? (
                  <p className="text-slate-500 text-sm w-full text-center">
                    All ingredients added to the beaker!
                  </p>
                ) : (
                  availableIngredients.map((ingredient) => (
                    <DraggableIngredient key={ingredient.id} ingredient={ingredient} />
                  ))
                )}
              </div>
            </div>

            {/* ── Reaction beaker ── */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                🔬 Drop here
              </p>
              <ReactionBeaker
                droppedItems={droppedIngredients}
                isActive={!!activeIngredient}
                hasReaction={!!matchedCombo}
              />
            </div>
          </div>

          {/* Table front edge */}
          <div
            className="h-5 w-full"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeIngredient && (
            <DraggableIngredient ingredient={activeIngredient} isOverlay />
          )}
        </DragOverlay>
      </DndContext>

      {/* Reaction animation */}
      {matchedCombo && (
        <AnimationStage
          animationKey={matchedCombo.animationKey}
          resultLabel={matchedCombo.resultLabel}
        />
      )}

      {/* Reset */}
      {droppedItems.length > 0 && (
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
