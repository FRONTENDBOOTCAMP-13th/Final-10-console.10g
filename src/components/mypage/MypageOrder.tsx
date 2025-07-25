'use client';

// 나중에 DB로 불러오는 로직을 위해 컴포넌트로 빼놨습니다.

export default function MypageOrder() {
  return (
    <>
      <div className="w-full border border-light-gray rounded-md">
        <div className="flex flex-row flex-nowrap p-8 lg:p-12 pb-4 lg:pb-6 gap-4 items-center">
          <p className="text-lg lg:text-xl font-bold text-secondary-green">나의 주문 현황</p>
          <p className="text-xs lg:text-sm">최근 3개월 주문 기준</p>
        </div>

        <hr className="border-light-gray" />

        <ul className="flex flex-row flex-wrap justify-center gap-4 items-center p-4 lg:p-12">
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] aspect-square p-4 bg-background rounded-4xl justify-center items-center gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 lg:w-13 aspect-square lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              <span>입금전</span>
            </div>
            <span>1 건</span>
          </li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] aspect-square p-4 bg-background rounded-4xl justify-center items-center gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 lg:w-13 aspect-square lucide lucide-package-icon lucide-package">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                <path d="M12 22V12" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <path d="m7.5 4.27 9 5.15" />
              </svg>
              <span>배송준비중</span>
            </div>
            <span>2 건</span>
          </li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] aspect-square p-4 bg-background rounded-4xl justify-center items-center gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 lg:w-13 aspect-square lucide lucide-truck-icon lucide-truck">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <span>배송중</span>
            </div>
            <span>3 건</span>
          </li>
          <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[6rem] lg:w-[8rem]">
            <div className="flex flex-col flex-nowrap text-xs lg:text-sm sm:w-[6rem] lg:w-[8rem] aspect-square p-4 bg-background rounded-4xl justify-center items-center gap-1 lg:gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 lg:w-13 aspect-square lucide lucide-package-open-icon lucide-package-open">
                <path d="M12 22v-9" />
                <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
              </svg>
              <span>배송완료</span>
            </div>
            <span>4 건</span>
          </li>
        </ul>
      </div>
    </>
  );
}
