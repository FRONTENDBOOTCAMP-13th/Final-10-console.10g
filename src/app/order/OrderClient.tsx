'use client';

import { useFormContext } from 'react-hook-form';
import type { OrderForm } from '@/types/Order';
import type { CartItem } from '@/types/Cart';
import OrderUserInfo from './OrderUserInfo';
import OrderProductList from './OrderProductList';
import OrderCostSummary from './OrderCostSummary';
import OrderPayment from './OrderPayment';
import { useState } from 'react';
import { UserAddress } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  cartItems: CartItem[];
  cartCost: {
    products: number;
    shippingFees: number;
    discount: { products: number; shippingFees: number };
    total: number;
  };
  userInfo: {
    name: string;
    recipient: string;
    phone: string;
    address: string;
    details: string;
  };
  addresses: UserAddress[];
  onAddAddress: () => void;
}

export default function OrderClient({ cartCost, cartItems, userInfo, addresses, onSubmit, onAddAddress }: Props & { onSubmit: (data: OrderForm) => Promise<void> }) {
  const { handleSubmit } = useFormContext<OrderForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payment, setPayment] = useState<{ method: string; bank?: string }>({ method: 'toss' });

  const handleOrderSubmit = async (data: OrderForm) => {
    // 카드사 미선택 시 주문 막기
    if (payment.method === 'card' && !payment.bank) {
      toast.error('카드사를 선택해주세요.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOrderSubmit)} className="relative space-y-4">
      <OrderUserInfo {...userInfo} addresses={addresses} onAddAddress={onAddAddress} />
      <OrderProductList items={cartItems} />
      <OrderCostSummary cartCost={cartCost} />
      <OrderPayment onPaymentChange={(method, bank) => setPayment({ method, bank })} />

      {/* 주문 버튼 */}
      <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded cursor-pointer disabled:opacity-50">
        {isSubmitting ? '주문 처리 중...' : '주문하기'}
      </button>

      {/* 로딩 오버레이 (스피너) */}
      {isSubmitting && (
        <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-white font-semibold text-sm">주문 처리 중...</span>
        </div>
      )}
    </form>
  );
}
