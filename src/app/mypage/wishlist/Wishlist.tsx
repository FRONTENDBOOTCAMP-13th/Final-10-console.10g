'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { getLikedProducts } from '@/utils/getProducts';
import ProductCard from './ProductCard';
import type { Product } from '@/types/Product';
import Loading from '@/app/loading';
import FilterIcon from '@/components/icon/FilterIcon';
import Pagination from '@/components/common/Pagination';
import toast from 'react-hot-toast';

interface LikedProduct extends Product {
  bookmarkId: number;
}

export default function Wishlist() {
  const user = useLoginStore(state => state.user);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('date');
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLUListElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 12;
  useEffect(() => {
    if (!user?.token?.accessToken) return;

    try {
      setLoading(true);
      const fetchLiked = async () => {
        const res = await getLikedProducts(user.token.accessToken);

        if (!res.ok) {
          throw res.message;
        }

        const items = res.item as unknown as { _id: number; product: Product }[];

        setTotalPage(Math.ceil(res.item.length / itemsPerPage));
        const products = items.map(v => ({
          ...v.product,
          bookmarkId: v._id,
        }));

        setLikedProducts(products);
      };

      fetchLiked();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640); // 모바일 기준 폭 설정
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sortedProducts = [...likedProducts].sort((a, b) => {
    if (sortOption === 'lowPrice') return a.price - b.price;
    if (sortOption === 'highPrice') return b.price - a.price;
    if (sortOption === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const paginatedProducts = useMemo(() => {
    if (sortedProducts) {
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      if (!isMobile) return sortedProducts.slice(startIdx, endIdx);
      else return sortedProducts;
    } else {
      return [];
    }
  }, [sortedProducts, currentPage]);

  // 클릭 외부 감지로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // 정렬
  const sortState = [
    { label: '담은 날짜순', value: 'date' },
    { label: '낮은가격순', value: 'lowPrice' },
    { label: '높은가격순', value: 'highPrice' },
  ];

  return (
    <>
      <div className="flex flex-row flex-nowrap justify-between items-center p-4 sm:px-0 relative">
        <p>TOTAL {likedProducts ? likedProducts.length : 0} ITEMS</p>
        <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="sm:hidden">
          <option value="lowPrice">가격 낮은순</option>
          <option value="highPrice">가격 높은순</option>
          <option value="date">담은 날짜순</option>
        </select>
        <button type="button" className="hidden cursor-pointer sm:flex sm:flex-row sm:flex-nowrap sm:gap-4 sm:items-center" onClick={() => setIsOpen(!isOpen)}>
          {/* <p>{sortState.find(item => item.value == `${sortOption}`)?.label}</p> */}
          <FilterIcon svgProps={{ className: 'w-8 h-8' }} />
        </button>
        {isOpen && (
          <ul ref={popoverRef} className="absolute bg-white p-4 flex flex-col flex-nowrap gap-2 right-0 top-12 z-10 border border-primary">
            {sortState.map((option, index) => (
              <li
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setSortOption(option.value);
                  setIsOpen(!isOpen);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <Loading />}
      {!loading && paginatedProducts.length > 0 ? (
        <div className="flex flex-col flex-nowrap justify-center sm:bg-background rounded-4xl sm:border border-primary">
          <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-8">
            {paginatedProducts.map(product => (
              <ProductCard key={product._id} product={product} bookmarkId={product.bookmarkId} />
            ))}
          </ul>
          <div className="hidden sm:block pt-12 pb-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={page => {
                setCurrentPage(page);
              }}
              totalPages={totalPage}
            />
          </div>
        </div>
      ) : (
        <div className="p-4">관심 상품이 없습니다.</div>
      )}
    </>
  );
}
