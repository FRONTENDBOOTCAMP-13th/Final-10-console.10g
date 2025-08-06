'use client';

import { useEffect, useState, useRef } from 'react';
import { getAllReviews } from '@/utils/getReviews';
import type { Review } from '@/types/Review';
import BestReviewCard from './BestReviewCard';

export default function ReviewSlider() {
  const [showAll, setShowAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTouching = useRef(false);
  const isMouseDown = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const allReviews = await getAllReviews();

        // 이미지가 있고 평점이 4 이상인 리뷰만 필터링
        const imageReviews = allReviews.filter(review => review.images && review.images.length > 0 && review.rating >= 4);

        // 랜덤으로 섞고 12개 선택
        const shuffled = imageReviews.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 12);

        setSelectedReviews(selected);
      } catch (err) {
        console.error('리뷰 가져오기 실패:', err);
        setError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
      {/* 전체보기 토글 버튼 */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAll(!showAll)} className="cursor-pointer text-sm text-gray-600" type="button">
          {showAll ? '간략 보기' : '전체 보기'}
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">리뷰를 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {/* 리뷰가 없을 때 */}
      {!loading && !error && selectedReviews.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">베스트 포토리뷰가 없습니다.</div>
        </div>
      )}

      {/* 간략 보기 (가로 슬라이더) */}
      {!loading && !error && selectedReviews.length > 0 && !showAll && (
        <div className="relative">
          {/* 좌우 버튼 */}
          <button onClick={() => scrollByAmount(-200)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10" aria-label="왼쪽으로 스크롤" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-12 cursor-pointer drop-shadow-[0px_0px_3px_rgba(0,0,0,1)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={() => scrollByAmount(200)} className="absolute right-2 top-1/2 -translate-y-1/2 transform -scale-x-100 z-10" aria-label="오른쪽으로 스크롤" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-12 cursor-pointer drop-shadow-[0px_0px_3px_rgba(0,0,0,1)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* 드래그 가능 영역 */}
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
            {selectedReviews.map(review => (
              <BestReviewCard key={String(review._id)} review={review} variant="slider" />
            ))}
          </div>
        </div>
      )}

      {/* 전체 보기 (그리드) */}
      {!loading && !error && selectedReviews.length > 0 && showAll && (
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedReviews.map(review => (
            <BestReviewCard key={`${String(review._id)}-${showAll ? 'grid' : 'slider'}`} review={review} variant={showAll ? 'grid' : 'slider'} />
          ))}
        </div>
      )}
    </section>
  );
}
