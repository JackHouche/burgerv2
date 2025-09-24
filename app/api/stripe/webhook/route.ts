import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db/client";
import { orders, orderItems, timeSlots } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils/orders";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      // Récupérer les données de commande depuis les métadonnées
      const orderData = JSON.parse(session.metadata.orderData);

      const db = getDb();

      // Calculer le montant total
      const totalAmount = orderData.items.reduce((total: number, item: any) => {
        return total + item.quantity * item.unitPrice;
      }, 0);

      // Générer le numéro de commande
      const orderNumber = generateOrderNumber();

      // Créer la commande
      const [newOrder] = await db
        .insert(orders)
        .values({
          orderNumber,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          status: "confirmed", // Directement confirmé car paiement validé
          totalAmount,
          pickupDate: orderData.pickupDate,
          pickupTime: orderData.pickupTime,
          stripeSessionId: session.id,
          notes: orderData.notes,
        })
        .returning();

      // Ajouter les articles de la commande
      const orderItemsData = orderData.items.map((item: any) => ({
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
            eq(timeSlots.date, orderData.pickupDate),
            eq(timeSlots.time, orderData.pickupTime),
          ),
        );

      console.log(
        `Order ${orderNumber} created successfully from Stripe webhook`,
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
