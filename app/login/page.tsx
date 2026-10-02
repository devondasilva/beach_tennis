import { Suspense } from "react";
import LoginClient from "./LoginClient";
import PageLoading from "@/components/ui/PageLoading";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LoginClient />
    </Suspense>
  );
}
