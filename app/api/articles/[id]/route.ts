import { NextRequest, NextResponse } from "next/server";
import { deleteArticle, setArticleFeatured } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bascule la mise en avant sur la page d'accueil. Body JSON : { featured: boolean } */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { featured } = body as { featured: boolean };
  const article = setArticleFeatured(params.id, !!featured);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }
  return NextResponse.json({ article });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const article = deleteArticle(params.id);
  if (!article) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }
  if (article.imageUrl) deleteUploadedFile(article.imageUrl);
  return NextResponse.json({ ok: true });
}
