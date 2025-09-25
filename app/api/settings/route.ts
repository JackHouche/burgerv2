import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { restaurantConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    // Récupérer tous les paramètres du restaurant
    const settings = await db.select().from(restaurantConfig);

    // Convertir en objet clé-valeur
    const settingsObject = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    // Paramètres par défaut si aucun n'existe
    const defaultSettings = {
      restaurantName: "Block B",
      restaurantPhone: "+33 1 23 45 67 89",
      restaurantEmail: "contact@blockb.com",
      restaurantAddress: "123 Rue Example, 75001 Paris",
      isOpen: "true",
      orderMinimum: "0",
      deliveryFee: "0",
      ...settingsObject,
    };

    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);

    // Fallback vers les paramètres par défaut
    return NextResponse.json({
      restaurantName: "Block B",
      restaurantPhone: "+33 1 23 45 67 89",
      restaurantEmail: "contact@blockb.com",
      restaurantAddress: "123 Rue Example, 75001 Paris",
      isOpen: "true",
      orderMinimum: "0",
      deliveryFee: "0",
    });
  }
}
