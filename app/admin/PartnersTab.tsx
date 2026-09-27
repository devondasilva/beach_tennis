"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminPartner } from "./types";

const emptyForm = { name: "", websiteUrl: "" };

export default function PartnersTab() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((d) => setPartners(d.partners ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Le logo est requis.");
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("websiteUrl", form.websiteUrl);
      fd.set("logo", file);
      const res = await fetch("/api/partners", { method: "POST", body: fd });
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

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/partners/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60 max-w-2xl">
        Les logos ajoutés ici apparaissent dans la bande « Ils nous font confiance » de la
        page d&apos;accueil, cliquables vers le site du partenaire si un lien est renseigné.
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouveau partenaire"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Nom du partenaire"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            type="url"
            placeholder="Site web (optionnel, https://…)"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
          />
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Logo (JPEG, PNG, WEBP — idéalement transparent, 8 Mo max)
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
            {creating ? "Création…" : "Ajouter le partenaire"}
          </button>
        </form>
      )}

      {partners.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun partenaire enregistré.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {partners.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-ink/15 p-3 flex flex-col items-center gap-2 w-32"
            >
              <div className="relative w-full h-14 rounded-xl overflow-hidden bg-sandlight">
                <Image src={p.logoUrl} alt={p.name} fill className="object-contain p-2" />
              </div>
              <p className="text-xs font-semibold text-ink text-center truncate w-full">
                {p.name}
              </p>
              <button
                disabled={busyId === p.id}
                onClick={() => handleDelete(p.id)}
                className="text-[11px] font-semibold text-coral hover:underline disabled:opacity-50"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
