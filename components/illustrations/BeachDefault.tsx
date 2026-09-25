import { COLORS } from "./palette";
import { SunMark, WaveBand, Net } from "./pieces";

/** Illustration par défaut pour une plage sans photo encore ajoutée. */
export default function BeachDefault({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 750"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Illustration par défaut d'une plage de beach tennis"
    >
      <defs>
        <linearGradient id="bdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.lagoonDark} />
          <stop offset="100%" stopColor={COLORS.lagoon} />
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#bdSky)" />
      <SunMark cx={950} cy={160} r={65} color={COLORS.sun} glow />
      <WaveBand y={340} width={1200} height={26} color={COLORS.lagoonDark} opacity={0.5} />
      <rect y="370" width="1200" height="380" fill={COLORS.sand} />
      <g transform="translate(600 640)">
        <Net width={240} height={120} color={COLORS.sandlight} postColor={COLORS.ink} />
      </g>
    </svg>
  );
}
