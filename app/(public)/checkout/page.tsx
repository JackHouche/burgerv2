'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/ui/Header';
import { Navigation } from '@/components/ui/Navigation';
import { CartItem } from '@/components/cart/CartItem';
import { TimeSlotPicker } from '@/components/cart/TimeSlotPicker';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const canProceed = items.length > 0 && selectedDate && selectedTime &&
                    customerInfo.name.trim() && customerInfo.email.trim();

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!canProceed) return;

    setLoading(true);
    try {
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        pickupDate: selectedDate!,
        pickupTime: selectedTime!,
        notes: customerInfo.notes,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          customizations: item.customizations.removedIngredients.length > 0
            ? `Sans: ${item.customizations.removedIngredients.join(', ')}`
            : undefined
        }))
      };

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <Header title="Panier" showBack />

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Ajoutez des produits à votre panier pour continuer
          </p>
          <Button onClick={() => router.push('/')}>
            Voir le menu
          </Button>
        </div>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Commande" showBack />

      <div className="p-4 space-y-6">
        {/* Articles du panier */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Votre commande</h2>
          </div>

          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${JSON.stringify(item.customizations)}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Sélection du créneau */}
        <TimeSlotPicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSlotSelect={handleSlotSelect}
        />

        {/* Informations client */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Vos informations</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={customerInfo.notes}
                onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Instructions particulières..."
              />
            </div>
          </div>
        </div>

        {/* Bouton de paiement */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Button
            onClick={handleCheckout}
            disabled={!canProceed || loading}
            loading={loading}
            className="w-full"
            size="lg"
          >
            Payer {formatPrice(total)}
          </Button>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Paiement sécurisé par Stripe
          </p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
