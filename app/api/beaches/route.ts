import { NextRequest, NextResponse } from "next/server";
import { getBeaches, createBeach, getBeachRating } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const beaches = getBeaches().map((b) => ({ ...b, rating: getBeachRating(b.id) }));
  return NextResponse.json({ beaches });
}

/** Création (admin) : multipart/form-data avec champs texte + fichiers "images". */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const amenitiesRaw = String(form.get("amenities") ?? "");
  const amenities = amenitiesRaw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (!name || !location) {
    return NextResponse.json({ error: "Le nom et la localisation sont requis." }, { status: 400 });
  }

  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const images: string[] = [];
  try {
    for (const file of files) {
      images.push(await saveUploadedImage(file, "beaches"));
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi des images." },
      { status: 400 }
    );
  }

  const beach = createBeach({ name, location, description, amenities, active: true, images });
  return NextResponse.json({ beach });
}
