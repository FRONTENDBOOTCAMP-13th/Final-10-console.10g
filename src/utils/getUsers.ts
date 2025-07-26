// src/utils/getUsers.ts

import type { ApiResPromise } from '@/types/api';
import type { User, UserAddress } from '@/types/User';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 유저 목록을 가져옵니다.
 * @returns {Promise<ApiRes<User[]>>} - 유저 목록 응답 객체
 */
export async function getUsers(): ApiResPromise<User[]> {
  try {
    const res = await fetch(`${API_URL}/users`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 유저 목록을 불러오지 못했습니다.' };
  }
}

/**
 * 특정 유저의 상세 정보를 가져옵니다.
 * @param userId - 조회할 유저의 고유 ID
 * @returns {Promise<ApiRes<User>>} - 유저 상세 정보 응답 객체
 */
export async function getUserById(userId: number): ApiResPromise<User> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('getUserById 에러:', error);
    return { ok: 0, message: '일시적인 네트워크 문제로 유저 정보를 불러오지 못했습니다.' };
  }
}

/**
 * 특정 유저의 배송지 목록 가져오기
 * @param userId 유저 ID
 * @param accessToken 로그인 토큰
 */
export async function getUserAddress(userId: number, accessToken: string): ApiResPromise<UserAddress[]> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/extra/address`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    const result = await res.json();
    const addresses = result?.item?.extra?.address;
    if (res.ok && Array.isArray(addresses)) {
      return { ok: 1, item: addresses };
    }

    return { ok: 1, item: [] };
  } catch (error) {
    console.error('getUserAddress 에러:', error);
    return { ok: 0, message: '일시적인 네트워크 문제로 배송지 목록을 불러오지 못했습니다.' };
  }
}

/**
 * 이메일 중복 여부를 체크 합니다.
 * @returns {Promise<ApiRes<User[]>>} - 유저 목록 응답 객체
 */
export async function getUsersEmail(email: string) {
  try {
    const res = await fetch(`${API_URL}/users/email?email=${email}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 유저 목록을 불러오지 못했습니다.' };
  }
}
