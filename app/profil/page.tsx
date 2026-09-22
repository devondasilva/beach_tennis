import { Suspense } from "react";
import ProfilClient from "./ProfilClient";

export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="max-w-content mx-auto px-6 py-16">Chargement…</div>}>
      <ProfilClient />
    </Suspense>
  );
}
