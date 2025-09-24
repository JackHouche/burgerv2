import { RESTAURANT_HOURS, SLOT_CONFIG } from "@/lib/constants";
import { TimeSlot } from "@/types";

export function getDayName(date: Date): keyof typeof RESTAURANT_HOURS {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  return days[date.getDay()];
}

export function generateTimeSlots(date: Date): string[] {
  const dayName = getDayName(date);
  const dayConfig = RESTAURANT_HOURS[dayName];

  if ("closed" in dayConfig && dayConfig.closed) {
    return [];
  }

  const slots: string[] = [];

  // Vérifier que le restaurant n'est pas fermé
  if ("closed" in dayConfig && dayConfig.closed) {
    return slots;
  }

  // Générer les créneaux pour le déjeuner
  if ("lunch" in dayConfig && dayConfig.lunch) {
    const lunchSlots = generateSlotsForPeriod(
      dayConfig.lunch.open,
      dayConfig.lunch.close,
    );
    slots.push(...lunchSlots);
  }

  // Générer les créneaux pour le dîner
  if ("dinner" in dayConfig && dayConfig.dinner) {
    const dinnerSlots = generateSlotsForPeriod(
      dayConfig.dinner.open,
      dayConfig.dinner.close,
    );
    slots.push(...dinnerSlots);
  }

  return slots;
}

function generateSlotsForPeriod(start: string, end: string): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  for (let time = startTime; time < endTime; time += SLOT_CONFIG.duration) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    slots.push(timeString);
  }

  return slots;
}

export function isSlotAvailable(date: Date, time: string): boolean {
  const now = new Date();
  const slotDateTime = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  slotDateTime.setHours(hours, minutes, 0, 0);

  // Vérifier que le créneau est dans le futur avec le délai minimum
  const minTime = new Date(
    now.getTime() + SLOT_CONFIG.minAdvanceTime * 60 * 1000,
  );

  return slotDateTime >= minTime;
}

export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i < SLOT_CONFIG.daysInAdvance; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Vérifier si le restaurant est ouvert ce jour
    const dayName = getDayName(date);
    const dayConfig = RESTAURANT_HOURS[dayName];

    if (!("closed" in dayConfig && dayConfig.closed)) {
      dates.push(date);
    }
  }

  return dates;
}
