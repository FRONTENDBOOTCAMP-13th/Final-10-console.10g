interface Props {
  cartCost: {
    products: number;
    shippingFees: number;
    discount: { products: number; shippingFees: number };
    total: number;
  };
}

export default function OrderCostSummary({ cartCost }: Props) {
  const { products, shippingFees, discount, total } = cartCost;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-3 rounded-xl sm:rounded-2xl bg-white text-dark-gray">
      <h2 className="text-base sm:text-lg font-semibold">결제금액</h2>

      <div className="space-y-1 text-sm sm:text-base">
        <div className="flex justify-between">
          <span>상품 금액</span>
          <span>{products.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>배송비</span>
          <span>{shippingFees.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>할인 금액</span>
          <span>{(discount.products + discount.shippingFees).toLocaleString()}원</span>
        </div>
        <div className="flex justify-between font-bold text-black">
          <span>최종 결제 금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
