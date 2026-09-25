"use client";

import { useState } from "react";
import { formatFCFA } from "@/lib/pricing";
import { AdminLesson } from "./types";

export default function LessonsTab({
  lessons,
  onChanged,
}: {
  lessons: AdminLesson[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: AdminLesson["status"]) {
    setBusyId(id);
    try {
      await fetch(`/api/lessons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (lessons.length === 0) {
    return <p className="text-sm text-ink/60">Aucun cours réservé pour le moment.</p>;
  }

  return (
    <div className="rounded-card border border-ink/15 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ink text-sandlight text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Joueur</th>
            <th className="px-4 py-3 font-semibold">Formule</th>
            <th className="px-4 py-3 font-semibold">Coach</th>
            <th className="px-4 py-3 font-semibold">Créneau</th>
            <th className="px-4 py-3 font-semibold text-right">Montant</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l, i) => (
            <tr key={l.id} className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/40"}>
              <td className="px-4 py-3">{l.playerName}</td>
              <td className="px-4 py-3">{l.formulaLabel}</td>
              <td className="px-4 py-3">{l.coach}</td>
              <td className="px-4 py-3">
                {l.date} · {l.time}
              </td>
              <td className="px-4 py-3 text-right font-semibold">{formatFCFA(l.price)}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    l.status === "annulee" ? "bg-coral/10 text-coral" : "bg-lagoon/10 text-lagoon"
                  }`}
                >
                  {l.status === "annulee" ? "Annulé" : "Confirmé"}
                </span>
              </td>
              <td className="px-4 py-3">
                {l.status !== "annulee" ? (
                  <button
                    disabled={busyId === l.id}
                    onClick={() => setStatus(l.id, "annulee")}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Annuler
                  </button>
                ) : (
                  <button
                    disabled={busyId === l.id}
                    onClick={() => setStatus(l.id, "confirme")}
                    className="text-xs font-semibold text-ink/60 hover:underline disabled:opacity-50"
                  >
                    Réactiver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
