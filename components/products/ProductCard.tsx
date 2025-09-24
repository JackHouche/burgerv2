import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Plus, Clock, Star, Flame } from "lucide-react";

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
    <div className="bg-gradient-to-b from-blockb-darker to-blockb-dark rounded-2xl border border-blockb-gold/20 overflow-hidden transition-all duration-500 hover:border-blockb-gold/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blockb-gold/20 group relative">
      {/* Street texture overlay */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="h-full bg-[radial-gradient(circle_at_25%_25%,_#f59e0b_1px,_transparent_1px),_radial-gradient(circle_at_75%_75%,_#f59e0b_1px,_transparent_1px)] bg-[length:15px_15px]"></div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-blockb-darker via-zinc-800 to-blockb-dark overflow-hidden">
        {product.imageUrl && !imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blockb-gold-light">
            <div className="w-16 h-16 bg-blockb-gold/20 rounded-full flex items-center justify-center mb-2 border border-blockb-gold/30">
              <span className="text-2xl">🍔</span>
            </div>
            <span className="text-sm font-medium">Image non disponible</span>
          </div>
        )}

        {/* Availability Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-blockb-dark/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-red-500/50">
            <Clock className="w-8 h-8 text-red-400 mb-2" />
            <span className="text-red-400 font-bold text-lg drop-shadow-lg">
              Indisponible
            </span>
            <span className="text-red-300 text-sm">Temporairement</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-blockb-gold via-amber-500 to-blockb-gold rounded-xl px-3 py-2 shadow-xl border border-amber-400/50 relative">
            <span className="text-blockb-dark font-bold text-lg drop-shadow-sm">
              {formatPrice(product.price)}
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-blockb-dark/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-blockb-gold/30 shadow-lg">
            <span className="text-blockb-gold text-xs font-bold uppercase tracking-widest drop-shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Hot indicator for popular items */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-2 py-1 border border-red-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-400 animate-pulse" />
            <span className="text-red-400 text-xs font-bold">POPULAIRE</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-bold text-blockb-gold-light text-lg leading-tight mb-1 group-hover:text-blockb-gold transition-colors duration-300 drop-shadow-sm">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-blockb-gold text-blockb-gold drop-shadow-sm"
              />
            ))}
            <span className="text-sm text-blockb-gold-muted ml-1">(4.8)</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-blockb-gold-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-blockb-gold uppercase tracking-widest mb-2 flex items-center gap-1">
              <span className="w-1 h-1 bg-blockb-gold rounded-full"></span>
              Ingrédients
            </p>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={ingredient.id}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blockb-gold/10 text-blockb-gold-light border border-blockb-gold/20 hover:bg-blockb-gold/20 transition-colors"
                >
                  {ingredient.name}
                </span>
              ))}
              {product.ingredients.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-blockb-gold/5 text-blockb-gold-muted border border-blockb-gold/10">
                  +{product.ingredients.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          loading={isLoading}
          fullWidth
          size="md"
          variant="primary"
          className="font-bold text-sm tracking-wide relative overflow-hidden group/btn"
        >
          <Plus className="w-5 h-5 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
