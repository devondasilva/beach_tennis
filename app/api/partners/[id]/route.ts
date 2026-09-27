import { NextRequest, NextResponse } from "next/server";
import { deletePartner } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const partner = deletePartner(params.id);
  if (!partner) {
    return NextResponse.json({ error: "Partenaire introuvable." }, { status: 404 });
  }
  deleteUploadedFile(partner.logoUrl);
  return NextResponse.json({ ok: true });
}
