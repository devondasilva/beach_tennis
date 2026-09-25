import { NextRequest, NextResponse } from "next/server";
import { updateEvent, deleteEvent } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const patch = await req.json();
  const event = updateEvent(params.id, patch);
  if (!event) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }
  return NextResponse.json({ event });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const ok = deleteEvent(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
