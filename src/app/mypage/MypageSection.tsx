'use client';

import { getUserById } from '@/utils/getUsers';
import OrderHistory from './OrderHistory';
import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import AdminGraph from './AdminGraph';
import AdminList from './AdminList';
import { toast } from 'react-hot-toast';

export default function MypageSection() {
  const user = useLoginStore(state => state.user);
  const [type, setType] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const getData = async () => {
      try {
        const res = await getUserById(user._id);

        if (res.ok) {
          const userType = res.item.type;
          setType(userType);
        }
      } catch {
        toast.error('일시적인 네트워크 오류로 마이페이지를 불러올 수 없습니다.');
      }
    };

    getData();
  }, [user]);

  if (type === '')
    return (
      <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center">
        {/* 로딩 원(스피너) */}
        <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-white font-semibold text-sm">데이터 로드 중...</span>
      </div>
    );
  if (type === 'admin')
    return (
      <section className="text-xs sm:text-sm lg:text-base bg-white border-t border-primary-dark min-h-[700px] py-12">
        <div className="flex flex-col flex-nowrap sm:w-[600px] lg:w-[800px] mx-auto">
          <AdminList />
          <AdminGraph />
        </div>
      </section>
    );
  return <OrderHistory />;
}
