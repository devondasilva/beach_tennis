import { NextRequest, NextResponse } from "next/server";
import { findOrCreatePlayer, registerToEvent, removeEventRegistration } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { name, phone } = body as { name: string; phone: string };

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Le nom et le numéro de téléphone sont requis." },
      { status: 400 }
    );
  }

  const player = findOrCreatePlayer(name, phone);
  const result = registerToEvent(params.id, player.id, player.name);

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: result.message, event: result.event, player });
}

/** Retrait d'une inscription par un administrateur. Body : { playerId } */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { playerId } = body as { playerId: string };
  if (!playerId) {
    return NextResponse.json({ error: "playerId requis." }, { status: 400 });
  }

  const event = removeEventRegistration(params.id, playerId);
  if (!event) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }
  return NextResponse.json({ event });
}
