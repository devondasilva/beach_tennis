"use client";

import { useState } from "react";
import { AdminPlayer } from "./types";

const LEVEL_LABEL: Record<AdminPlayer["level"], string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

export default function PlayersTab({
  players,
  onChanged,
}: {
  players: AdminPlayer[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const sorted = [...players].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  async function adjustPoints(id: string, delta: number) {
    setBusyId(id);
    try {
      await fetch(`/api/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointsDelta: delta }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  async function setLevel(id: string, level: AdminPlayer["level"]) {
    setBusyId(id);
    try {
      await fetch(`/api/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (players.length === 0) {
    return <p className="text-sm text-ink/60">Aucun joueur enregistré pour le moment.</p>;
  }

  return (
    <div className="rounded-card border border-ink/15 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ink text-sandlight text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Joueur</th>
            <th className="px-4 py-3 font-semibold">Téléphone</th>
            <th className="px-4 py-3 font-semibold">Niveau</th>
            <th className="px-4 py-3 font-semibold text-right">Points</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={p.id} className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/40"}>
              <td className="px-4 py-3">{p.name}</td>
              <td className="px-4 py-3 text-ink/60">{p.phone}</td>
              <td className="px-4 py-3">
                <select
                  value={p.level}
                  disabled={busyId === p.id}
                  onChange={(e) => setLevel(p.id, e.target.value as AdminPlayer["level"])}
                  className="rounded-card border border-ink/20 px-2 py-1 text-xs bg-white"
                >
                  {Object.entries(LEVEL_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-right font-semibold">{p.loyaltyPoints}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    disabled={busyId === p.id}
                    onClick={() => adjustPoints(p.id, 10)}
                    className="w-7 h-7 rounded-full border border-ink/15 text-ink/70 hover:border-lagoon hover:text-lagoon disabled:opacity-50"
                    title="+10 points"
                  >
                    +
                  </button>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => adjustPoints(p.id, -10)}
                    className="w-7 h-7 rounded-full border border-ink/15 text-ink/70 hover:border-coral hover:text-coral disabled:opacity-50"
                    title="-10 points"
                  >
                    −
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
