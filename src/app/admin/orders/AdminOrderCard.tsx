'use client';

import type { AdminOrder, OrderStateCode } from '@/types/AdminOrder';
import Image from 'next/image';
import { ORDER_STATE_LABEL } from '@/types/AdminOrder';
import { useRouter } from 'next/navigation';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface Props {
  order: AdminOrder;
  timeAgo: (date: string) => string;
  removePostalCode: (address?: string) => string;
  onChangeOrderState: (orderId: number, newState: OrderStateCode) => void;
}

export default function AdminOrderCard({ order, timeAgo, removePostalCode, onChangeOrderState }: Props) {
  const router = useRouter();
  const firstProduct = order.products[0];
  const moreProducts = order.products.length > 1 ? ` 외 ${order.products.length - 1}개` : '';
  const addressValue = removePostalCode(order.address?.value);
  const addressDetails = order.address?.details ?? '';

  return (
    <div className="w-full border rounded-lg bg-background border-primary-light shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-dark-gray">
          <span className="text-primary">#{order._id}</span> | {firstProduct?.name}
          {moreProducts}
        </h3>
        <span className="px-3 py-1 text-xs rounded font-bold bg-primary-light text-primary-dark border border-primary">{ORDER_STATE_LABEL[order.state] ?? '상태 미정'}</span>
      </div>

      {/* 본문 */}
      <div className="flex gap-3">
        {/* 상품 이미지 */}
        {firstProduct?.image?.path && (
          <div className="w-20 h-20 border rounded overflow-hidden flex-shrink-0 border-primary-light">
            <Image src={`${getFullImageUrl(firstProduct.image.path)}`} alt={firstProduct.name} width={80} height={80} className="object-cover w-full h-full" />
          </div>
        )}

        {/* 텍스트 정보 */}
        <div className="flex flex-col justify-center flex-1 text-sm">
          <span className="text-gray">{timeAgo(order.createdAt)}</span>
          <span className="font-bold text-lg text-dark-gray">{order.cost.total.toLocaleString()}원</span>
          <p className="text-xs text-gray font-bold mt-1">
            {order.user?.name ?? '-'} ({order.user?.phone ?? '-'})
          </p>
          <p className="text-xs text-gray">
            {addressValue} {addressDetails}
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-2 gap-2 w-full mt-2">
        <button onClick={() => router.push(`/admin/orders/${order._id}`)} className="text-xs py-2 rounded border border-primary text-primary-dark hover:bg-secondary cursor-pointer">
          상세보기
        </button>
        <button onClick={() => onChangeOrderState(order._id, 'OS020')} className="text-xs py-2 rounded bg-primary text-white hover:bg-primary-dark cursor-pointer">
          상태 변경
        </button>
      </div>
    </div>
  );
}
