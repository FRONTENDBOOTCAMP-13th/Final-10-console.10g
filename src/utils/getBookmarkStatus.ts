import type { ApiResPromise } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface BookmarkResponse {
  _id: number;
  user_id: number;
  memo?: string;
  createdAt: string;
  product: object;
}

export async function getBookmarkStatus(productId: number | string, accessToken: string): ApiResPromise<BookmarkResponse | null> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/product/${productId}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    if (res.status === 404) {
      return { ok: 1, item: null };
    }
    const data = await res.json();
    if (data.ok && data.item) {
      return { ok: 1, item: data.item };
    }
    // 북마크가 없으면 item이 없으니 null로 반환
    return { ok: 1, item: null };
  } catch (error) {
    console.error('getBookmarkStatus error:', error);
    return { ok: 0, message: '북마크 상태 조회 실패' };
  }
}
