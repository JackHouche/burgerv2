import { NextResponse } from "next/server";
import { products, ingredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// export const runtime = "edge"; // Activé seulement en production

export async function GET() {
  try {
    // En développement local
    if (process.env.NODE_ENV === "development") {
      const { getLocalDb } = await import("@/lib/db/client");
      const db = getLocalDb();

      const allProducts = await db
        .select()
        .from(products)
        .where(eq(products.isAvailable, true))
        .orderBy(products.category, products.name);

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
    }

    // En production sur Cloudflare Pages
    const { getCloudflareDb } = await import("@/lib/db/cloudflare-client");
    const db = getCloudflareDb();

    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.isAvailable, true))
      .orderBy(products.category, products.name);

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

    // Retourner des données mock si la DB n'est pas disponible
    const mockProducts = [
      {
        id: 1,
        name: "Block B Signature",
        description: "Notre burger emblématique avec steak de bœuf, fromage aged cheddar, salade, tomate, oignons caramélisés et sauce Block B spéciale",
        price: 12.00,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [
          { id: 1, productId: 1, name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
          { id: 2, productId: 1, name: "Fromage cheddar aged", isRemovable: true, sortOrder: 2 },
          { id: 3, productId: 1, name: "Salade iceberg", isRemovable: true, sortOrder: 3 },
          { id: 4, productId: 1, name: "Tomate", isRemovable: true, sortOrder: 4 },
          { id: 5, productId: 1, name: "Oignons caramélisés", isRemovable: true, sortOrder: 5 },
          { id: 6, productId: 1, name: "Sauce Block B", isRemovable: true, sortOrder: 6 },
        ],
      },
      {
        id: 2,
        name: "BBQ Smoker",
        description: "Steak de bœuf grillé, bacon fumé, fromage cheddar, oignons frits, sauce BBQ maison",
        price: 13.50,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [
          { id: 7, productId: 2, name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
          { id: 8, productId: 2, name: "Bacon fumé", isRemovable: true, sortOrder: 2 },
          { id: 9, productId: 2, name: "Fromage cheddar", isRemovable: true, sortOrder: 3 },
          { id: 10, productId: 2, name: "Oignons frits", isRemovable: true, sortOrder: 4 },
          { id: 11, productId: 2, name: "Sauce BBQ", isRemovable: true, sortOrder: 5 },
        ],
      },
      {
        id: 3,
        name: "Veggie Street",
        description: "Steak végétarien maison, avocat, roquette, tomate, oignons rouges, sauce tahini",
        price: 11.00,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [
          { id: 12, productId: 3, name: "Steak végétarien", isRemovable: false, sortOrder: 1 },
          { id: 13, productId: 3, name: "Avocat", isRemovable: true, sortOrder: 2 },
          { id: 14, productId: 3, name: "Roquette", isRemovable: true, sortOrder: 3 },
          { id: 15, productId: 3, name: "Tomate", isRemovable: true, sortOrder: 4 },
          { id: 16, productId: 3, name: "Oignons rouges", isRemovable: true, sortOrder: 5 },
          { id: 17, productId: 3, name: "Sauce tahini", isRemovable: true, sortOrder: 6 },
        ],
      },
      {
        id: 4,
        name: "Frites Block B",
        description: "Frites maison coupées à la main, assaisonnement secret Block B",
        price: 4.50,
        category: "side",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [],
      },
      {
        id: 5,
        name: "Onion Rings",
        description: "Rondelles d'oignons panées maison, sauce ranch",
        price: 5.50,
        category: "side",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [],
      },
      {
        id: 6,
        name: "Cola Artisanal",
        description: "Cola fait maison aux épices naturelles",
        price: 3.50,
        category: "drink",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [],
      },
      {
        id: 7,
        name: "Brownie Block B",
        description: "Brownie au chocolat noir, glace vanille, sauce caramel",
        price: 6.50,
        category: "dessert",
        imageUrl: null,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [],
      }
    ];

    return NextResponse.json(mockProducts);
  }
}