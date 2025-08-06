import { refreshToken } from '@/data/actions/authorization';
import { LoginUser } from '@/types';
import { getUserById } from '@/utils/getUsers';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoginStore {
  user: LoginUser | null;
  isLogin: boolean;
  isLoading: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
  fetchUser: () => void;
  refreshUser: () => void;
  isAdmin: boolean;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLogin: false,
      isLoading: true,
      fetchUser: async () => {
        const prevUser = get().user;
        if (prevUser) {
          const res = await getUserById(prevUser._id);

          if (res.ok && res.item.image) {
            const newUser = {
              ...prevUser,
              image: res.item.image,
            };

            set({ user: newUser });
          }
        }
      },
      isAdmin: false,
      login: (user: LoginUser) =>
        set({
          user,
          isLogin: true,
          isAdmin: user.type === 'admin',
        }),
      logout: () => set({ user: null, isLogin: false, isAdmin: false }),
      refreshUser: async () => {
        const prevUser = get().user;
        if (prevUser) {
          const res = await refreshToken(prevUser);

          if (res.ok) {
            const newUser = {
              ...prevUser,
              token: {
                ...prevUser.token,
                accessToken: res.accessToken,
              },
            };
            set({ user: newUser });
          } else {
            console.error('토큰 재발행 실패');
          }
        }
      },
    }),
    {
      name: 'login-storage',
      partialize: state => ({ user: state.user, isLogin: state.isLogin, isAdmin: state.isAdmin }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
