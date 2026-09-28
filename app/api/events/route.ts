import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const events = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));
  return NextResponse.json({ events });
}

/** Création (admin) : multipart/form-data, affiche optionnelle dans le champ "poster". */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const date = String(form.get("date") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const prize = String(form.get("prize") ?? "").trim();
  const entryFee = Number(form.get("entryFee")) || 0;
  const capacity = Number(form.get("capacity")) || 0;
  const file = form.get("poster");

  if (!title || !date || !category || !capacity) {
    return NextResponse.json(
      { error: "Titre, date, catégorie et capacité sont requis." },
      { status: 400 }
    );
  }

  let poster: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      poster = await saveUploadedImage(file, "events");
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Échec de l'envoi de l'affiche." },
        { status: 400 }
      );
    }
  }

  const event = createEvent({ title, date, category, description, entryFee, prize, capacity, poster });
  return NextResponse.json({ event });
}
