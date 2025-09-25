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
    <div className="sticky top-[129px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105"
                : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            ✨ Tout voir
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-lg">{categoryLabels[category].icon}</span>
              <span>{categoryLabels[category].label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
