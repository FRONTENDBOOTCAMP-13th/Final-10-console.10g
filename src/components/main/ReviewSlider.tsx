'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  image: string;
  name: string;
}

const mockProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: `/images/product${(i % 5) + 1}.png`,
  name: `리뷰 ${i + 1}`,
}));

export default function ProductGrid() {
  const [showAll, setShowAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTouching = useRef(false);
  const isMouseDown = useRef(false);
  const lastX = useRef(0);

  // 터치 이벤트
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

  // 마우스 이벤트
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

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="my-8 px-4">
      {/* 제목 + 전체보기 버튼 */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAll(!showAll)} className="text-sm text-gray-600" type="button">
          {showAll ? '간략 보기' : '전체 보기'}
        </button>
      </div>

      {/* 간략 보기 모드 (가로 스크롤) */}
      {!showAll && (
        <div className="relative">
          {/* 좌우 화살표 버튼 */}
          <button onClick={() => scrollByAmount(-200)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10" aria-label="왼쪽으로 스크롤" type="button">
            ◀
          </button>
          <button onClick={() => scrollByAmount(200)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10" aria-label="오른쪽으로 스크롤" type="button">
            ▶
          </button>

          {/* 드래그 가능*/}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto whitespace-nowrap select-none hide-scrollbar py-2"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {mockProducts.map(product => (
              <div key={product.id} className="inline-block w-[160px] h-[160px] bg-gray-200 rounded-lg relative overflow-hidden flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 전체 보기 모드 */}
      {showAll && (
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.map(product => (
            <div key={product.id} className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="160px" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
