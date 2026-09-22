/**
 * Emplacement photo réutilisable, en attendant les vraies photos du club
 * (courts, joueurs, événements). Remplacer par un <Image> Next.js pointant
 * vers une vraie photo dès qu'elle est disponible — voir le README.
 */
type Tone = "lagoon" | "ink" | "coral";

const TONE_STYLES: Record<Tone, string> = {
  lagoon: "from-lagoon via-lagoondark to-ink",
  ink: "from-ink via-[#123246] to-lagoondark",
  coral: "from-coral via-[#c2452c] to-ink",
};

export default function PhotoBlock({
  caption,
  tone = "lagoon",
  className = "",
  dark = true,
  clipPath,
  hoverScale = false,
  showCaption = true,
}: {
  caption: string;
  tone?: Tone;
  className?: string;
  dark?: boolean;
  clipPath?: string;
  hoverScale?: boolean;
  showCaption?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${TONE_STYLES[tone]} ${
        hoverScale ? "group" : ""
      } ${className}`}
      style={clipPath ? { clipPath } : undefined}
    >
      <div
        className={`absolute inset-0 ${dark ? "court-lines-dark" : "court-lines"} ${
          hoverScale ? "transition-transform duration-700 group-hover:scale-110" : ""
        }`}
      />
      {showCaption && (
        <div className="absolute inset-0 flex items-end p-4">
          <span className="text-[11px] tracking-wide text-white/70 bg-black/25 rounded-full px-3 py-1 backdrop-blur-sm">
            Emplacement photo — {caption}
          </span>
        </div>
      )}
    </div>
  );
}
