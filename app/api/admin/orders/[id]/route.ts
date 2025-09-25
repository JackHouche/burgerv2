import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "preparing", "ready", "completed"])
    .optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const db = getDb();

    // Vérifier que la commande existe
    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Mettre à jour la commande
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Récupérer les articles de la commande
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const completeOrder = {
      ...updatedOrder,
      items,
    };

    return NextResponse.json(completeOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
