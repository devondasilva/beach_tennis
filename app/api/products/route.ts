import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = getProducts();
  return NextResponse.json({ products });
}

/** Création (admin) : multipart/form-data avec champs texte + fichiers "images" (optionnel). */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const price = Number(form.get("price"));
  const stock = Number(form.get("stock"));
  const description = String(form.get("description") ?? "").trim();

  if (!name || !category || Number.isNaN(price) || Number.isNaN(stock)) {
    return NextResponse.json(
      { error: "Nom, catégorie, prix et stock sont requis." },
      { status: 400 }
    );
  }

  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const images: string[] = [];
  try {
    for (const file of files) {
      images.push(await saveUploadedImage(file, "products"));
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi des images." },
      { status: 400 }
    );
  }

  const product = createProduct({ name, category, price, description, stock, images });
  return NextResponse.json({ product });
}
