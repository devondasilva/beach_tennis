import { NextRequest, NextResponse } from "next/server";
import { getAdminById, updateAdminPassword } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body as {
    currentPassword: string;
    newPassword: string;
  };

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Mot de passe actuel et nouveau mot de passe requis." },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." },
      { status: 400 }
    );
  }

  const admin = getAdminById(session.id);
  if (!admin) {
    return NextResponse.json({ error: "Administrateur introuvable." }, { status: 404 });
  }

  const ok = verifyPassword(currentPassword, admin.passwordHash, admin.passwordSalt);
  if (!ok) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
  }

  const { hash, salt } = hashPassword(newPassword);
  updateAdminPassword(admin.id, hash, salt);

  return NextResponse.json({ ok: true });
}
