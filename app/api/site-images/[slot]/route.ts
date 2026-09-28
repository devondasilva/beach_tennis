import { NextRequest, NextResponse } from "next/server";
import { setSiteImage, removeSiteImage } from "@/lib/db";
import { saveUploadedImage, deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";
import { isSiteImageSlot } from "@/lib/site-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Définit ou remplace l'image d'un emplacement (admin). multipart/form-data, champ "image". */
export async function POST(
  req: NextRequest,
  { params }: { params: { slot: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  if (!isSiteImageSlot(params.slot)) {
    return NextResponse.json({ error: "Emplacement inconnu." }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
  }

  let imagePath: string;
  try {
    imagePath = await saveUploadedImage(file, "site");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi de l'image." },
      { status: 400 }
    );
  }

  const previous = setSiteImage(params.slot, imagePath);
  if (previous) deleteUploadedFile(previous);
  return NextResponse.json({ slot: params.slot, path: imagePath });
}

/** Retire l'image : l'illustration par défaut réapparaît sur le site (admin). */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slot: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  if (!isSiteImageSlot(params.slot)) {
    return NextResponse.json({ error: "Emplacement inconnu." }, { status: 404 });
  }
  const previous = removeSiteImage(params.slot);
  if (previous) deleteUploadedFile(previous);
  return NextResponse.json({ ok: true });
}
