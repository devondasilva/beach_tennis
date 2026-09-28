import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent } from "@/lib/db";
import { saveUploadedImage, deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ajoute ou remplace l'affiche d'un événement (admin). multipart/form-data, champ "poster". */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  const existing = getEventById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("poster");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Aucune affiche reçue." }, { status: 400 });
  }

  let poster: string;
  try {
    poster = await saveUploadedImage(file, "events");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi de l'affiche." },
      { status: 400 }
    );
  }

  const event = updateEvent(params.id, { poster });
  if (existing.poster) deleteUploadedFile(existing.poster);
  return NextResponse.json({ event });
}

/** Retire l'affiche d'un événement (admin). */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  const existing = getEventById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }
  const event = updateEvent(params.id, { poster: null });
  if (existing.poster) deleteUploadedFile(existing.poster);
  return NextResponse.json({ event });
}
