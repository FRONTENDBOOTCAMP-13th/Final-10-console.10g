'use client';

import { useEffect, useRef, useState } from 'react';
import ProductItemCard from '@/components/common/ProductItemCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import { Product } from '@/types/Product';
import { getLikedProducts, getProducts } from '@/utils/getProducts';
import { useLoginStore } from '@/stores/loginStore';

interface LikedProduct extends Product {
  bookmarkId: number;
}

export default function PopularSection() {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLUListElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const isMobile = window.innerWidth <= 640; // Tailwind 기준 sm 이하
    const scrollAmount = direction === 'left' ? (isMobile ? -250 : -400) : isMobile ? 250 : 400;

    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const resProducts = await getProducts();
        if (resProducts.ok === 1 && Array.isArray(resProducts.item)) {
          resProducts.item.sort((a, b) => b.buyQuantity - a.buyQuantity);
          setProducts(resProducts.item.slice(0, 10));
        } else {
          console.error('상품 데이터 이상:', resProducts);
        }

        if (accessToken) {
          const resLiked = await getLikedProducts(accessToken);
          if (!resLiked.ok) {
            throw resLiked.message;
          }

          const items = resLiked.item as unknown as { _id: number; product: Product }[];

          const liked = items.map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

          setLikedProducts(liked);
        } else {
          setLikedProducts([]);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  // 북마크 상태 변경 감지 → likedProducts 다시 불러오기
  useEffect(() => {
    const handleBookmarkChange = async () => {
      if (!accessToken) return;
      try {
        const resLiked = await getLikedProducts(accessToken);
        if (!resLiked.ok) {
          throw resLiked.message;
        }

        const items = resLiked.item as unknown as { _id: number; product: Product }[];

        const liked = items.map(v => ({
          ...v.product,
          bookmarkId: v._id,
        }));
        setLikedProducts(liked);
      } catch (error) {
        console.error('liked products 재로드 실패:', error);
      }
    };

    window.addEventListener('bookmarkChanged', handleBookmarkChange);
    return () => window.removeEventListener('bookmarkChanged', handleBookmarkChange);
  }, [accessToken]);

  if (loading) {
    return (
      <section className="my-8">
        <div className={`flex flex-row flex-nowrap`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative my-8 py-4 sm:px-12 text-xs sm:text-sm lg:text-base">
      {/* 좌우 스크롤 버튼 */}
      <button className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 z-10" onClick={() => handleScroll('left')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-12 cursor-pointer sm:size-16 lg:size-24 drop-shadow-[0px_0px_4px_rgba(0,0,0,0.5)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 z-10 transform -scale-x-100" onClick={() => handleScroll('right')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-12 cursor-pointer sm:size-16 lg:size-24 drop-shadow-[0px_0px_4px_rgba(0,0,0,0.5)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <ul ref={scrollRef} className={`flex flex-row flex-nowrap p-12 gap-4 overflow-hidden overflow-x-scroll scrollbar-hide`}>
        <ProductItemCard products={products} likedProducts={likedProducts} type={'large'} />
      </ul>
    </section>
  );
}
