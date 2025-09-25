"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartHydrated } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export function FloatingCart() {
  const { getItemCount, getTotal, items, isHydrated } = useCartHydrated();
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      setItemCount(getItemCount());
      setTotal(getTotal());
    }
  }, [getItemCount, getTotal, isHydrated, items]);

  if (!isHydrated || itemCount === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full p-4 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
        >
          <ShoppingBag className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
            {itemCount}
          </div>

          {/* Price bubble */}
          <div className="absolute -top-1 -left-16 bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatPrice(total)}
          </div>
        </button>
      </div>

      {/* Expanded Mini Cart */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsExpanded(false)}
          />

          {/* Mini Cart */}
          <div className="fixed bottom-24 right-4 left-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 max-w-sm ml-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Votre panier</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="space-y-3 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${JSON.stringify(item.customizations)}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.quantity * item.product.price)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-orange-600 text-lg">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsExpanded(false)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-center block hover:shadow-lg transition-all duration-200"
                >
                  Commander ({itemCount})
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
