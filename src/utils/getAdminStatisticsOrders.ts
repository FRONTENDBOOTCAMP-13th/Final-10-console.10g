import type { ApiResPromise } from '@/types/api';

interface Statistics {
  totalQuantity: number;
  totalSales: number;
  date: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 로그인한 사용자의 알림 목록을 가져옵니다.
 */
export async function getAdminStatisticsOrders(token: string): ApiResPromise<Statistics[]> {
  // 🔹 날짜 포맷 함수
  const formatDateToDot = (date: Date): string => `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

  // 🔹 8/1 ~ 오늘 날짜 설정
  const startDate = new Date();
  startDate.setMonth(7); // 8월 (month는 0부터 시작)
  startDate.setDate(1); // 1일

  const today = new Date();

  const searchParams = new URLSearchParams({
    start: formatDateToDot(startDate), // "2025.08.01"
    finish: formatDateToDot(today), // 예: "2025.08.05"
    by: 'day',
  });

  try {
    const requests = await fetch(`${API_URL}/admin/statistics/orders?${searchParams.toString()}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }).then(res => res.json());

    return requests;
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제로 내가 쓴 글을 불러오지 못했습니다.',
    };
  }
}
