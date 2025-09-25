"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
        const data = (await response.json()) as Product[];
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
      <div className="min-h-screen bg-white">
        <Header title="Notre Menu" subtitle="Chargement..." />
        <div className="p-4">
          {/* Logo de chargement */}
          <div className="flex justify-center py-8">
            <div className="relative w-20 h-20 animate-pulse">
              <Image
                src="/logo.png"
                alt="Block B"
                fill
                className="object-contain opacity-50"
              />
            </div>
          </div>
          {/* Skeleton Loading */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm animate-pulse border border-gray-200"
                >
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <Header
        title="Notre Menu"
        subtitle="Commandez en ligne, récupérez sur place"
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Banner */}
      {!selectedCategory && (
        <div className="px-4 pt-4 pb-2">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-2">🎉 Offre du jour</h2>
            <p className="text-sm opacity-90">
              -10% sur toutes les commandes avec le code BLOCK10
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-4 opacity-50">
              <Image
                src="/logo.png"
                alt="Block B"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Aucun produit disponible
            </h3>
            <p className="text-gray-500 text-center max-w-sm leading-relaxed">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Voir tout le menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="h-full animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
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
