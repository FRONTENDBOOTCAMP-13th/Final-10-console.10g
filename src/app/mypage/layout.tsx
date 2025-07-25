import Breadcrumb from '@/components/common/Breadcrumb';
import MyPageNav from '@/components/mypage/MypageNav';
import Link from 'next/link';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col-reverse sm:flex-row sm:justify-between max-w-[1200px] mx-auto p-8 gap-4 text-xs sm:text-sm lg:text-base">
        {/* Sidebar */}
        <aside className="text-dark-gray w-full sm:w-52 lg:w-64">
          <Breadcrumb
            items={[
              { label: '홈', href: '/' },
              { label: '마이페이지', href: '/mypage' },
            ]}
          />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2 mb-8">
            <Link href="/mypage">마이페이지</Link>
          </h2>
          <nav>
            <MyPageNav />
          </nav>
        </aside>
        {/* Content */}
        <section className="w-full">{children}</section>
      </main>
    </>
  );
}
