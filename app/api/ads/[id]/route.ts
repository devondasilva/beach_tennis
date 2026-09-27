import { NextRequest, NextResponse } from "next/server";
import { updateAd, deleteAd, getAdById } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Modifie une publicité : activer/désactiver, changer le lien, les dates, etc. (admin) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const patch = await req.json();
  const ad = updateAd(params.id, patch);
  if (!ad) {
    return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ad });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const ad = getAdById(params.id);
  const ok = deleteAd(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
  }
  if (ad) deleteUploadedFile(ad.imageUrl);
  return NextResponse.json({ ok: true });
}
