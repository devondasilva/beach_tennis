import { NextRequest, NextResponse } from "next/server";
import { markContactMessageRead, deleteContactMessage } from "@/lib/db";
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

  const body = await req.json();
  const { read } = body as { read: boolean };
  const message = markContactMessageRead(params.id, !!read);
  if (!message) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
  return NextResponse.json({ message });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const ok = deleteContactMessage(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
