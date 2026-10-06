"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Compteur "odomètre" : chaque chiffre défile sur une colonne 0-9 jusqu'à sa
 * valeur quand le bloc entre dans l'écran (effet des statistiques MADES).
 */
export default function RollingNumber({
  value,
  suffix,
  prefix,
  className = "",
  suffixClassName = "text-coral",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  suffixClassName?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = requestAnimationFrame(() => setGo(true));
      return () => cancelAnimationFrame(t);
    }
  }, [inView]);

  const digits = Array.from(String(Math.round(value)));

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular ${className}`} aria-label={`${prefix ?? ""}${value}${suffix ?? ""}`}>
      {prefix && <span aria-hidden>{prefix}</span>}
      <span className="inline-flex overflow-hidden" style={{ height: "1em", lineHeight: 1 }} aria-hidden>
        {digits.map((d, i) => {
          const target = 10 + Number(d); // un tour complet de plus : effet "rouleau"
          return (
            <span
              key={i}
              className="flex flex-col"
              style={{
                transform: go ? `translateY(-${target}em)` : "translateY(0)",
                transition: `transform ${duration + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k} style={{ height: "1em", lineHeight: 1 }}>
                  {k % 10}
                </span>
              ))}
            </span>
          );
        })}
      </span>
      {suffix && (
        <span aria-hidden className={suffixClassName}>
          {suffix}
        </span>
      )}
    </span>
  );
}
