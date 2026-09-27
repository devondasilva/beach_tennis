import { NextRequest, NextResponse } from "next/server";
import { getAdById, updateAd } from "@/lib/db";
import { saveUploadedImage, deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Remplace le visuel d'une publicité existante (admin). */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const existing = getAdById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
  }

  let imageUrl: string;
  try {
    imageUrl = await saveUploadedImage(file, "ads");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi de l'image." },
      { status: 400 }
    );
  }

  const ad = updateAd(params.id, { imageUrl });
  deleteUploadedFile(existing.imageUrl);
  return NextResponse.json({ ad });
}
