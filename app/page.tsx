"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Product } from "@/types";
import { useCartHydrated } from "@/hooks/useCart";
import { Header } from "@/components/ui/Header";
import { Navigation } from "@/components/ui/Navigation";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/utils";

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartHydrated();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleAddToCart = (product: Product) => {
    try {
      addItem(product);
      toast.success(`${product.name} ajouté au panier !`, {
        description: `Prix: ${formatPrice(product.price)}`,
        action: {
          label: "Voir le panier",
          onClick: () => (window.location.href = "/checkout"),
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Menu" />
        <div className="p-4">
          {/* Skeleton Loading */}
          <div className="space-y-4 mt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Menu" />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="px-4 pb-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 text-center max-w-sm">
              Aucun produit ne correspond à vos critères de recherche. Essayez
              une autre catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
