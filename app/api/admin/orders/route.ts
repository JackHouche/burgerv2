import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDb();

    const allOrders = status
      ? await db
          .select()
          .from(orders)
          .where(eq(orders.status, status as any))
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset)
      : await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset);

    // Récupérer les articles pour chaque commande
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order: any) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items,
        };
      }),
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
