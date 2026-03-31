'use client';

import { useMemo } from 'react';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import CartSummary from './CartSummary';
import type { CartResponse } from '@/types/Cart';

export default function CartSummaryContainer({ items, selectedIds, onPurchase }: { items: CartResponse['item']; selectedIds: number[]; onPurchase: () => void }) {
  const quantities = useCartQuantityStore(s => s.quantities);
  const shippingFee = useCartQuantityStore(s => s.shippingFee);

  const { productOnlyTotal, totalShipping, total } = useMemo(() => {
    const set = new Set(selectedIds);
    const selected = items.filter(i => set.has(i._id) && i.product.quantity > 0);

    const productOnlyTotal = selected.reduce((sum, i) => {
      const q = quantities[i._id] ?? i.quantity;
      return sum + i.product.price * q;
    }, 0);

    const totalShipping = selected.length > 0 ? shippingFee : 0;
    return { productOnlyTotal, totalShipping, total: productOnlyTotal + totalShipping };
  }, [items, selectedIds, quantities, shippingFee]);

  return <CartSummary productOnlyTotal={productOnlyTotal} shippingFee={totalShipping} total={total} handlePurchase={onPurchase} />;
}
