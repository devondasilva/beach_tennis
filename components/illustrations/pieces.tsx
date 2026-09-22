import { COLORS } from "./palette";

/**
 * Éléments graphiques réutilisables (pictogrammes) pour composer les
 * illustrations du site. Chaque pièce est un <g> à positionner via
 * `transform` dans le <svg> parent.
 */

export function Player({
  color = COLORS.ink,
  paddleColor = COLORS.coral,
  mirror = false,
  pose = "swing",
}: {
  color?: string;
  paddleColor?: string;
  mirror?: boolean;
  pose?: "swing" | "ready" | "point";
}) {
  const arms =
    pose === "swing" ? (
      <>
        <path d="M0,-30 L-32,-46" />
        <path d="M0,-30 L28,-52 L46,-70" />
        <ellipse
          cx="52"
          cy="-76"
          rx="15"
          ry="21"
          transform="rotate(25 52 -76)"
          fill={paddleColor}
          stroke="none"
        />
      </>
    ) : pose === "point" ? (
      <>
        <path d="M0,-30 L-40,-58" />
        <path d="M0,-30 L26,-14" />
      </>
    ) : (
      <>
        <path d="M0,-28 L-30,-8 L-38,14" />
        <path d="M0,-28 L30,-8 L38,14" />
      </>
    );

  return (
    <g transform={mirror ? "scale(-1,1)" : undefined}>
      <g
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="0" cy="-58" r="14" fill={color} stroke="none" />
        <path d="M0,-44 L0,10" />
        {arms}
        <path d="M0,10 L-26,52 L-34,78" />
        <path d="M0,10 L24,46 L18,80" />
      </g>
    </g>
  );
}

export function Ball({
  x = 0,
  y = 0,
  r = 9,
  color = COLORS.coral,
  trail = true,
}: {
  x?: number;
  y?: number;
  r?: number;
  color?: string;
  trail?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {trail && (
        <path
          d={`M ${-r * 6} ${r * 2.2} Q ${-r * 3} ${-r * 3} 0 0`}
          stroke={color}
          strokeOpacity="0.35"
          strokeWidth={r * 0.6}
          strokeLinecap="round"
          strokeDasharray={`${r * 0.4} ${r * 1.1}`}
          fill="none"
        />
      )}
      <circle r={r} fill={color} />
    </g>
  );
}

export function Net({
  width = 420,
  height = 90,
  color = COLORS.sandlight,
  postColor = COLORS.ink,
}: {
  width?: number;
  height?: number;
  color?: string;
  postColor?: string;
}) {
  const cols = 10;
  const rows = 4;
  const lines = [];
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * width;
    lines.push(
      <line key={`v${i}`} x1={x} y1={0} x2={x} y2={height} stroke={color} strokeOpacity="0.55" strokeWidth="1.5" />
    );
  }
  for (let j = 0; j <= rows; j++) {
    const y = (j / rows) * height;
    lines.push(
      <line key={`h${j}`} x1={0} y1={y} x2={width} y2={y} stroke={color} strokeOpacity="0.55" strokeWidth="1.5" />
    );
  }
  return (
    <g>
      <rect x={-6} y={-14} width={12} height={height + 14} fill={postColor} rx="3" />
      <rect x={width - 6} y={-14} width={12} height={height + 14} fill={postColor} rx="3" />
      <rect x={-6} y={-14} width={width + 12} height={8} fill={postColor} rx="3" />
      {lines}
    </g>
  );
}

export function SunMark({
  cx = 0,
  cy = 0,
  r = 60,
  color = COLORS.sun,
  glow = true,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  color?: string;
  glow?: boolean;
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {glow && <circle r={r * 1.7} fill={color} opacity="0.12" />}
      {glow && <circle r={r * 1.3} fill={color} opacity="0.18" />}
      <circle r={r} fill={color} />
    </g>
  );
}

export function WaveBand({
  y = 0,
  width = 1200,
  height = 60,
  color = COLORS.lagoon,
  opacity = 1,
}: {
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  const d = `M0,${y + height * 0.4} 
    C ${width * 0.15},${y} ${width * 0.35},${y} ${width * 0.5},${y + height * 0.4}
    C ${width * 0.65},${y + height * 0.8} ${width * 0.85},${y + height * 0.8} ${width},${y + height * 0.4}
    L ${width},${y + height * 4} L 0,${y + height * 4} Z`;
  return <path d={d} fill={color} opacity={opacity} />;
}

export function PalmFronds({
  x = 0,
  y = 0,
  color = COLORS.palm,
  scale = 1,
  mirror = false,
}: {
  x?: number;
  y?: number;
  color?: string;
  scale?: number;
  mirror?: boolean;
}) {
  const fronds = [-70, -35, 0, 35, 70, 100];
  return (
    <g transform={`translate(${x} ${y}) scale(${(mirror ? -1 : 1) * scale} ${scale})`}>
      {fronds.map((a, i) => (
        <path
          key={i}
          d={`M0,0 Q ${40 * Math.cos((a * Math.PI) / 180)},${
            -120 - 20 * Math.sin((a * Math.PI) / 180)
          } ${90 * Math.cos((a * Math.PI) / 180)},${-30 * Math.sin((a * Math.PI) / 180) + 10}`}
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          opacity={0.85 - i * 0.05}
        />
      ))}
    </g>
  );
}

export function Podium({
  color1 = COLORS.sun,
  color2 = COLORS.coral,
  color3 = COLORS.lagoon,
}: {
  color1?: string;
  color2?: string;
  color3?: string;
}) {
  return (
    <g>
      <rect x="-170" y="-70" width="100" height="70" fill={color3} rx="6" />
      <text x="-120" y="-25" textAnchor="middle" fontSize="28" fontWeight="800" fill={COLORS.white}>3</text>

      <rect x="-50" y="-120" width="100" height="120" fill={color1} rx="6" />
      <text x="0" y="-45" textAnchor="middle" fontSize="34" fontWeight="800" fill={COLORS.ink}>1</text>

      <rect x="70" y="-95" width="100" height="95" fill={color2} rx="6" />
      <text x="120" y="-38" textAnchor="middle" fontSize="30" fontWeight="800" fill={COLORS.white}>2</text>
    </g>
  );
}

export function Trophy({ x = 0, y = 0, color = COLORS.sun }: { x?: number; y?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-24,-60 Q-24,-10 0,-10 Q24,-10 24,-60 Z" fill={color} />
      <path d="M-24,-56 C-46,-56 -46,-20 -22,-16" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M24,-56 C46,-56 46,-20 22,-16" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
      <rect x="-6" y="-10" width="12" height="18" fill={color} />
      <rect x="-22" y="8" width="44" height="10" rx="3" fill={color} />
    </g>
  );
}

export function Confetti({ color1 = COLORS.sun, color2 = COLORS.coral, color3 = COLORS.lagoon }: {
  color1?: string; color2?: string; color3?: string;
}) {
  const pieces = [
    { x: -140, y: -180, c: color1, r: 18 },
    { x: -90, y: -220, c: color2, r: -30 },
    { x: -20, y: -240, c: color3, r: 10 },
    { x: 60, y: -230, c: color1, r: -15 },
    { x: 130, y: -190, c: color2, r: 25 },
    { x: 10, y: -160, c: color3, r: -20 },
    { x: -150, y: -120, c: color3, r: 40 },
    { x: 150, y: -130, c: color1, r: -40 },
  ];
  return (
    <g>
      {pieces.map((p, i) => (
        <rect
          key={i}
          x={p.x - 6}
          y={p.y - 6}
          width="12"
          height="12"
          fill={p.c}
          transform={`rotate(${p.r} ${p.x} ${p.y})`}
          opacity="0.9"
        />
      ))}
    </g>
  );
}
