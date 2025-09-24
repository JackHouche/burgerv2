import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { products, ingredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productIngredients = await db
      .select()
      .from(ingredients)
      .where(eq(ingredients.productId, productId))
      .orderBy(ingredients.sortOrder);

    const productWithIngredients = {
      ...product,
      ingredients: productIngredients,
    };

    return NextResponse.json(productWithIngredients);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
