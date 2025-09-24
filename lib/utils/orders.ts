export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${random}`.toUpperCase();
}

export function calculateOrderTotal(items: Array<{
  quantity: number;
  unitPrice: number;
}>): number {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
}
