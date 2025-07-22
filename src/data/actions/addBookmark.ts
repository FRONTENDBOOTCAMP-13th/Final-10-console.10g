import type { ApiResPromise } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 북마크 추가 함수
 * @param targetId - 북마크 대상 ID (상품 id)
 * @param type - 북마크 타입 ('product' | 'user' | 'post')
 * @param accessToken - 로그인한 유저의 액세스 토큰
 * @returns 추가 결과를 반환하는 Promise
 * @description
 * 서버에 북마크를 추가합니다.
 */
export async function addBookmark(targetId: number, type: 'product' | 'user' | 'post' = 'product', accessToken: string): ApiResPromise<{ _id: number }> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${type}`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        target_id: targetId,
        memo: '',
        extra: {},
      }),
    });

    if (!res.ok) {
      throw new Error('북마크 추가 실패');
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}
