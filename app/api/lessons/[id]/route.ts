import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateLessonStatus } from "@/lib/db";
import { LessonStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID: LessonStatus[] = ["confirme", "annulee"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body as { status: LessonStatus };
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const lesson = updateLessonStatus(params.id, status);
  if (!lesson) {
    return NextResponse.json({ error: "Cours introuvable." }, { status: 404 });
  }
  return NextResponse.json({ lesson });
}
