import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "@/lib/db";
import { saveUploadedImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";
import { ArticleCategory } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") as ArticleCategory | null;
  const featuredOnly = req.nextUrl.searchParams.get("featured") === "1";
  let articles = getArticles();
  if (category) articles = articles.filter((a) => a.category === category);
  if (featuredOnly) articles = articles.filter((a) => a.featured);
  return NextResponse.json({ articles });
}

/** Création d'un article ou d'une revue de presse (admin). multipart/form-data, image optionnelle. */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  const category = String(form.get("category") ?? "actualite") as ArticleCategory;
  const sourceUrl = String(form.get("sourceUrl") ?? "").trim() || null;
  const sourceName = String(form.get("sourceName") ?? "").trim() || null;
  const publishedAtInput = String(form.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput).toISOString()
    : new Date().toISOString();
  const featured = form.get("featured") === "true";
  const file = form.get("image");

  if (!title || !excerpt || (category === "actualite" && !content)) {
    return NextResponse.json(
      { error: "Titre, résumé et (pour une actualité) contenu sont requis." },
      { status: 400 }
    );
  }
  if (category !== "actualite" && category !== "revue_presse") {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  if (category === "revue_presse" && !sourceUrl) {
    return NextResponse.json(
      { error: "Le lien vers l'article original est requis pour une revue de presse." },
      { status: 400 }
    );
  }

  let imageUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveUploadedImage(file, "articles");
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Échec de l'envoi de l'image." },
        { status: 400 }
      );
    }
  }

  const article = createArticle({
    title,
    excerpt,
    content,
    category,
    sourceUrl,
    sourceName,
    imageUrl,
    featured,
    publishedAt,
  });
  return NextResponse.json({ article });
}
