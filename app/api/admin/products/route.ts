import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { products, ingredients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(['burger', 'side', 'drink', 'dessert']),
  imageUrl: z.string().url().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    isRemovable: z.boolean().default(true),
    sortOrder: z.number().default(0)
  })).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const db = getDb();

    // Créer le produit
    const [newProduct] = await db
      .insert(products)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl,
        isAvailable: true
      })
      .returning();

    // Ajouter les ingrédients si fournis
    if (validatedData.ingredients && validatedData.ingredients.length > 0) {
      await db.insert(ingredients).values(
        validatedData.ingredients.map(ingredient => ({
          productId: newProduct.id,
          name: ingredient.name,
          isRemovable: ingredient.isRemovable,
          sortOrder: ingredient.sortOrder
        }))
      );
    }

    // Récupérer le produit complet avec ses ingrédients
    const productIngredients = await db
      .select()
      .from(ingredients)
      .where(eq(ingredients.productId, newProduct.id))
      .orderBy(ingredients.sortOrder);

    const completeProduct = {
      ...newProduct,
      ingredients: productIngredients
    };

    return NextResponse.json(completeProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
