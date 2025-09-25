import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Mock settings data for now
const defaultSettings = {
  restaurantName: "Block B",
  address: "123 Rue de la Gastronomie, 75001 Paris",
  phone: "+33 1 23 45 67 89",
  email: "contact@blockb.fr",
  openingHours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "22:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "22:00", closed: false },
  },
  orderSettings: {
    maxAdvanceOrderDays: 7,
    minOrderAmount: 0,
    deliveryFee: 0,
    taxRate: 20,
  },
  isOpen: true,
  maintenanceMode: false,
};

export async function GET() {
  try {
    // For now, return mock data
    // Later this could fetch from database
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // For now, just return success
    // Later this would update the database
    console.log("Settings update:", body);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
