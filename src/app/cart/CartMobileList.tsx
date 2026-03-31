'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CartResponse } from '@/types/Cart';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface CartMobileListProps {
  items: CartResponse['item'];
  selectedItems: number[];
  toggleItem: (id: number) => void;
  increaseQty: (id: number, stock: number, buyQty?: number) => void;
  decreaseQty: (id: number) => void;
  handleDeleteItem: (id: number) => void;
  getQuantity: (id: number) => number;
}

export default function CartMobileList({ items, selectedItems, toggleItem, increaseQty, decreaseQty, handleDeleteItem, getQuantity }: CartMobileListProps) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col sm:hidden">
      {items.map(product => (
        <div key={product._id} className="py-4 border-t border-dark-gray first:border-t-0 last:border-b last:border-dark-gray">
          {/* 체크박스 */}
          <div className="mb-2">
            <input type="checkbox" disabled={product.product.quantity === 0} checked={selectedItems.includes(product._id)} onChange={() => toggleItem(product._id)} className="accent-black" aria-label="상품 선택" />
          </div>

          {/* 품절 UI */}
          {product.product.quantity === 0 ? (
            <div className="flex items-start gap-4">
              <Image src={getFullImageUrl(product.product.image.path) ?? '/fallback.png'} alt={product.product.name} width={80} height={80} className="rounded-sm cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)} />
              <div className="flex flex-col flex-1 justify-between">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-sm cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                    {product.product.name}
                  </div>
                  <button onClick={() => handleDeleteItem(product._id)} className="text-xs border border-gray px-2 py-1 text-gray hover:text-red hover:border-red cursor-pointer">
                    삭제
                  </button>
                </div>
                <div className="text-red text-xs mt-1">품절된 상품입니다</div>
              </div>
            </div>
          ) : (
            <>
              {/* 상품 UI */}
              <div className="flex justify-between items-start gap-4">
                <button className="cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                  <Image src={getFullImageUrl(product.product.image.path) ?? '/fallback.png'} alt={product.product.name} width={80} height={80} className="rounded-sm" />
                </button>
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-center">
                    <button className="cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                      <div className="font-semibold text-sm">{product.product.name}</div>
                    </button>
                    <button onClick={() => handleDeleteItem(product._id)} className="text-xs border border-gray px-2 py-1 text-dark-gray hover:text-red hover:border-red cursor-pointer">
                      삭제
                    </button>
                  </div>
                  <div className="text-gray text-xs mt-1">{product.product.price.toLocaleString()}원</div>
                </div>
              </div>

              {/* 수량 조절 & 총 금액 */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex border divide-x border-gray overflow-hidden text-sm">
                  <button onClick={() => decreaseQty(product._id)} className="px-3 py-1 cursor-pointer">
                    -
                  </button>
                  <span className="px-4 py-1">{getQuantity(product._id)}</span>
                  <button onClick={() => increaseQty(product._id, product.product.quantity, product.product.buyQuantity)} className="px-3 py-1 cursor-pointer">
                    +
                  </button>
                </div>
                <div className="font-bold text-base">총 {(product.product.price * getQuantity(product._id)).toLocaleString()}원</div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
