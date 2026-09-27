"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Ad {
  id: string;
  advertiser: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
}

/**
 * Espace publicitaire : affiche la publicité active pour l'emplacement donné
 * (s'il y en a une). Ne rend rien tant qu'aucune annonce n'est configurée,
 * pour ne jamais laisser un bloc vide sur le site.
 */
export default function AdBanner({
  placement,
  className = "",
}: {
  placement: "accueil" | "boutique" | "evenements" | "cours";
  className?: string;
}) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ads?placement=${placement}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setAd(d.ads?.[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (!ad) return null;

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block rounded-card overflow-hidden border border-ink/10 group ${className}`}
    >
      <div className="relative w-full aspect-[16/5] bg-sandlight">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="100vw"
        />
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-ink/70 text-sandlight px-2 py-1 rounded-full">
          Publicité
        </span>
      </div>
    </a>
  );
}
