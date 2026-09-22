import { COLORS } from "./palette";

export default function GalleryEquipement({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Raquettes et balles de beach tennis, prêtes à jouer"
    >
      <rect width="900" height="1200" fill={COLORS.sand} />
      <circle cx="450" cy="600" r="480" fill={COLORS.sandlight} opacity="0.6" />

      {/* Raquette (palette) */}
      <g transform="translate(400 560) rotate(-18)">
        <ellipse cx="0" cy="-160" rx="100" ry="140" fill={COLORS.lagoon} />
        <ellipse cx="0" cy="-160" rx="78" ry="115" fill={COLORS.lagoonDark} opacity="0.35" />
        <rect x="-16" y="-30" width="32" height="150" rx="14" fill={COLORS.ink} />
      </g>

      {/* Balles */}
      <g>
        <circle cx="600" cy="760" r="46" fill={COLORS.coral} />
        <circle cx="690" cy="700" r="38" fill={COLORS.sun} />
        <circle cx="640" cy="850" r="34" fill={COLORS.coralDark} />
      </g>

      {/* Sac fourre-tout, forme simplifiée */}
      <g transform="translate(330 950)">
        <path
          d="M-120,0 Q-120,-90 0,-90 Q120,-90 120,0 L110,90 Q0,120 -110,90 Z"
          fill={COLORS.ink}
          opacity="0.9"
        />
        <path
          d="M-60,-90 Q0,-150 60,-90"
          stroke={COLORS.ink}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
