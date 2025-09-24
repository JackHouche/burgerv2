'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleProductAvailability = async (productId: number, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p =>
          p.id === productId ? updatedProduct : p
        ));
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const categories = [
    { value: 'burger', label: 'Burgers' },
    { value: 'side', label: 'Accompagnements' },
    { value: 'drink', label: 'Boissons' },
    { value: 'dessert', label: 'Desserts' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen">
        <Header title="Produits" showBack backHref="/admin/dashboard" />
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Gestion des produits"
        showBack
        backHref="/admin/dashboard"
        rightElement={
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Filtres par catégorie */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tout ({products.length})
            </button>

            {categories.map((category) => {
              const count = products.filter(p => p.category === category.value).length;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span className="font-bold text-orange-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.category === 'burger' ? 'bg-red-100 text-red-800' :
                          product.category === 'side' ? 'bg-yellow-100 text-yellow-800' :
                          product.category === 'drink' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {categories.find(c => c.value === product.category)?.label}
                        </span>

                        <button
                          onClick={() => toggleProductAvailability(product.id, product.isAvailable)}
                          className={`px-2 py-1 text-xs rounded-full transition-colors ${
                            product.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {product.isAvailable ? 'Disponible' : 'Indisponible'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ingrédients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Ingrédients: {product.ingredients.map(i => i.name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
