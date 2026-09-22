import { COLORS } from "./palette";
import { Player, Ball, Net, SunMark, WaveBand } from "./pieces";

export default function ActivityJeuLibre({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 750"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Deux joueurs en pleine partie de beach tennis, filet et sable"
    >
      <defs>
        <linearGradient id="jlSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.lagoonDark} />
          <stop offset="100%" stopColor={COLORS.lagoon} />
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#jlSky)" />
      <SunMark cx={980} cy={140} r={60} color={COLORS.sun} glow />
      <WaveBand y={330} width={1200} height={26} color={COLORS.lagoonDark} opacity={0.5} />
      <rect y="360" width="1200" height="390" fill={COLORS.sand} />
      <WaveBand y={345} width={1200} height={20} color={COLORS.sandlight} opacity={0.7} />

      <g stroke={COLORS.sandlight} strokeOpacity="0.5" strokeWidth="4">
        <line x1="80" y1="700" x2="1120" y2="700" />
        <line x1="220" y1="360" x2="80" y2="700" />
        <line x1="980" y1="360" x2="1120" y2="700" />
      </g>

      <g transform="translate(600 610)">
        <Net width={220} height={110} color={COLORS.sandlight} postColor={COLORS.ink} />
      </g>

      <g transform="translate(430 660) scale(1.35)">
        <Player color={COLORS.ink} paddleColor={COLORS.coral} pose="swing" />
      </g>
      <g transform="translate(830 650) scale(1.3)">
        <Player color={COLORS.ink} paddleColor={COLORS.lagoonDark} pose="ready" mirror />
      </g>
      <Ball x={660} y={520} r={11} color={COLORS.coral} />
    </svg>
  );
}
