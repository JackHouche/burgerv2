import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { timeSlots } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAvailableDates, generateTimeSlots, isSlotAvailable } from '@/lib/utils/slots';
import { z } from 'zod';

const getSlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryDate = searchParams.get('date');

    const validatedQuery = getSlotsSchema.parse({
      date: queryDate || undefined
    });

    const db = getDb();

    if (validatedQuery.date) {
      // Récupérer les créneaux pour une date específique
      const requestedDate = new Date(validatedQuery.date);
      const availableSlots = await getAvailableSlotsForDate(db, requestedDate);

      return NextResponse.json({
        date: validatedQuery.date,
        slots: availableSlots
      });
    } else {
      // Récupérer tous les créneaux disponibles pour les prochains jours
      const availableDates = getAvailableDates();
      const allSlots = await Promise.all(
        availableDates.map(async (date) => {
          const dateStr = date.toISOString().split('T')[0];
          const slots = await getAvailableSlotsForDate(db, date);

          return {
            date: dateStr,
            slots: slots
          };
        })
      );

      return NextResponse.json(allSlots);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}

async function getAvailableSlotsForDate(db: any, date: Date) {
  const dateStr = date.toISOString().split('T')[0];

  // Générer tous les créneaux possibles pour cette date
  const possibleSlots = generateTimeSlots(date);

  // Récupérer les créneaux déjà réservés
  const reservedSlots = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.date, dateStr));

  const reservedTimes = new Set(
    reservedSlots
      .filter((slot: any) => !slot.isAvailable)
      .map((slot: any) => slot.time)
  );

  // Filtrer les créneaux disponibles
  const availableSlots = possibleSlots
    .filter(time => !reservedTimes.has(time))
    .filter(time => isSlotAvailable(date, time))
    .map(time => ({
      time,
      isAvailable: true
    }));

  return availableSlots;
}

// Réserver un créneau
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const slotDate = new Date(date);

    // Vérifier que le créneau est disponible
    if (!isSlotAvailable(slotDate, time)) {
      return NextResponse.json(
        { error: 'Slot is not available' },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà une réservation
    const existingSlot = await db
      .select()
      .from(timeSlots)
      .where(and(
        eq(timeSlots.date, date),
        eq(timeSlots.time, time)
      ));

    if (existingSlot.length > 0) {
      return NextResponse.json(
        { error: 'Slot is already reserved' },
        { status: 409 }
      );
    }

    // Créer la réservation temporaire (sera liée à la commande plus tard)
    const [newSlot] = await db
      .insert(timeSlots)
      .values({
        date,
        time,
        isAvailable: false
      })
      .returning();

    return NextResponse.json(newSlot, { status: 201 });
  } catch (error) {
    console.error('Error reserving slot:', error);
    return NextResponse.json(
      { error: 'Failed to reserve slot' },
      { status: 500 }
    );
  }
}
