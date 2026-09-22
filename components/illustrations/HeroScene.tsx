import { COLORS } from "./palette";
import { Player, Ball, Net, SunMark, WaveBand, PalmFronds } from "./pieces";

export default function HeroScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Coucher de soleil sur un terrain de beach tennis, deux joueurs en pleine partie"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ink} />
          <stop offset="55%" stopColor={COLORS.inkSoft} />
          <stop offset="85%" stopColor={COLORS.coralDark} />
          <stop offset="100%" stopColor={COLORS.coral} />
        </linearGradient>
        <linearGradient id="heroSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.lagoonDark} />
          <stop offset="100%" stopColor={COLORS.lagoon} />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#heroSky)" />
      <SunMark cx={1180} cy={520} r={90} color={COLORS.sun} />

      <rect y="520" width="1600" height="120" fill="url(#heroSea)" />
      <WaveBand y={520} width={1600} height={26} color={COLORS.lagoon} opacity={0.9} />

      <rect y="600" width="1600" height="300" fill={COLORS.sand} />
      <WaveBand y={585} width={1600} height={22} color={COLORS.sandlight} opacity={0.6} />

      <g opacity="0.9">
        <PalmFronds x={90} y={900} color={COLORS.ink} scale={1.5} />
        <PalmFronds x={1520} y={900} color={COLORS.ink} scale={1.3} mirror />
      </g>

      <g transform="translate(720 760)">
        <Net width={280} height={130} color={COLORS.sandlight} postColor={COLORS.ink} />
      </g>

      <g transform="translate(560 800) scale(1.5)">
        <Player color={COLORS.ink} paddleColor={COLORS.coral} pose="swing" />
      </g>
      <g transform="translate(1080 790) scale(1.4)">
        <Player color={COLORS.ink} paddleColor={COLORS.sun} pose="ready" mirror />
      </g>
      <Ball x={880} y={640} r={12} color={COLORS.sun} />
    </svg>
  );
}
