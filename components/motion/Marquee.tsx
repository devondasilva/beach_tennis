/** Bandeau défilant infini (CSS), dupliqué pour une boucle sans couture. */
export default function Marquee({
  items,
  className = "",
  itemClassName = "",
  separator = "·",
  duration = 30,
  reverse = false,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
  duration?: number;
  reverse?: boolean;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className={`flex items-center whitespace-nowrap ${itemClassName}`}>
          {it}
          <span className="mx-[0.4em] opacity-60">{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused]"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
