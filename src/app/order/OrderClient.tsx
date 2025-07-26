'use client';

import { useFormContext } from 'react-hook-form';
import type { OrderForm } from '@/types/Order';
import type { CartItem } from '@/types/Cart';
import OrderUserInfo from './OrderUserInfo';
import OrderProductList from './OrderProductList';
import OrderCostSummary from './OrderCostSummary';
import OrderPayment from './OrderPayment';

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
  };
}

export default function OrderClient({ cartCost, cartItems, userInfo, onSubmit }: Props & { onSubmit: (data: OrderForm) => void }) {
  const { handleSubmit } = useFormContext<OrderForm>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <OrderUserInfo name={userInfo.name} recipient={userInfo.recipient} phone={userInfo.phone} address={userInfo.address} />
      <OrderProductList items={cartItems} />
      <OrderCostSummary cartCost={cartCost} />
      <OrderPayment />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded cursor-pointer">
        주문하기
      </button>
    </form>
  );
}
