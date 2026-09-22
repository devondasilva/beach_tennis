import { getPlayers } from "@/lib/db";

export const dynamic = "force-dynamic";

const LEVEL_LABEL: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

export default function ClassementPage() {
  const players = getPlayers()
    .slice()
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Classement</p>
        <h1 className="font-display text-4xl text-ink">Le ladder des joueurs</h1>
        <p className="mt-3 text-ink/70">
          Classement basé sur les points de fidélité cumulés à chaque séance,
          cours et événement.
        </p>
      </div>

      <div className="mt-10 rounded-card border border-ink/15 overflow-hidden">
        {players.length === 0 ? (
          <p className="p-6 text-sm text-ink/60">
            Le classement s&rsquo;affichera dès les premières réservations.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-ink text-sandlight text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Joueur</th>
                <th className="px-4 py-3 font-semibold">Niveau</th>
                <th className="px-4 py-3 font-semibold text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr
                  key={p.id}
                  className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/50"}
                >
                  <td className="px-4 py-3 font-display text-lagoon">{i + 1}</td>
                  <td className="px-4 py-3 text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {LEVEL_LABEL[p.level] ?? p.level}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    {p.loyaltyPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
