'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { CartResponse } from '@/types/Cart';
import { getFullImageUrl } from '@/utils/getFullImageUrl';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useLoginStore } from '@/stores/loginStore';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';

type Props = {
  product: CartResponse['item'][number];
  selected: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onIncrease: (id: number, stock: number, buyQty?: number) => void;
  onDecrease: (id: number) => void;
};

function CartRow({ product, selected, onToggle, onDelete, onIncrease, onDecrease }: Props) {
  const router = useRouter();
  const accessToken = useLoginStore(s => s.user?.token?.accessToken);

  const qty = useCartQuantityStore(s => s.quantities[product._id] ?? product.quantity);
  const setQuantity = useCartQuantityStore(s => s.setQuantity);

  const prevQtyRef = useRef(qty);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    if (qty === prevQtyRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await patchCartQuantity(product._id, qty, accessToken);
        prevQtyRef.current = qty;
      } catch {
        setQuantity(product._id, prevQtyRef.current);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [qty, accessToken, product._id, setQuantity]);

  const goDetail = useCallback(() => {
    router.push(`/products/${product.product._id}`);
  }, [router, product.product._id]);

  const isSoldOut = product.product.quantity === 0;
  const linePrice = product.product.price * qty;

  return (
    <tr className="text-center text-sm lg:text-base border-b py-4 border-gray-200">
      <td>
        <input type="checkbox" disabled={isSoldOut} checked={selected} onChange={() => onToggle(product._id)} aria-label="상품 선택" />
      </td>

      <td className="text-left border-r border-gray-200">
        <div className="flex items-center gap-4 py-4 lg:py-6 cursor-pointer" onClick={goDetail}>
          <Image src={getFullImageUrl(product.product.image.path) ?? '/fallback.png'} alt={product.product.name} width={80} height={80} className="rounded-md" />
          <div>
            <div className="font-semibold">{product.product.name}</div>
            <div className="text-gray-500 text-sm">{product.product.price.toLocaleString()}원</div>
          </div>
        </div>
      </td>

      <td className="border-r border-gray-200">
        {isSoldOut ? (
          <div className="text-red-500 font-semibold text-center">품절</div>
        ) : (
          <div className="flex items-center border divide-x border-gray justify-center w-fit mx-auto">
            <button onClick={() => onDecrease(product._id)} className="px-3 py-1 text-base cursor-pointer">
              -
            </button>
            <span className="px-3 py-1 text-base">{qty}</span>
            <button onClick={() => onIncrease(product._id, product.product.quantity, product.product.buyQuantity)} className="px-3 py-1 text-base cursor-pointer">
              +
            </button>
          </div>
        )}
      </td>

      <td className="border-r border-gray-200">{linePrice.toLocaleString()}원</td>
      <td className="border-r border-gray-200">{(product.product.shippingFees ?? 3000).toLocaleString()}원</td>
      <td>
        <button onClick={() => onDelete(product._id)} className="text-sm text-gray hover:text-red cursor-pointer">
          삭제
        </button>
      </td>
    </tr>
  );
}

export default memo(CartRow);
