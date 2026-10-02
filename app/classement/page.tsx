import Link from "next/link";
import { Crown, Lock, Medal, Trophy } from "lucide-react";
import { getPlayers } from "@/lib/db";
import { getServerSession } from "@/lib/auth";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const LEVEL_LABEL: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

const PODIUM = [
  { place: 2, h: "h-28", tone: "bg-white text-ink", medal: "text-ink/40" },
  { place: 1, h: "h-40", tone: "bg-coral text-white", medal: "text-sun" },
  { place: 3, h: "h-20", tone: "bg-sand text-ink", medal: "text-[#B86E3C]" },
];

export default async function ClassementPage() {
  const session = await getServerSession();

  const hero = (
    <PageHero
      badge="Ladder des joueurs"
      icon={<Trophy size={15} />}
      title="Le classement"
      accent="du sable."
      subtitle="Classement basé sur les points de fidélité cumulés à chaque séance, cours et événement. 200 points = une séance offerte."
      image={PAGE_IMAGES.classement}
      crumbs={[{ href: "/", label: "Accueil" }]}
    />
  );

  if (!session) {
    return (
      <div className="bg-sandlight">
        {hero}
        <PageBody>
          <Reveal className={`${ui.card} max-w-xl mx-auto p-10 text-center`}>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-ink text-sun flex items-center justify-center">
              <Lock size={26} />
            </div>
            <h2 className="mt-6 font-display text-3xl font-black tracking-tight">Réservé aux membres connectés.</h2>
            <p className="mt-3 text-ink/60">
              Connecte-toi avec ton nom et ton numéro de téléphone pour voir le ladder des joueurs et suivre tes
              points de fidélité.
            </p>
            <Link href="/login?next=/classement" className={`mt-8 ${ui.btnPrimary}`}>
              Se connecter
            </Link>
          </Reveal>
        </PageBody>
      </div>
    );
  }

  const players = getPlayers()
    .slice()
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);
  const myRank = players.findIndex((p) => p.id === session.id);
  // Top 25 affiché, plus la ligne du joueur connecté s'il est plus bas.
  const TOP = 25;
  const rows = players
    .map((p, i) => ({ p, rank: i + 1 }))
    .filter((r) => r.rank <= TOP || r.p.id === session.id);

  return (
    <div className="bg-sandlight">
      {hero}
      <PageBody>
        {players.length === 0 ? (
          <EmptyState icon={<Trophy size={24} />} title="Le classement arrive">
            Il s&rsquo;affichera dès les premières réservations.
          </EmptyState>
        ) : (
          <>
            {/* Podium */}
            {players.length >= 3 && (
              <Reveal className={`${ui.card} p-6 md:p-10`}>
                <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-2xl mx-auto">
                  {PODIUM.map((pd, i) => {
                    const p = players[pd.place - 1];
                    return (
                      <Reveal key={pd.place} delay={0.15 + i * 0.12} y={40} className="text-center">
                        <div className="relative mx-auto w-14 h-14 md:w-20 md:h-20 rounded-full bg-ink text-sun font-display font-black text-xl md:text-3xl flex items-center justify-center shadow-lg">
                          {p.name.charAt(0).toUpperCase()}
                          {pd.place === 1 && <Crown size={26} className="absolute -top-6 text-sun fill-sun" />}
                        </div>
                        <p className="mt-3 font-bold text-ink text-sm md:text-base truncate">{p.name}</p>
                        <p className="text-xs text-ink/50">{p.loyaltyPoints} pts</p>
                        <div className={`mt-4 ${pd.h} rounded-t-2xl ${pd.tone} border border-ink/[0.06] flex flex-col items-center justify-start pt-3`}>
                          <Medal size={22} className={pd.medal} />
                          <span className="font-display text-3xl md:text-4xl font-black">{pd.place}</span>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {myRank >= 0 && (
              <Reveal delay={0.1} className="mt-6 relative overflow-hidden bg-ink text-white rounded-[2rem] p-6 md:p-7 flex flex-wrap items-center justify-between gap-4">
                <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/15 blur-3xl" aria-hidden />
                <div className="relative">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Ta position</p>
                  <p className="mt-1 font-display text-3xl font-black">
                    {myRank + 1}
                    <sup className="text-base">{myRank === 0 ? "er" : "e"}</sup>{" "}
                    <span className="text-white/50 text-lg font-semibold">sur {players.length}</span>
                  </p>
                </div>
                <div className="relative text-right">
                  <p className="font-display text-3xl font-black text-sun">{players[myRank].loyaltyPoints} pts</p>
                  <p className="text-xs text-white/50">
                    {200 - (players[myRank].loyaltyPoints % 200)} pts avant ta prochaine séance offerte
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.15} className={`mt-6 ${ui.card} overflow-hidden`}>
              <table className="w-full text-sm">
                <thead className="bg-ink text-sandlight text-left">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest">#</th>
                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest">Joueur</th>
                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest hidden sm:table-cell">Niveau</th>
                    <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {rows.map(({ p, rank }, idx) => {
                    const me = p.id === session.id;
                    const gap = idx > 0 && rank - rows[idx - 1].rank > 1;
                    return (
                      <tr key={p.id} style={gap ? { borderTop: "3px dashed rgba(11,46,61,0.12)" } : undefined} className={`transition-colors ${me ? "bg-sun/15" : "hover:bg-sandlight"}`}>
                        <td className="px-5 py-3.5 font-display font-black text-lg text-lagoon w-14">{rank}</td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-sandlight text-ink font-bold text-xs flex items-center justify-center shrink-0">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="font-semibold text-ink">
                              {p.name}
                              {me && <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-coral">Toi</span>}
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-ink/60 hidden sm:table-cell">{LEVEL_LABEL[p.level] ?? p.level}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-ink tabular">{p.loyaltyPoints}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {players.length > TOP && (
                <p className="px-5 py-4 text-xs text-ink/50 bg-sandlight/60">
                  Top {TOP} sur {players.length} joueurs classés.
                </p>
              )}
            </Reveal>
          </>
        )}
      </PageBody>
    </div>
  );
}
