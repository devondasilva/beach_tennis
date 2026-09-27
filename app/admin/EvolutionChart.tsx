import { BeachMonthlyStat } from "@/lib/types";
import { formatFCFA } from "@/lib/pricing";

function MiniBarChart({
  data,
  valueKey,
  color,
  format,
}: {
  data: BeachMonthlyStat[];
  valueKey: "revenue" | "bookings";
  color: string;
  format: (v: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => {
        const value = d[valueKey];
        const heightPct = value > 0 ? Math.max(6, Math.round((value / max) * 100)) : 2;
        return (
          <div key={d.month} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full">
            <span className="text-[10px] text-ink/60 mb-1 whitespace-nowrap truncate w-full text-center">
              {value > 0 ? format(value) : ""}
            </span>
            <div
              className="w-full rounded-t-md"
              style={{ height: `${heightPct}%`, backgroundColor: color, minHeight: 3 }}
              title={`${d.label} : ${format(value)}`}
            />
            <span className="text-[10px] text-ink/50 mt-2 whitespace-nowrap">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Évolution mensuelle des recettes et des réservations d'une plage. */
export default function EvolutionChart({ monthly }: { monthly: BeachMonthlyStat[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div>
        <p className="text-xs font-semibold text-ink/60 mb-3">Recettes par mois</p>
        <MiniBarChart data={monthly} valueKey="revenue" color="#E8593B" format={(v) => formatFCFA(v)} />
      </div>
      <div>
        <p className="text-xs font-semibold text-ink/60 mb-3">Réservations par mois</p>
        <MiniBarChart data={monthly} valueKey="bookings" color="#12807F" format={(v) => String(v)} />
      </div>
    </div>
  );
}
