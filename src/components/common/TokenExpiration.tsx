import { useLoginStore } from '@/stores/loginStore';
import { getUserById } from '@/utils/getUsers';
import toast from 'react-hot-toast';

export default function TokenExpiration() {
  const user = useLoginStore(state => state.user);
  const logout = useLoginStore(state => state.logout);

  const fetchUser = async () => {
    if (user) {
      const res = await getUserById(user?._id);

      if (!res.ok && res.errorName) {
        toast.error('로그인 토큰이 만료되었습니다.');
        logout();
      }
    }
  };

  fetchUser();
}
