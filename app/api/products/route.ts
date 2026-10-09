import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { name, category, price, description, stock } = body as {
    name: string;
    category: string;
    price: number;
    description: string;
    stock: number;
  };

  if (!name || !category || price == null || stock == null) {
    return NextResponse.json(
      { error: "Nom, catégorie, prix et stock sont requis." },
      { status: 400 }
    );
  }

  const product = createProduct({
    name,
    category,
    price,
    description: description ?? "",
    stock,
  });
  return NextResponse.json({ product });
}
