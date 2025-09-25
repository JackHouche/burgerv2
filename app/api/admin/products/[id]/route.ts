import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import { products, ingredients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.enum(["burger", "side", "drink", "dessert"]).optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        isRemovable: z.boolean().default(true),
        sortOrder: z.number().default(0),
      }),
    )
    .optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const db = getDb();

    // Vérifier que le produit existe
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Mettre à jour le produit
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, productId))
      .returning();

    // Mettre à jour les ingrédients si fournis
    if (validatedData.ingredients) {
      // Supprimer les anciens ingrédients
      await db.delete(ingredients).where(eq(ingredients.productId, productId));

      // Ajouter les nouveaux ingrédients
      if (validatedData.ingredients.length > 0) {
        await db.insert(ingredients).values(
          validatedData.ingredients.map((ingredient) => ({
            productId: productId,
            name: ingredient.name,
            isRemovable: ingredient.isRemovable,
            sortOrder: ingredient.sortOrder,
          })),
        );
      }
    }

    // Récupérer le produit complet avec ses ingrédients
    const productIngredients = await db
      .select()
      .from(ingredients)
      .where(eq(ingredients.productId, productId))
      .orderBy(ingredients.sortOrder);

    const completeProduct = {
      ...updatedProduct,
      ingredients: productIngredients,
    };

    return NextResponse.json(completeProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const db = getDb();

    // Vérifier que le produit existe
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Supprimer les ingrédients associés
    await db.delete(ingredients).where(eq(ingredients.productId, productId));

    // Supprimer le produit
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
