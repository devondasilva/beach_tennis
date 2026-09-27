import { NextRequest, NextResponse } from "next/server";
import { getAds, getActiveAdsByPlacement, createAd } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";
import { AdPlacement } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLACEMENTS: AdPlacement[] = ["accueil", "boutique", "evenements", "cours"];

/**
 * GET public (site) : ?placement=accueil -> annonces actives et dans leur fenêtre de diffusion.
 * GET admin (back-office) : ?admin=1 -> toutes les annonces, actives ou non.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wantsAdmin = searchParams.get("admin") === "1";

  if (wantsAdmin) {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
    }
    return NextResponse.json({ ads: getAds() });
  }

  const placement = searchParams.get("placement") as AdPlacement | null;
  if (!placement || !PLACEMENTS.includes(placement)) {
    return NextResponse.json({ ads: [] });
  }
  return NextResponse.json({ ads: getActiveAdsByPlacement(placement) });
}

/** Création d'une publicité (admin) : multipart/form-data avec champs texte + fichier "image". */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const advertiser = String(form.get("advertiser") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const targetUrl = String(form.get("targetUrl") ?? "").trim();
  const placement = String(form.get("placement") ?? "") as AdPlacement;
  const startDate = String(form.get("startDate") ?? "").trim() || null;
  const endDate = String(form.get("endDate") ?? "").trim() || null;
  const file = form.get("image");

  if (!advertiser || !title || !targetUrl || !PLACEMENTS.includes(placement)) {
    return NextResponse.json(
      { error: "Annonceur, titre, lien et emplacement sont requis." },
      { status: 400 }
    );
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Le visuel de la publicité est requis." }, { status: 400 });
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

  const ad = createAd({
    advertiser,
    title,
    targetUrl,
    placement,
    startDate,
    endDate,
    imageUrl,
    active: true,
  });
  return NextResponse.json({ ad });
}
