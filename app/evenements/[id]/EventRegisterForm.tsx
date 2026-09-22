"use client";

import { useState } from "react";
import Link from "next/link";

export default function EventRegisterForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ playerId: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSuccess({ playerId: data.player.id });
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-card bg-lagoon text-sandlight p-6">
        <p className="font-display text-xl">Inscription confirmée !</p>
        <p className="mt-2 text-sm text-sandlight/85">
          Retrouvez le détail de l&rsquo;événement et votre QR code sur votre profil.
        </p>
        <Link
          href={`/profil?playerId=${success.playerId}`}
          className="mt-4 inline-block text-sun font-semibold text-sm hover:underline"
        >
          Voir mon profil →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1" htmlFor="name">
          Nom complet
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Grace Houngbedji"
          className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1" htmlFor="phone">
          Téléphone
        </label>
        <input
          id="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+229 97 00 00 00"
          className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
        />
      </div>
      {error && (
        <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-coral text-white font-semibold px-6 py-3 hover:bg-ink transition-colors disabled:opacity-60"
      >
        {loading ? "Inscription en cours…" : "S'inscrire au tournoi"}
      </button>
    </form>
  );
}
