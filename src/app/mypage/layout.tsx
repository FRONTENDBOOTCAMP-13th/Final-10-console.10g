import Link from 'next/link';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row max-w-[1200px] mx-auto">
        {/* Sidebar */}
        <aside className="text-dark-gray w-full sm:w-40 lg:w-50 p-3">
          <nav className="space-y-5 flex flex-col text-xs sm:text-sm lg:text-base">
            <Link href="/mypage/myposts">내가 쓴 글</Link>
            <Link href="/mypage/address">배송 주소록 관리</Link>
            <Link href="/mypage/wishlist">관심 상품</Link>
            <Link href="/mypage/edit-info">회원 정보 수정</Link>
            <Link href="/mypage/logout">로그아웃</Link>
          </nav>
        </aside>
        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
