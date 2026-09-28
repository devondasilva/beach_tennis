import { NextRequest, NextResponse } from "next/server";
import { updateEvent, deleteEvent, getEventById } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/upload";
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

  const { poster: _poster, registrations: _registrations, id: _id, ...patch } = await req.json();
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

  const existing = getEventById(params.id);
  const ok = deleteEvent(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
  }
  if (existing?.poster) deleteUploadedFile(existing.poster);
  return NextResponse.json({ ok: true });
}
