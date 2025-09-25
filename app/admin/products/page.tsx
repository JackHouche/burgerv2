"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const { data: session, status } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    fetchProducts();
  }, [session, status, router]);

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

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          category: productData.category,
          ingredients: productData.ingredients.filter((ing: any) =>
            ing.name.trim(),
          ),
        }),
      });

      if (response.ok) {
        const newProduct = (await response.json()) as Product;
        setProducts([...products, newProduct]);
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        throw new Error(
          (errorData as any)?.error || "Erreur lors de l'ajout du produit",
        );
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const toggleProductAvailability = async (
    productId: number,
    isAvailable: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (response.ok) {
        const updatedProduct = (await response.json()) as Product;
        setProducts(
          products.map((p) => (p.id === productId ? updatedProduct : p)),
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const categories = [
    { value: "burger", label: "Burgers" },
    { value: "side", label: "Accompagnements" },
    { value: "drink", label: "Boissons" },
    { value: "dessert", label: "Desserts" },
  ];

  if (status === "loading" || loading) {
    return (
      <AdminLayout title="Gestion des produits">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout title="Gestion des produits">
      <div className="space-y-6">
        {/* Add Product Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
        {/* Filtres par catégorie */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 sm:hidden">
            Filtrer par catégorie :
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === null
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tout ({products.length})
            </button>

            {categories.map((category) => {
              const count = products.filter(
                (p) => p.category === category.value,
              ).length;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === category.value
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun produit
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par ajouter des produits à votre menu
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="w-full h-32 sm:w-20 sm:h-20 bg-gray-100 flex-shrink-0">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <span className="font-bold text-orange-600 text-lg">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            product.category === "burger"
                              ? "bg-red-100 text-red-800"
                              : product.category === "side"
                                ? "bg-yellow-100 text-yellow-800"
                                : product.category === "drink"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {
                            categories.find((c) => c.value === product.category)
                              ?.label
                          }
                        </span>

                        <button
                          onClick={() =>
                            toggleProductAvailability(
                              product.id,
                              product.isAvailable,
                            )
                          }
                          className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                            product.isAvailable
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {product.isAvailable ? "Disponible" : "Indisponible"}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ingrédients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 line-clamp-2">
                          <span className="font-medium">Ingrédients: </span>
                          {product.ingredients.map((i) => i.name).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <ProductForm
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddProduct}
        />
      </div>
    </AdminLayout>
  );
}
