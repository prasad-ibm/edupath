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
import DropZone from './DropZone';
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

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
        <span className="text-blue-500 text-lg flex-shrink-0">📋</span>
        <p className="text-blue-800 text-sm font-medium">{experiment.instructions}</p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ingredient tray */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              🧪 Ingredients
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 min-h-[100px] flex flex-wrap gap-3">
              {availableIngredients.length === 0 ? (
                <p className="text-slate-400 text-sm w-full text-center pt-2">
                  All ingredients added!
                </p>
              ) : (
                availableIngredients.map((ingredient) => (
                  <DraggableIngredient key={ingredient.id} ingredient={ingredient} />
                ))
              )}
            </div>
          </div>

          {/* Drop zone + Animation stage */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              🔬 Experiment Area
            </h4>
            <DropZone droppedItems={droppedItems} ingredients={experiment.ingredients} />
          </div>
        </div>

        {/* Drag overlay for smooth visual */}
        <DragOverlay>
          {activeIngredient && (
            <div className="bg-white border-2 border-blue-400 rounded-xl px-4 py-3 shadow-xl opacity-90 flex items-center gap-2">
              <span className="text-2xl">{activeIngredient.label.slice(0, 2)}</span>
              <span className="font-medium text-sm text-slate-700">{activeIngredient.label}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Animation result */}
      <AnimationStage
        animationKey={matchedCombo?.animationKey ?? null}
        resultLabel={matchedCombo?.resultLabel ?? null}
      />

      {/* Reset button */}
      {droppedItems.length > 0 && (
        <button
          onClick={handleReset}
          className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
        >
          ↺ Reset experiment
        </button>
      )}
    </div>
  );
}
