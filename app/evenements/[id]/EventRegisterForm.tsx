"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const darkInput =
  "w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3.5 font-semibold text-white placeholder:text-white/40 focus:border-sun focus:outline-none transition-colors";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white/5 border-2 border-sun/40 p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="mx-auto w-12 h-12 rounded-full bg-sun text-ink flex items-center justify-center"
        >
          <Check size={24} strokeWidth={3} />
        </motion.div>
        <p className="mt-4 font-display text-xl font-black text-sun">Inscription confirmée !</p>
        <p className="mt-2 text-sm text-white/70">
          Retrouvez le détail de l&rsquo;événement et votre QR code sur votre profil.
        </p>
        <Link
          href={`/profil?playerId=${success.playerId}`}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-sun text-ink font-semibold text-xs rounded-full hover:bg-white transition-colors"
        >
          Voir mon profil →
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        id="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom complet"
        aria-label="Nom complet"
        className={darkInput}
      />
      <input
        id="phone"
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone (+229 97 00 00 00)"
        aria-label="Téléphone"
        className={darkInput}
      />
      {error && <p className="text-sm font-semibold text-white bg-coral/90 rounded-2xl px-4 py-3">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-coral text-white font-semibold text-sm rounded-full hover:bg-ink transition-all disabled:opacity-60"
      >
        {loading ? "Inscription en cours…" : "S'inscrire au tournoi"}
      </button>
    </form>
  );
}
