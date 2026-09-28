"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { SITE_IMAGE_SLOTS } from "@/lib/site-images";

export default function SiteImagesTab() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/site-images", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? {}));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleUpload(slot: string) {
    const file = files[slot];
    if (!file) return;
    setError(null);
    setBusySlot(slot);
    try {
      const fd = new FormData();
      fd.set("image", file);
      const res = await fetch(`/api/site-images/${slot}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setFiles((prev) => ({ ...prev, [slot]: null }));
      refresh();
    } finally {
      setBusySlot(null);
    }
  }

  async function handleRemove(slot: string) {
    setError(null);
    setBusySlot(slot);
    try {
      await fetch(`/api/site-images/${slot}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusySlot(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60 max-w-2xl">
        Remplace les illustrations de la page d&apos;accueil par tes propres photos.
        Sans photo, l&apos;illustration par défaut reste affichée. Formats JPEG, PNG,
        WEBP — 8 Mo max.
      </p>
      {error && <p className="text-sm text-coral">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {SITE_IMAGE_SLOTS.map((slot) => {
          const current = images[slot.id];
          return (
            <div key={slot.id} className="rounded-xl border border-ink/15 p-4 space-y-3">
              <div>
                <p className="font-semibold text-ink text-sm">{slot.label}</p>
                <p className="text-xs text-ink/50">{slot.hint}</p>
              </div>
              <div className="relative h-32 rounded-xl overflow-hidden bg-sandlight flex items-center justify-center">
                {current ? (
                  <Image src={current} alt={slot.label} fill className="object-cover" />
                ) : (
                  <span className="text-xs text-ink/40">Illustration par défaut</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFiles((prev) => ({ ...prev, [slot.id]: e.target.files?.[0] ?? null }))
                  }
                  className="text-xs max-w-full"
                />
                <button
                  disabled={busySlot === slot.id || !files[slot.id]}
                  onClick={() => handleUpload(slot.id)}
                  className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-40"
                >
                  {current ? "Remplacer" : "Ajouter"}
                </button>
                {current && (
                  <button
                    disabled={busySlot === slot.id}
                    onClick={() => handleRemove(slot.id)}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Retirer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
