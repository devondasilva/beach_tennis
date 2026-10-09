import { NextRequest, NextResponse } from "next/server";
import { findOrCreatePlayer } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { checkLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const wait = checkLimit(`player-login:${clientIp(req)}`, 20, 15 * 60 * 1000);
  if (wait > 0) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let body: { name?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name : "";
  const phone = typeof body.phone === "string" ? body.phone : "";

  if (!phone) {
    return NextResponse.json({ error: "Le numéro de téléphone est requis." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json(
      { error: "Le nom est requis pour la première connexion." },
      { status: 400 }
    );
  }

  const player = findOrCreatePlayer(name, phone);
  const token = await createSessionToken("player", player.id, player.name);
  const res = NextResponse.json({
    session: { role: "player", id: player.id, name: player.name },
    player,
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
