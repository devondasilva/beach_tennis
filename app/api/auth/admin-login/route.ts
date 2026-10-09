import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { checkLimit, clientIp, resetLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limitKey = `admin-login:${clientIp(req)}`;
  const wait = checkLimit(limitKey, 5, 15 * 60 * 1000);
  if (wait > 0) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(wait / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const { username, password } = body;

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return NextResponse.json(
      { error: "Identifiant et mot de passe requis." },
      { status: 400 }
    );
  }

  const admin = verifyAdminCredentials(username, password);
  if (!admin) {
    return NextResponse.json(
      { error: "Identifiant ou mot de passe incorrect." },
      { status: 401 }
    );
  }

  resetLimit(limitKey);
  const token = await createSessionToken("admin", admin.id, admin.name);
  const res = NextResponse.json({
    session: { role: "admin", id: admin.id, name: admin.name },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: req.headers.get("x-forwarded-proto") === "https" || req.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
