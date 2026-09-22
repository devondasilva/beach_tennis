import { NextResponse } from "next/server";
import {
  getPlayers,
  getBookings,
  getLessons,
  getOrders,
  getEvents,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const players = getPlayers();
  const bookings = getBookings();
  const lessons = getLessons();
  const orders = getOrders();
  const events = getEvents();

  const revenueBookings = bookings.reduce((s, b) => s + b.price, 0);
  const revenueLessons = lessons.reduce((s, l) => s + l.price, 0);
  const revenueOrders = orders.reduce((s, o) => s + o.total, 0);
  const revenueEvents = events.reduce(
    (s, e) => s + e.entryFee * e.registrations.length,
    0
  );

  const totalRevenue =
    revenueBookings + revenueLessons + revenueOrders + revenueEvents;

  return NextResponse.json({
    totals: {
      players: players.length,
      bookings: bookings.length,
      lessons: lessons.length,
      orders: orders.length,
      eventRegistrations: events.reduce(
        (s, e) => s + e.registrations.length,
        0
      ),
      revenueBookings,
      revenueLessons,
      revenueOrders,
      revenueEvents,
      totalRevenue,
    },
    bookings,
    lessons,
    orders,
    events,
    players,
  });
}
