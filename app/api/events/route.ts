import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const events = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  const body = await req.json();
  const { title, date, category, description, entryFee, prize, capacity } = body as {
    title: string;
    date: string;
    category: string;
    description: string;
    entryFee: number;
    prize: string;
    capacity: number;
  };

  if (!title || !date || !category || !capacity) {
    return NextResponse.json(
      { error: "Titre, date, catégorie et capacité sont requis." },
      { status: 400 }
    );
  }

  const event = createEvent({
    title,
    date,
    category,
    description: description ?? "",
    entryFee: entryFee ?? 0,
    prize: prize ?? "",
    capacity,
  });
  return NextResponse.json({ event });
}
