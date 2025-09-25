"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Plus, Trash2 } from "lucide-react";
import { Product } from "@/types";

interface Ingredient {
  name: string;
  isRemovable: boolean;
  sortOrder: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: "burger" | "side" | "drink" | "dessert";
  ingredients: Ingredient[];
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductFormData) => Promise<void>;
  product?: Product | null;
}

export function ProductForm({ isOpen, onClose, onSubmit, product }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "burger",
    ingredients: product?.ingredients || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "burger", label: "Burgers" },
    { value: "side", label: "Accompagnements" },
    { value: "drink", label: "Boissons" },
    { value: "dessert", label: "Desserts" },
  ];

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      name: "",
      isRemovable: true,
      sortOrder: formData.ingredients.length,
    };
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      ),
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Le nom du produit est requis");
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Le prix doit être un nombre valide supérieur à 0");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "burger",
        ingredients: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? "Modifier le produit" : "Ajouter un produit"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nom du produit"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Description du produit"
                rows={3}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Ingrédients
              </label>
              <Button
                type="button"
                onClick={addIngredient}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {formData.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nom de l'ingrédient"
                    />
                  </div>
                  <label className="flex items-center text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={ingredient.isRemovable}
                      onChange={(e) => updateIngredient(index, "isRemovable", e.target.checked)}
                      className="mr-1"
                    />
                    Modifiable
                  </label>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.ingredients.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun ingrédient ajouté
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout..." : product ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
