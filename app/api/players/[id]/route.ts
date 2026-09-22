import { NextRequest, NextResponse } from "next/server";
import { getPlayerById, getBookings, getLessons, getOrders, getEvents } from "@/lib/db";

export const runtime = "nodejs";

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
