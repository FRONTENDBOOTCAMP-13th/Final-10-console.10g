'use client';

import { useLoginStore } from '@/stores/loginStore';
import { Order } from '@/types/Order';
import { getOrders } from '@/utils/getOrders';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function CalculationDays(createdAt: string): string {
  const parsedCreatedAt = new Date(createdAt.replace(/\.| /g, match => (match === '.' ? '-' : 'T')));
  const now = new Date();

  const diffMs = now.getTime() - parsedCreatedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return '결제완료';
  } else if (diffDays < 2) {
    return '배송준비중';
  } else if (diffDays < 3) {
    return '배송중';
  } else if (diffDays < 90) {
    return '배송완료';
  } else {
    return '정보만료';
  }
}

export default function OrderHistory() {
  const user = useLoginStore(state => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderState1, setOrderState1] = useState(0);
  const [orderState2, setOrderState2] = useState(0);
  const [orderState3, setOrderState3] = useState(0);
  const [orderState4, setOrderState4] = useState(0);
  const createdDay: string[] = [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await getOrders(user.token.accessToken);

        if (!res.ok) throw res.message;

        const ordersData = [...res.item];
        setOrders(ordersData);

        console.log(res.item);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (orders) {
      console.log('orders', orders);

      // 상태별 카운트 초기화
      let state1 = 0; // 결제완료
      let state2 = 0; // 배송준비중
      let state3 = 0; // 배송중
      let state4 = 0; // 배송완료

      for (let i = 0; i < orders.length; i++) {
        const diffDays = CalculationDays(orders[i].createdAt);

        switch (diffDays) {
          case '결제완료':
            state1++;
            break;
          case '배송준비중':
            state2++;
            break;
          case '배송중':
            state3++;
            break;
          case '배송완료':
            state4++;
            break;
        }
      }

      setOrderState1(state1);
      setOrderState2(state2);
      setOrderState3(state3);
      setOrderState4(state4);
    }
  }, [orders]);

  return (
    <section className="text-xs sm:text-sm lg:text-base flex-1 bg-white flex flex-col flex-nowrap items-center gap-12 sm:px-6 py-12 sm:p-12">
      {/* 나의 주문 현황 */}
      <div className="w-full sm:w-[600px] lg:w-[800px] shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:shadow-none sm:border border-gray sm:rounded-md">
        <div className="flex flex-row flex-nowrap p-8 lg:p-12 pb-4 lg:pb-6 gap-4 items-center">
          <p className="text-lg lg:text-xl font-bold text-secondary-green">나의 주문 현황</p>
          <p className="text-xs lg:text-sm">최근 3개월 이내 주문 기준</p>
        </div>

        <ul className="flex flex-row flex-wrap justify-center gap-2 sm:gap-4 items-center p-8 sm:p-4 lg:p-12 bg-background">
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center sm:gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 sm:w-8 lg:w-13 aspect-square lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              <span>결제완료</span>
            </div>
            <span>{orderState1} 건</span>
          </li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center sm:gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 sm:w-8 lg:w-13 aspect-square lucide lucide-package-icon lucide-package">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                <path d="M12 22V12" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <path d="m7.5 4.27 9 5.15" />
              </svg>
              <span>배송준비중</span>
            </div>
            <span>{orderState2} 건</span>
          </li>
          <li className="w-full sm:hidden"></li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center sm:gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 sm:w-8 lg:w-13 aspect-square lucide lucide-truck-icon lucide-truck">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <span>배송중</span>
            </div>
            <span>{orderState3} 건</span>
          </li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center sm:gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 sm:w-8 lg:w-13 aspect-square lucide lucide-package-open-icon lucide-package-open">
                <path d="M12 22v-9" />
                <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
              </svg>
              <span>배송완료</span>
            </div>
            <span>{orderState4} 건</span>
          </li>
        </ul>
      </div>

      {/* 주문내역 조회 */}
      <div className="w-full sm:w-[600px] lg:w-[800px] shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:shadow-none sm:border border-gray sm:rounded-md">
        <div className="flex flex-row flex-nowrap p-8 lg:p-12 pb-4 lg:pb-6 gap-4 items-center">
          <p className="text-lg lg:text-xl font-bold text-secondary-green">주문내역 조회</p>
          <p className="text-xs lg:text-sm">최근 3개월 이내 주문 기준</p>
        </div>

        <div className="p-8 flex flex-col flex-nowrap gap-8 bg-background">
          {!orders && <p>3개월 이내 주문한 상품이 없습니다.</p>}
          {orders && (
            <ul>
              {orders.map((order, index) => {
                let day = false;
                if (createdDay.find(val => val === order.createdAt.split(' ')[0])) {
                  day = true;
                }
                createdDay.push(order.createdAt.split(' ')[0]);
                return (
                  <li key={index} className="">
                    {!day && <p className="p-2 text-xl font-bold">{order.createdAt.split(' ')[0]}</p>}
                    <ul className="flex flex-col flex-nowrap pb-4 gap-4">
                      {order.products.map((product, index) => {
                        return (
                          <li key={999999 - index} className="p-8 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                            <div className="flex flex-col sm:flex-row flex-nowrap sm:items-center gap-4 sm:gap-0">
                              <div className="flex flex-row flex-nowrap items-center gap-4">
                                <div className="w-[70px] sm:w-[100px] aspect-square relative">
                                  <Image src={product.image ? product.image.path : ''} alt={`${order.products[0].name} 결제 이미지`} className="border border-primary rounded-lg object-cover" fill />
                                </div>
                                <div className="flex flex-col flex-nowrap gap-1">
                                  <p className="sm:text-base lg:text-lg font-bold">{CalculationDays(order.createdAt)}</p>
                                  <Link href={`/products/${product._id}`}>
                                    <span className="truncate">{product.name}</span> <span className="text-light-gray hidden lg:inline">|</span> <br className="lg:hidden" />
                                    {product.quantity}개 <strong>&gt;</strong>
                                  </Link>
                                  <p>
                                    <span className="font-bold text-red-500">{product.price.toLocaleString()}원</span> <small className="text-gray">{order.createdAt} 결제</small>
                                  </p>
                                </div>
                              </div>
                              {/* TODO 링크 제대로 연결시키기 */}
                              <div className="flex flex-row sm:flex-col flex-nowrap gap-2 justify-center sm:ml-auto">
                                <Link href={`/board/qna/new`} className="w-full text-center sm:px-4 lg:px-8 py-2 border border-primary text-primary">
                                  상품 문의하기
                                </Link>
                                <Link href={`/products/${product._id}`} className="w-full text-center sm:px-4 lg:px-8 py-2 border border-primary text-primary">
                                  리뷰 작성하기
                                </Link>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
