import { NextRequest, NextResponse } from "next/server";
import { getPartners, createPartner } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ partners: getPartners() });
}

/** Création d'un partenaire (admin) : multipart/form-data, champ "logo" requis. */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const websiteUrl = String(form.get("websiteUrl") ?? "").trim() || null;
  const file = form.get("logo");

  if (!name) {
    return NextResponse.json({ error: "Le nom du partenaire est requis." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Le logo est requis." }, { status: 400 });
  }

  let logoUrl: string;
  try {
    logoUrl = await saveUploadedImage(file, "partners");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi du logo." },
      { status: 400 }
    );
  }

  const partner = createPartner({ name, websiteUrl, logoUrl });
  return NextResponse.json({ partner });
}
