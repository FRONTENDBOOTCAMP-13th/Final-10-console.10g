import { LoginUser } from '@/types';
import type { ApiResPromise } from '@/types/api';
import { stringifyError } from 'next/dist/shared/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 이메일과 비밀번호를 입력해 로그인을 합니다.
 * @param {string} email - 유저 이메일
 * @param {string} password - 유저 패스워드
 * @returns {Promise<ApiRes<LoginUser>>} - 유저 목록 응답 객체
 */
export async function postUsersLogin(email: string, password: string): ApiResPromise<LoginUser> {
  const body = {
    email: `${email}`,
    password: `${password}`,
  };

  try {
    const res = await fetch(`${API_URL}/users/login?expiresIn=7d`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    if (typeof error === 'string') return { ok: 0, message: error };
    else if (error instanceof Error) return { ok: 0, message: stringifyError(error) };

    return { ok: 0, message: '일시적인 문제로 로그인에 실패했습니다. 잠시후에 시도해주세요.' };
  }
}
