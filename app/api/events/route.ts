import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const events = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));
  return NextResponse.json({ events });
}
