import ResidentCard from './ResidentCard';
import MypageOrder from '@/components/mypage/MypageOrder';
import MypageOrderHistory from '@/components/mypage/MypageOrderHistory';

export default function MyPage() {
  return (
    <div className="flex flex-col items-center w-full sm:p-4 gap-8">
      <ResidentCard />

      {/* 나의 주문 현황 */}
      <MypageOrder />

      {/* 나의 주문 내역 조회 */}
      <MypageOrderHistory />
    </div>
  );
}
