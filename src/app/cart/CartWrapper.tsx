'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCarts } from '@/utils/getCarts';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';
import { deleteCartItem } from '@/data/actions/deleteCartItem';
import { deleteCartItems } from '@/data/actions/deleteCartItems';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import { useCartSelection } from '@/hooks/useCartSelection';
import Image from 'next/image';
import Loading from '../loading';
import CartTable from './CartTable';
import CartMobileList from './CartMobileList';
import CartSummary from './CartSummary';
import CartButtons from './CartButtons';
import { CartResponse } from '@/types/Cart';
import { getProductById } from '@/utils/getProducts';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';
import { toast } from 'react-hot-toast';

export default function CartWrapper() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const previousQty = useRef<Record<number, number>>({});
  const debounceTimers = useRef<Record<number, NodeJS.Timeout | null>>({});
  const { decrease } = useCartBadgeStore();
  const { user, isLogin } = useLoginStore();
  const cartStore = useCartQuantityStore();
  const router = useRouter();
  const { selectedItems, setSelectedItems, toggleAll, toggleItem } = useCartSelection(cartData);
  const alertedRef = useRef(false);
  // 선택된 상품 총합 계산
  const selectedPriceInfo = useMemo(() => {
    if (!cartData) return { productOnlyTotal: 0, shippingFee: 0, total: 0 };
    const validItems = cartData.item.filter(i => selectedItems.includes(i._id) && i.product.quantity > 0);
    const productOnlyTotal = validItems.reduce((sum, item) => sum + item.product.price * cartStore.getQuantity(item._id), 0);
    const shippingFee = validItems.length > 0 ? cartStore.shippingFee : 0;

    return { productOnlyTotal, shippingFee, total: productOnlyTotal + shippingFee };
  }, [cartData, selectedItems, cartStore.quantities]);

  // 권한 가드
  useEffect(() => {
    if (alertedRef.current) return;
    if (isLogin === false) {
      alertedRef.current = true;
      toast.error('로그인이 필요합니다.');
      router.replace('/login');
    }
  }, [isLogin, router]);

  // 장바구니 데이터 초기 fetch + Zustand 초기화
  useEffect(() => {
    if (!user?.token?.accessToken) return;

    (async () => {
      const data = await getCarts(user.token.accessToken);

      // 상품별 배송비 가져오기
      const updatedItems = await Promise.all(
        data.item.map(async cartItem => {
          try {
            const productRes = await getProductById(cartItem.product._id);
            const shippingFee = productRes.ok ? productRes.item.shippingFees : 0;

            return {
              ...cartItem,
              product: {
                ...cartItem.product,
                shippingFees: shippingFee,
              },
            };
          } catch {
            return {
              ...cartItem,
              product: {
                ...cartItem.product,
                shippingFees: 0,
              },
            };
          }
        }),
      );

      setCartData({ ...data, item: updatedItems });
      cartStore.resetQuantities(Object.fromEntries(updatedItems.map(p => [p._id, p.quantity])));
      cartStore.setShippingFee(data.cost.shippingFees);
    })();
  }, [user?.token?.accessToken]);

  // 디바운싱 수량 변경 API 호출
  useEffect(() => {
    if (!cartData || !user?.token?.accessToken) return;
    cartData.item.forEach(product => {
      const productId = product._id;
      const currentQty = cartStore.getQuantity(productId);
      const prevQty = previousQty.current[productId];
      if (prevQty === currentQty) return;
      if (debounceTimers.current[productId]) clearTimeout(debounceTimers.current[productId]!);

      debounceTimers.current[productId] = setTimeout(async () => {
        try {
          await patchCartQuantity(productId, currentQty, user.token.accessToken);
          previousQty.current[productId] = currentQty;
        } catch {
          cartStore.setQuantity(productId, prevQty);
        }
      }, 300);
    });
  }, [cartStore.quantities]);

  // 핸들러들
  const increaseQty = (id: number, stock: number, buyQty = 0) => {
    const currentQty = cartStore.getQuantity(id);
    const maxQty = stock - buyQty;
    if (currentQty >= maxQty) {
      toast.error(`최대 ${maxQty}개까지 구매 가능합니다.`);
      return;
    }
    cartStore.setQuantity(id, currentQty + 1);
  };

  const decreaseQty = (id: number) => {
    const currentQty = cartStore.getQuantity(id);
    if (currentQty <= 1) return;
    cartStore.setQuantity(id, currentQty - 1);
  };

  const handleDeleteItem = async (id: number) => {
    if (!user?.token?.accessToken) return;
    try {
      await deleteCartItem(id, user.token.accessToken);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => i._id !== id) } : null));
      cartStore.removeQuantity(id);
      setSelectedItems(prev => prev.filter(i => i !== id));
      decrease(1);
    } catch (err) {
      console.error('상품 삭제 중 오류:', err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!user?.token?.accessToken || selectedItems.length === 0) return;
    try {
      await deleteCartItems(selectedItems, user.token.accessToken);
      setCartData(prev => (prev ? { ...prev, item: prev.item.filter(i => !selectedItems.includes(i._id)) } : null));
      cartStore.removeQuantities(selectedItems);
      setSelectedItems([]);
      decrease(selectedItems.length);
    } catch (err) {
      console.error('선택된 상품 삭제 중 오류:', err);
    }
  };

  const handlePurchase = () => {
    if (selectedItems.length === 0) {
      toast.error('구매할 상품을 선택해주세요.');
      return;
    }
    router.push(`/order?ids=${selectedItems.join(',')}`);
  };

  // 로딩 처리
  if (!cartData) return <Loading />;

  // 장바구니가 비어있을 경우
  if (cartData.item.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 sm:space-y-6 lg:space-y-8">
        <Image src="/cart-empty-dotori.png" alt="장바구니 비었음" width={160} height={160} className="h-auto w-40 sm:w-50 lg:w-60" />
        <button onClick={() => router.push('/')} className="px-6 py-2 sm:px-8 sm:py-4 lg:sm:px-10  bg-primary text-base sm:text-lg lg:text-xl text-white rounded-md hover:bg-primary/80 transition cursor-pointer">
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[900px] mx-auto">
      <CartTable items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} toggleAll={toggleAll} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} getQuantity={cartStore.getQuantity} />
      <CartButtons handleDeleteSelected={handleDeleteSelected} />
      <CartMobileList items={cartData.item} selectedItems={selectedItems} toggleItem={toggleItem} increaseQty={increaseQty} decreaseQty={decreaseQty} handleDeleteItem={handleDeleteItem} getQuantity={cartStore.getQuantity} />
      <CartSummary productOnlyTotal={selectedPriceInfo.productOnlyTotal} shippingFee={selectedPriceInfo.shippingFee} total={selectedPriceInfo.total} handlePurchase={handlePurchase} />
    </div>
  );
}
