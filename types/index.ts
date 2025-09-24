export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: 'burger' | 'side' | 'drink' | 'dessert';
  imageUrl?: string;
  isAvailable: boolean;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  id: number;
  productId: number;
  name: string;
  isRemovable: boolean;
  sortOrder: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations: {
    removedIngredients: string[];
  };
}

export interface TimeSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  totalAmount: number;
  pickupDate: string;
  pickupTime: string;
  stripeSessionId?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  customizations?: string;
  subtotal: number;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'kitchen';
  isActive: boolean;
}

export interface RestaurantHours {
  monday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  tuesday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  wednesday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  thursday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  friday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  saturday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
  sunday: { closed: true } | { lunch?: { open: string; close: string } | null; dinner?: { open: string; close: string } | null };
}

export interface SlotConfig {
  duration: number;
  minAdvanceTime: number;
  maxPerSlot: number;
  daysInAdvance: number;
}
