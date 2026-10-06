import type { ReactNode } from "react";

export default function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-card p-12 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-sandlight text-coral flex items-center justify-center">
        {icon}
      </div>
      <p className="mt-5 font-display text-2xl font-black text-ink">{title}</p>
      {children && <div className="mt-2 text-sm text-ink/60 max-w-sm mx-auto">{children}</div>}
    </div>
  );
}
