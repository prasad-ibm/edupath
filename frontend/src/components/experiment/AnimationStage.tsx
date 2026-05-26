import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  animationKey: string | null;
  resultLabel: string | null;
}

// Animation configs keyed by animationKey from lesson JSON
const ANIMATIONS: Record<string, React.ReactNode> = {
  ice_melting: <IceMeltingAnimation />,
  bubbling_reaction: <BubblingAnimation />,
  circuit_lighting: <CircuitAnimation />,
  color_change: <ColorChangeAnimation />,
  mixing_liquids: <MixingAnimation />,
  default: <DefaultAnimation />,
};

export default function AnimationStage({ animationKey, resultLabel }: Props) {
  const animation = animationKey
    ? (ANIMATIONS[animationKey] ?? ANIMATIONS['default'])
    : null;

  return (
    <div className="w-full h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {animation ? (
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            {animation}
            {resultLabel && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-semibold text-slate-700 text-center px-4"
              >
                {resultLabel}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-2"
          >
            <p className="text-3xl">🧪</p>
            <p className="text-slate-400 text-sm">Drag ingredients here to start the experiment</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Individual Animation Components ────────────────────────────────────────

function IceMeltingAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-end justify-center">
      <motion.div
        className="absolute bg-blue-200 rounded-md"
        style={{ width: 40, height: 40, bottom: 20 }}
        animate={{ width: [40, 30, 15, 5], height: [40, 30, 15, 5], opacity: [1, 0.8, 0.5, 0] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 bg-blue-400 rounded-full"
        style={{ width: 60, height: 16 }}
        animate={{ width: [60, 65, 70], scaleX: [1, 1.05, 1.1] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
      />
      <span className="absolute top-0 text-2xl">🌡️</span>
    </div>
  );
}

function BubblingAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-end justify-center overflow-hidden">
      <div className="absolute bottom-0 w-16 h-14 bg-orange-200 rounded-b-xl rounded-t-sm" />
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full opacity-70"
          style={{ bottom: 10, left: 24 + i * 8 }}
          animate={{ y: [-5, -50], opacity: [0.7, 0], scale: [1, 1.5] }}
          transition={{ duration: 1, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
      <span className="absolute top-0 text-2xl">⚗️</span>
    </div>
  );
}

function CircuitAnimation() {
  return (
    <div className="relative w-28 h-20 flex items-center justify-center">
      <div className="w-24 h-16 border-4 border-slate-400 rounded-lg relative">
        <motion.div
          className="absolute inset-0 rounded"
          style={{ border: '4px solid transparent' }}
          animate={{ borderColor: ['#fbbf24', '#f59e0b', '#fbbf24'] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1 right-1 text-2xl"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          💡
        </motion.div>
        <div className="absolute bottom-1 left-1 text-lg">🔋</div>
      </div>
    </div>
  );
}

function ColorChangeAnimation() {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        className="w-12 h-16 rounded-b-full rounded-t-sm"
        animate={{ backgroundColor: ['#bfdbfe', '#fca5a5', '#86efac', '#fde68a'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <span className="text-2xl">🎨</span>
    </div>
  );
}

function MixingAnimation() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-blue-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ borderTopColor: 'transparent' }}
      />
      <span className="absolute text-2xl">🌀</span>
    </div>
  );
}

function DefaultAnimation() {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="text-4xl"
    >
      ✨
    </motion.div>
  );
}
