import { NextResponse } from "next/server";
import { getCoaches } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const coaches = getCoaches();
  return NextResponse.json({ coaches });
}
