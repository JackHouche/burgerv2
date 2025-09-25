import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCheckoutSchema = z.object({
  orderData: z.object({
    customerName: z.string().min(1),
    customerEmail: z.string().email(),
    customerPhone: z.string().optional(),
    pickupDate: z.string(),
    pickupTime: z.string(),
    items: z.array(
      z.object({
        productId: z.number(),
        productName: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        customizations: z.string().optional(),
      }),
    ),
    notes: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData } = createCheckoutSchema.parse(body);

    // Créer les line items pour Stripe
    const lineItems = orderData.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName,
          description: item.customizations || undefined,
        },
        unit_amount: Math.round(item.unitPrice * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Créer la session Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/order/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      customer_email: orderData.customerEmail,
      metadata: {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone || "",
        pickupDate: orderData.pickupDate,
        pickupTime: orderData.pickupTime,
        notes: orderData.notes || "",
        orderData: JSON.stringify(orderData),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
