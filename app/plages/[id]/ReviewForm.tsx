"use client";

import { useState } from "react";

export default function ReviewForm({
  beachId,
  onSubmitted,
}: {
  beachId: string;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/beaches/${beachId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setDone(true);
      setComment("");
      onSubmitted();
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm font-semibold text-ink bg-sun rounded-2xl px-4 py-3">
        Merci pour votre avis ! Il est maintenant visible ci-dessus.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-2">Votre note</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-3xl leading-none transition-transform hover:scale-125 ${n <= rating ? "text-sun" : "text-white/20"}`}
              aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        placeholder="Votre avis sur ce site (optionnel)"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/40 focus:border-sun focus:outline-none transition-colors"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          required
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/40 focus:border-sun focus:outline-none transition-colors"
        />
        <input
          required
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/40 focus:border-sun focus:outline-none transition-colors"
        />
      </div>
      {error && <p className="text-sm font-semibold text-white bg-coral/90 rounded-2xl px-4 py-3">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-coral text-white font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-sun hover:text-ink transition-all disabled:opacity-60"
      >
        {loading ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}
