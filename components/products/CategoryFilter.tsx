import { PRODUCT_CATEGORIES } from "@/lib/constants";

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

  return (
    <div className="sticky top-[73px] z-30 bg-blockb-dark/95 backdrop-blur-md border-b border-blockb-gold/20 shadow-lg">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-blockb-gold to-transparent opacity-60"></div>

      <div className="px-4 py-4 relative">
        {/* Street food texture overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full bg-[radial-gradient(circle_at_25%_25%,_#f59e0b_1px,_transparent_1px),_radial-gradient(circle_at_75%_75%,_#f59e0b_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative">
          <button
            onClick={() => onCategoryChange(null)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 relative group ${
              selectedCategory === null
                ? "bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold text-blockb-dark shadow-xl shadow-blockb-gold/30 animate-pulse-gold"
                : "bg-blockb-darker/80 text-blockb-gold-light hover:bg-blockb-darker border border-blockb-gold/30 hover:border-blockb-gold/50 hover:shadow-lg hover:shadow-blockb-gold/20"
            }`}
          >
            <span className="text-lg drop-shadow-sm">🍽️</span>
            <span className="drop-shadow-sm">Tout</span>
            {selectedCategory === null && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
            )}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 relative group ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold text-blockb-dark shadow-xl shadow-blockb-gold/30 animate-pulse-gold"
                  : "bg-blockb-darker/80 text-blockb-gold-light hover:bg-blockb-darker border border-blockb-gold/30 hover:border-blockb-gold/50 hover:shadow-lg hover:shadow-blockb-gold/20"
              }`}
            >
              <span className="text-lg drop-shadow-sm">
                {categoryLabels[category].icon}
              </span>
              <span className="drop-shadow-sm">
                {categoryLabels[category].label}
              </span>
              {selectedCategory === category && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-blockb-gold/40 to-transparent"></div>
    </div>
  );
}
