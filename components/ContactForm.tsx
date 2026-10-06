"use client";

import { useState } from "react";
import ArrowButton from "@/components/ui/ArrowButton";

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
      <div className="rounded-card border border-orange/30 bg-orangeL p-8 text-center">
        <p className="h-display text-3xl text-orange">Message envoyé !</p>
        <p className="mt-2 text-sm text-mutedfg">Merci, on vous répond sous 48h.</p>
        <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-ink underline-offset-4 hover:text-orange hover:underline">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="field-label">Nom complet</span>
        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Aïcha Dossou" className="field" />
      </label>
      <label className="block">
        <span className="field-label">Téléphone</span>
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 01 00 00 00 00" className="field" />
      </label>
      <label className="block">
        <span className="field-label">Votre demande</span>
        <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Réservation de groupe, partenariat plage, cours…" rows={4} className="field" />
      </label>
      {error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <ArrowButton type="submit" loading={loading} full size="lg">
        Envoyer ma demande
      </ArrowButton>
    </form>
  );
}
