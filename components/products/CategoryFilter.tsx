import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categoryLabels = {
  [PRODUCT_CATEGORIES.BURGER]: { label: "Burgers", icon: "🍔" },
  [PRODUCT_CATEGORIES.SIDE]: { label: "Accompagnements", icon: "🍟" },
  [PRODUCT_CATEGORIES.DRINK]: { label: "Boissons", icon: "🥤" },
  [PRODUCT_CATEGORIES.DESSERT]: { label: "Desserts", icon: "🧁" },
} as const;

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = Object.values(PRODUCT_CATEGORIES);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth,
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  return (
    <div className="sticky top-[129px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="px-4 py-4">
        <div className="relative">
          {/* Left fade indicator */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none"></div>
          )}

          {/* Right fade indicator */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 to-transparent z-10 pointer-events-none"></div>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 touch-manipulation min-h-[44px] ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-orange-200 active:scale-95"
              }`}
            >
              ✨ Tout voir
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 touch-manipulation min-h-[44px] ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md scale-105"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-orange-200 active:scale-95"
                }`}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {categoryLabels[category].icon}
                </span>
                <span>{categoryLabels[category].label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
