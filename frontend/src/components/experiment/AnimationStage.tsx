/**
 * AnimationStage — Realistic, looping reaction animations.
 * Each animationKey gets its own science-accurate visual sequence.
 */
import { motion } from 'framer-motion';

interface Props {
  animationKey: string;
  resultLabel: string;
}

export default function AnimationStage({ animationKey, resultLabel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        minHeight: 260,
      }}
    >
      {/* starfield */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{
            width: (i % 3) + 1, height: (i % 3) + 1,
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            opacity: 0.12 + (i % 4) * 0.06,
          }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8 min-h-[260px]">
        <ReactionVisual animationKey={animationKey} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center max-w-md"
        >
          <div className="inline-block px-4 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p className="text-white font-semibold text-sm leading-relaxed">{resultLabel}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ReactionVisual({ animationKey }: { animationKey: string }) {
  switch (animationKey) {
    case 'ice_melting':       return <IceMeltingReaction />;
    case 'bubbling_reaction': return <BubblingReaction />;
    case 'dissolving':        return <DissolvingReaction />;
    case 'not_dissolving':    return <NotDissolvingReaction />;
    case 'waterproof':        return <WaterproofReaction />;
    case 'melting':           return <MeltingReaction />;
    case 'color_change':      return <ColorChangeReaction />;
    case 'rolling':           return <RollingReaction />;
    case 'floating':          return <FloatingReaction />;
    case 'shadow':            return <ShadowReaction />;
    case 'vibrating':         return <VibratingReaction />;
    case 'magnetic':          return <MagneticReaction />;
    // legacy keys kept working
    case 'circuit':           return <MagneticReaction />;
    case 'mixing':            return <FloatingReaction />;
    case 'mixing_liquids':    return <ColorChangeReaction />;
    default:                  return <DefaultReaction />;
  }
}

// ─── ICE MELTING ─────────────────────────────────────────────────────────────
// Ice cube in warm water bowl → melts, water level rises, steam rises
function IceMeltingReaction() {
  return (
    <div className="relative" style={{ width: 220, height: 150 }}>
      {/* Bowl */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: 160, height: 90, overflow: 'hidden' }}>
        <svg viewBox="0 0 160 90" width="160" height="90">
          <path d="M5,30 Q5,85 80,85 Q155,85 155,30" fill="rgba(56,189,248,0.35)" />
          <path d="M5,30 Q5,85 80,85 Q155,85 155,30" fill="none" stroke="rgba(125,211,252,0.7)" strokeWidth="3" />
          <ellipse cx="80" cy="30" rx="75" ry="18" fill="rgba(186,230,253,0.35)" stroke="rgba(125,211,252,0.5)" strokeWidth="2" />
          {/* water surface ripple */}
          <motion.ellipse cx="80" cy="30" rx="55" ry="10"
            animate={{ ry: [8, 12, 8], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            fill="rgba(186,230,253,0.3)" />
        </svg>
      </div>

      {/* Ice cube shrinking */}
      <motion.div
        className="absolute rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%)',
          boxShadow: '0 0 20px rgba(125,211,252,0.7), inset 0 0 10px rgba(255,255,255,0.4)',
          bottom: 28, left: '50%',
        }}
        animate={{
          width: [68, 52, 36, 18, 4],
          height: [68, 52, 36, 18, 4],
          x: ['-50%', '-50%', '-50%', '-50%', '-50%'],
          opacity: [1, 0.95, 0.8, 0.5, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: 'easeIn' }}
      />

      {/* Melt drips */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 6, height: 8, background: 'rgba(147,197,253,0.8)', left: `${38 + i * 14}%` }}
          animate={{ y: [0, 28], opacity: [0.8, 0] }}
          transition={{ duration: 1.2, delay: i * 0.5, repeat: Infinity, repeatDelay: 0.8 }}
        />
      ))}

      {/* Steam */}
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 10 + i * 3, height: 10 + i * 3,
            background: 'rgba(186,230,253,0.4)',
            filter: 'blur(4px)',
            bottom: 80, left: `${28 + i * 14}%`,
          }}
          animate={{ y: [0, -50], opacity: [0.5, 0], scale: [1, 2.5] }}
          transition={{ duration: 2, delay: i * 0.45, repeat: Infinity }}
        />
      ))}

      {/* Thermometer */}
      <div className="absolute top-0 right-4 text-2xl select-none">🌡️</div>

      {/* Label */}
      <motion.div
        className="absolute -bottom-8 w-full text-center text-xs font-bold text-cyan-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Solid → Liquid ✓
      </motion.div>
    </div>
  );
}

// ─── BAKING SODA + VINEGAR ───────────────────────────────────────────────────
// Realistic fizzing eruption with foam overflow and CO₂ bubbles
function BubblingReaction() {
  return (
    <div className="relative" style={{ width: 200, height: 160 }}>
      {/* Glass container */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: 100, height: 120 }}>
        <svg viewBox="0 0 100 120" width="100" height="120">
          {/* container body */}
          <path d="M8,0 L92,0 L88,118 L12,118 Z"
            fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.5)" strokeWidth="2" />
          {/* liquid level (amber vinegar) */}
          <path d="M9,60 L91,60 L88,118 L12,118 Z" fill="rgba(251,191,36,0.45)" />
          {/* white reaction zone */}
          <motion.path d="M10,55 L90,55 L90,65 L10,65 Z"
            animate={{ fill: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)'] }}
            transition={{ duration: 0.8, repeat: Infinity }} />
          {/* reflection */}
          <line x1="12" y1="8" x2="14" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* CO₂ Bubbles streaming up */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 5 + (i % 4) * 3,
            height: 5 + (i % 4) * 3,
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(251,191,36,0.5)',
            bottom: 16 + (i % 3) * 12,
            left: `${30 + (i * 11) % 38}%`,
          }}
          animate={{ y: [0, -(80 + i * 8)], opacity: [0.9, 0], scale: [1, 1.6] }}
          transition={{ duration: 1.1 + i * 0.08, delay: i * 0.12, repeat: Infinity }}
        />
      ))}

      {/* FOAM OVERFLOW */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: 'rgba(255,255,255,0.85)',
          filter: 'blur(2px)',
          left: '50%', bottom: 120,
          x: '-50%',
        }}
        animate={{ width: [10, 90, 10], height: [4, 28, 4], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.1 }}
      />
      {/* foam drips over sides */}
      {[-1, 1].map(side => (
        <motion.div key={side}
          className="absolute"
          style={{
            width: 16, height: 30,
            background: 'rgba(255,255,255,0.7)',
            filter: 'blur(3px)',
            bottom: 98,
            left: side === -1 ? '24%' : '62%',
            borderRadius: '0 0 50% 50%',
          }}
          animate={{ height: [4, 30, 4], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.4, delay: 0.2, repeat: Infinity }}
        />
      ))}

      {/* CO₂ label */}
      <motion.div className="absolute top-0 left-0 text-xs font-bold text-yellow-300"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
        CO₂ ↑
      </motion.div>

      {/* bottom label */}
      <motion.div className="absolute -bottom-8 w-full text-center text-xs font-bold text-yellow-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Chemical Reaction! ⚡
      </motion.div>
    </div>
  );
}

// ─── DISSOLVING (sugar in water) ──────────────────────────────────────────────
function DissolvingReaction() {
  return (
    <div className="relative" style={{ width: 160, height: 150 }}>
      {/* Glass */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg viewBox="0 0 90 120" width="90" height="120">
          <path d="M8,0 L82,0 L75,118 L15,118 Z"
            fill="rgba(186,230,253,0.15)" stroke="rgba(125,211,252,0.5)" strokeWidth="2" />
          <path d="M9,30 L81,30 L75,118 L15,118 Z" fill="rgba(56,189,248,0.25)" />
          <line x1="12" y1="8" x2="14" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
          {/* water surface glimmer */}
          <motion.line x1="10" y1="30" x2="80" y2="30"
            stroke="rgba(255,255,255,0.5)" strokeWidth="2"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </svg>
      </div>

      {/* Sugar cube dissolving at bottom */}
      <motion.div
        className="absolute rounded"
        style={{
          background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
          boxShadow: '0 0 8px rgba(253,224,71,0.6)',
          bottom: 8, left: '50%',
        }}
        animate={{
          width: [42, 32, 20, 10, 2],
          height: [42, 32, 20, 10, 2],
          x: ['-50%', '-50%', '-50%', '-50%', '-50%'],
          opacity: [1, 0.85, 0.6, 0.3, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
      />

      {/* Sparkle particles as it dissolves */}
      {[0,1,2,3,4].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 5, height: 5,
            background: '#fde047',
            boxShadow: '0 0 6px rgba(253,224,71,0.8)',
            bottom: 8 + (i % 3) * 10,
            left: `${30 + i * 10}%`,
          }}
          animate={{ y: [0, -24], opacity: [0.9, 0], scale: [1, 0] }}
          transition={{ duration: 1.4, delay: 1.5 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* Swirl inside glass */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 50, height: 50,
          bottom: 14, left: '50%',
          border: '2px solid rgba(253,224,71,0.25)',
          x: '-50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div className="absolute -bottom-8 w-full text-center text-xs font-bold text-yellow-300"
        animate={{ opacity: [0, 1, 0] }} transition={{ delay: 3, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
        Dissolved ✓ Still there!
      </motion.div>
    </div>
  );
}

// ─── NOT DISSOLVING (sand in water) ───────────────────────────────────────────
function NotDissolvingReaction() {
  return (
    <div className="relative" style={{ width: 160, height: 150 }}>
      {/* Glass */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg viewBox="0 0 90 120" width="90" height="120">
          <path d="M8,0 L82,0 L75,118 L15,118 Z"
            fill="rgba(186,230,253,0.15)" stroke="rgba(125,211,252,0.5)" strokeWidth="2" />
          {/* clear water top */}
          <path d="M9,30 L81,30 L78,90 L12,90 Z" fill="rgba(56,189,248,0.2)" />
          {/* sand layer at bottom */}
          <motion.path d="M12,90 L78,90 L75,118 L15,118 Z"
            animate={{ fill: ['rgba(180,90,10,0.6)', 'rgba(180,90,10,0.75)', 'rgba(180,90,10,0.6)'] }}
            transition={{ duration: 3, repeat: Infinity }} />
          {/* layer divider */}
          <line x1="12" y1="90" x2="78" y2="90" stroke="rgba(253,230,138,0.4)" strokeWidth="1.5" />
          <line x1="12" y1="8" x2="14" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
          {/* water surface */}
          <motion.line x1="10" y1="30" x2="80" y2="30"
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }} />
        </svg>
      </div>

      {/* Sand particles falling */}
      {[0,1,2,3,4].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 5 + (i % 3), height: 5 + (i % 3),
            background: `rgba(${180 + i * 8},${90 + i * 4},10,0.8)`,
            left: `${28 + i * 10}%`,
          }}
          animate={{ y: [0, 80], opacity: [1, 0.5] }}
          transition={{ duration: 2, delay: i * 0.35, repeat: Infinity, repeatDelay: 0.5 }}
        />
      ))}

      {/* Labels */}
      <div className="absolute top-4 right-0 text-xs text-cyan-300 font-semibold">Water ↑</div>
      <div className="absolute bottom-8 right-0 text-xs text-amber-400 font-semibold">Sand ↓</div>
      <motion.div className="absolute -bottom-8 w-full text-center text-xs font-bold text-orange-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Stays Separate ✗
      </motion.div>
    </div>
  );
}

// ─── WATERPROOF vs ABSORBENT ──────────────────────────────────────────────────
function WaterproofReaction() {
  return (
    <div className="flex gap-8 items-end">
      {/* Raincoat side */}
      <div className="relative flex flex-col items-center gap-2" style={{ width: 90 }}>
        <div className="text-4xl select-none">🧥</div>
        {/* water drops falling */}
        {[0,1,2].map(i => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: 7, height: 10, background: 'rgba(96,165,250,0.85)', top: 12, left: `${20 + i * 28}%` }}
            animate={{ y: [0, 12, 24], opacity: [1, 0.8, 0], scaleX: [1, 1.3, 1.6] }}
            transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.5 }}
          />
        ))}
        {/* drops rolling off */}
        {[0,1].map(i => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: 7, height: 7, background: 'rgba(96,165,250,0.8)', top: 46, left: i === 0 ? '8%' : '74%' }}
            animate={{ y: [0, 30], x: [0, i === 0 ? -12 : 12], opacity: [0.9, 0] }}
            transition={{ duration: 0.9, delay: i * 0.4 + 0.8, repeat: Infinity, repeatDelay: 0.8 }}
          />
        ))}
        <div className="text-xs font-bold text-blue-300 mt-2">Raincoat</div>
        <div className="text-xs text-emerald-300 font-bold">Waterproof ✓</div>
        <div className="text-xs text-slate-400 text-center">water slides off</div>
      </div>

      {/* divider */}
      <div className="w-px h-24 bg-slate-600 self-center" />

      {/* Sponge side */}
      <div className="relative flex flex-col items-center gap-2" style={{ width: 90 }}>
        {/* sponge body growing (absorbing) */}
        <motion.div
          className="rounded-xl"
          style={{ background: '#fb923c', border: '2px solid #ea580c' }}
          animate={{ width: [60, 72, 60], height: [36, 44, 36] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* pores */}
          <svg viewBox="0 0 72 44" width="72" height="44" style={{ display: 'block' }}>
            {[[12,12],[24,12],[36,12],[48,12],[60,12],[18,28],[30,28],[42,28],[54,28]].map(([x,y],i) => (
              <ellipse key={i} cx={x} cy={y} rx="4" ry="4.5"
                fill="rgba(0,0,0,0.2)" />
            ))}
          </svg>
        </motion.div>

        {/* water drops hitting sponge */}
        {[0,1,2].map(i => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: 7, height: 10, background: 'rgba(96,165,250,0.85)', top: -10, left: `${20 + i * 28}%` }}
            animate={{ y: [0, 20], opacity: [1, 0] }}
            transition={{ duration: 0.6, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.8 }}
          />
        ))}

        {/* absorbed water showing in sponge */}
        <motion.div
          className="absolute rounded-xl"
          style={{ background: 'rgba(96,165,250,0.3)', inset: 0 }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <div className="text-xs font-bold text-orange-300 mt-2">Sponge</div>
        <div className="text-xs text-blue-300 font-bold">Absorbent ✓</div>
        <div className="text-xs text-slate-400 text-center">soaks it up</div>
      </div>
    </div>
  );
}

// ─── BUTTER MELTING ON PAN ────────────────────────────────────────────────────
function MeltingReaction() {
  return (
    <div className="relative" style={{ width: 200, height: 140 }}>
      {/* Pan */}
      <svg className="absolute bottom-0" viewBox="0 0 200 60" width="200" height="60">
        {/* heat glow */}
        <ellipse cx="90" cy="52" rx="75" ry="14" fill="#f97316" opacity="0.35" />
        <ellipse cx="90" cy="52" rx="55" ry="9" fill="#ef4444" opacity="0.3" />
        {/* pan body */}
        <ellipse cx="90" cy="44" rx="75" ry="18" fill="#475569" stroke="#64748b" strokeWidth="2.5" />
        <ellipse cx="90" cy="44" rx="65" ry="14" fill="#334155" />
        {/* handle */}
        <rect x="158" y="38" width="38" height="14" rx="7" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      </svg>

      {/* Butter block (original) morphing into puddle */}
      <motion.div
        className="absolute"
        style={{
          background: 'linear-gradient(135deg, #fef08a, #fde047)',
          boxShadow: '0 0 12px rgba(253,224,71,0.6)',
          borderRadius: 8,
          bottom: 26, left: '50%',
        }}
        animate={{
          width: [52, 42, 30, 18, 8],
          height: [32, 24, 16, 8, 4],
          x: ['-50%', '-50%', '-50%', '-50%', '-50%'],
          borderRadius: ['8px', '10px', '50%', '50%', '50%'],
        }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, ease: 'easeIn' }}
      />

      {/* Butter puddle spreading */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(253,224,71,0.8) 0%, rgba(253,224,71,0.2) 70%)',
          bottom: 28, left: '50%',
        }}
        animate={{ width: [4, 90, 4], height: [2, 12, 2], x: ['-50%', '-50%', '-50%'] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, ease: 'easeOut' }}
      />

      {/* Sizzle particles */}
      {[0,1,2,3,4].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, background: '#fde047', bottom: 34, left: `${28 + i * 10}%` }}
          animate={{ y: [0, -(10 + i * 4)], x: [0, (i % 2 === 0 ? 6 : -6)], opacity: [0.9, 0] }}
          transition={{ duration: 0.5, delay: 2 + i * 0.18, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* Steam */}
      {[0,1,2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 12, height: 12,
            background: 'rgba(253,224,71,0.25)',
            filter: 'blur(4px)',
            bottom: 58, left: `${32 + i * 16}%`,
          }}
          animate={{ y: [0, -42], opacity: [0.6, 0], scale: [1, 2.2] }}
          transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity }}
        />
      ))}

      <motion.div className="absolute -bottom-4 w-full text-center text-xs font-bold text-yellow-300"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
        Solid → Liquid (reversible) 🔥
      </motion.div>
    </div>
  );
}

// ─── COLOR CHANGE (pH indicator) ─────────────────────────────────────────────
function ColorChangeReaction() {
  return (
    <div className="relative" style={{ width: 220, height: 150 }}>
      {/* Beaker */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg viewBox="0 0 120 130" width="120" height="130">
          <path d="M12,0 L108,0 L102,128 L18,128 Z"
            fill="rgba(167,139,250,0.15)" stroke="rgba(147,51,234,0.5)" strokeWidth="2" />
          {/* liquid */}
          <motion.path d="M13,30 L107,30 L102,128 L18,128 Z"
            animate={{
              fill: ['rgba(124,58,237,0.75)', 'rgba(168,85,247,0.6)', 'rgba(236,72,153,0.7)', 'rgba(236,72,153,0.7)', 'rgba(244,114,182,0.75)'],
            }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.2, 0.5, 0.8, 1] }}
          />
          {/* swirl line */}
          <motion.path d="M25,65 Q60,50 95,65 Q60,80 25,65"
            fill="none"
            animate={{ stroke: ['rgba(196,181,253,0.6)', 'rgba(249,168,212,0.6)', 'rgba(196,181,253,0.6)'] }}
            strokeWidth="2"
            transition={{ duration: 3.5, repeat: Infinity }}
          />
          <line x1="14" y1="8" x2="16" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
          {/* beaker spout */}
          <path d="M90,0 Q106,0 108,10" fill="none" stroke="rgba(147,51,234,0.4)" strokeWidth="2" />
        </svg>
      </div>

      {/* Lemon drops falling in */}
      {[0,1,2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 8, height: 10, background: '#fde047', top: 0, left: `${38 + i * 12}%` }}
          animate={{ y: [0, 60], opacity: [1, 0] }}
          transition={{ duration: 1.2, delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}

      {/* Sparkles on color change */}
      {[0,1,2,3].map(i => (
        <motion.div key={i}
          className="absolute"
          style={{ fontSize: 12, bottom: 40 + (i % 2) * 24, left: `${22 + i * 18}%` }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 1.5 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
        >
          ✦
        </motion.div>
      ))}

      {/* Labels */}
      <motion.div className="absolute -bottom-6 w-full text-center text-xs font-bold"
        animate={{ color: ['#c4b5fd', '#f9a8d4', '#c4b5fd'] }}
        transition={{ duration: 3.5, repeat: Infinity }}>
        Purple → Pink = Acid! 🍋
      </motion.div>
    </div>
  );
}

// ─── ROLLING (ball on ramp) ───────────────────────────────────────────────────
function RollingReaction() {
  return (
    <div className="relative" style={{ width: 220, height: 140 }}>
      {/* Ramp */}
      <svg className="absolute bottom-0" viewBox="0 0 220 100" width="220" height="100">
        <polygon points="10,98 210,98 210,78 10,98" fill="#92400e" />
        <polygon points="10,98 150,18 210,78" fill="#d97706" />
        <line x1="10" y1="98" x2="150" y2="18" stroke="rgba(253,230,138,0.4)" strokeWidth="2" />
        {/* ground */}
        <line x1="0" y1="98" x2="220" y2="98" stroke="#475569" strokeWidth="3" />
      </svg>

      {/* Rolling ball */}
      <motion.div
        className="absolute"
        style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden' }}
        animate={{ x: [12, 170], y: [-90, -16] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, ease: 'easeIn' }}
      >
        {/* ball with rotating panels to show spin */}
        <motion.svg viewBox="0 0 32 32" width="32" height="32"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <circle cx="16" cy="16" r="15" fill="white" stroke="#1e293b" strokeWidth="1.5" />
          <polygon points="16,4 20,10 16,16 12,10" fill="#1e293b" />
          <polygon points="4,14 10,12 10,20 4,18" fill="#1e293b" />
          <polygon points="28,14 22,12 22,20 28,18" fill="#1e293b" />
        </motion.svg>
      </motion.div>

      {/* Speed lines */}
      <motion.div className="absolute"
        animate={{ opacity: [0, 0.6, 0], x: [120, 180], y: [-35, -20] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}>
        <svg width="30" height="10"><line x1="0" y1="5" x2="28" y2="3" stroke="#fde047" strokeWidth="2" strokeDasharray="4,3" /></svg>
      </motion.div>

      <motion.div className="absolute -bottom-2 w-full text-center text-xs font-bold text-amber-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Gravity + Force = Motion! ↘
      </motion.div>
    </div>
  );
}

// ─── FLOATING (rubber duck) ───────────────────────────────────────────────────
function FloatingReaction() {
  return (
    <div className="relative" style={{ width: 200, height: 140 }}>
      {/* Water surface */}
      <svg className="absolute bottom-0" viewBox="0 0 200 80" width="200" height="80">
        {/* water body */}
        <rect x="0" y="28" width="200" height="52" fill="rgba(56,189,248,0.4)" />
        {/* surface wave */}
        <motion.path d="M0,28 Q25,18 50,28 Q75,38 100,28 Q125,18 150,28 Q175,38 200,28 L200,0 L0,0 Z"
          fill="rgba(56,189,248,0.25)"
          animate={{ d: [
            'M0,28 Q25,18 50,28 Q75,38 100,28 Q125,18 150,28 Q175,38 200,28 L200,0 L0,0 Z',
            'M0,28 Q25,38 50,28 Q75,18 100,28 Q125,38 150,28 Q175,18 200,28 L200,0 L0,0 Z',
            'M0,28 Q25,18 50,28 Q75,38 100,28 Q125,18 150,28 Q175,38 200,28 L200,0 L0,0 Z',
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* sparkle on surface */}
        {[30,80,130,170].map((x,i) => (
          <motion.circle key={i} cx={x} cy="28" r="2"
            fill="rgba(255,255,255,0.6)"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }} />
        ))}
      </svg>

      {/* Duck floating + bobbing */}
      <motion.div
        className="absolute text-5xl select-none"
        style={{ bottom: 38, left: '50%', x: '-50%' }}
        animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🦆
      </motion.div>

      {/* Upward buoyancy arrow */}
      <motion.div className="absolute text-indigo-300 text-xl font-bold"
        style={{ bottom: 40, right: 30 }}
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}>
        ↑
      </motion.div>
      <div className="absolute bottom-32 right-24 text-xs text-indigo-300 font-semibold">Buoyancy</div>

      <motion.div className="absolute -bottom-2 w-full text-center text-xs font-bold text-cyan-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Less dense than water → Floats! 🚢
      </motion.div>
    </div>
  );
}

// ─── SHADOW (flashlight + block) ─────────────────────────────────────────────
function ShadowReaction() {
  return (
    <div className="relative flex items-center gap-4" style={{ width: 280, height: 120 }}>
      {/* Flashlight */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-4xl select-none">🔦</div>
        <div className="text-xs text-yellow-300 font-semibold">Light source</div>
      </div>

      {/* Light beam */}
      <div className="relative flex-1">
        <motion.div
          className="absolute"
          style={{ top: -15, left: 0, right: 0 }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <svg viewBox="0 0 120 60" width="120" height="60">
            <path d="M0,30 L80,10 L80,50 Z" fill="rgba(254,240,138,0.35)" />
            <path d="M0,30 L80,10 L80,50 Z" fill="none" stroke="rgba(253,224,71,0.3)" strokeWidth="1" />
            {/* light rays */}
            {[15,30,45].map(y => (
              <motion.line key={y} x1="4" y1="30" x2="76" y2={y}
                stroke="rgba(253,224,71,0.2)" strokeWidth="1.5"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, delay: y * 0.02, repeat: Infinity }} />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Block */}
      <div className="flex flex-col items-center gap-1 z-10">
        <div className="text-4xl select-none">🧱</div>
        <div className="text-xs text-orange-300 font-semibold">Opaque block</div>
      </div>

      {/* Shadow */}
      <div className="flex flex-col items-center gap-1">
        <motion.div
          className="rounded-md"
          style={{ background: 'rgba(0,0,0,0.7)', width: 32, height: 60 }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <div className="text-xs text-slate-400 font-semibold">Shadow</div>
      </div>

      {/* Label */}
      <motion.div className="absolute -bottom-6 w-full text-center text-xs font-bold text-yellow-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Light travels in straight lines! →
      </motion.div>
    </div>
  );
}

// ─── VIBRATING (rubber band + box) ───────────────────────────────────────────
function VibratingReaction() {
  return (
    <div className="relative" style={{ width: 220, height: 130 }}>
      {/* Box */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg viewBox="0 0 120 80" width="120" height="80">
          <rect x="10" y="10" width="100" height="68" rx="6" fill="#92400e" />
          <rect x="10" y="10" width="100" height="68" rx="6" fill="none" stroke="#d97706" strokeWidth="2" />
          <line x1="10" y1="22" x2="110" y2="22" stroke="#ca8a04" strokeWidth="1.5" />
          {/* rubber band stretched across */}
          <motion.path d="M10,44 Q60,38 110,44"
            fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round"
            animate={{ d: [
              'M10,44 Q60,28 110,44',
              'M10,44 Q60,60 110,44',
              'M10,44 Q60,44 110,44',
              'M10,44 Q60,28 110,44',
            ]}}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {/* Sound waves radiating out */}
      {[1,2,3].map(i => (
        <motion.div key={i}
          className="absolute rounded-full border-2 border-indigo-400"
          style={{ left: '50%', top: '30%' }}
          animate={{
            width: [20, 80 + i * 30],
            height: [20, 80 + i * 30],
            x: ['-50%', '-50%'],
            y: ['-50%', '-50%'],
            opacity: [0.7, 0],
          }}
          transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* Musical notes */}
      {['♪','♫','♩'].map((note, i) => (
        <motion.div key={i}
          className="absolute text-xl text-indigo-300"
          style={{ bottom: 70 + i * 10, left: `${20 + i * 28}%` }}
          animate={{ y: [0, -30], opacity: [0.9, 0] }}
          transition={{ duration: 1.4, delay: i * 0.5, repeat: Infinity }}
        >
          {note}
        </motion.div>
      ))}

      <motion.div className="absolute -bottom-2 w-full text-center text-xs font-bold text-indigo-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Vibration → Sound Waves 🎵
      </motion.div>
    </div>
  );
}

// ─── MAGNETIC ATTRACTION ──────────────────────────────────────────────────────
function MagneticReaction() {
  return (
    <div className="relative flex items-center gap-2" style={{ width: 280, height: 120 }}>
      {/* Magnet */}
      <div className="flex flex-col items-center gap-1">
        <svg viewBox="0 0 64 40" width="64" height="40">
          <rect x="0" y="8" width="30" height="26" rx="4" fill="#ef4444" />
          <rect x="34" y="8" width="30" height="26" rx="4" fill="#3b82f6" />
          <text x="10" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="white">N</text>
          <text x="42" y="27" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="white">S</text>
        </svg>
        <div className="text-xs text-slate-400">Magnet</div>
      </div>

      {/* Field lines */}
      <div className="relative flex-1 h-20">
        {[0,1,2].map(i => (
          <motion.div key={i}
            className="absolute"
            style={{ top: `${20 + i * 16}%`, left: 0, right: 0 }}
          >
            <motion.svg viewBox="0 0 80 8" width="80" height="8"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}>
              <path d="M0,4 Q40,0 80,4" fill="none"
                stroke={i % 2 === 0 ? 'rgba(239,68,68,0.6)' : 'rgba(59,130,246,0.6)'}
                strokeWidth="1.5" strokeDasharray="4,3" />
            </motion.svg>
          </motion.div>
        ))}
      </div>

      {/* Nail being attracted */}
      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ x: [30, 4, 30] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 16 60" width="16" height="60">
          <ellipse cx="8" cy="8" rx="8" ry="5" fill="url(#silver-h)" stroke="#64748b" strokeWidth="1" />
          <rect x="5" y="8" width="6" height="46" rx="3" fill="#94a3b8" />
          <path d="M5,54 Q8,62 11,54 Z" fill="#94a3b8" />
        </svg>
        <div className="text-xs text-slate-400">Iron nail</div>
      </motion.div>

      {/* Spark on contact */}
      <motion.div className="absolute text-yellow-300 text-2xl"
        style={{ right: 40, top: '30%' }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, delay: 1.2, repeat: Infinity, repeatDelay: 2 }}>
        ⚡
      </motion.div>

      <motion.div className="absolute -bottom-4 w-full text-center text-xs font-bold text-blue-300"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Magnetic force attracts iron! 🧲
      </motion.div>
    </div>
  );
}

// ─── DEFAULT ──────────────────────────────────────────────────────────────────
function DefaultReaction() {
  return (
    <motion.div className="flex items-center gap-4"
      animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}>
      <span className="text-5xl">✨</span>
      <span className="text-5xl">⚗️</span>
      <span className="text-5xl">✨</span>
    </motion.div>
  );
}
