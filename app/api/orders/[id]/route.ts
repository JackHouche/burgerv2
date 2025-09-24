import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const db = getDb();

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const completeOrder = {
      ...order,
      items,
    };

    return NextResponse.json(completeOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
