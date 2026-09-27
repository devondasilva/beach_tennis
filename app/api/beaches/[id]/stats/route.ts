import { NextRequest, NextResponse } from "next/server";
import { getBeachById, getBeachStats } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  if (!getBeachById(params.id)) {
    return NextResponse.json({ error: "Plage introuvable." }, { status: 404 });
  }

  const monthsParam = Number(req.nextUrl.searchParams.get("months"));
  const months = Number.isFinite(monthsParam) && monthsParam > 0 ? monthsParam : 6;

  return NextResponse.json({ stats: getBeachStats(params.id, months) });
}
