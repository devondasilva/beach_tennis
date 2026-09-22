import { COLORS } from "./palette";
import { Ball, SunMark, WaveBand } from "./pieces";

export default function GallerySunset({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Partie de beach tennis en fin de journée, lumière dorée"
    >
      <defs>
        <linearGradient id="gsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ink} />
          <stop offset="60%" stopColor={COLORS.coralDark} />
          <stop offset="100%" stopColor={COLORS.sun} />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#gsSky)" />
      <SunMark cx={450} cy={620} r={130} color={COLORS.sun} glow={false} />
      <WaveBand y={760} width={900} height={40} color={COLORS.lagoonDark} opacity={0.85} />
      <rect y="860" width="900" height="340" fill={COLORS.sand} />
      <Ball x={450} y={520} r={16} color={COLORS.ink} trail />
    </svg>
  );
}
