import { NextRequest, NextResponse } from "next/server";
import {
  getBeachById,
  updateBeach,
  deleteBeach,
  getReviewsByBeach,
  getBeachRating,
} from "@/lib/db";
import { deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const beach = getBeachById(params.id);
  if (!beach) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 404 });
  }
  const reviews = getReviewsByBeach(params.id);
  const rating = getBeachRating(params.id);
  return NextResponse.json({ beach, reviews, rating });
}

/** Mise à jour des champs texte (admin). Pas de fichiers ici — voir /images. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const patch = await req.json();
  const beach = updateBeach(params.id, patch);
  if (!beach) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 404 });
  }
  return NextResponse.json({ beach });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const beach = getBeachById(params.id);
  if (!beach) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 404 });
  }
  for (const img of beach.images) deleteUploadedFile(img);

  deleteBeach(params.id);
  return NextResponse.json({ ok: true });
}
