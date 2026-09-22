import { NextRequest, NextResponse } from "next/server";
import { createLesson, findOrCreatePlayer, getLessons } from "@/lib/db";
import { findTariff, LESSON_TARIFFS } from "@/lib/pricing";
import { PaymentMethod } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const lessons = getLessons().sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ lessons });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, coach, formulaId, date, time, paymentMethod } = body as {
    name: string;
    phone: string;
    coach: string;
    formulaId: string;
    date: string;
    time: string;
    paymentMethod: PaymentMethod;
  };

  if (!name || !phone || !coach || !formulaId || !date || !time) {
    return NextResponse.json(
      { error: "Tous les champs sont requis pour réserver un cours." },
      { status: 400 }
    );
  }

  const formula = findTariff(formulaId, LESSON_TARIFFS);
  if (!formula) {
    return NextResponse.json({ error: "Formule de cours inconnue." }, { status: 400 });
  }

  const player = findOrCreatePlayer(name, phone);

  const lesson = createLesson({
    playerId: player.id,
    playerName: player.name,
    coach,
    formulaId: formula.id,
    formulaLabel: `${formula.label} (${formula.detail})`,
    date,
    time,
    price: formula.price,
    paymentMethod: paymentMethod ?? "sur_place",
  });

  return NextResponse.json({ lesson, player });
}
