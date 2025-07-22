import type { UserAddress } from '@/types/User';
import { PatchUserAddressesRes } from '@/types/UserAddressRes';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 공통 PATCH 함수 - 수정, 삭제, 대표배송지 변경 처리
 * @param userId 유저 ID
 * @param accessToken JWT 토큰
 * @param updatedAddresses 수정된 주소 배열
 * @returns { ok, item, message }
 */
export async function patchUserAddresses(userId: number, accessToken: string, updatedAddresses: UserAddress[]): Promise<PatchUserAddressesRes> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        extra: { address: updatedAddresses },
      }),
    });

    const data: PatchUserAddressesRes = await res.json();
    return data;
  } catch (error) {
    console.error('patchUserAddresses 에러:', error);
    return { ok: 0, message: '주소 업데이트 실패' };
  }
}
