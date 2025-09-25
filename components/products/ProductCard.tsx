import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product);
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-50 to-orange-100 flex-shrink-0 overflow-hidden">
        {product.imageUrl && !imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image
              src="/logo.png"
              alt={product.name}
              width={60}
              height={60}
              className="object-contain opacity-30"
            />
          </div>
        )}

        {/* Availability Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600 font-medium">Indisponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Header */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Ingredients - Simplified */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="text-xs text-gray-500 mb-3 line-clamp-1">
            {product.ingredients.slice(0, 3).map(ing => ing.name).join(", ")}
            {product.ingredients.length > 3 && ` +${product.ingredients.length - 3}`}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price and Action */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
            {!product.isAvailable && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Indisponible
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="text-sm font-semibold">Ajouter au panier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}