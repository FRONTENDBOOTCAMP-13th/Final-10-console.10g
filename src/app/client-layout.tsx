'use client';
import { useEffect, useState } from 'react';
import WelcomeModal from '@/components/common/WelcomeModal';
import { useLoginStore } from '@/stores/loginStore';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function ClientLayout() {
  const user = useLoginStore(state => state.user);
  const isAdmin = user?.type === 'admin';
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  function logout() {
    localStorage.removeItem('accessToken');
    toast.error('로그아웃되었습니다. 다시 로그인해주세요.');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }

  // 모달 제어
  useEffect(() => {
    if (pathname === '/login' || isAdmin) {
      setShowModal(false);
      return;
    }

    const doNotShowUntil = localStorage.getItem('doNotShowUntil');
    const now = new Date();

    if (!doNotShowUntil || new Date(doNotShowUntil) < now) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [pathname, isAdmin]);

  // 토큰 만료 체크
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expireAt = payload.exp * 1000;
      const now = Date.now();

      const timeLeft = expireAt - now;

      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeLeft);

        return () => clearTimeout(timer);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [router]);

  if (isAdmin || pathname === '/login') {
    return null;
  }

  return (
    <>
      {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
      <Toaster position="top-center" />
    </>
  );
}
