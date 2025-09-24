import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { products, ingredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(products.category, products.name);

    // Récupérer les ingrédients pour chaque produit
    const productsWithIngredients = await Promise.all(
      allProducts.map(async (product) => {
        const productIngredients = await db
          .select()
          .from(ingredients)
          .where(eq(ingredients.productId, product.id))
          .orderBy(ingredients.sortOrder);

        return {
          ...product,
          ingredients: productIngredients,
        };
      }),
    );

    return NextResponse.json(productsWithIngredients);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
