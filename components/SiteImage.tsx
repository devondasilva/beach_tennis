"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";

/** Charge une seule fois les images configurées par l'admin (slot -> chemin). */
export function useSiteImages(): Record<string, string> {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-images", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setImages(d.images ?? {});
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

/**
 * Affiche la photo de l'emplacement si l'admin en a envoyé une,
 * sinon l'illustration par défaut.
 */
export default function SiteImageBlock({
  src,
  alt,
  Illustration,
  className = "",
  clipPath,
  hoverScale = false,
  sizes = "100vw",
}: {
  src?: string;
  alt: string;
  Illustration: ComponentType<{ className?: string }>;
  className?: string;
  clipPath?: string;
  hoverScale?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return (
      <IllustrationBlock
        Illustration={Illustration}
        className={className}
        clipPath={clipPath}
        hoverScale={hoverScale}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${hoverScale ? "group" : ""} ${className}`}
      style={clipPath ? { clipPath } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${
          hoverScale ? "transition-transform duration-700 group-hover:scale-110" : ""
        }`}
      />
    </div>
  );
}
