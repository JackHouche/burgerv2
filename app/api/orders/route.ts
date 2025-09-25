import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { orders, orderItems, timeSlots } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { generateOrderNumber, calculateOrderTotal } from "@/lib/utils/orders";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/),
  items: z
    .array(
      z.object({
        productId: z.number(),
        productName: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        customizations: z.string().optional(),
      }),
    )
    .min(1),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const db = getDb();

    // Calculer le montant total
    const totalAmount = calculateOrderTotal(validatedData.items);

    // Générer le numéro de commande
    const orderNumber = generateOrderNumber();

    // Créer la commande
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        status: "pending",
        totalAmount,
        pickupDate: validatedData.pickupDate,
        pickupTime: validatedData.pickupTime,
        notes: validatedData.notes,
      })
      .returning();

    // Ajouter les articles de la commande
    const orderItemsData = validatedData.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      customizations: item.customizations,
      subtotal: item.quantity * item.unitPrice,
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Marquer le créneau comme réservé
    await db
      .update(timeSlots)
      .set({
        orderId: newOrder.id,
        isAvailable: false,
      })
      .where(
        and(
          eq(timeSlots.date, validatedData.pickupDate),
          eq(timeSlots.time, validatedData.pickupTime),
        ),
      );

    // Récupérer la commande complète avec les articles
    const completeOrder = await getOrderById(db, newOrder.id);

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

async function getOrderById(db: any, orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    items,
  };
}
