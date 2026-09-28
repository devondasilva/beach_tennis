"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Impossible d'envoyer le message. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white/5 border-2 border-sun/40 rounded-2xl p-8 text-center">
        <p className="font-display text-xl text-sun mb-2">Message envoyé !</p>
        <p className="text-white/70 text-sm mb-6">
          Merci, on vous répond sous 48h.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-sun transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom complet"
        className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone"
        className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Décrivez votre demande…"
        rows={3}
        className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
      />
      {error && (
        <p className="text-sm text-coral bg-coral/10 rounded-2xl px-4 py-3">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-coral text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-sun hover:text-ink transition-all disabled:opacity-60"
      >
        {loading ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
