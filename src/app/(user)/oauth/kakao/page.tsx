'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '';

export default function KakaoOAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    const code = urlParams.get('code');

    console.log(code);

    if (code) {
      axios
        .post(`${API_URL}/users/login/kakao`, {
          code,
          redirect_uri: REDIRECT_URI,
          user: {},
        })
        .then(res => {
          console.log('카카오 로그인 성공:', res.data);
          // 토큰 등 상태 저장 (예: zustand store)
          // 로그인 후 홈 등으로 이동
          router.replace('/');
        })
        .catch(err => {
          console.error('카카오 로그인 실패:', err);
        });
    }
  }, [router]);

  return <div>카카오 로그인 처리 중입니다...</div>;
}
