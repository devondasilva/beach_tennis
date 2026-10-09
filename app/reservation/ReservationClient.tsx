"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TARIFFS, PLAY_SLOTS, formatFCFA, isWeekendFriendlyDate } from "@/lib/pricing";

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

export default function ReservationClient() {
  const params = useSearchParams();
  const preselectedBeachId = params.get("beachId");

  const [beaches, setBeaches] = useState<Beach[]>([]);
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
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTariff = TARIFFS.find((t) => t.id === tariffId)!;
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
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-content mx-auto px-6 py-20">
        <div className="max-w-lg mx-auto bg-lagoon text-sandlight rounded-card p-10 text-center">
          <p className="tag-label !text-sun mb-2">Réservation confirmée</p>
          <h1 className="font-display text-3xl">{result.tariffLabel}</h1>
          <p className="mt-4 text-sandlight/85">{result.beachName}</p>
          <p className="mt-1 text-sandlight/85">
            {new Date(result.date + "T00:00:00").toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            à {result.time}
          </p>
          <p className="mt-1 text-sandlight/85">{formatFCFA(result.price)}</p>
          <div className="rule bg-sandlight/20 my-6" />
          <p className="text-sm text-sandlight/75">
            Présentez votre QR code personnel à l&rsquo;arrivée sur la plage pour un
            enregistrement immédiat.
          </p>
          <Link
            href={`/profil?playerId=${playerId}`}
            className="mt-6 inline-flex items-center rounded-card bg-sun text-ink font-semibold px-6 py-3 hover:bg-white transition-colors"
          >
            Voir mon QR code et mon profil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Réservation</p>
        <h1 className="font-display text-4xl text-ink">Choisissez votre créneau</h1>
        <p className="mt-3 text-ink/70">
          L&rsquo;activité se joue surtout le week-end — vendredi soir, samedi et
          dimanche. Le règlement se fait par Mobile Money ou sur place.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-xl space-y-8">
        <fieldset>
          <legend className="font-display text-lg text-ink mb-4">Plage</legend>
          {beaches.length === 0 ? (
            <p className="text-sm text-ink/50">Chargement des plages disponibles…</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {beaches.map((b) => (
                <label
                  key={b.id}
                  className={`cursor-pointer rounded-card border p-4 transition-colors ${
                    beachId === b.id
                      ? "border-lagoon bg-lagoon/5"
                      : "border-ink/15 hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="beach"
                    value={b.id}
                    checked={beachId === b.id}
                    onChange={() => setBeachId(b.id)}
                    className="sr-only"
                  />
                  <p className="font-semibold text-ink">{b.name}</p>
                  <p className="text-sm text-ink/60">{b.location}</p>
                </label>
              ))}
            </div>
          )}
          <Link
            href="/plages"
            className="mt-2 inline-block text-xs font-semibold text-lagoon hover:underline"
          >
            Voir toutes les plages, photos et avis →
          </Link>
        </fieldset>

        <fieldset>
          <legend className="font-display text-lg text-ink mb-4">Formule</legend>
          <div className="grid sm:grid-cols-2 gap-3">
            {TARIFFS.map((t) => (
              <label
                key={t.id}
                className={`cursor-pointer rounded-card border p-4 transition-colors ${
                  tariffId === t.id
                    ? "border-coral bg-coral/5"
                    : "border-ink/15 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="tariff"
                  value={t.id}
                  checked={tariffId === t.id}
                  onChange={() => setTariffId(t.id)}
                  className="sr-only"
                />
                <p className="font-semibold text-ink">{t.label}</p>
                <p className="text-sm text-ink/60">{t.detail}</p>
                <p className="mt-2 font-display text-lg text-coral">
                  {formatFCFA(t.price)}
                </p>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
            />
            {weekendHint && (
              <p className="mt-1 text-xs text-coral">
                Ce jour est hors week-end : disponible uniquement pour des cours
                privatisés, sous réserve de confirmation.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1" htmlFor="time">
              Heure
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
            >
              {PLAY_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1" htmlFor="name">
              Nom complet
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Awa Djossou"
              className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1" htmlFor="phone">
              Téléphone (Mobile Money)
            </label>
            <input
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+229 97 00 00 00"
              className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
            />
          </div>
        </div>

        <fieldset>
          <legend className="font-display text-lg text-ink mb-4">Paiement</legend>
          <div className="grid sm:grid-cols-3 gap-3">
            {(
              [
                { id: "mtn_momo", label: "MTN Mobile Money" },
                { id: "moov_money", label: "Moov Money" },
                { id: "sur_place", label: "Sur place" },
              ] as { id: PaymentMethod; label: string }[]
            ).map((m) => (
              <label
                key={m.id}
                className={`cursor-pointer text-center rounded-card border px-3 py-3 text-sm font-semibold transition-colors ${
                  paymentMethod === m.id
                    ? "border-lagoon bg-lagoon/10 text-lagoon"
                    : "border-ink/15 text-ink/70 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                  className="sr-only"
                />
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3">{error}</p>
        )}

        <div className="flex items-center justify-between rounded-card bg-sand px-5 py-4">
          <span className="text-sm text-ink/70">Total à régler</span>
          <span className="font-display text-2xl text-ink">
            {formatFCFA(selectedTariff.price)}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !beachId}
          className="w-full rounded-card bg-coral text-white font-semibold px-6 py-3 hover:bg-ink transition-colors disabled:opacity-60"
        >
          {loading ? "Confirmation en cours…" : "Confirmer la réservation"}
        </button>
      </form>
    </div>
  );
}
