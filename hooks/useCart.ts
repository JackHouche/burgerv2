import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (
    product: Product,
    customizations?: { removedIngredients: string[] },
  ) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setHydrated: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      addItem: (product, customizations = { removedIngredients: [] }) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.customizations) ===
                JSON.stringify(customizations),
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                JSON.stringify(item.customizations) ===
                  JSON.stringify(customizations)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                customizations,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        if (typeof window === "undefined") return 0;
        return get().items.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        if (typeof window === "undefined") return 0;
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    },
  ),
);

// Hook personnalisé pour gérer l'hydratation
export const useCartHydrated = () => {
  const cart = useCart();

  // S'assurer que l'hydratation se fait côté client uniquement
  if (typeof window !== "undefined" && !cart.isHydrated) {
    cart.setHydrated();
  }

  return cart;
};
