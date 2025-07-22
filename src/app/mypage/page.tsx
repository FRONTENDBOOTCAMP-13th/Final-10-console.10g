'use client';

import Image from 'next/image';

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  // lg 기준 width 잡기
  const isLg = width >= 1024;

  // @2x 적용할 파일들 목록
  const targetImages = ['greencard', 'barcode'];

  // 현재 src가 targetImages에 포함되어 있으면 @2x 처리
  const shouldApply2x = targetImages.some(name => src.includes(name));

  if (isLg && shouldApply2x) {
    return src.replace('.png', '@2x.png');
  }

  return src;
};

export default function MyPage() {
  return (
    <div className="flex flex-col items-center  p-2 sm:p-4 space-y-10 mt-4">
      {/* 주민증 */}
      <div className="relative w-80 h-35 sm:w-120 sm:h-50 lg:w-150 lg:h-60 bg-[#E7D8CC] rounded-md shadow-lg flex items-center justify-center">
        {/* 카드 배경 이미지 */}
        <div className="relative  rounded-xl">
          <Image loader={imageLoader} src="/mypage-greencard.png" alt="Green Card" className="rounded-lg w-75 h-30 sm:w-115 sm:h-45 lg:w-140 lg:h-55 object-cover" width={280} height={100} priority />
          {/* 프로필 버튼 */}
          <button type="button" onClick={() => console.log('프로필 버튼 클릭!')} className="absolute top-7 left-4 w-[3.75rem] h-[3.75rem] sm:left-8 sm:top-11 sm:w-[5rem] sm:h-[5rem] lg:w-[7rem] lg:h-[7rem] lg:left-10 lg:top-12 rounded-xl overflow-hidden">
            <Image src="/mypage-profile.png" alt="profile" className="object-cover" fill />
          </button>
          {/* MEMBERSHIP CARD 텍스트 */}
          <div className="absolute top-0.5 left-10 right-10 text-center flex items-center justify-center gap-2">
            <div className="flex-1 border-t border-[#95aa81]"></div>
            <h2 className="text-[#95aa81] text-[.5rem] sm:text-[0.75rem] lg:text-base tracking-wide">MEMBERSHIP CARD</h2>
            <div className="flex-1 border-t border-[#95aa81]"></div>
          </div>
          {/* NAME & BIRTH */}
          <div className="absolute top-7 left-20 space-y-1  sm:top-11 sm:left-35 sm:space-y-2 lg:left-50 lg:top-14">
            <div className="flex items-center w-45 border-b border-[#95aa81] mb-1.5 sm:w-60 sm:mb-2.5 lg:w-80">
              <p className="text-[#95aa81] text-[.6rem] pr-2 sm:text-[0.75rem] lg:text-base ">NAME</p>
              <p className="text-[.6rem] sm:text-[0.75rem] lg:text-base text-dark-gray">유빈</p>
            </div>
            <div className="flex items-center w-45 border-b border-[#95aa81] mb-1.5 sm:w-60 sm:mb-2.5 lg:w-80">
              <p className="text-[#95aa81] text-[.6rem]  pr-2 sm:text-[0.75rem] lg:text-base">BIRTH</p>
              <p className="text-dark-gray text-[.6rem] sm:text-[0.75rem] lg:text-base">1999.09.03</p>
            </div>
            <div className="flex items-center w-45 border-b border-[#95aa81] sm:w-60 lg:w-80">
              <p className="text-dark-gray text-[.6rem] sm:text-[0.75rem] lg:text-base">안녕하세요 도토리섬 주민입니다!</p>
            </div>
          </div>
          {/* 바코드 */}
          <div className="absolute bottom-0 right-7 w-22 h-4 sm:right-10 sm:w-30 sm:h-5 lg:w-40 lg:h-7">
            <Image loader={imageLoader} src="/mypage-barcode.png" alt="Barcode" className="object-cover" fill />
          </div>
          {/* 작은 텍스트 */}
          <div className="absolute bottom-1 left-5 text-[#95aa81] text-[.45rem] sm:text-[0.5rem] sm:bottom-2 lg:text-[0.75rem] lg:bottom-3">CONSOLE.10G</div>
        </div>
      </div>

      {/* 나의 주문 현황 */}
      <div className="w-full max-w-[20rem]  sm:max-w-[30rem] lg:shadow-md lg:max-w-full lg:border lg:border-gray">
        <div className="text-sm flex flex-row items-center mb-1 px-2 py-1 lg:px-4 lg:py-2 lg:bg-background lg:border-b border-gray">
          <span className="text-dark-gray font-bold text-xs sm:text-sm lg:text-base">나의 주문 현황</span>
          <span className="flex flex-row text-gray text-[0.7rem] mt-1 ml-2 sm:text-xs sm:ml-3 lg:text-sm lg:ml-4">
            최근 <p className="text-dark-gray mx-0.5 sm:mx-0.75 lg:mx-1 font-bold">3개월</p> 기준
          </span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-soft-gray text-center font-bold border-dark-gray border-t border-b sm:py-6 lg:divide-gray lg:border-none lg:py-12 lg:border-gray">
          {['입금전', '배송준비중', '배송중', '배송완료'].map((label, idx) => (
            <div key={idx} className="py-3 sm:4 lg:py-6">
              <p className="text-xs text-dark-gray  mb-1 sm:text-sm sm:mb-3 lg:text-base lg:mb-6">{label}</p>
              <p className="text-base  text-dark-gray sm:text-lg lg:text-3xl">0</p>
            </div>
          ))}
        </div>
      </div>

      {/* 나의 주문 내역 조회 */}
      <div className="w-full max-w-[20rem] sm:max-w-[30rem] lg:max-w-full border-gray mt-4">
        <div className="text-sm flex flex-row items-center mb-1 px-2 py-1 border-gray">
          <span className="text-dark-gray font-bold text-xs sm:text-sm lg:text-base">주문내역 조회</span>
          <span className="flex flex-row text-gray text-[0.7rem] mt-1 ml-2 sm:text-xs sm:ml-3 lg:text-sm lg:ml-4">
            최근 <p className="text-dark-gray mx-0.5 sm:mx-0.75 lg:mx-1 font-bold">3개월</p> 기준
          </span>
        </div>
        <div className="grid grid-cols-5 text-center text-dark-gray border-t border-b">
          {['주문번호', '상품명', '주문일자', '주문상태', '결제금액'].map((header, idx) => (
            <div key={idx} className="py-2 text-[0.7rem] sm:text-sm lg:text-base">
              {header}
            </div>
          ))}
        </div>
        {[
          { no: 1, name: '도토리 머그컵', date: '2025-07-08', status: '배송완료', price: '15,000', img: '/logo.png' },
          { no: 2, name: '도토리 머그컵', date: '2025-07-08', status: '결제완료', price: '15,000', img: '/logo.png' },
          { no: 3, name: '도토리 머그컵', date: '2025-07-08', status: '취소완료', price: '15,000', img: '/logo.png' },
        ].map((order, idx) => (
          <div key={idx} className="grid grid-cols-5 items-center text-center border-b text-[0.5rem] sm:text-[0.75rem] lg:text-base">
            <p className="py-2">{order.no}</p>
            <div className="flex flex-col items-center justify-center py-2">
              <Image src={order.img} alt="상품 이미지" width={40} height={40} className="rounded-md mb-1 lg:w-16 lg:h-16" />
              <p>{order.name}</p>
            </div>
            <p>{order.date}</p>
            <p
              className={`${order.status === '취소완료' ? '' : 'font-bold'} 
              ${order.status === '배송완료' ? 'text-primary' : 'text-dark-gray'}`}
            >
              {order.status}
            </p>
            <p>{order.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
