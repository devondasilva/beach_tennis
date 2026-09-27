import { Suspense } from "react";
import ReservationClient from "./ReservationClient";

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">Chargement…</div>}>
      <ReservationClient />
    </Suspense>
  );
}
