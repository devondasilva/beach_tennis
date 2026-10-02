import { Suspense } from "react";
import ReservationClient from "./ReservationClient";
import PageLoading from "@/components/ui/PageLoading";

export default function ReservationPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ReservationClient />
    </Suspense>
  );
}
