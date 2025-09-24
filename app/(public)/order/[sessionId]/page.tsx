'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDate, formatTime } from '@/lib/utils';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { Order } from '@/types';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // En production, l'ordre serait créé via le webhook Stripe
      // Pour le développement, on simule la récupération
      fetchOrderBySessionId(sessionId);
    }
  }, [sessionId]);

  const fetchOrderBySessionId = async (sessionId: string) => {
    try {
      // TODO: Implémenter l'API pour récupérer une commande par session Stripe
      // Pour l'instant, on simule avec des données
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Confirmation" />
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Traitement de votre commande...</p>
        </div>
      </div>
    );
  }

  // Version de démonstration avec des données simulées
  const mockOrder = {
    orderNumber: 'CMD' + sessionId.slice(-8).toUpperCase(),
    customerName: 'Client Test',
    status: 'confirmed',
    totalAmount: 24.90,
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '19:00',
    items: [
      { productName: 'Burger Classic', quantity: 1, unitPrice: 12.50, subtotal: 12.50 },
      { productName: 'Frites', quantity: 1, unitPrice: 4.90, subtotal: 4.90 },
      { productName: 'Coca Cola', quantity: 1, unitPrice: 2.50, subtotal: 2.50 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Commande confirmée" />

      <div className="p-4 space-y-6">
        {/* Confirmation de succès */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-4">
            Votre paiement a été accepté et votre commande est en cours de préparation.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Numéro de commande:</span><br />
              {mockOrder.orderNumber}
            </p>
          </div>
        </div>

        {/* Informations de récupération */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Récupération
          </h2>

          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Restaurant Click & Collect</p>
                <p className="text-sm text-gray-600">123 Rue de la Gastronomie, Paris</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {formatDate(mockOrder.pickupDate)} à {formatTime(mockOrder.pickupTime)}
                </p>
                <p className="text-sm text-gray-600">
                  Votre commande sera prête dans 20-30 minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Détail de la commande */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Détail de la commande</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {mockOrder.items.map((item, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {formatPrice(mockOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Statut de la commande */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Statut</h2>

          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-900">Commande confirmée</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-900">En préparation</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-gray-500">Prête à récupérer</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Retour au menu
            </Button>
          </Link>

          <p className="text-xs text-gray-500 text-center">
            Vous recevrez un email de confirmation à l'adresse fournie.
          </p>
        </div>
      </div>
    </div>
  );
}
