import { COLORS } from "./palette";
import { Podium, Trophy, Confetti, SunMark, WaveBand } from "./pieces";

export default function ActivityTournoi({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 750"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Podium et remise de prix lors du tournoi mensuel de beach tennis"
    >
      <defs>
        <linearGradient id="tourSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.coralDark} />
          <stop offset="100%" stopColor={COLORS.coral} />
        </linearGradient>
      </defs>
      <rect width="1200" height="750" fill="url(#tourSky)" />
      <SunMark cx={1000} cy={140} r={55} color={COLORS.sun} glow />
      <WaveBand y={420} width={1200} height={26} color={COLORS.ink} opacity={0.12} />
      <rect y="450" width="1200" height="300" fill={COLORS.sand} />

      <g transform="translate(600 700)">
        <Podium color1={COLORS.sun} color2={COLORS.ink} color3={COLORS.lagoonDark} />
        <Trophy x={0} y={-190} color={COLORS.sun} />
        <Confetti color1={COLORS.sun} color2={COLORS.sandlight} color3={COLORS.lagoonDark} />
      </g>
    </svg>
  );
}
