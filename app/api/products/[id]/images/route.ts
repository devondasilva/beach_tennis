import { NextRequest, NextResponse } from "next/server";
import { addProductImages, removeProductImage, getProductById } from "@/lib/db";
import { saveUploadedImage, deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ajoute une ou plusieurs photos à un produit existant (admin). */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  if (!getProductById(params.id)) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  const form = await req.formData();
  const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
  }

  const newPaths: string[] = [];
  try {
    for (const file of files) {
      newPaths.push(await saveUploadedImage(file, "products"));
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de l'envoi des images." },
      { status: 400 }
    );
  }

  const product = addProductImages(params.id, newPaths);
  return NextResponse.json({ product });
}

/** Retire une photo (admin). Body JSON : { path } */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { path: imgPath } = body as { path: string };
  if (!imgPath) {
    return NextResponse.json({ error: "path requis." }, { status: 400 });
  }

  const product = removeProductImage(params.id, imgPath);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  deleteUploadedFile(imgPath);
  return NextResponse.json({ product });
}
