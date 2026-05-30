import { motion } from 'framer-motion';

interface Props {
  animationKey: string;
  resultLabel: string;
}

export default function AnimationStage({ animationKey, resultLabel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        minHeight: 240,
      }}
    >
      {/* Stars background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8 min-h-[240px]">
        {/* Reaction visual */}
        <ReactionVisual animationKey={animationKey} />

        {/* Result label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center max-w-sm"
        >
          <p className="text-white font-semibold text-base leading-relaxed">{resultLabel}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ReactionVisual({ animationKey }: { animationKey: string }) {
  switch (animationKey) {
    case 'ice_melting':       return <IceMeltingVisual />;
    case 'bubbling_reaction': return <BubblingVisual />;
    case 'dissolving':        return <DissolvingVisual />;
    case 'not_dissolving':    return <NotDissolvingVisual />;
    case 'circuit_lighting':  return <CircuitVisual />;
    case 'color_change':      return <ColorChangeVisual />;
    case 'mixing_liquids':    return <MixingVisual />;
    default:                  return <DefaultVisual />;
  }
}

// ─── Ice Melting ─────────────────────────────────────────────────────────────
function IceMeltingVisual() {
  return (
    <div className="relative flex items-end justify-center" style={{ width: 160, height: 120 }}>
      {/* Water puddle */}
      <motion.div
        className="absolute bottom-0 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(96,165,250,0.7) 0%, rgba(59,130,246,0.3) 70%)' }}
        animate={{ width: [40, 120, 140], height: [10, 28, 32] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      {/* Ice cube shrinking */}
      <motion.div
        className="absolute rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)',
          boxShadow: '0 0 20px rgba(125,211,252,0.6), inset 0 0 10px rgba(255,255,255,0.4)',
          bottom: 16,
        }}
        animate={{ width: [70, 50, 30, 10], height: [70, 50, 30, 10], opacity: [1, 0.9, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      {/* Steam particles */}
      {[0,1,2].map(i => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full"
          style={{ background: 'rgba(186,230,253,0.5)', bottom: 50, left: 50 + i * 20 }}
          animate={{ y: [0, -40], opacity: [0.5, 0], scale: [1, 2] }}
          transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      {/* Thermometer */}
      <motion.div className="absolute top-0 right-4 text-3xl"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}>
        🌡️
      </motion.div>
    </div>
  );
}

// ─── Bubbling Reaction ────────────────────────────────────────────────────────
function BubblingVisual() {
  return (
    <div className="relative flex items-end justify-center" style={{ width: 160, height: 120 }}>
      {/* Flask */}
      <div className="absolute bottom-0" style={{ width: 90, height: 80 }}>
        <motion.div
          className="absolute inset-0 rounded-b-2xl rounded-t-sm"
          style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.3) 0%, rgba(234,88,12,0.5) 100%)' }}
          animate={{ background: [
            'linear-gradient(180deg, rgba(251,191,36,0.3) 0%, rgba(234,88,12,0.5) 100%)',
            'linear-gradient(180deg, rgba(249,115,22,0.5) 0%, rgba(239,68,68,0.6) 100%)',
            'linear-gradient(180deg, rgba(251,191,36,0.3) 0%, rgba(234,88,12,0.5) 100%)',
          ]}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="absolute inset-0 rounded-b-2xl rounded-t-sm"
          style={{ border: '2px solid rgba(251,191,36,0.4)' }} />
      </div>
      {/* Foam overflow */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: 'rgba(255,255,255,0.8)', bottom: 72, left: 20, right: 20 }}
        animate={{ height: [0, 30, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Bubbles */}
      {[0,1,2,3,4,5].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 8 + (i % 3) * 5,
            height: 8 + (i % 3) * 5,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(251,191,36,0.4)',
            left: 20 + (i * 14) % 60,
            bottom: 20,
          }}
          animate={{ y: [0, -(70 + i * 10)], opacity: [0.8, 0], scale: [1, 1.5] }}
          transition={{ duration: 1 + i * 0.1, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
      <span className="absolute top-0 left-0 text-3xl">⚗️</span>
    </div>
  );
}

// ─── Dissolving ───────────────────────────────────────────────────────────────
function DissolvingVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 120 }}>
      {/* Glass of water */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: 80, height: 90, border: '2px solid rgba(125,211,252,0.5)',
          borderRadius: '4px 4px 12px 12px',
          background: 'linear-gradient(180deg, rgba(186,230,253,0.2) 0%, rgba(96,165,250,0.3) 100%)' }}>
        {/* Swirl */}
        <motion.div className="absolute inset-2 rounded-full"
          style={{ border: '2px solid rgba(255,255,255,0.2)' }}
          animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      </div>
      {/* Sugar cube dissolving */}
      <motion.div className="absolute"
        style={{ top: 10, background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
          border: '1px solid rgba(245,158,11,0.5)', borderRadius: 6 }}
        animate={{ width: [40, 25, 10, 2], height: [40, 25, 10, 2], opacity: [1, 0.7, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.p className="absolute bottom-2 text-xs font-bold text-yellow-300"
        animate={{ opacity: [0, 1, 0] }} transition={{ delay: 2, duration: 1.5, repeat: Infinity }}>
        dissolved! ✓
      </motion.p>
      <span className="absolute top-0 right-0 text-2xl">💧</span>
    </div>
  );
}

// ─── Not Dissolving ───────────────────────────────────────────────────────────
function NotDissolvingVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 120 }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: 80, height: 90, border: '2px solid rgba(125,211,252,0.5)',
          borderRadius: '4px 4px 12px 12px',
          background: 'linear-gradient(180deg, rgba(186,230,253,0.2) 0%, rgba(96,165,250,0.2) 100%)' }}>
        {/* Sand settling */}
        <motion.div className="absolute bottom-0 left-0 right-0 rounded-b-xl"
          style={{ background: 'linear-gradient(180deg, rgba(217,119,6,0.3), rgba(217,119,6,0.8))' }}
          animate={{ height: [0, 25] }} transition={{ duration: 2, ease: 'easeOut' }}
        />
      </div>
      {/* Sand particles falling */}
      {[0,1,2,3].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 6, height: 6, background: 'rgba(217,119,6,0.7)', left: 55 + i * 10 }}
          animate={{ y: [0, 60], opacity: [1, 0.3] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
      <motion.p className="absolute top-2 text-xs font-bold text-orange-300 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        stays separate
      </motion.p>
      <span className="absolute top-0 right-0 text-2xl">🏖️</span>
    </div>
  );
}

// ─── Circuit Lighting ─────────────────────────────────────────────────────────
function CircuitVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 100 }}>
      <div className="w-28 h-16 rounded-xl relative"
        style={{ border: '2px solid rgba(251,191,36,0.4)', background: 'rgba(30,27,75,0.5)' }}>
        <motion.div className="absolute inset-0 rounded-xl"
          animate={{ boxShadow: ['0 0 10px rgba(251,191,36,0.3)', '0 0 30px rgba(251,191,36,0.8)', '0 0 10px rgba(251,191,36,0.3)'] }}
          transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.div className="absolute top-2 right-2 text-3xl"
          animate={{ opacity: [0.2, 1, 0.2], filter: ['brightness(0.5)', 'brightness(2)', 'brightness(0.5)'] }}
          transition={{ duration: 0.8, repeat: Infinity }}>💡</motion.div>
        <div className="absolute bottom-2 left-2 text-xl">🔋</div>
        {[0,1,2].map(i => (
          <motion.div key={i} className="absolute top-0 left-0 w-full h-full rounded-xl"
            style={{ border: '2px solid rgba(251,191,36,0.6)', opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }} />
        ))}
      </div>
    </div>
  );
}

// ─── Color Change ─────────────────────────────────────────────────────────────
function ColorChangeVisual() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-14 rounded-b-full" style={{ background: '#fca5a5', border: '2px solid rgba(239,68,68,0.4)' }} />
        <span className="text-xs text-red-300">Red</span>
      </div>
      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
        <span className="text-2xl text-white">+</span>
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-14 rounded-b-full" style={{ background: '#93c5fd', border: '2px solid rgba(59,130,246,0.4)' }} />
        <span className="text-xs text-blue-300">Blue</span>
      </div>
      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}>
        <span className="text-2xl text-white">=</span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-1">
        <motion.div className="w-14 h-14 rounded-b-full"
          animate={{ background: ['rgba(147,51,234,0.3)', 'rgba(168,85,247,0.8)', 'rgba(147,51,234,0.3)'],
            boxShadow: ['0 0 10px rgba(168,85,247,0.3)', '0 0 30px rgba(168,85,247,0.8)', '0 0 10px rgba(168,85,247,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ border: '2px solid rgba(168,85,247,0.6)' }}
        />
        <span className="text-xs text-purple-300 font-bold">Purple! 🎉</span>
      </motion.div>
    </div>
  );
}

// ─── Mixing Liquids ───────────────────────────────────────────────────────────
function MixingVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 100 }}>
      <motion.div className="w-20 h-20 rounded-full"
        animate={{ background: [
          'conic-gradient(rgba(59,130,246,0.6) 0%, rgba(16,185,129,0.6) 50%, rgba(59,130,246,0.6) 100%)',
          'conic-gradient(rgba(16,185,129,0.6) 0%, rgba(59,130,246,0.6) 50%, rgba(16,185,129,0.6) 100%)',
        ], rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
      />
      <span className="absolute text-2xl">🌀</span>
    </div>
  );
}

// ─── Default ──────────────────────────────────────────────────────────────────
function DefaultVisual() {
  return (
    <motion.div className="flex items-center gap-3"
      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <span className="text-5xl">✨</span>
      <span className="text-5xl">🧪</span>
      <span className="text-5xl">✨</span>
    </motion.div>
  );
}
