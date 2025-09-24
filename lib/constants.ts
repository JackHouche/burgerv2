import { RestaurantHours, SlotConfig } from '@/types';

// Configuration des horaires d'ouverture
export const RESTAURANT_HOURS: RestaurantHours = {
  monday: { closed: true },
  tuesday: {
    lunch: null,
    dinner: { open: '18:00', close: '21:30' }
  },
  wednesday: {
    lunch: { open: '11:30', close: '13:30' },
    dinner: { open: '18:00', close: '21:30' }
  },
  thursday: {
    lunch: { open: '11:30', close: '13:30' },
    dinner: { open: '18:00', close: '21:30' }
  },
  friday: {
    lunch: { open: '11:30', close: '13:30' },
    dinner: { open: '18:00', close: '22:00' }
  },
  saturday: {
    lunch: { open: '11:30', close: '13:30' },
    dinner: { open: '18:00', close: '22:00' }
  },
  sunday: {
    lunch: null,
    dinner: { open: '18:00', close: '22:00' }
  }
};

// Configuration des créneaux
export const SLOT_CONFIG: SlotConfig = {
  duration: 30, // minutes
  minAdvanceTime: 30, // minutes minimum avant récupération
  maxPerSlot: 1, // nombre max de commandes par créneau
  daysInAdvance: 7 // jours de réservation à l'avance
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed'
} as const;

export const PRODUCT_CATEGORIES = {
  BURGER: 'burger',
  SIDE: 'side',
  DRINK: 'drink',
  DESSERT: 'dessert'
} as const;
