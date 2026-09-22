import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getPlayerById } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { playerId: string } }
) {
  const player = getPlayerById(params.playerId);
  if (!player) {
    return NextResponse.json({ error: "Joueur introuvable." }, { status: 404 });
  }

  const payload = `BEACHTENNISBJ:${player.id}`;
  const svg = await QRCode.toString(payload, {
    type: "svg",
    margin: 1,
    color: { dark: "#0B2E3D", light: "#00000000" },
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
