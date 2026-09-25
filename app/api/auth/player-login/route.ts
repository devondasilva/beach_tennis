import { NextRequest, NextResponse } from "next/server";
import { findOrCreatePlayer } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone } = body as { name: string; phone: string };

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
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
