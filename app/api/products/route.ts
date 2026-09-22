import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = getProducts();
  return NextResponse.json({ products });
}
