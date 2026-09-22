import { NextRequest, NextResponse } from "next/server";
import { createOrder, findOrCreatePlayer, getOrders, getProducts } from "@/lib/db";
import { OrderItem } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const orders = getOrders().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, productId, qty } = body as {
    name: string;
    phone: string;
    productId: string;
    qty: number;
  };

  if (!name || !phone || !productId || !qty || qty < 1) {
    return NextResponse.json(
      { error: "Nom, téléphone, produit et quantité sont requis." },
      { status: 400 }
    );
  }

  const product = getProducts().find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  if (product.stock < qty) {
    return NextResponse.json(
      { error: `Stock insuffisant (restant : ${product.stock}).` },
      { status: 400 }
    );
  }

  const player = findOrCreatePlayer(name, phone);
  const items: OrderItem[] = [
    { productId: product.id, name: product.name, qty, price: product.price },
  ];
  const total = product.price * qty;

  const order = createOrder({
    playerId: player.id,
    playerName: player.name,
    items,
    total,
  });

  return NextResponse.json({ order, player });
}
