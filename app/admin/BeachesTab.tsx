"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Wallet, CalendarCheck2, Star, Trophy } from "lucide-react";
import { BeachStats } from "@/lib/types";
import { formatFCFA } from "@/lib/pricing";
import EvolutionChart from "./EvolutionChart";

interface AdminBeachReview {
  id: string;
  playerName: string;
  rating: number;
  comment: string;
}
interface AdminBeach {
  id: string;
  name: string;
  location: string;
  description: string;
  amenities: string[];
  images: string[];
  active: boolean;
  rating: { average: number; count: number };
}

const emptyForm = { name: "", location: "", description: "", amenities: "" };

export default function BeachesTab() {
  const [beaches, setBeaches] = useState<AdminBeach[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<FileList | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reviewsByBeach, setReviewsByBeach] = useState<Record<string, AdminBeachReview[]>>({});
  const [statsByBeach, setStatsByBeach] = useState<Record<string, BeachStats | undefined>>({});
  const [addImageFiles, setAddImageFiles] = useState<Record<string, FileList | null>>({});

  const refresh = useCallback(() => {
    fetch("/api/beaches")
      .then((r) => r.json())
      .then((d) => setBeaches(d.beaches ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function loadReviews(beachId: string) {
    const res = await fetch(`/api/beaches/${beachId}`);
    const data = await res.json();
    setReviewsByBeach((prev) => ({ ...prev, [beachId]: data.reviews ?? [] }));
  }

  async function loadStats(beachId: string) {
    const res = await fetch(`/api/beaches/${beachId}/stats`);
    if (!res.ok) return;
    const data = await res.json();
    setStatsByBeach((prev) => ({ ...prev, [beachId]: data.stats }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("location", form.location);
      fd.set("description", form.description);
      fd.set("amenities", form.amenities);
      if (files) {
        Array.from(files).forEach((f) => fd.append("images", f));
      }
      const res = await fetch("/api/beaches", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setForm(emptyForm);
      setFiles(null);
      setShowForm(false);
      refresh();
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(b: AdminBeach) {
    setBusyId(b.id);
    try {
      await fetch(`/api/beaches/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !b.active }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/beaches/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddImages(beachId: string) {
    const fl = addImageFiles[beachId];
    if (!fl || fl.length === 0) return;
    setBusyId(beachId);
    try {
      const fd = new FormData();
      Array.from(fl).forEach((f) => fd.append("images", f));
      await fetch(`/api/beaches/${beachId}/images`, { method: "POST", body: fd });
      setAddImageFiles((prev) => ({ ...prev, [beachId]: null }));
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemoveImage(beachId: string, imgPath: string) {
    setBusyId(beachId);
    try {
      await fetch(`/api/beaches/${beachId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: imgPath }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteReview(beachId: string, reviewId: string) {
    await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    loadReviews(beachId);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouvelle plage"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Nom de la plage"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Localisation (ex. Fidjrossè, Cotonou)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            placeholder="Équipements, séparés par des virgules"
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Photos (JPEG, PNG, WEBP — 8 Mo max chacune)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="text-sm"
            />
          </div>
          {error && <p className="text-xs text-coral sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 rounded-full bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {creating ? "Création…" : "Créer la plage"}
          </button>
        </form>
      )}

      {beaches.length === 0 ? (
        <p className="text-sm text-ink/60">Aucune plage enregistrée.</p>
      ) : (
        <div className="space-y-3">
          {beaches.map((b) => (
            <div key={b.id} className="rounded-xl border border-ink/15 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-sandlight">
                <div>
                  <p className="font-semibold text-ink">
                    {b.name}{" "}
                    {!b.active && (
                      <span className="text-xs text-coral font-normal">(masquée)</span>
                    )}
                  </p>
                  <p className="text-xs text-ink/60">
                    {b.location} · {b.images.length} photo(s) ·{" "}
                    {b.rating.count > 0 ? `${b.rating.average}/5 (${b.rating.count} avis)` : "pas d'avis"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const next = openId === b.id ? null : b.id;
                      setOpenId(next);
                      if (next) {
                        loadReviews(b.id);
                        loadStats(b.id);
                      }
                    }}
                    className="text-xs font-semibold text-lagoon hover:underline"
                  >
                    {openId === b.id ? "Masquer" : "Gérer"}
                  </button>
                  <button
                    disabled={busyId === b.id}
                    onClick={() => toggleActive(b)}
                    className="text-xs font-semibold text-ink/60 hover:underline disabled:opacity-50"
                  >
                    {b.active ? "Masquer" : "Publier"}
                  </button>
                  <button
                    disabled={busyId === b.id}
                    onClick={() => handleDelete(b.id)}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {openId === b.id && (
                <div className="p-4 border-t border-ink/10 space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-ink/60 mb-2">Statistiques</p>
                    {(() => {
                      const s = statsByBeach[b.id];
                      if (!s) {
                        return <p className="text-xs text-ink/50">Chargement…</p>;
                      }
                      return (
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="rounded-xl bg-sandlight p-3">
                              <div className="w-7 h-7 rounded-full bg-coral/10 text-coral flex items-center justify-center mb-2">
                                <Wallet size={14} />
                              </div>
                              <p className="text-sm font-semibold text-ink">
                                {formatFCFA(s.totalRevenue)}
                              </p>
                              <p className="text-[11px] text-ink/60">Recettes totales</p>
                            </div>
                            <div className="rounded-xl bg-sandlight p-3">
                              <div className="w-7 h-7 rounded-full bg-lagoon/10 text-lagoondark flex items-center justify-center mb-2">
                                <CalendarCheck2 size={14} />
                              </div>
                              <p className="text-sm font-semibold text-ink">
                                {s.confirmedBookings} / {s.totalBookings}
                              </p>
                              <p className="text-[11px] text-ink/60">Réservations honorées</p>
                            </div>
                            <div className="rounded-xl bg-sandlight p-3">
                              <div className="w-7 h-7 rounded-full bg-sun/20 text-[#854F0B] flex items-center justify-center mb-2">
                                <Star size={14} />
                              </div>
                              <p className="text-sm font-semibold text-ink">
                                {s.averageRating != null ? `${s.averageRating}/5` : "—"}
                              </p>
                              <p className="text-[11px] text-ink/60">{s.reviewsCount} avis</p>
                            </div>
                            <div className="rounded-xl bg-sandlight p-3">
                              <div className="w-7 h-7 rounded-full bg-palm/10 text-palm flex items-center justify-center mb-2">
                                <Trophy size={14} />
                              </div>
                              <p className="text-sm font-semibold text-ink truncate">
                                {s.topTariff ? s.topTariff.label : "—"}
                              </p>
                              <p className="text-[11px] text-ink/60">Tarif le plus réservé</p>
                            </div>
                          </div>
                          <EvolutionChart monthly={s.monthly} />
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink/60 mb-2">Photos</p>
                    <div className="flex flex-wrap gap-2">
                      {b.images.map((img) => (
                        <div key={img} className="relative w-20 h-16 rounded-xl overflow-hidden group">
                          <Image src={img} alt="" fill className="object-cover" />
                          <button
                            onClick={() => handleRemoveImage(b.id, img)}
                            className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setAddImageFiles((prev) => ({ ...prev, [b.id]: e.target.files }))
                        }
                        className="text-xs"
                      />
                      <button
                        disabled={busyId === b.id}
                        onClick={() => handleAddImages(b.id)}
                        className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink/60 mb-2">Avis</p>
                    {(reviewsByBeach[b.id] ?? []).length === 0 ? (
                      <p className="text-xs text-ink/50">Aucun avis pour cette plage.</p>
                    ) : (
                      <ul className="space-y-2">
                        {(reviewsByBeach[b.id] ?? []).map((r) => (
                          <li
                            key={r.id}
                            className="flex items-center justify-between text-sm rounded-xl bg-sandlight px-3 py-2"
                          >
                            <span>
                              {r.playerName} — {"★".repeat(r.rating)}
                              {r.comment ? ` — ${r.comment}` : ""}
                            </span>
                            <button
                              onClick={() => handleDeleteReview(b.id, r.id)}
                              className="text-xs font-semibold text-coral hover:underline shrink-0 ml-3"
                            >
                              Retirer
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
