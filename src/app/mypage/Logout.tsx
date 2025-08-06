'use client';

import { useLoginStore } from '@/stores/loginStore';
import toast from 'react-hot-toast';

interface LogoutProps {
  className?: string;
  children?: React.ReactNode;
  onLogoutComplete?: () => void;
}

export default function Logout({ className = 'w-full text-center border cursor-pointer border-primary p-4 rounded-2xl', children = '로그아웃', onLogoutComplete }: LogoutProps) {
  const logout = useLoginStore(state => state.logout);

  const handleLogout = () => {
    try {
      logout();
      toast.success('로그아웃되었습니다.');

      if (onLogoutComplete) {
        onLogoutComplete();
      }
      window.location.href = '/login';
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
      console.error('Logout error:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
