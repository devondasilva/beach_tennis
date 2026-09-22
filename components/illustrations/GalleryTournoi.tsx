import { COLORS } from "./palette";
import { Net, Confetti, WaveBand } from "./pieces";

export default function GalleryTournoi({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Ambiance du tournoi mensuel sur la plage"
    >
      <rect width="900" height="1200" fill={COLORS.lagoon} />
      <WaveBand y={520} width={900} height={30} color={COLORS.lagoonDark} opacity={0.6} />
      <rect y="580" width="900" height="620" fill={COLORS.sand} />

      <g transform="translate(450 900) scale(1.3)">
        <Net width={300} height={140} color={COLORS.sandlight} postColor={COLORS.ink} />
      </g>

      {/* Petite foule stylisée en fond */}
      <g fill={COLORS.ink} opacity="0.65">
        {[80, 150, 210, 270, 630, 690, 750, 820].map((x, i) => (
          <g key={i} transform={`translate(${x} ${560 + (i % 2) * 14})`}>
            <circle r="14" />
            <rect x="-10" y="10" width="20" height="34" rx="8" />
          </g>
        ))}
      </g>

      <g transform="translate(450 360)">
        <Confetti color1={COLORS.sun} color2={COLORS.coral} color3={COLORS.sandlight} />
      </g>
    </svg>
  );
}
