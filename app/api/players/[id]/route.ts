import { NextRequest, NextResponse } from "next/server";
import {
  getPlayerById,
  getBookings,
  getLessons,
  getOrders,
  getEvents,
  adjustPlayerPointsManually,
  updatePlayerLevel,
} from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Level } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const player = getPlayerById(params.id);
  if (!player) {
    return NextResponse.json({ error: "Joueur introuvable." }, { status: 404 });
  }

  const bookings = getBookings().filter((b) => b.playerId === player.id);
  const lessons = getLessons().filter((l) => l.playerId === player.id);
  const orders = getOrders().filter((o) => o.playerId === player.id);
  const events = getEvents().filter((e) =>
    e.registrations.some((r) => r.playerId === player.id)
  );

  return NextResponse.json({ player, bookings, lessons, orders, events });
}

/** Ajustement admin : { pointsDelta?: number, level?: Level } */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { pointsDelta, level } = body as { pointsDelta?: number; level?: Level };

  let player = getPlayerById(params.id);
  if (!player) {
    return NextResponse.json({ error: "Joueur introuvable." }, { status: 404 });
  }

  if (typeof pointsDelta === "number" && pointsDelta !== 0) {
    player = adjustPlayerPointsManually(params.id, pointsDelta) ?? player;
  }
  if (level) {
    player = updatePlayerLevel(params.id, level) ?? player;
  }

  return NextResponse.json({ player });
}
