'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import Loading from '../loading';
import CartTable from './CartTable';
import CartMobileList from './CartMobileList';
import CartButtons from './CartButtons';
import CartSummaryContainer from './CartSummaryContainer';

import type { CartResponse } from '@/types/Cart';
import { getCarts } from '@/utils/getCarts';
import { getProductById } from '@/utils/getProducts';
import { deleteCartItem } from '@/data/actions/deleteCartItem';
import { deleteCartItems } from '@/data/actions/deleteCartItems';

import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';
import { useLoginStore } from '@/stores/loginStore';
import { useCartSelection } from '@/hooks/useCartSelection';

export default function CartWrapper() {
  const router = useRouter();
  const { decrease } = useCartBadgeStore();
  const { user, isLogin } = useLoginStore();

  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const alertedRef = useRef(false);

  // Zustand
  const resetQuantities = useCartQuantityStore(s => s.resetQuantities);
  const setShippingFee = useCartQuantityStore(s => s.setShippingFee);
  const setQuantity = useCartQuantityStore(s => s.setQuantity);
  const removeQuantity = useCartQuantityStore(s => s.removeQuantity);
  const removeQuantities = useCartQuantityStore(s => s.removeQuantities);

  const { selectedItems, setSelectedItems, toggleAll, toggleItem } = useCartSelection(cartData);

  useEffect(() => {
    if (alertedRef.current) return;

    const t = setTimeout(() => {
      if (!user?.token?.accessToken) {
        alertedRef.current = true;
        toast.error('로그인이 필요합니다.');
        router.replace('/login');
      }
    }, 0);

    return () => clearTimeout(t);
  }, [user?.token?.accessToken, router]);
  // 초기 수량/배송비 초기화
  useEffect(() => {
    if (!user?.token?.accessToken) return;

    (async () => {
      const data = await getCarts(user.token.accessToken);

      // 상품별 배송비
      const updatedItems = await Promise.all(
        data.item.map(async cartItem => {
          try {
            const productRes = await getProductById(cartItem.product._id);
            const shippingFee = productRes.ok ? productRes.item.shippingFees : 0;
            return { ...cartItem, product: { ...cartItem.product, shippingFees: shippingFee } };
          } catch {
            return { ...cartItem, product: { ...cartItem.product, shippingFees: 0 } };
          }
        }),
      );

      setCartData({ ...data, item: updatedItems });

      resetQuantities(Object.fromEntries(updatedItems.map(p => [p._id, p.quantity])));
      setShippingFee(data.cost.shippingFees);
    })();
  }, [user?.token?.accessToken, resetQuantities, setShippingFee]);

  const getQuantity = useCallback((id: number) => {
    return useCartQuantityStore.getState().quantities[id] ?? 1;
  }, []);

  // 핸들러
  const increaseQty = useCallback(
    (id: number, stock: number, buyQty = 0) => {
      const current = useCartQuantityStore.getState().quantities[id] ?? 1;
      const maxQty = stock - buyQty;
      if (current >= maxQty) {
        toast.error(`최대 ${maxQty}개까지 구매 가능합니다.`);
        return;
      }
      setQuantity(id, current + 1);
    },
    [setQuantity],
  );

  const decreaseQty = useCallback(
    (id: number) => {
      const current = useCartQuantityStore.getState().quantities[id] ?? 1;
      if (current <= 1) return;
      setQuantity(id, current - 1);
    },
    [setQuantity],
  );

  const handleDeleteItem = useCallback(
    async (id: number) => {
      if (!user?.token?.accessToken) return;
      try {
        await deleteCartItem(id, user.token.accessToken);
        setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => i._id !== id) } : null));
        removeQuantity(id);
        setSelectedItems(prev => prev.filter(i => i !== id));
        decrease(1);
      } catch (err) {
        console.error('상품 삭제 중 오류:', err);
      }
    },
    [user?.token?.accessToken, removeQuantity, setSelectedItems, decrease],
  );

  const handleDeleteSelected = useCallback(async () => {
    if (!user?.token?.accessToken || selectedItems.length === 0) return;
    try {
      await deleteCartItems(selectedItems, user.token.accessToken);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => !selectedItems.includes(i._id)) } : null));
      removeQuantities(selectedItems);
      setSelectedItems([]);
      decrease(selectedItems.length);
    } catch (err) {
      console.error('선택된 상품 삭제 중 오류:', err);
    }
  }, [user?.token?.accessToken, selectedItems, removeQuantities, setSelectedItems, decrease]);

  const handlePurchase = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error('구매할 상품을 선택해주세요.');
      return;
    }
    router.push(`/order?ids=${selectedItems.join(',')}`);
  }, [router, selectedItems]);
  const token = user?.token?.accessToken;
  if (!token) return <Loading />;
  if (!cartData) return <Loading />;
  if (cartData.item.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 sm:space-y-6 lg:space-y-8">
        <Image src="/cart-empty-dotori.png" alt="장바구니 비었음" width={160} height={160} className="h-auto w-40 sm:w-50 lg:w-60" priority />
        <button onClick={() => router.push('/')} className="px-6 py-2 sm:px-8 sm:py-4 lg:sm:px-10 bg-primary text-base sm:text-lg lg:text-xl text-white rounded-md hover:bg-primary/80 transition cursor-pointer">
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[900px] mx-auto">
      <CartTable items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} toggleAll={toggleAll} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} />
      <CartButtons handleDeleteSelected={handleDeleteSelected} />
      <CartMobileList items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} getQuantity={getQuantity} />
      <CartSummaryContainer items={cartData.item} selectedIds={selectedItems} onPurchase={handlePurchase} />
    </div>
  );
}
