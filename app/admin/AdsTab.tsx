"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminAd } from "./types";

const emptyForm = {
  advertiser: "",
  title: "",
  targetUrl: "",
  placement: "accueil" as AdminAd["placement"],
  startDate: "",
  endDate: "",
};

const PLACEMENT_LABELS: Record<AdminAd["placement"], string> = {
  accueil: "Accueil",
  boutique: "Boutique",
  evenements: "Événements",
  cours: "Cours",
};

export default function AdsTab() {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replaceFiles, setReplaceFiles] = useState<Record<string, File | null>>({});

  const refresh = useCallback(() => {
    fetch("/api/ads?admin=1")
      .then((r) => r.json())
      .then((d) => setAds(d.ads ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Le visuel de la publicité est requis.");
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.set("advertiser", form.advertiser);
      fd.set("title", form.title);
      fd.set("targetUrl", form.targetUrl);
      fd.set("placement", form.placement);
      fd.set("startDate", form.startDate);
      fd.set("endDate", form.endDate);
      fd.set("image", file);
      const res = await fetch("/api/ads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setForm(emptyForm);
      setFile(null);
      setShowForm(false);
      refresh();
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(ad: AdminAd) {
    setBusyId(ad.id);
    try {
      await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !ad.active }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/ads/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleReplaceImage(id: string) {
    const f = replaceFiles[id];
    if (!f) return;
    setBusyId(id);
    try {
      const fd = new FormData();
      fd.set("image", f);
      await fetch(`/api/ads/${id}/image`, { method: "POST", body: fd });
      setReplaceFiles((prev) => ({ ...prev, [id]: null }));
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60 max-w-2xl">
        Propose des espaces publicitaires à des annonceurs (sponsors locaux, marques
        partenaires…) : une bannière image affichée sur une page du site, cliquable vers
        le site de l&apos;annonceur. Active/désactive-la à tout moment, avec une fenêtre de
        diffusion optionnelle.
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouvel espace publicitaire"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Nom de l'annonceur"
            value={form.advertiser}
            onChange={(e) => setForm({ ...form, advertiser: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Titre de la publicité"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            type="url"
            placeholder="Lien de destination (https://…)"
            value={form.targetUrl}
            onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <select
            value={form.placement}
            onChange={(e) =>
              setForm({ ...form, placement: e.target.value as AdminAd["placement"] })
            }
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          >
            {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                Emplacement : {label}
              </option>
            ))}
          </select>
          <div />
          <div>
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Début de diffusion (optionnel)
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="rounded-xl border border-ink/20 px-3 py-2 text-sm w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Fin de diffusion (optionnel)
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="rounded-xl border border-ink/20 px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Visuel de la bannière (JPEG, PNG, WEBP — 8 Mo max, format large recommandé)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>
          {error && <p className="text-xs text-coral sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 rounded-xl bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {creating ? "Création…" : "Créer l'espace publicitaire"}
          </button>
        </form>
      )}

      {ads.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun espace publicitaire configuré.</p>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="rounded-xl border border-ink/15 overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-4 bg-sandlight">
                <div className="relative w-28 h-16 rounded-xl overflow-hidden shrink-0 bg-white">
                  <Image src={ad.imageUrl} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <p className="font-semibold text-ink">
                    {ad.title}{" "}
                    {!ad.active && (
                      <span className="text-xs text-coral font-normal">(désactivée)</span>
                    )}
                  </p>
                  <p className="text-xs text-ink/60">
                    {ad.advertiser} · {PLACEMENT_LABELS[ad.placement]}
                    {ad.startDate ? ` · dès le ${ad.startDate}` : ""}
                    {ad.endDate ? ` · jusqu'au ${ad.endDate}` : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setReplaceFiles((prev) => ({ ...prev, [ad.id]: e.target.files?.[0] ?? null }))
                      }
                      className="text-xs"
                    />
                    <button
                      disabled={busyId === ad.id}
                      onClick={() => handleReplaceImage(ad.id)}
                      className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                    >
                      Remplacer le visuel
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={busyId === ad.id}
                    onClick={() => toggleActive(ad)}
                    className="text-xs font-semibold text-ink/60 hover:underline disabled:opacity-50"
                  >
                    {ad.active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    disabled={busyId === ad.id}
                    onClick={() => handleDelete(ad.id)}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
