"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, QrCode, ShieldCheck, Smartphone, Waves } from "lucide-react";
import { TARIFFS, PLAY_SLOTS, formatFCFA, isWeekendFriendlyDate } from "@/lib/pricing";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import SuccessPanel from "@/components/ui/SuccessPanel";
import { FormSection, SelectedTick, StepTitle, SummaryRow } from "@/components/ui/FormBits";
import { PAGE_IMAGES } from "@/lib/page-images";
import { optionCls, ui } from "@/lib/ui";

type PaymentMethod = "mtn_momo" | "moov_money" | "sur_place";

interface Beach {
  id: string;
  name: string;
  location: string;
  active: boolean;
}

interface BookingResult {
  id: string;
  tariffLabel: string;
  beachName: string;
  date: string;
  time: string;
  price: number;
  playerName: string;
}

const PAYMENTS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "mtn_momo", label: "MTN Mobile Money", hint: "Validation sur votre téléphone" },
  { id: "moov_money", label: "Moov Money", hint: "Validation sur votre téléphone" },
];

const longDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export default function ReservationClient() {
  const params = useSearchParams();
  const preselectedBeachId = params.get("beachId");

  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [beachesLoaded, setBeachesLoaded] = useState(false);
  const [beachId, setBeachId] = useState<string>(preselectedBeachId ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tariffId, setTariffId] = useState(TARIFFS[0].id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(PLAY_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn_momo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/beaches")
      .then((r) => r.json())
      .then((d) => {
        const active: Beach[] = (d.beaches ?? []).filter((b: Beach) => b.active);
        setBeaches(active);
        if (!preselectedBeachId && active[0]) setBeachId(active[0].id);
      })
      .finally(() => setBeachesLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTariff = TARIFFS.find((t) => t.id === tariffId)!;
  const selectedBeach = beaches.find((b) => b.id === beachId);
  const weekendHint = date && !isWeekendFriendlyDate(date);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, beachId, tariffId, date, time, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setResult(data.booking);
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
        badge="Réservation · Week-end"
        icon={<CalendarDays size={15} />}
        title="Choisissez votre"
        accent="créneau."
        subtitle="L'activité se joue surtout le week-end — vendredi soir, samedi et dimanche. Le règlement se fait par Mobile Money, et votre QR code d'accès est immédiat."
        image={PAGE_IMAGES.reservation}
        crumbs={[{ href: "/", label: "Accueil" }]}
        aside={
          <div className="hidden lg:block bg-white/10 backdrop-blur-xl border border-white/15 p-7 rounded-card space-y-4">
            {[
              { icon: Waves, t: "Choisissez votre plage et votre formule" },
              { icon: Smartphone, t: "Payez en Mobile Money en quelques secondes" },
              { icon: QrCode, t: "Présentez votre QR code à l'arrivée" },
            ].map((s, i) => (
              <div key={s.t} className="flex items-center gap-4 text-sm text-white/85">
                <span className="w-10 h-10 rounded-xl bg-sun/20 text-sun flex items-center justify-center shrink-0">
                  <s.icon size={18} />
                </span>
                <span>
                  <span className="text-sun font-bold mr-1.5">0{i + 1}</span>
                  {s.t}
                </span>
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
                eyebrow="Réservation confirmée"
                title={result.tariffLabel}
                action={
                  <Link href={`/profil?playerId=${playerId}`} className={ui.btnSun}>
                    <QrCode size={16} /> Voir mon QR code et mon profil
                  </Link>
                }
              >
                <p>{result.beachName}</p>
                <p className="capitalize">
                  {longDate(result.date)} à {result.time}
                </p>
                <p className="font-display text-2xl font-black text-sun pt-2">{formatFCFA(result.price)}</p>
                <p className="pt-4 text-sm text-white/60">
                  Présentez votre QR code personnel à l&rsquo;arrivée sur la plage pour un enregistrement immédiat.
                </p>
              </SuccessPanel>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="grid lg:grid-cols-12 gap-6 items-start"
            >
              <div className="lg:col-span-8 space-y-6">
                <FormSection>
                  <StepTitle n={1} title="La plage" hint="Où souhaitez-vous jouer ?" />
                  {!beachesLoaded ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="skeleton h-20 rounded-2xl" />
                      <div className="skeleton h-20 rounded-2xl" />
                    </div>
                  ) : beaches.length === 0 ? (
                    <p className="text-sm text-ink/50">Aucune plage disponible pour le moment.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {beaches.map((b) => (
                        <label key={b.id} className={optionCls(beachId === b.id, "lagoon")}>
                          <input
                            type="radio"
                            name="beach"
                            value={b.id}
                            checked={beachId === b.id}
                            onChange={() => setBeachId(b.id)}
                            className="sr-only"
                          />
                          <SelectedTick show={beachId === b.id} />
                          <p className="font-bold text-ink pr-8">{b.name}</p>
                          <p className="text-sm text-ink/60 inline-flex items-center gap-1.5 mt-1">
                            <MapPin size={13} className="text-coral" /> {b.location}
                          </p>
                        </label>
                      ))}
                    </div>
                  )}
                  <Link href="/plages" className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-lagoon hover:text-coral transition-colors">
                    Voir toutes les plages, photos et avis →
                  </Link>
                </FormSection>

                <FormSection delay={0.05}>
                  <StepTitle n={2} title="La formule" hint="Tarifs dégressifs pour les groupes et les familles." />
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                    {TARIFFS.map((t) => (
                      <label key={t.id} className={optionCls(tariffId === t.id)}>
                        <input
                          type="radio"
                          name="tariff"
                          value={t.id}
                          checked={tariffId === t.id}
                          onChange={() => setTariffId(t.id)}
                          className="sr-only"
                        />
                        <SelectedTick show={tariffId === t.id} />
                        <p className="font-bold text-ink pr-8">{t.label}</p>
                        <p className="text-sm text-ink/60">{t.detail}</p>
                        <p className="mt-3 font-display text-xl font-black text-coral">{formatFCFA(t.price)}</p>
                      </label>
                    ))}
                  </div>
                </FormSection>

                <FormSection delay={0.1}>
                  <StepTitle n={3} title="Date & heure" hint="Vendredi soir, samedi et dimanche." />
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
                      {weekendHint && (
                        <p className="mt-2 text-xs font-semibold text-coral">
                          Ce jour est hors week-end : disponible uniquement pour des cours privatisés, sous réserve de
                          confirmation.
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={ui.label}>Heure</span>
                      <div className="grid grid-cols-3 gap-2">
                        {PLAY_SLOTS.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setTime(s)}
                            className={`rounded-full border-2 py-2.5 text-sm font-bold transition-all ${
                              time === s
                                ? "border-ink bg-ink text-white"
                                : "border-ink/10 bg-white text-ink/70 hover:border-ink/30"
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
                  <StepTitle n={4} title="Vos coordonnées" hint="Votre profil joueur est créé automatiquement." />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={ui.label} htmlFor="name">
                        Nom complet
                      </label>
                      <input
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Awa Djossou"
                        className={ui.input}
                      />
                    </div>
                    <div>
                      <label className={ui.label} htmlFor="phone">
                        Téléphone (Mobile Money)
                      </label>
                      <input
                        id="phone"
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className={ui.input}
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection delay={0.2}>
                  <StepTitle n={5} title="Paiement" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {PAYMENTS.map((m) => (
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
                        <p className="text-xs text-ink/55 mt-1">{m.hint}</p>
                      </label>
                    ))}
                  </div>
                </FormSection>
              </div>

              {/* Récapitulatif collant */}
              <motion.aside
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="lg:col-span-4 lg:sticky lg:top-[calc(var(--nav-height,4.5rem)+1.5rem)]"
              >
                <div className="relative overflow-hidden bg-ink text-white rounded-card p-7 shadow-xl shadow-ink/15">
                  <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/15 blur-3xl" aria-hidden />
                  <p className="relative text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Récapitulatif</p>
                  <div className="relative mt-4">
                    <SummaryRow label="Plage" value={selectedBeach?.name ?? "—"} />
                    <SummaryRow label="Formule" value={selectedTariff.label} />
                    <SummaryRow
                      label="Date"
                      value={date ? <span className="capitalize">{longDate(date)}</span> : "À choisir"}
                    />
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
                      key={selectedTariff.price}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-3xl font-black text-sun"
                    >
                      {formatFCFA(selectedTariff.price)}
                    </motion.span>
                  </div>

                  {error && <p className="relative mt-5 text-sm font-semibold text-white bg-coral/90 rounded-2xl px-4 py-3">{error}</p>}

                  <button type="submit" disabled={loading || !beachId} className={`relative mt-6 w-full ${ui.btnPrimary}`}>
                    {loading ? "Confirmation en cours…" : "Confirmer la réservation"}
                  </button>
                  <p className="relative mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                    <ShieldCheck size={14} className="text-sun" /> Matériel fourni sur place
                  </p>
                </div>
              </motion.aside>
            </motion.form>
          )}
        </AnimatePresence>
      </PageBody>
    </div>
  );
}
