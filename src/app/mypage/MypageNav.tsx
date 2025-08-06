'use client';

import { useLoginStore } from '@/stores/loginStore';
import { getUserById } from '@/utils/getUsers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function MypageNav() {
  const pathname = usePathname();
  const user = useLoginStore(state => state.user);
  const [type, setType] = useState<string>('admin');

  useEffect(() => {
    if (!user) return;
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

  if (type === 'admin') return;

  return (
    <>
      <div className="sticky top-[60.5px] sm:top-[69px] bg-background z-20 w-full text-sm lg:text-base">
        <nav className="flex flex-row flex-nowrap w-full sm:w-[600px] lg:w-[700px] mx-auto items-center justify-center">
          <Link href="/mypage" className={`h-16 flex flex-row flex-wrap items-center justify-center sm:h-12 w-full py-2 text-center ${pathname === '/mypage' ? 'border-b-4 border-primary-dark text-primary-dark font-bold' : ''}`}>
            마이페이지
          </Link>
          <Link href="/mypage/myposts" className={`h-16 flex flex-row flex-wrap items-center justify-center sm:h-12 w-full py-2 text-center ${pathname.startsWith('/mypage/myposts') ? 'border-b-4 border-primary-dark text-primary-dark font-bold' : ''}`}>
            내가 쓴 글
          </Link>
          <Link href="/mypage/address" className={`h-16 flex flex-row flex-wrap items-center justify-center sm:h-12 w-full py-2 text-center ${pathname.startsWith('/mypage/address') ? 'border-b-4 border-primary-dark text-primary-dark font-bold' : ''}`}>
            주소록 <br className="sm:hidden" />
            관리
          </Link>
          <Link href="/mypage/wishlist" className={`h-16 flex flex-row flex-wrap items-center justify-center sm:h-12 w-full py-2 text-center ${pathname.startsWith('/mypage/wishlist') ? 'border-b-4 border-primary-dark text-primary-dark font-bold' : ''}`}>
            관심 상품
          </Link>
          <Link href="/mypage/edit-info" className={`h-16 flex flex-row flex-wrap items-center justify-center sm:h-12 w-full py-2 text-center ${pathname.startsWith('/mypage/edit-info') ? 'border-b-4 border-primary-dark text-primary-dark font-bold' : ''}`}>
            회원정보 <br className="sm:hidden" />
            수정
          </Link>
        </nav>
        <hr className="border-primary-dark" />
      </div>
    </>
  );
}
