'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MyPageNav() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col flex-nowrap">
      <li className={`p-4 border-t border-light-gray ${pathname === '/mypage/myposts' ? 'text-primary font-bold' : ''}`}>
        <Link href="/mypage/myposts">내가 쓴 글</Link>
      </li>
      <li className={`p-4 border-t border-light-gray ${pathname.startsWith('/mypage/address') ? 'text-primary font-bold' : ''}`}>
        <Link href="/mypage/address">배송 주소록 관리</Link>
      </li>
      <li className={`p-4 border-t border-light-gray ${pathname === '/mypage/wishlist' ? 'text-primary font-bold' : ''}`}>
        <Link href="/mypage/wishlist">관심 상품</Link>
      </li>
      <li className={`p-4 border-t border-light-gray ${pathname === '/mypage/edit-info' ? 'text-primary font-bold' : ''}`}>
        <Link href="/mypage/edit-info">회원 정보 수정</Link>
      </li>
      <li className={`p-4 border-y border-light-gray ${pathname === '/mypage/logout' ? 'text-primary font-bold' : ''}`}>
        <Link href="/mypage/logout">로그아웃</Link>
      </li>
    </ul>
  );
}
