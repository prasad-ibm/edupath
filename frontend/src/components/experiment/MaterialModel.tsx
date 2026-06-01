/**
 * MaterialModel — CSS/SVG 3D-looking models for every experiment ingredient.
 * Each model uses gradients, shading and perspective tricks to look like the
 * real physical object.  Wrapped in a gentle float animation by default.
 */
import { motion } from 'framer-motion';

interface Props {
  id: string;
  /** Rendered width in px (height = 1.2× width) */
  size?: number;
  /** Skip the idle float – useful inside DragOverlay */
  noFloat?: boolean;
}

const floatVariants = {
  animate: { y: [0, -5, 0] },
};
const floatTransition = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };

export default function MaterialModel({ id, size = 88, noFloat = false }: Props) {
  const w = size;
  const h = Math.round(size * 1.25);

  const inner = (
    <svg viewBox="0 0 100 125" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* ── shared gradients ── */}
        <radialGradient id="water-fill" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id="glass-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0.08)" />
        </linearGradient>
        <linearGradient id="silver-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <ModelContent id={id} />
    </svg>
  );

  if (noFloat) return <div style={{ width: w, height: h }}>{inner}</div>;

  return (
    <motion.div
      style={{ width: w, height: h }}
      variants={floatVariants}
      animate="animate"
      transition={floatTransition}
    >
      {inner}
    </motion.div>
  );
}

// ─── dispatch ─────────────────────────────────────────────────────────────────
function ModelContent({ id }: { id: string }) {
  switch (id) {
    case 'ice_cube':       return <IceCube />;
    case 'warm_water':     return <WarmWater />;
    case 'water_glass':    return <WaterGlass />;
    case 'sugar_cube':     return <SugarCube />;
    case 'sand':           return <Sand />;
    case 'baking_soda':    return <BakingSoda />;
    case 'vinegar':        return <Vinegar />;
    case 'oil':            return <Oil />;
    case 'raincoat':       return <Raincoat />;
    case 'sponge':         return <Sponge />;
    case 'butter':         return <Butter />;
    case 'hot_pan':        return <HotPan />;
    case 'cabbage_juice':  return <CabbageJuice />;
    case 'lemon_juice':    return <LemonJuice />;
    case 'ball':           return <Ball />;
    case 'ramp':
    case 'ramp_board':     return <Ramp />;
    case 'rubber_duck':    return <RubberDuck />;
    case 'water_tank':     return <WaterTank />;
    case 'flashlight':     return <Flashlight />;
    case 'toy_block':      return <ToyBlock />;
    case 'magnet':         return <Magnet />;
    case 'iron_nail':      return <IronNail />;
    case 'rubber_band':    return <RubberBandModel />;
    case 'box':
    case 'heavy_box':      return <BoxModel />;
    default:               return <DefaultModel />;
  }
}

// ─── ICE CUBE (isometric) ──────────────────────────────────────────────────────
function IceCube() {
  return (
    <g>
      {/* shadow */}
      <ellipse cx="50" cy="118" rx="32" ry="6" fill="rgba(0,0,0,0.18)" />
      {/* right face – darkest */}
      <polygon points="62,32 90,47 90,87 62,72" fill="#38bdf8" opacity="0.75" />
      {/* front face */}
      <polygon points="10,47 62,72 62,32 10,7" fill="#bae6fd" opacity="0.85" />
      {/* top face – lightest */}
      <polygon points="10,7 62,32 90,17 38,-8" fill="#e0f2fe" opacity="0.95" />
      {/* edge outlines */}
      <polygon points="10,7 62,32 90,17 38,-8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <polygon points="10,7 62,32 62,72 10,47" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <polygon points="62,32 90,17 90,57 62,72" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
      {/* shine on top */}
      <ellipse cx="38" cy="14" rx="14" ry="7" fill="rgba(255,255,255,0.45)" transform="rotate(-25 38 14)" />
      {/* sparkle */}
      <line x1="22" y1="58" x2="22" y2="64" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="19" y1="61" x2="25" y2="61" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="42" y1="36" x2="42" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="38" x2="44" y2="38" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

// ─── WARM WATER BOWL ──────────────────────────────────────────────────────────
function WarmWater() {
  return (
    <g>
      {/* shadow */}
      <ellipse cx="50" cy="118" rx="35" ry="6" fill="rgba(0,0,0,0.18)" />
      {/* bowl body */}
      <path d="M14,55 Q14,100 50,100 Q86,100 86,55" fill="url(#water-fill)" />
      <path d="M14,55 Q14,100 50,100 Q86,100 86,55" fill="none" stroke="rgba(125,211,252,0.7)" strokeWidth="2.5" />
      {/* bowl rim */}
      <ellipse cx="50" cy="55" rx="36" ry="10" fill="rgba(186,230,253,0.5)" stroke="rgba(125,211,252,0.8)" strokeWidth="2" />
      {/* water surface glint */}
      <ellipse cx="43" cy="55" rx="18" ry="4" fill="rgba(255,255,255,0.3)" />
      {/* steam wisps */}
      <path d="M34,48 Q31,40 34,32 Q37,24 34,16" fill="none" stroke="rgba(186,230,253,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50,44 Q47,36 50,28 Q53,20 50,12" fill="none" stroke="rgba(186,230,253,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66,48 Q63,40 66,32 Q69,24 66,16" fill="none" stroke="rgba(186,230,253,0.55)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// ─── WATER GLASS ──────────────────────────────────────────────────────────────
function WaterGlass() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="28" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* glass body (trapezoid – wider at top) */}
      <path d="M28,22 L72,22 L65,105 L35,105 Z" fill="url(#glass-body)" stroke="rgba(125,211,252,0.5)" strokeWidth="1.5" />
      {/* water fill */}
      <path d="M29,52 L71,52 L65,105 L35,105 Z" fill="url(#water-fill)" opacity="0.85" />
      {/* water surface */}
      <line x1="30" y1="52" x2="70" y2="52" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      {/* top rim */}
      <ellipse cx="50" cy="22" rx="22" ry="6" fill="rgba(186,230,253,0.3)" stroke="rgba(186,230,253,0.6)" strokeWidth="1.5" />
      {/* glass left reflection */}
      <path d="M31,30 L34,100" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      {/* bubble */}
      <circle cx="44" cy="72" r="3.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <circle cx="57" cy="85" r="2.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
    </g>
  );
}

// ─── SUGAR CUBE ───────────────────────────────────────────────────────────────
function SugarCube() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />
      {/* right face */}
      <polygon points="64,38 84,50 84,82 64,70" fill="#fef9c3" />
      {/* front face */}
      <polygon points="16,50 64,70 64,38 16,18" fill="#fef3c7" />
      {/* top face */}
      <polygon points="16,18 64,38 84,26 36,6" fill="#fefce8" />
      {/* grid lines – front */}
      <line x1="16" y1="34" x2="64" y2="54" stroke="rgba(180,150,60,0.3)" strokeWidth="0.8" />
      <line x1="40" y1="18" x2="40" y2="70" stroke="rgba(180,150,60,0.3)" strokeWidth="0.8" />
      {/* grid lines – top */}
      <line x1="50" y1="6" x2="70" y2="32" stroke="rgba(180,150,60,0.2)" strokeWidth="0.8" />
      {/* shine */}
      <ellipse cx="36" cy="18" rx="10" ry="5" fill="rgba(255,255,255,0.5)" transform="rotate(-20 36 18)" />
      {/* sparkle */}
      <circle cx="72" cy="40" r="2.5" fill="white" opacity="0.7" />
    </g>
  );
}

// ─── SAND ─────────────────────────────────────────────────────────────────────
function Sand() {
  return (
    <g>
      {/* pile silhouette */}
      <path d="M10,105 Q20,60 50,52 Q80,60 90,105 Z" fill="#d97706" opacity="0.9" />
      <path d="M10,105 Q20,60 50,52 Q80,60 90,105 Z" fill="url(#sand-grad)" />
      {/* highlight ridge */}
      <path d="M30,82 Q50,68 70,82" fill="none" stroke="rgba(253,230,138,0.7)" strokeWidth="2.5" strokeLinecap="round" />
      {/* texture dots */}
      {[[22,96],[35,88],[48,75],[63,88],[75,96],[55,98],[40,102]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(180,90,10,0.4)" />
      ))}
      <defs>
        <linearGradient id="sand-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  );
}

// ─── BAKING SODA BOX ──────────────────────────────────────────────────────────
function BakingSoda() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="30" ry="5" fill="rgba(0,0,0,0.15)" />
      {/* box right side */}
      <rect x="68" y="25" width="18" height="80" rx="2" fill="#cbd5e1" />
      {/* box front */}
      <rect x="18" y="20" width="50" height="85" rx="3" fill="#f1f5f9" />
      {/* orange label band */}
      <rect x="18" y="48" width="50" height="26" fill="#f97316" />
      <text x="43" y="66" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7" fill="white">BAKING</text>
      <text x="43" y="75" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="6" fill="white">SODA</text>
      {/* top of box */}
      <path d="M18,20 L68,20 L86,8 L36,8 Z" fill="#e2e8f0" />
      {/* white powder spill at base */}
      <ellipse cx="45" cy="107" rx="20" ry="4" fill="rgba(255,255,255,0.6)" />
    </g>
  );
}

// ─── VINEGAR BOTTLE ───────────────────────────────────────────────────────────
function Vinegar() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="25" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* bottle body */}
      <path d="M30,45 Q28,108 50,108 Q72,108 70,45 Z" fill="#d9f99d" opacity="0.85" />
      <path d="M30,45 Q28,108 50,108 Q72,108 70,45 Z" fill="none" stroke="rgba(132,204,22,0.6)" strokeWidth="2" />
      {/* liquid fill (amber) */}
      <path d="M31,70 Q30,108 50,108 Q70,108 69,70 Z" fill="#fef08a" opacity="0.75" />
      {/* shoulder */}
      <path d="M32,45 Q35,38 42,34 L58,34 Q65,38 68,45 Z" fill="#bbf7d0" />
      {/* neck */}
      <rect x="42" y="18" width="16" height="18" rx="4" fill="#bbf7d0" stroke="rgba(132,204,22,0.5)" strokeWidth="1.5" />
      {/* cap */}
      <rect x="40" y="12" width="20" height="9" rx="3" fill="#16a34a" />
      {/* label */}
      <rect x="33" y="72" width="34" height="20" rx="3" fill="white" opacity="0.8" />
      <text x="50" y="83" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="6" fill="#166534" fontWeight="bold">VINEGAR</text>
      {/* reflection */}
      <path d="M33,52 Q32,88 34,95" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── OIL BOTTLE ───────────────────────────────────────────────────────────────
function Oil() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="25" ry="5" fill="rgba(0,0,0,0.18)" />
      <path d="M30,45 Q28,108 50,108 Q72,108 70,45 Z" fill="#fef08a" opacity="0.9" />
      <path d="M32,65 Q30,108 50,108 Q70,108 68,65 Z" fill="#fde047" opacity="0.75" />
      <path d="M32,45 Q35,38 42,34 L58,34 Q65,38 68,45 Z" fill="#fef9c3" />
      <rect x="42" y="18" width="16" height="18" rx="4" fill="#fef9c3" stroke="rgba(234,179,8,0.5)" strokeWidth="1.5" />
      <rect x="40" y="12" width="20" height="9" rx="3" fill="#ca8a04" />
      <rect x="33" y="68" width="34" height="16" rx="3" fill="white" opacity="0.8" />
      <text x="50" y="79" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7" fill="#854d0e" fontWeight="bold">OIL</text>
      <path d="M33,52 Q32,88 34,95" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── RAINCOAT ─────────────────────────────────────────────────────────────────
function Raincoat() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="32" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* body */}
      <path d="M20,50 L28,35 Q35,22 50,20 Q65,22 72,35 L80,50 L74,60 Q66,56 60,62 L60,108 L40,108 L40,62 Q34,56 26,60 Z" fill="#3b82f6" />
      {/* collar */}
      <path d="M38,20 Q42,15 50,14 Q58,15 62,20 L60,28 Q53,24 50,24 Q47,24 40,28 Z" fill="#1d4ed8" />
      {/* hood */}
      <path d="M36,20 Q30,10 32,4 Q40,-2 50,0 Q60,-2 68,4 Q70,10 64,20" fill="#2563eb" />
      {/* button/snap row */}
      {[35,45,55,65,75,85,95].map((y,i) => (
        <circle key={i} cx="50" cy={y} r="2.5" fill="#1e40af" />
      ))}
      {/* shiny highlight on left arm */}
      <path d="M26,54 Q24,62 26,72" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* water droplets beading on coat */}
      <ellipse cx="35" cy="80" rx="4" ry="5" fill="rgba(147,197,253,0.8)" />
      <ellipse cx="65" cy="75" rx="3" ry="4" fill="rgba(147,197,253,0.75)" />
      <ellipse cx="55" cy="92" rx="3" ry="4" fill="rgba(147,197,253,0.7)" />
    </g>
  );
}

// ─── SPONGE ───────────────────────────────────────────────────────────────────
function Sponge() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="6" fill="rgba(0,0,0,0.18)" />
      {/* main block */}
      <rect x="8" y="38" width="84" height="72" rx="10" fill="#fb923c" />
      {/* top face (3d look) */}
      <path d="M8,38 Q12,24 50,24 Q88,24 92,38" fill="#fdba74" />
      {/* pores/holes pattern */}
      {[[22,52],[36,52],[50,52],[64,52],[78,52],
        [29,68],[43,68],[57,68],[71,68],
        [22,84],[36,84],[50,84],[64,84],[78,84],
        [29,100],[43,100],[57,100],[71,100]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="4.5" ry="5" fill="rgba(0,0,0,0.22)" />
      ))}
      {/* top shine */}
      <path d="M16,32 Q50,18 84,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

// ─── BUTTER BLOCK ─────────────────────────────────────────────────────────────
function Butter() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* wrapper paper underneath */}
      <rect x="8" y="70" width="84" height="42" rx="4" fill="#f0fdf4" />
      {/* butter right side */}
      <polygon points="74,38 88,48 88,82 74,72" fill="#ca8a04" opacity="0.9" />
      {/* butter front face */}
      <polygon points="12,48 74,72 74,38 12,14" fill="#fde047" />
      {/* butter top face */}
      <polygon points="12,14 74,38 88,28 26,4" fill="#fef08a" />
      {/* text on front */}
      <text x="38" y="62" fontFamily="Arial,sans-serif" fontSize="7" fill="#854d0e" fontWeight="bold" transform="rotate(-15 38 62)">BUTTER</text>
      {/* wrapper fold at bottom */}
      <path d="M8,70 L88,70" stroke="#d1fae5" strokeWidth="2" />
      {/* highlight */}
      <path d="M14,22 L20,60" stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── HOT PAN ──────────────────────────────────────────────────────────────────
function HotPan() {
  return (
    <g>
      {/* heat glow underneath */}
      <ellipse cx="50" cy="100" rx="40" ry="12" fill="#f97316" opacity="0.4" />
      <ellipse cx="50" cy="100" rx="30" ry="8" fill="#ef4444" opacity="0.35" />
      {/* pan body (side view) */}
      <ellipse cx="50" cy="88" rx="40" ry="12" fill="url(#silver-h)" stroke="#94a3b8" strokeWidth="2" />
      {/* pan rim highlight */}
      <ellipse cx="50" cy="88" rx="38" ry="10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* pan surface */}
      <ellipse cx="50" cy="88" rx="30" ry="8" fill="#475569" opacity="0.7" />
      {/* handle */}
      <rect x="82" y="83" width="16" height="10" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* heat shimmer lines */}
      <path d="M26,80 Q28,68 26,56" stroke="#fb923c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M38,76 Q40,64 38,52" stroke="#fb923c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M50,74 Q52,62 50,50" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M62,76 Q64,64 62,52" stroke="#fb923c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M74,80 Q76,68 74,56" stroke="#fb923c" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

// ─── CABBAGE JUICE BEAKER ─────────────────────────────────────────────────────
function CabbageJuice() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="28" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* beaker body */}
      <path d="M28,22 L72,22 L68,108 L32,108 Z" fill="url(#glass-body)" stroke="rgba(147,51,234,0.5)" strokeWidth="2" />
      {/* purple liquid */}
      <path d="M29,48 L71,48 L68,108 L32,108 Z" fill="#7c3aed" opacity="0.8" />
      {/* liquid surface */}
      <line x1="30" y1="48" x2="70" y2="48" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" />
      {/* beaker spout bump */}
      <path d="M62,22 Q70,16 74,22" fill="none" stroke="rgba(147,51,234,0.5)" strokeWidth="2" />
      {/* top rim */}
      <ellipse cx="50" cy="22" rx="22" ry="6" fill="none" stroke="rgba(147,51,234,0.6)" strokeWidth="1.5" />
      {/* measurement lines */}
      <line x1="28" y1="60" x2="35" y2="60" stroke="rgba(167,139,250,0.6)" strokeWidth="1.2" />
      <line x1="28" y1="75" x2="35" y2="75" stroke="rgba(167,139,250,0.6)" strokeWidth="1.2" />
      <line x1="28" y1="90" x2="35" y2="90" stroke="rgba(167,139,250,0.6)" strokeWidth="1.2" />
      {/* reflection */}
      <path d="M31,30 L33,100" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── LEMON JUICE ──────────────────────────────────────────────────────────────
function LemonJuice() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="28" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* glass body */}
      <path d="M28,42 L72,42 L65,108 L35,108 Z" fill="url(#glass-body)" stroke="rgba(234,179,8,0.5)" strokeWidth="1.5" />
      {/* yellow juice */}
      <path d="M29,65 L71,65 L65,108 L35,108 Z" fill="#fde047" opacity="0.8" />
      <line x1="30" y1="65" x2="70" y2="65" stroke="rgba(253,224,71,0.9)" strokeWidth="1.5" />
      {/* rim */}
      <ellipse cx="50" cy="42" rx="22" ry="6" fill="rgba(254,249,195,0.3)" stroke="rgba(234,179,8,0.6)" strokeWidth="1.5" />
      {/* lemon slice on rim */}
      <circle cx="68" cy="38" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="68" cy="38" r="10" fill="#fde047" />
      {/* segments */}
      {[0,60,120,180,240,300].map(a => (
        <line key={a} x1="68" y1="38"
          x2={68 + 9*Math.cos(a*Math.PI/180)} y2={38 + 9*Math.sin(a*Math.PI/180)}
          stroke="rgba(202,138,4,0.5)" strokeWidth="1" />
      ))}
      <circle cx="68" cy="38" r="2.5" fill="#ca8a04" />
      {/* reflection */}
      <path d="M31,50 L33,100" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ─── BALL (soccer) ────────────────────────────────────────────────────────────
function Ball() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* main circle */}
      <circle cx="50" cy="62" r="46" fill="white" stroke="#1e293b" strokeWidth="2" />
      {/* pentagon patches */}
      <polygon points="50,20 62,30 58,44 42,44 38,30" fill="#1e293b" />
      <polygon points="20,42 32,36 38,48 30,58 18,52" fill="#1e293b" />
      <polygon points="80,42 68,36 62,48 70,58 82,52" fill="#1e293b" />
      <polygon points="28,82 34,70 46,72 48,86 36,92" fill="#1e293b" />
      <polygon points="72,82 66,70 54,72 52,86 64,92" fill="#1e293b" />
      {/* shine */}
      <ellipse cx="36" cy="38" rx="10" ry="7" fill="rgba(255,255,255,0.45)" transform="rotate(-30 36 38)" />
    </g>
  );
}

// ─── RAMP ─────────────────────────────────────────────────────────────────────
function Ramp() {
  return (
    <g>
      {/* shadow */}
      <ellipse cx="52" cy="118" rx="40" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* ramp body */}
      <polygon points="8,108 92,108 92,90 8,108" fill="#92400e" />
      <polygon points="8,108 92,90 60,30 8,108" fill="#b45309" />
      {/* top surface */}
      <polygon points="8,108 60,30 92,90" fill="#d97706" />
      {/* wood grain lines */}
      <line x1="20" y1="105" x2="62" y2="38" stroke="rgba(120,53,15,0.4)" strokeWidth="1" />
      <line x1="35" y1="108" x2="76" y2="55" stroke="rgba(120,53,15,0.4)" strokeWidth="1" />
      {/* highlight edge */}
      <line x1="8" y1="108" x2="60" y2="30" stroke="rgba(253,230,138,0.45)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// ─── RUBBER DUCK ──────────────────────────────────────────────────────────────
function RubberDuck() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="30" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* body */}
      <ellipse cx="50" cy="90" rx="36" ry="28" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      {/* head */}
      <circle cx="72" cy="62" r="22" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      {/* eye */}
      <circle cx="80" cy="56" r="5" fill="white" stroke="#1e293b" strokeWidth="1" />
      <circle cx="81" cy="56" r="2.5" fill="#1e293b" />
      <circle cx="82" cy="54.5" r="1" fill="white" />
      {/* beak */}
      <path d="M90,62 Q100,62 96,68 Q88,70 86,66 Z" fill="#f97316" />
      {/* wing */}
      <path d="M24,82 Q40,72 56,82" fill="none" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
      {/* shine */}
      <ellipse cx="40" cy="78" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-20 40 78)" />
    </g>
  );
}

// ─── WATER TANK ───────────────────────────────────────────────────────────────
function WaterTank() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* tank walls */}
      <rect x="10" y="30" width="80" height="82" rx="4" fill="rgba(186,230,253,0.2)" stroke="rgba(125,211,252,0.6)" strokeWidth="2.5" />
      {/* water fill */}
      <rect x="11" y="58" width="78" height="53" rx="3" fill="url(#water-fill)" opacity="0.75" />
      {/* water surface */}
      <path d="M12,58 Q30,52 50,58 Q70,64 88,58" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      {/* top rim */}
      <rect x="10" y="26" width="80" height="8" rx="3" fill="rgba(125,211,252,0.3)" stroke="rgba(125,211,252,0.5)" strokeWidth="1.5" />
      {/* reflection */}
      <path d="M14,38 L14,106" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      {/* bubble */}
      <circle cx="62" cy="78" r="4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <circle cx="42" cy="90" r="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    </g>
  );
}

// ─── FLASHLIGHT ───────────────────────────────────────────────────────────────
function Flashlight() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="18" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* body cylinder */}
      <rect x="36" y="52" width="28" height="62" rx="14" fill="url(#silver-h)" stroke="#64748b" strokeWidth="1.5" />
      {/* grip rings */}
      {[68,78,88].map(y => (
        <rect key={y} x="36" y={y} width="28" height="4" rx="2" fill="#64748b" opacity="0.4" />
      ))}
      {/* head / reflector */}
      <path d="M30,52 Q35,30 50,28 Q65,30 70,52 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      {/* lens */}
      <ellipse cx="50" cy="42" rx="16" ry="12" fill="#fef9c3" opacity="0.9" stroke="#ca8a04" strokeWidth="1" />
      <ellipse cx="50" cy="42" rx="10" ry="7" fill="#fde047" opacity="0.8" />
      {/* light beam */}
      <path d="M34,28 Q20,10 8,0" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M42,24 Q36,8 30,-4" stroke="#fef08a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M50,22 Q50,6 50,-6" stroke="#fef08a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* switch */}
      <rect x="74" y="70" width="8" height="12" rx="4" fill="#1e293b" />
    </g>
  );
}

// ─── TOY BLOCK ────────────────────────────────────────────────────────────────
function ToyBlock() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="32" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* right face */}
      <polygon points="66,30 88,44 88,82 66,68" fill="#f87171" />
      {/* front face */}
      <polygon points="12,44 66,68 66,30 12,16" fill="#fca5a5" />
      {/* top face */}
      <polygon points="12,16 66,30 88,16 34,2" fill="#fecaca" />
      {/* letter A on front */}
      <text x="36" y="58" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="22" fill="#dc2626" opacity="0.8">A</text>
      {/* shine on top */}
      <ellipse cx="34" cy="14" rx="14" ry="5" fill="rgba(255,255,255,0.45)" transform="rotate(-20 34 14)" />
    </g>
  );
}

// ─── BAR MAGNET ───────────────────────────────────────────────────────────────
function Magnet() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* right half – South = blue */}
      <rect x="50" y="38" width="42" height="62" rx="4" fill="#3b82f6" />
      {/* left half – North = red */}
      <rect x="8" y="38" width="42" height="62" rx="4" fill="#ef4444" />
      {/* top 3D faces */}
      <path d="M8,38 L50,38 L56,26 L14,26 Z" fill="#fca5a5" />
      <path d="M50,38 L92,38 L98,26 L56,26 Z" fill="#93c5fd" />
      {/* N label */}
      <text x="22" y="76" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="22" fill="white">N</text>
      {/* S label */}
      <text x="74" y="76" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="22" fill="white">S</text>
      {/* shine */}
      <path d="M10,44 L10,92" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
      <path d="M52,44 L52,92" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
      {/* field lines hint */}
      <path d="M4,38 Q0,62 4,85" stroke="#fca5a5" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3,3" opacity="0.7" />
      <path d="M96,38 Q100,62 96,85" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3,3" opacity="0.7" />
    </g>
  );
}

// ─── IRON NAIL ────────────────────────────────────────────────────────────────
function IronNail() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="16" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* nail shaft */}
      <rect x="44" y="32" width="12" height="82" rx="6" fill="url(#silver-h)" stroke="#64748b" strokeWidth="1" />
      {/* nail head */}
      <ellipse cx="50" cy="28" rx="22" ry="8" fill="url(#silver-h)" stroke="#64748b" strokeWidth="1.5" />
      {/* point */}
      <path d="M44,114 Q50,125 56,114 Z" fill="#94a3b8" />
      {/* reflection stripe */}
      <rect x="47" y="36" width="4" height="70" rx="2" fill="rgba(255,255,255,0.4)" />
    </g>
  );
}

// ─── RUBBER BAND ──────────────────────────────────────────────────────────────
function RubberBandModel() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* outer ring */}
      <ellipse cx="50" cy="65" rx="42" ry="46" fill="none" stroke="#f97316" strokeWidth="14" />
      {/* inner shadow */}
      <ellipse cx="50" cy="65" rx="42" ry="46" fill="none" stroke="#ea580c" strokeWidth="2" />
      {/* outer highlight */}
      <ellipse cx="50" cy="65" rx="42" ry="46" fill="none" stroke="rgba(253,186,116,0.6)" strokeWidth="3" />
      {/* shine arc */}
      <path d="M22,32 Q36,16 58,22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

// ─── CARDBOARD BOX ────────────────────────────────────────────────────────────
function BoxModel() {
  return (
    <g>
      <ellipse cx="50" cy="118" rx="36" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* right side */}
      <polygon points="72,32 94,44 94,100 72,88" fill="#92400e" opacity="0.9" />
      {/* front face */}
      <polygon points="6,44 72,88 72,32 6,18" fill="#b45309" />
      {/* top flaps */}
      <polygon points="6,18 72,32 94,20 28,6" fill="#d97706" />
      {/* tape line on top */}
      <line x1="50" y1="6" x2="50" y2="32" stroke="#fde68a" strokeWidth="3" opacity="0.6" />
      {/* tape on front */}
      <line x1="39" y1="18" x2="39" y2="88" stroke="#fde68a" strokeWidth="3" opacity="0.5" />
      {/* label */}
      <rect x="14" y="46" width="44" height="28" rx="3" fill="rgba(253,230,138,0.4)" />
      {/* shine */}
      <path d="M8,24 L8,80" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

// ─── DEFAULT ──────────────────────────────────────────────────────────────────
function DefaultModel() {
  return (
    <g>
      <circle cx="50" cy="65" r="40" fill="#8b5cf6" opacity="0.8" />
      <ellipse cx="50" cy="65" r="36" fill="none" stroke="rgba(196,181,253,0.5)" strokeWidth="2" />
      <text x="50" y="72" textAnchor="middle" fontSize="30" fill="white">⚗</text>
      <ellipse cx="38" cy="48" rx="10" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-30 38 48)" />
    </g>
  );
}
