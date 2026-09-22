import { NextRequest, NextResponse } from "next/server";
import { getPlayers, findOrCreatePlayer } from "@/lib/db";
import { Level } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const players = getPlayers().sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);
  return NextResponse.json({ players });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, level } = body as {
    name: string;
    phone: string;
    level?: Level;
  };

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Le nom et le numéro de téléphone sont requis." },
      { status: 400 }
    );
  }

  const player = findOrCreatePlayer(name, phone, level ?? "debutant");
  return NextResponse.json({ player });
}
