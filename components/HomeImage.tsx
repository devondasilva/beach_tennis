"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";

/**
 * Photo de la page d'accueil (import statique next/image : dimensions et
 * flou de chargement automatiques). Si le chargement échoue, un bloc de
 * couleur neutre s'affiche à la place (jamais d'image cassée).
 */
export default function HomeImage({
  src,
  alt,
  className = "",
  clipPath,
  hoverScale = false,
  sizes = "100vw",
  priority = false,
}: {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  clipPath?: string;
  hoverScale?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-sand/60 ${hoverScale ? "group" : ""} ${className}`}
      style={clipPath ? { clipPath } : undefined}
    >
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={typeof src === "string" ? "empty" : "blur"}
          onError={() => setFailed(true)}
          className={`object-cover ${
            hoverScale ? "transition-transform duration-700 group-hover:scale-110" : ""
          }`}
        />
      )}
    </div>
  );
}
