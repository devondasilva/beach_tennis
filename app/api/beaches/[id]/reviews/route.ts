import { NextRequest, NextResponse } from "next/server";
import { getBeachById, getReviewsByBeach, createReview, findOrCreatePlayer } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const reviews = getReviewsByBeach(params.id);
  return NextResponse.json({ reviews });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const beach = getBeachById(params.id);
  if (!beach) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 404 });
  }

  const body = await req.json();
  const { name, phone, rating, comment } = body as {
    name: string;
    phone: string;
    rating: number;
    comment: string;
  };

  if (!name || !phone || !rating) {
    return NextResponse.json(
      { error: "Nom, téléphone et note sont requis." },
      { status: 400 }
    );
  }
  const ratingNum = Math.round(Number(rating));
  if (ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "La note doit être comprise entre 1 et 5." }, { status: 400 });
  }

  const player = findOrCreatePlayer(name, phone);
  const review = createReview({
    beachId: params.id,
    playerId: player.id,
    playerName: player.name,
    rating: ratingNum,
    comment: comment ?? "",
  });

  return NextResponse.json({ review });
}
