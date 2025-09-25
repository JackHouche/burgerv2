import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { z } from "zod";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  pickupDate: z.string(),
  pickupTime: z.string(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      customizations: z.string().optional(),
    }),
  ),
});

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const db = getDb();

    // Calculer le montant total
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

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
    if (validatedData.items.length > 0) {
      await db.insert(orderItems).values(
        validatedData.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customizations: item.customizations,
          subtotal: item.unitPrice * item.quantity,
        })),
      );
    }

    return NextResponse.json(
      {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        totalAmount: newOrder.totalAmount,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid order data", details: error.errors },
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
