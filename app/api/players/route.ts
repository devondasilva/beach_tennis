import { NextRequest, NextResponse } from "next/server";
import { getPlayers, findOrCreatePlayer } from "@/lib/db";
import { getServerSession } from "@/lib/auth";
import { Level } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Réservé aux utilisateurs connectés (joueur ou admin), comme le classement.
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  // Jamais le numéro de téléphone dans cette liste, même connecté : il ne
  // sert à rien pour un classement et ne doit pas être exposé au client.
  const players = getPlayers()
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    .map(({ id, name, level, loyaltyPoints, createdAt }) => ({
      id,
      name,
      level,
      loyaltyPoints,
      createdAt,
    }));
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
