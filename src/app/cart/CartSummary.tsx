'use client';

interface CartSummaryProps {
  productOnlyTotal: number; // 총 상품 금액
  shippingFee: number; // 총 배송비
  total: number; // 최종 결제 금액
  handlePurchase: () => void;
}

export default function CartSummary({ productOnlyTotal, shippingFee, total, handlePurchase }: CartSummaryProps) {
  return (
    <>
      {/* 총 결제 정보 */}
      <div className="my-10 sm:my-15 lg:my-20 font-bold text-dark-gray text-base lg:text-lg">
        <table className="w-full text-center sm:border-t-2 sm:border-b-1">
          <thead className="sm:border-b border-gray-200 sm:text-sm lg:text-base">
            <tr>
              <th className="sm:py-2 lg:py-4">총 주문금액</th>
              <th className="sm:py-2 lg:py-4">총 배송비</th>
              <th className="sm:py-2 lg:py-4">총 결제금액</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sm:py-6 lg:py-8">{productOnlyTotal.toLocaleString()}원</td>
              <td className="sm:py-6 lg:py-8">{shippingFee.toLocaleString()}원</td>
              <td className="text-red-700 sm:py-6 lg:py-8">{total.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 구매 버튼 */}
      <div className="mt-8 sm:static fixed bottom-0 left-0 right-0 p-4 z-20 bg-white border-t border-gray-200 sm:border-none sm:p-0 shadow-md">
        <button onClick={handlePurchase} className="w-full bg-primary text-white py-4 rounded-md text-center cursor-pointer">
          <span className=" font-bold text-base">{total.toLocaleString()}원 구매하기</span>
        </button>
      </div>
    </>
  );
}
