import { Suspense } from "react";
import ReservationClient from "./ReservationClient";

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="max-w-content mx-auto px-6 py-16">Chargement…</div>}>
      <ReservationClient />
    </Suspense>
  );
}
