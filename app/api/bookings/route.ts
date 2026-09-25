import { NextRequest, NextResponse } from "next/server";
import { createBooking, findOrCreatePlayer, getBookings, getBeachById } from "@/lib/db";
import { findTariff, TARIFFS } from "@/lib/pricing";
import { PaymentMethod } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = getBookings().sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, beachId, tariffId, date, time, paymentMethod } = body as {
    name: string;
    phone: string;
    beachId: string;
    tariffId: string;
    date: string;
    time: string;
    paymentMethod: PaymentMethod;
  };

  if (!name || !phone || !beachId || !tariffId || !date || !time) {
    return NextResponse.json(
      { error: "Tous les champs — dont la plage choisie — sont requis pour réserver un créneau." },
      { status: 400 }
    );
  }

  const beach = getBeachById(beachId);
  if (!beach) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 400 });
  }

  const tariff = findTariff(tariffId, TARIFFS);
  if (!tariff) {
    return NextResponse.json({ error: "Formule inconnue." }, { status: 400 });
  }

  const player = findOrCreatePlayer(name, phone);

  const booking = createBooking({
    playerId: player.id,
    playerName: player.name,
    beachId: beach.id,
    beachName: beach.name,
    tariffId: tariff.id,
    tariffLabel: `${tariff.label} (${tariff.detail})`,
    date,
    time,
    price: tariff.price,
    paymentMethod: paymentMethod ?? "sur_place",
    status: "confirmee",
  });

  return NextResponse.json({ booking, player });
}
