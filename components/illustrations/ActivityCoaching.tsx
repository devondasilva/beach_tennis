import { COLORS } from "./palette";
import { Player, Ball, SunMark, WaveBand } from "./pieces";

export default function ActivityCoaching({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 750"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Un coach fait une démonstration technique à un élève sur le sable"
    >
      <defs>
        <linearGradient id="coachSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ink} />
          <stop offset="100%" stopColor={COLORS.inkSoft} />
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#coachSky)" />
      <SunMark cx={200} cy={150} r={55} color={COLORS.sun} glow />
      <WaveBand y={360} width={1200} height={24} color={COLORS.lagoonDark} opacity={0.6} />
      <rect y="384" width="1200" height="366" fill={COLORS.sand} />
      <WaveBand y={368} width={1200} height={18} color={COLORS.sandlight} opacity={0.6} />

      {/* Coach, plus grand, en position de démonstration */}
      <g transform="translate(470 690) scale(1.7)">
        <Player color={COLORS.sun} paddleColor={COLORS.coral} pose="point" />
      </g>
      {/* Élève, plus petit, en position d'écoute */}
      <g transform="translate(760 700) scale(1.15)">
        <Player color={COLORS.ink} paddleColor={COLORS.lagoonDark} pose="ready" mirror />
      </g>

      <Ball x={600} y={520} r={10} color={COLORS.coral} trail={false} />

      {/* Ligne de trajectoire pédagogique */}
      <path
        d="M 520 560 Q 600 480 700 560"
        stroke={COLORS.sun}
        strokeWidth="4"
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}
