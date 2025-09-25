"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      // Simuler les statistiques pour la démo
      setStats({
        todayOrders: 12,
        todayRevenue: 287.5,
        pendingOrders: 3,
        totalProducts: 24,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout title="Tableau de bord">
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
    <AdminLayout title="Tableau de bord">
      <div className="space-y-6">
        {/* Bienvenue */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Bonjour, {session.name}
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de votre restaurant aujourd'hui
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                  Commandes
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {stats.todayOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  aujourd'hui
                </p>
              </div>
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                  Chiffre d'affaires
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  {formatPrice(stats.todayRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  aujourd'hui
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                  En attente
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {stats.pendingOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">commandes</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                  Produits
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">au menu</p>
              </div>
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Actions rapides</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Link href="/admin/products" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">
                  Gérer les produits
                </span>
              </Button>
            </Link>

            <Link href="/admin/orders" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">
                  Voir les commandes
                </span>
              </Button>
            </Link>

            <Link href="/kitchen" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">
                  Interface cuisine
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {/* Commandes simulées */}
            {[
              {
                id: 1,
                number: "CMD001",
                customer: "Marie Dupont",
                total: 24.5,
                status: "preparing",
              },
              {
                id: 2,
                number: "CMD002",
                customer: "Jean Martin",
                total: 18.9,
                status: "ready",
              },
              {
                id: 3,
                number: "CMD003",
                customer: "Sophie Leblanc",
                total: 31.2,
                status: "pending",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {order.number}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {order.customer}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "preparing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status === "pending"
                      ? "En attente"
                      : order.status === "preparing"
                        ? "Préparation"
                        : "Prêt"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
