import { NextRequest } from "next/server";

/**
 * Limiteur en mémoire (par processus) : suffisant pour un serveur unique.
 * Sur plusieurs instances, le remplacer par un stockage partagé (Redis, etc.).
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip")) || "local";
}

/** Renvoie le nombre de secondes à attendre si la limite est dépassée, sinon 0. */
export function checkLimit(key: string, max: number, windowMs: number): number {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  b.count++;
  return b.count > max ? Math.ceil((b.resetAt - now) / 1000) : 0;
}

export function resetLimit(key: string): void {
  buckets.delete(key);
}
