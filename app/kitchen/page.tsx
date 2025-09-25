"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatTime } from "@/lib/utils";
import { Order } from "@/types";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Timer,
  RefreshCw,
} from "lucide-react";

const statusLabels = {
  pending: "Nouvelle",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  completed: "Récupérée",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function KitchenPage() {
  const { data: session, status } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    fetchOrders();

    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(fetchOrders, 30000);

    return () => clearInterval(interval);
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);

      // Simuler des commandes pour la démo
      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: "CMD001",
          customerName: "Marie Dupont",
          customerEmail: "marie@email.com",
          status: "confirmed",
          totalAmount: 24.5,
          pickupDate: new Date().toISOString().split("T")[0],
          pickupTime: "12:30",
          notes: "Sans oignon sur le burger",
          items: [
            {
              id: 1,
              productName: "Burger Classic",
              quantity: 1,
              unitPrice: 12.5,
              subtotal: 12.5,
              customizations: "Sans oignon",
            },
            {
              id: 2,
              productName: "Frites",
              quantity: 1,
              unitPrice: 4.5,
              subtotal: 4.5,
            },
            {
              id: 3,
              productName: "Coca Cola",
              quantity: 1,
              unitPrice: 2.5,
              subtotal: 2.5,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          orderNumber: "CMD002",
          customerName: "Jean Martin",
          customerEmail: "jean@email.com",
          status: "preparing",
          totalAmount: 18.9,
          pickupDate: new Date().toISOString().split("T")[0],
          pickupTime: "12:45",
          items: [
            {
              id: 3,
              productName: "Burger Végétarien",
              quantity: 1,
              unitPrice: 11.5,
              subtotal: 11.5,
            },
            {
              id: 4,
              productName: "Salade César",
              quantity: 1,
              unitPrice: 7.4,
              subtotal: 7.4,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          orderNumber: "CMD003",
          customerName: "Sophie Leblanc",
          customerEmail: "sophie@email.com",
          status: "ready",
          totalAmount: 31.2,
          pickupDate: new Date().toISOString().split("T")[0],
          pickupTime: "13:00",
          items: [
            {
              id: 5,
              productName: "Burger BBQ",
              quantity: 2,
              unitPrice: 13.5,
              subtotal: 27.0,
            },
            {
              id: 6,
              productName: "Nuggets",
              quantity: 1,
              unitPrice: 4.2,
              subtotal: 4.2,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // En production, on ferait un appel API
      // const response = await fetch(`/api/admin/orders/${orderId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Pour la démo, on met à jour localement
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus as any,
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getOrderStatusActions = (order: Order) => {
    switch (order.status) {
      case "confirmed":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "preparing")}
            className="w-full"
          >
            <Timer className="w-4 h-4 mr-1" />
            Commencer
          </Button>
        );
      case "preparing":
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, "ready")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Terminer
          </Button>
        );
      case "ready":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateOrderStatus(order.id, "completed")}
            className="w-full"
          >
            <Package className="w-4 h-4 mr-1" />
            Récupérée
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders.filter((order) => order.status !== "completed")
      : orders.filter((order) => order.status === selectedStatus);

  const orderCounts = {
    all: orders.filter((order) => order.status !== "completed").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    preparing: orders.filter((order) => order.status === "preparing").length,
    ready: orders.filter((order) => order.status === "ready").length,
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen">
        <Header title="Cuisine" />
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Interface Cuisine"
        rightElement={
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Filtres de statut */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === "all"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes ({orderCounts.all})
            </button>

            <button
              onClick={() => setSelectedStatus("confirmed")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === "confirmed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nouvelles ({orderCounts.confirmed})
            </button>

            <button
              onClick={() => setSelectedStatus("preparing")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === "preparing"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En préparation ({orderCounts.preparing})
            </button>

            <button
              onClick={() => setSelectedStatus("ready")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === "ready"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Prêtes ({orderCounts.ready})
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-600">
                {selectedStatus === "all"
                  ? "Toutes les commandes sont terminées"
                  : `Aucune commande avec le statut "${statusLabels[selectedStatus as keyof typeof statusLabels]}"`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  {/* En-tête de commande */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customerName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Récupération: {formatTime(order.pickupTime)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {item.quantity}× {item.productName}
                          </span>
                          {item.customizations && (
                            <p className="text-sm text-orange-600 mt-1">
                              {item.customizations}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{order.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {getOrderStatusActions(order)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
