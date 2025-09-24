import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, customizations } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-3 p-4 bg-white border-b border-gray-200">
      <div className="relative w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            N/A
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
            {product.name}
          </h3>
          <button
            onClick={() => onRemove(product.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {customizations.removedIngredients.length > 0 && (
          <p className="text-xs text-gray-500 mb-2">
            Sans: {customizations.removedIngredients.join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>

            <span className="text-sm font-medium px-2">{quantity}</span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <span className="font-semibold text-orange-600">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
