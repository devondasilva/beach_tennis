"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminArticle } from "./types";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "actualite" as AdminArticle["category"],
  sourceUrl: "",
  sourceName: "",
  publishedAt: "",
  featured: false,
};

export default function ArticlesTab() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const fd = new FormData();
      fd.set("title", form.title);
      fd.set("excerpt", form.excerpt);
      fd.set("content", form.content);
      fd.set("category", form.category);
      fd.set("sourceUrl", form.sourceUrl);
      fd.set("sourceName", form.sourceName);
      fd.set("publishedAt", form.publishedAt);
      fd.set("featured", String(form.featured));
      if (file) fd.set("image", file);

      const res = await fetch("/api/articles", { method: "POST", body: fd });
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
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleFeatured(a: AdminArticle) {
    setBusyId(a.id);
    try {
      await fetch(`/api/articles/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !a.featured }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  const isPresse = form.category === "revue_presse";

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60 max-w-2xl">
        Publie des actualités du club (rédigées ici) ou ajoute une revue de presse
        (un article publié ailleurs, avec un lien vers la source). Les deux apparaissent
        ensemble sur la page publique « Actualités », les plus récentes en premier.
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouvel article"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as AdminArticle["category"] })
            }
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          >
            <option value="actualite">Actualité du club</option>
            <option value="revue_presse">Revue de presse (article externe)</option>
          </select>

          <input
            required
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            required
            placeholder="Résumé court (affiché dans la liste)"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />

          {isPresse ? (
            <>
              <input
                required
                type="url"
                placeholder="Lien vers l'article original (https://…)"
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
              />
              <input
                placeholder="Nom du média (ex. La Nation)"
                value={form.sourceName}
                onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                className="rounded-xl border border-ink/20 px-3 py-2 text-sm"
              />
            </>
          ) : (
            <>
              <textarea
                required
                placeholder="Contenu complet de l'article"
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                type="url"
                placeholder="Lien vers un site de référence (optionnel, https://…)"
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                className="rounded-xl border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
              />
              <p className="text-xs text-ink/50 -mt-2 sm:col-span-2">
                Si renseigné, un clic sur cette actualité redirigera directement vers ce
                site plutôt que vers la page Actualités.
              </p>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Date de publication (optionnel, défaut : aujourd&apos;hui)
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className="rounded-xl border border-ink/20 px-3 py-2 text-sm w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/60 mb-1">
              Image (optionnelle, 8 Mo max)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>

          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-ink/30"
            />
            Mettre en avant sur la page d&apos;accueil
          </label>

          {error && <p className="text-xs text-coral sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 rounded-full bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {creating ? "Publication…" : "Publier"}
          </button>
        </form>
      )}

      {articles.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun article publié.</p>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-ink/15 p-4 flex flex-wrap items-center gap-4 bg-sandlight"
            >
              {a.imageUrl && (
                <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-white">
                  <Image src={a.imageUrl} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-ink">
                  {a.title}{" "}
                  {a.featured && (
                    <span className="text-xs text-sun font-normal">— à la une</span>
                  )}
                </p>
                <p className="text-xs text-ink/60">
                  {a.category === "revue_presse" ? "Revue de presse" : "Actualité"} ·{" "}
                  {new Date(a.publishedAt).toLocaleDateString("fr-FR")}
                  {a.sourceName ? ` · ${a.sourceName}` : ""}
                </p>
              </div>
              <button
                disabled={busyId === a.id}
                onClick={() => handleToggleFeatured(a)}
                className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
              >
                {a.featured ? "Retirer de la une" : "Mettre à la une"}
              </button>
              <button
                disabled={busyId === a.id}
                onClick={() => handleDelete(a.id)}
                className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
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
