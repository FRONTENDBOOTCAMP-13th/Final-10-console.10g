'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLoginStore } from '@/stores/loginStore';
import { getOrders } from '@/utils/getOrders';
import type { Order } from '@/types/Order';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrderProduct: (product: Order['products'][0]) => void;
}

export default function OrderModal({ isOpen, onClose, onSelectOrderProduct }: OrderModalProps) {
  const user = useLoginStore(state => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isOpen || hasFetched) return;
    if (!user) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrders(user.token.accessToken);
        if (res.ok === 1) {
          setOrders(res.item);
          setHasFetched(true);
        }
      } catch (error) {
        console.error('주문 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, hasFetched, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold">주문 선택</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 lg:text-4xl sm:text-3xl text-2xl">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 text-xs sm:text-sm lg:text-base">로딩 중...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs sm:text-sm lg:text-base">최근 주문 내역이 없습니다.</div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, index) => (
                <li key={index}>
                  {order.products.map(product => (
                    <div key={product._id} className="flex items-center justify-between gap-4 border-b py-4">
                      <div className="flex items-center gap-4">
                        <Image src={`${product.image?.path}`} alt={product.name} width={64} height={64} unoptimized className="w-16 h-16 object-cover rounded border" />
                        <div>
                          <p className="font-semibold text-sm sm:text-base">{product.name}</p>
                          <p className="text-xs text-gray-500">수량: {product.quantity}개</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onSelectOrderProduct(product);
                          onClose();
                        }}
                        className="px-4 py-2 bg-[#A97452] text-white rounded hover:bg-[#966343] transition-colors text-xs sm:text-sm lg:text-base"
                      >
                        선택
                      </button>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
