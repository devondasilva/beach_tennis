"use client";

import { useState } from "react";
import { formatFCFA } from "@/lib/pricing";
import { AdminEvent } from "./types";

const emptyForm = {
  title: "",
  date: "",
  category: "",
  description: "",
  entryFee: "",
  prize: "",
  capacity: "",
};

export default function EventsTab({
  events,
  onChanged,
}: {
  events: AdminEvent[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          category: form.category,
          description: form.description,
          entryFee: Number(form.entryFee) || 0,
          prize: form.prize,
          capacity: Number(form.capacity) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setForm(emptyForm);
      setShowForm(false);
      onChanged();
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemoveRegistration(eventId: string, playerId: string) {
    setBusyId(playerId);
    try {
      await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouvel événement"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-card border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Catégorie (ex. Confirmés)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Frais d'inscription (FCFA)"
            value={form.entryFee}
            onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min={1}
            placeholder="Capacité"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            placeholder="Dotation"
            value={form.prize}
            onChange={(e) => setForm({ ...form, prize: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          {error && <p className="text-xs text-coral sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 rounded-card bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {creating ? "Création…" : "Créer l'événement"}
          </button>
        </form>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun événement programmé.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="rounded-card border border-ink/15 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-sandlight">
                <div>
                  <p className="font-semibold text-ink">{e.title}</p>
                  <p className="text-xs text-ink/60">
                    {e.date} · {e.category} · {formatFCFA(e.entryFee)} · {e.registrations.length}/
                    {e.capacity} inscrits
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpenEventId(openEventId === e.id ? null : e.id)}
                    className="text-xs font-semibold text-lagoon hover:underline"
                  >
                    {openEventId === e.id ? "Masquer les inscrits" : "Voir les inscrits"}
                  </button>
                  <button
                    disabled={busyId === e.id}
                    onClick={() => handleDelete(e.id)}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              {openEventId === e.id && (
                <div className="p-4 border-t border-ink/10">
                  {e.registrations.length === 0 ? (
                    <p className="text-xs text-ink/50">Aucune inscription pour le moment.</p>
                  ) : (
                    <ul className="space-y-2">
                      {e.registrations.map((r) => (
                        <li
                          key={r.playerId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{r.playerName}</span>
                          <button
                            disabled={busyId === r.playerId}
                            onClick={() => handleRemoveRegistration(e.id, r.playerId)}
                            className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                          >
                            Retirer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
