'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  image: string;
  name: string;
}

const characterImagePaths = [
  { image: '/character/ghibli.png', name: '지브리' },
  { image: '/character/disney-pixar.png', name: '디즈니/픽사' },
  { image: '/character/sanrio.png', name: '산리오' },
  { image: '/character/miffy.png', name: '미피' },
  { image: '/character/pingu.png', name: '핑구' },
  { image: '/character/shinchang.png', name: '짱구' },
  { image: '/character/chiikawa.png', name: '치이카와' },
  { image: '/character/snoopy.png', name: '스누피' },
];

const mockProducts: Product[] = characterImagePaths.map((product, i) => ({
  id: i,
  image: product.image,
  name: product.name,
}));

export default function ProductGrid() {
  const [showAll, setShowAll] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 윈도우 크기 상태 업데이트
  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 640px 미만이고 간략보기이고 드래그 중 아니면 자동 스크롤 실행
  useEffect(() => {
    if (!scrollRef.current) return;
    if (windowWidth >= 640) return;
    if (showAll) return;
    if (isDragging) return;

    let rafId: number;
    const speed = 0.4;

    const step = () => {
      if (!scrollRef.current) return;
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [windowWidth, showAll, isDragging]);

  const isTouching = useRef(false);
  const lastX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    isTouching.current = true;
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current || !scrollRef.current) return;
    const dx = lastX.current - e.touches[0].clientX;
    scrollRef.current.scrollLeft += dx;
    lastX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isTouching.current = false;
  };

  const isMouseDown = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    isMouseDown.current = true;
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !scrollRef.current) return;
    const dx = lastX.current - e.clientX;
    scrollRef.current.scrollLeft += dx;
    lastX.current = e.clientX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isMouseDown.current = false;
  };

  const isMobile = windowWidth < 640;

  return (
    <section className="my-8 px-4">
      {/* 전체보기 버튼 (640px 미만에서만 표시) */}
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowAll(!showAll)} className="cursor-pointer text-sm text-gray-600">
            {showAll ? '간략 보기' : '전체 보기'}
          </button>
        </div>
      )}

      {/* 간략보기(자동스크롤+드래그) - 640px 미만 & showAll이 false 일 때만 노출 */}
      {isMobile && !showAll && (
        <div ref={scrollRef} className="flex gap-4 overflow-x-hidden whitespace-nowrap select-none" style={{ cursor: isDragging ? 'grabbing' : 'grab' }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          {mockProducts.map((product, index) => (
            <div key={product.id} className="inline-flex flex-col items-center w-[120px] sm:w-[160px] flex-shrink-0">
              <Link href={`/category/character/0${index + 1}`} className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-md overflow-hidden block">
                <Image src={product.image} alt={`${product.name} 캐릭터 이미지`} fill className="object-cover" sizes="120px" />
              </Link>
              <Link href={`/category/character/0${index + 1}`} className="mt-2 text-center text-sm font-medium block">
                {product.name}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 4열 그리드 - 640px 이상이거나, showAll이 true일 때 항상 노출 */}
      {(showAll || !isMobile) && (
        <div className="grid grid-cols-4 gap-4">
          {mockProducts.map((product, index) => (
            <Link href={`/category/character/0${index + 1}`} key={product.id} className="flex flex-col items-center w-full select-none">
              <div className="relative w-full pb-[100%] overflow-hidden rounded-md">
                <Image src={product.image} alt={`${product.name} 캐릭터 이미지`} fill className="object-cover" sizes="25vw" />
              </div>
              <p className={`mt-2 text-center text-sm ${showAll ? '' : 'font-bold'}`}>{product.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
