import { LoginUser } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoginStore {
  user: LoginUser | null;
  isLogin: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    set => ({
      user: null,
      isLogin: false,
      login: (user: LoginUser) => set({ user, isLogin: true }),
      logout: () => set({ user: null, isLogin: false }),
    }),
    {
      name: 'login-storage',
      partialize: state => ({ user: state.user, isLogin: state.isLogin }),
    },
  ),
);
