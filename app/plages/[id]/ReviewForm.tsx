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
      <p className="text-sm text-lagoon bg-lagoon/10 rounded-card px-4 py-3">
        Merci pour votre avis ! Il est maintenant visible ci-dessus.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink mb-1">Votre note</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl leading-none ${n <= rating ? "text-sun" : "text-ink/20"}`}
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
        className="w-full rounded-card border border-ink/20 px-3 py-2 text-sm"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          required
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-card border border-ink/20 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-card border border-ink/20 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-xs text-coral">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-card bg-coral text-white font-semibold px-5 py-2.5 text-sm hover:bg-ink transition-colors disabled:opacity-60"
      >
        {loading ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}
