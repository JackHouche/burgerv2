import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { timeSlots } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const db = getDb();

    // Récupérer les créneaux disponibles pour une date donnée
    const availableSlots = await db
      .select()
      .from(timeSlots)
      .where(and(eq(timeSlots.date, date), eq(timeSlots.isAvailable, true)));

    // Générer des créneaux par défaut si aucun n'existe
    if (availableSlots.length === 0) {
      const defaultSlots = [
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
      ];

      return NextResponse.json(
        defaultSlots.map((time) => ({
          id: `${date}-${time}`,
          date,
          time,
          isAvailable: true,
        })),
      );
    }

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);

    // Fallback vers des créneaux par défaut
    const defaultSlots = [
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ];

    const date =
      new URL(request.url).searchParams.get("date") ||
      new Date().toISOString().split("T")[0];

    return NextResponse.json(
      defaultSlots.map((time) => ({
        id: `${date}-${time}`,
        date,
        time,
        isAvailable: true,
      })),
    );
  }
}
