import { COLORS } from "./palette";
import { Player, WaveBand } from "./pieces";

export default function GalleryCoaching({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Coach et élève en plein exercice technique sur le sable"
    >
      <defs>
        <linearGradient id="gcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.inkSoft} />
          <stop offset="100%" stopColor={COLORS.lagoonDark} />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#gcSky)" />
      <WaveBand y={520} width={900} height={30} color={COLORS.lagoon} opacity={0.6} />
      <rect y="580" width="900" height="620" fill={COLORS.sand} />

      <g transform="translate(340 900) scale(3.1)">
        <Player color={COLORS.sun} paddleColor={COLORS.coral} pose="point" />
      </g>
      <g transform="translate(640 930) scale(2.2)">
        <Player color={COLORS.sandlight} paddleColor={COLORS.lagoonDark} pose="ready" mirror />
      </g>
    </svg>
  );
}
