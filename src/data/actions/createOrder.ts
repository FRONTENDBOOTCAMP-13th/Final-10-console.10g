import type { ApiRes } from '@/types/api';
import type { OrderForm, OrderResponse } from '@/types/Order';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;

export async function createOrder(data: OrderForm, token: string): Promise<ApiRes<OrderResponse>> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    console.error('주문 생성 실패:', error);
    return { ok: 0, message: '주문 요청 실패' };
  }
}
