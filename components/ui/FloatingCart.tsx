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
          className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 text-white rounded-full p-4 shadow-2xl hover:shadow-orange-500/30 active:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation min-h-[56px] min-w-[56px]"
        >
          <ShoppingBag
            className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? "scale-90 rotate-12" : "group-hover:scale-110"}`}
          />
          <div
            className={`absolute -top-2 -right-2 bg-white text-orange-600 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md transition-all duration-200 ${itemCount > 9 ? "animate-pulse" : ""}`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </div>

          {/* Price bubble */}
          <div className="absolute -top-1 -left-20 bg-white text-gray-900 px-3 py-1.5 rounded-full shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 whitespace-nowrap">
            {formatPrice(total)}
          </div>
        </button>
      </div>

      {/* Expanded Mini Cart */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-in fade-in duration-200"
            onClick={() => setIsExpanded(false)}
          />

          {/* Mini Cart */}
          <div className="fixed bottom-24 right-4 left-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 max-w-sm ml-auto animate-in slide-in-from-bottom-2 slide-in-from-right-2 duration-300">
            {/* Drag indicator */}
            <div className="flex justify-center pt-2">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Votre panier</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 active:text-gray-800 p-2 -mr-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 touch-manipulation"
                >
                  <Plus className="w-5 h-5 rotate-45 transition-transform duration-150 hover:scale-110" />
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
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 text-white py-4 rounded-xl font-semibold text-center block hover:shadow-lg active:shadow-md transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] touch-manipulation min-h-[48px] flex items-center justify-center"
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
