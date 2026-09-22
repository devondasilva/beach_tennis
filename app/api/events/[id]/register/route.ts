import { NextRequest, NextResponse } from "next/server";
import { findOrCreatePlayer, registerToEvent } from "@/lib/db";

export const runtime = "nodejs";

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
