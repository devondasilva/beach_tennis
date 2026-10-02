"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, GraduationCap, ShieldCheck, Smartphone, Target, TrendingUp, User } from "lucide-react";
import { LESSON_TARIFFS, LESSON_SLOTS, formatFCFA } from "@/lib/pricing";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import SuccessPanel from "@/components/ui/SuccessPanel";
import AdBanner from "@/components/AdBanner";
import { FormSection, SelectedTick, StepTitle, SummaryRow } from "@/components/ui/FormBits";
import { PAGE_IMAGES } from "@/lib/page-images";
import { optionCls, ui } from "@/lib/ui";

type PaymentMethod = "mtn_momo" | "moov_money" | "sur_place";
interface Coach {
  id: string;
  name: string;
  speciality: string;
}
interface LessonResult {
  formulaLabel: string;
  coach: string;
  date: string;
  time: string;
  price: number;
}

const longDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export default function CoursPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachesLoaded, setCoachesLoaded] = useState(false);
  const [coach, setCoach] = useState("");
  const [formulaId, setFormulaId] = useState(LESSON_TARIFFS[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(LESSON_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn_momo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coaches")
      .then((r) => r.json())
      .then((d) => {
        setCoaches(d.coaches ?? []);
        if (d.coaches?.[0]) setCoach(d.coaches[0].name);
      })
      .finally(() => setCoachesLoaded(true));
  }, []);

  const selectedFormula = LESSON_TARIFFS.find((t) => t.id === formulaId)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, coach, formulaId, date, time, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setResult(data.lesson);
      setPlayerId(data.player.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Coaching individuel"
        icon={<GraduationCap size={15} />}
        title="Progressez avec un"
        accent="coach dédié."
        subtitle="Réservable en semaine comme le week-end, en individuel ou en petit groupe. Le coach adapte chaque séance à votre niveau et à vos objectifs."
        image={PAGE_IMAGES.cours}
        crumbs={[{ href: "/", label: "Accueil" }]}
        aside={
          <div className="hidden lg:grid grid-cols-1 gap-3">
            {[
              { icon: Target, t: "Technique", d: "Coup droit, revers, volée, smash" },
              { icon: TrendingUp, t: "Progression", d: "Séances adaptées à votre niveau" },
              { icon: User, t: "Suivi", d: "Un coach qui vous connaît" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
                <span className="w-11 h-11 rounded-xl bg-sun/20 text-sun flex items-center justify-center shrink-0">
                  <x.icon size={19} />
                </span>
                <div>
                  <p className="font-bold">{x.t}</p>
                  <p className="text-sm text-white/60">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        }
      />

      <PageBody>
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="ok" className="max-w-xl mx-auto">
              <SuccessPanel
                eyebrow="Cours confirmé"
                title={result.formulaLabel}
                action={
                  <Link href={`/profil?playerId=${playerId}`} className={ui.btnSun}>
                    Voir mon profil
                  </Link>
                }
              >
                <p>avec {result.coach}</p>
                <p className="capitalize">
                  {longDate(result.date)} à {result.time}
                </p>
                <p className="font-display text-2xl font-black text-sun pt-2">{formatFCFA(result.price)}</p>
              </SuccessPanel>
            </motion.div>
          ) : (
            <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                <FormSection>
                  <StepTitle n={1} title="La formule" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {LESSON_TARIFFS.map((t) => (
                      <label key={t.id} className={optionCls(formulaId === t.id)}>
                        <input
                          type="radio"
                          name="formula"
                          value={t.id}
                          checked={formulaId === t.id}
                          onChange={() => setFormulaId(t.id)}
                          className="sr-only"
                        />
                        <SelectedTick show={formulaId === t.id} />
                        <p className="font-bold text-ink pr-8">{t.label}</p>
                        <p className="text-sm text-ink/60">{t.detail}</p>
                        <p className="mt-3 font-display text-xl font-black text-coral">{formatFCFA(t.price)}</p>
                      </label>
                    ))}
                  </div>
                </FormSection>

                <FormSection delay={0.05}>
                  <StepTitle n={2} title="Votre coach" hint="Chaque coach a sa spécialité." />
                  {!coachesLoaded ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="skeleton h-24 rounded-2xl" />
                      <div className="skeleton h-24 rounded-2xl" />
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {coaches.map((c) => (
                        <label key={c.id} className={optionCls(coach === c.name, "lagoon")}>
                          <input
                            type="radio"
                            name="coach"
                            value={c.name}
                            checked={coach === c.name}
                            onChange={() => setCoach(c.name)}
                            className="sr-only"
                          />
                          <SelectedTick show={coach === c.name} />
                          <div className="flex items-center gap-3 pr-8">
                            <span className="w-12 h-12 rounded-full bg-ink text-sun font-display font-black text-lg flex items-center justify-center shrink-0">
                              {c.name.replace(/^Coach\s+/i, "").charAt(0)}
                            </span>
                            <div>
                              <p className="font-bold text-ink">{c.name}</p>
                              <p className="text-sm text-ink/60 leading-snug">{c.speciality}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </FormSection>

                <FormSection delay={0.1}>
                  <StepTitle n={3} title="Date & heure" hint="En semaine comme le week-end." />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={ui.label} htmlFor="date">
                        Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setDate(e.target.value)}
                        className={ui.input}
                      />
                    </div>
                    <div>
                      <span className={ui.label}>Heure</span>
                      <div className="grid grid-cols-3 gap-2">
                        {LESSON_SLOTS.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setTime(s)}
                            className={`rounded-xl border-2 py-2.5 text-sm font-bold transition-all ${
                              time === s ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/70 hover:border-ink/30"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </FormSection>

                <FormSection delay={0.15}>
                  <StepTitle n={4} title="Vos coordonnées" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={ui.label} htmlFor="name">
                        Nom complet
                      </label>
                      <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Kévin Adjovi" className={ui.input} />
                    </div>
                    <div>
                      <label className={ui.label} htmlFor="phone">
                        Téléphone (Mobile Money)
                      </label>
                      <input id="phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 97 00 00 00" className={ui.input} />
                    </div>
                  </div>
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {(
                      [
                        { id: "mtn_momo", label: "MTN Mobile Money" },
                        { id: "moov_money", label: "Moov Money" },
                      ] as { id: PaymentMethod; label: string }[]
                    ).map((m) => (
                      <label key={m.id} className={optionCls(paymentMethod === m.id, "lagoon")}>
                        <input
                          type="radio"
                          name="payment"
                          value={m.id}
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)}
                          className="sr-only"
                        />
                        <SelectedTick show={paymentMethod === m.id} />
                        <p className="font-bold text-ink inline-flex items-center gap-2">
                          <Smartphone size={16} className="text-lagoon" /> {m.label}
                        </p>
                      </label>
                    ))}
                  </div>
                </FormSection>
              </div>

              <motion.aside
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="lg:col-span-4 lg:sticky lg:top-[calc(var(--nav-height,4.5rem)+1.5rem)] space-y-6"
              >
                <div className="relative overflow-hidden bg-ink text-white rounded-[2rem] p-7 shadow-xl shadow-ink/15">
                  <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/15 blur-3xl" aria-hidden />
                  <p className="relative text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Récapitulatif</p>
                  <div className="relative mt-4">
                    <SummaryRow label="Formule" value={selectedFormula.label} />
                    <SummaryRow label="Coach" value={coach || "—"} />
                    <SummaryRow label="Date" value={date ? <span className="capitalize">{longDate(date)}</span> : "À choisir"} />
                    <SummaryRow
                      label="Heure"
                      value={
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-sun" /> {time}
                        </span>
                      }
                    />
                  </div>
                  <div className="relative mt-5 flex items-end justify-between">
                    <span className="text-sm text-white/60">Total à régler</span>
                    <motion.span
                      key={selectedFormula.price}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-3xl font-black text-sun"
                    >
                      {formatFCFA(selectedFormula.price)}
                    </motion.span>
                  </div>
                  {error && <p className="relative mt-5 text-sm font-semibold text-white bg-coral/90 rounded-2xl px-4 py-3">{error}</p>}
                  <button type="submit" disabled={loading || !coach} className={`relative mt-6 w-full ${ui.btnPrimary}`}>
                    {loading ? "Confirmation en cours…" : "Réserver ce cours"}
                  </button>
                  <p className="relative mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                    <ShieldCheck size={14} className="text-sun" /> Raquettes et balles fournies
                  </p>
                </div>
                <AdBanner placement="cours" />
              </motion.aside>
            </motion.form>
          )}
        </AnimatePresence>
      </PageBody>
    </div>
  );
}
