'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const banners = [{ image: '/main-banner1.png' }, { image: '/main-banner2.png' }, { image: '/main-banner3.png' }];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 슬라이드 함수
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 3000);
  };

  // 자동 슬라이드 멈추기
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 자동 슬라이드 재시작
  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  // 슬라이드 직접 이동 함수
  const goToSlide = (index: number) => {
    setCurrent(index);
    resetAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-80 xl:h-[500px] overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, idx) => (
          <div key={idx} className="w-full flex-shrink-0 h-64 sm:h-80 xl:h-[500px] relative">
            <Image src={banner.image} alt={`배너 ${idx + 1}`} fill className="object-cover" priority={idx === 0} />
          </div>
        ))}
      </div>

      {/* 왼쪽 화살표 */}
      <button onClick={() => goToSlide((current - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow">
        ◀
      </button>

      {/* 오른쪽 화살표 */}
      <button onClick={() => goToSlide((current + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow">
        ▶
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button key={idx} onClick={() => goToSlide(idx)} className={`w-2 h-2 rounded-full transition-colors ${current === idx ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
