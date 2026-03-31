'use client';

import { memo, useMemo } from 'react';
import type { CartResponse } from '@/types/Cart';
import CartRow from './CartRow';

interface CartTableProps {
  items: CartResponse['item'];
  selectedItems: number[];
  toggleItem: (id: number) => void;
  toggleAll: () => void;
  increaseQty: (id: number, stock: number, buyQty?: number) => void;
  decreaseQty: (id: number) => void;
  handleDeleteItem: (id: number) => void;
}

function CartTable({ items, selectedItems, toggleItem, toggleAll, increaseQty, decreaseQty, handleDeleteItem }: CartTableProps) {
  if (!items || items.length === 0) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const selectable = useMemo(() => items.filter(item => item.product.quantity > 0).map(i => i._id), [items]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const allChecked = useMemo(() => selectable.length > 0 && selectable.every(id => selectedItems.includes(id)), [selectable, selectedItems]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const selectedSet = useMemo(() => new Set(selectedItems), [selectedItems]);

  return (
    <table className="hidden sm:table w-full text-sm border-y">
      <thead className="text-sm lg:text-base text-dark-gray">
        <tr className="border-b border-gray-200">
          <th className="text-center py-2 px-2 lg:py-4">
            <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="전체 선택" />
          </th>
          <th className="text-center py-2 px-2 lg:py-4">상품 정보</th>
          <th className="text-center py-2 px-2 lg:py-4">수량</th>
          <th className="text-center py-2 px-2 lg:py-4">주문 금액</th>
          <th className="text-center py-2 px-2 lg:py-4">배송비</th>
          <th className="text-center py-2 px-2 lg:py-4">삭제</th>
        </tr>
      </thead>
      <tbody>
        {items.map(product => (
          <CartRow key={product._id} product={product} selected={selectedSet.has(product._id)} onToggle={toggleItem} onDelete={handleDeleteItem} onIncrease={increaseQty} onDecrease={decreaseQty} />
        ))}
      </tbody>
    </table>
  );
}

export default memo(CartTable);
