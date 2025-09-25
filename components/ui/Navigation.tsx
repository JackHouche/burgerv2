"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartHydrated } from "@/hooks/useCart";
import { ShoppingBag, Home, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const { getItemCount, isHydrated } = useCartHydrated();
  const [itemCount, setItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated) {
      setItemCount(getItemCount());
    }
  }, [getItemCount, isHydrated]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-50">
      <div className="px-6 py-3">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className={`relative flex flex-col items-center py-2.5 px-5 rounded-2xl transition-all duration-200 group ${
              isActive("/")
                ? "text-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 scale-105"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Home className={`w-6 h-6 transition-transform duration-200 ${isActive("/") ? "scale-110" : "group-hover:scale-110"}`} />
            <span className="text-xs mt-1.5 font-semibold">Menu</span>
          </Link>

          <Link
            href="/checkout"
            className={`relative flex flex-col items-center py-2.5 px-5 rounded-2xl transition-all duration-200 group ${
              isActive("/checkout")
                ? "text-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 scale-105"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-6 h-6 transition-transform duration-200 ${isActive("/checkout") ? "scale-110" : "group-hover:scale-110"}`} />
              {isHydrated && itemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {itemCount}
                </div>
              )}
            </div>
            <span className="text-xs mt-1.5 font-semibold">Panier</span>
          </Link>

          <Link
            href="/admin/login"
            className={`relative flex flex-col items-center py-2.5 px-5 rounded-2xl transition-all duration-200 group ${
              pathname.startsWith("/admin")
                ? "text-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 scale-105"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <User className={`w-6 h-6 transition-transform duration-200 ${pathname.startsWith("/admin") ? "scale-110" : "group-hover:scale-110"}`} />
            <span className="text-xs mt-1.5 font-semibold">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}