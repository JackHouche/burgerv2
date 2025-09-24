import { drizzle } from "drizzle-orm/d1";
import { products, ingredients } from "../../lib/db/schema";
import { eq } from "drizzle-orm";

interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
}

declare global {
  interface CloudflareEnv extends Env {}
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const db = drizzle(env.DB);

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

    return new Response(JSON.stringify(productsWithIngredients), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
};
