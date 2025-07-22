import type { ApiResPromise } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 북마크 삭제 함수
 * @param bookmarkId - 삭제할 북마크의 ID
 * @param accessToken - 로그인한 유저의 액세스 토큰
 * @returns 삭제 결과를 반환하는 Promise
 * @description
 * 북마크를 서버에서 삭제합니다.
 */
export async function deleteBookmark(bookmarkId: number, accessToken: string): ApiResPromise<null> {
  try {
    const res = await fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('북마크 삭제 실패');
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}
