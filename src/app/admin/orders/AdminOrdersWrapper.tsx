'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { getAdminOrders } from '@/utils/getAdminOrders';
import type { AdminOrder, OrderStateCode } from '@/types/AdminOrder';
import AdminOrdersTable from './AdminOrdersTable';
import AdminOrdersMobile from './AdminOrdersMobile';
import Pagination from '@/components/common/Pagination';
import { patchOrderState } from '@/data/actions/patchOrderState';
import Loading from '@/app/loading';
import { toast } from 'react-hot-toast';

export default function AdminOrdersWrapper() {
  const { isLogin, isAdmin, isLoading } = useLoginStore();
  const { user } = useLoginStore();
  const router = useRouter();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  /** 우편번호 제거 */
  const removePostalCode = useCallback((address?: string) => {
    if (!address) return '';
    return address.replace(/^\d{5}\s?/, '');
  }, []);

  /** 시간 표시 포맷 */
  const timeAgo = useCallback((dateString: string) => {
    if (!dateString) return '-';
    const safeDate = dateString.replace(/\./g, '-').replace(' ', 'T');
    const date = new Date(safeDate);
    if (isNaN(date.getTime())) return '-';
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  }, []);

  /** 다음 상태 코드 순환 */
  function getNextOrderState(current: OrderStateCode): OrderStateCode {
    const states: OrderStateCode[] = ['OS010', 'OS020', 'OS030', 'OS040', 'OS050'];
    const idx = states.indexOf(current);
    return states[(idx + 1) % states.length];
  }

  /** 주문 상태 변경 핸들러 (Optimistic UI + API + 순환) */
  const handleChangeOrderState = async (orderId: number) => {
    if (!user?.token?.accessToken) return;

    // 현재 상태 찾기
    const currentOrder = orders.find(o => o._id === orderId);
    if (!currentOrder) return;

    // 다음 상태 코드 계산
    const nextState = getNextOrderState(currentOrder.state);

    // Optimistic UI 먼저 업데이트
    setOrders(prev => prev.map(order => (order._id === orderId ? { ...order, state: nextState } : order)));

    try {
      const res = await patchOrderState(orderId, nextState, user.token.accessToken);
      if (res.ok !== 1) {
        toast.error('상태 변경 실패');
        fetchOrders(); // 실패 시 원래 데이터 복구
      }
    } catch (err) {
      console.error('주문 상태 변경 오류:', err);
      toast.error('상태 변경 중 오류 발생');
      fetchOrders();
    }
  };

  /** 주문 목록 불러오기 */
  const fetchOrders = useCallback(async () => {
    if (!user?.token?.accessToken || !isLogin || !isAdmin) return;
    setLoading(true);
    try {
      const res = await getAdminOrders(user.token.accessToken, {
        page: currentPage,
        limit: itemsPerPage,
      });
      if (res.ok === 1) {
        setOrders(res.item);
        setTotalPages(res.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [user, currentPage]);

  /** 권한 가드 */
  useEffect(() => {
    if (!isLoading && (!isLogin || !isAdmin)) {
      router.push('/unauthorized');
    }
  }, [isLoading, isLogin, isAdmin, router]);

  /** 초기 데이터 로드 */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading)
    return (
      <div className="text-center py-6">
        <Loading />
      </div>
    );

  return (
    <section className="p-4 sm:px-0">
      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <>
          {/* 데스크탑 테이블 */}
          <div className="hidden sm:flex w-full">
            <AdminOrdersTable orders={orders} removePostalCode={removePostalCode} timeAgo={timeAgo} onChangeOrderState={handleChangeOrderState} />
          </div>

          {/* 모바일 카드 */}
          <div className="flex sm:hidden w-full">
            <AdminOrdersMobile orders={orders} removePostalCode={removePostalCode} timeAgo={timeAgo} onChangeOrderState={handleChangeOrderState} />
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />}
        </>
      )}
    </section>
  );
}
