import { Suspense } from "react";
import ProfilClient from "./ProfilClient";
import PageLoading from "@/components/ui/PageLoading";

export default function ProfilPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ProfilClient />
    </Suspense>
  );
}
