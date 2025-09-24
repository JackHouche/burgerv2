"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartHydrated } from "@/hooks/useCart";
import { ShoppingBag, Home, User, Phone } from "lucide-react";
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
    <>
      {/* Block B contact info */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-40">
        <div className="bg-blockb-gold-500/90 backdrop-blur-md rounded-full px-4 py-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Phone className="w-4 h-4 text-blockb-dark" />
            <span className="font-blockb font-black text-blockb-dark text-sm">
              02.77.24.85.66
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-blockb-dark/95 backdrop-blur-md border-t border-blockb-orange/30 shadow-dark z-50">
        {/* Decorative top border */}
        <div className="h-0.5 bg-gradient-to-r from-blockb-orange-500 via-blockb-gold-500 to-blockb-orange-500"></div>

        <div className="px-4 py-3 blockb-texture">
          <div className="flex justify-around items-center">
            <Link
              href="/"
              className={`flex flex-col items-center py-2 px-3 transition-all duration-300 hover:scale-110 active:scale-95 relative group ${
                isActive("/")
                  ? "text-blockb-orange-500 blockb-text-glow"
                  : "text-blockb-cream hover:text-blockb-orange-500"
              }`}
            >
              <div className="relative">
                <Home className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce-subtle" />
                {isActive("/") && (
                  <div className="absolute -inset-2 bg-blockb-orange-500/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 font-blockb-body font-bold">
                Menu
              </span>

              {/* Block B decorative dots */}
              {isActive("/") && (
                <div className="absolute -bottom-1 flex space-x-1">
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-gold-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                </div>
              )}
            </Link>

            <Link
              href="/checkout"
              className={`flex flex-col items-center py-2 px-3 transition-all duration-300 hover:scale-110 active:scale-95 relative group ${
                isActive("/checkout")
                  ? "text-blockb-orange-500 blockb-text-glow"
                  : "text-blockb-cream hover:text-blockb-orange-500"
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce-subtle" />

                {/* Cart count badge */}
                {isHydrated && itemCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-blockb-gold-500 text-blockb-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-blockb font-black shadow-gold animate-pulse-orange">
                    {itemCount}
                  </div>
                )}

                {isActive("/checkout") && (
                  <div className="absolute -inset-2 bg-blockb-orange-500/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 font-blockb-body font-bold">
                Panier
              </span>

              {/* Block B decorative dots */}
              {isActive("/checkout") && (
                <div className="absolute -bottom-1 flex space-x-1">
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-gold-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                </div>
              )}
            </Link>

            <Link
              href="/admin/login"
              className={`flex flex-col items-center py-2 px-3 transition-all duration-300 hover:scale-110 active:scale-95 relative group ${
                pathname.startsWith("/admin")
                  ? "text-blockb-orange-500 blockb-text-glow"
                  : "text-blockb-cream hover:text-blockb-orange-500"
              }`}
            >
              <div className="relative">
                <User className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce-subtle" />
                {pathname.startsWith("/admin") && (
                  <div className="absolute -inset-2 bg-blockb-orange-500/20 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 font-blockb-body font-bold">
                Admin
              </span>

              {/* Block B decorative dots */}
              {pathname.startsWith("/admin") && (
                <div className="absolute -bottom-1 flex space-x-1">
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-gold-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blockb-orange-500 rounded-full"></div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
