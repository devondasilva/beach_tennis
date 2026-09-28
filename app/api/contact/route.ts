import { NextRequest, NextResponse } from "next/server";
import { getContactMessages, createContactMessage } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }
  return NextResponse.json({ messages: getContactMessages() });
}

/** Envoi du formulaire "Parlons de votre projet" (public). */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, message } = body as { name: string; phone: string; message: string };

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Nom, téléphone et message sont requis." },
      { status: 400 }
    );
  }

  const msg = createContactMessage({
    name: name.trim(),
    phone: phone.trim(),
    message: message.trim(),
  });
  return NextResponse.json({ message: msg });
}
