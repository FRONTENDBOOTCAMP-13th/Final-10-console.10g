'use client';

import ProductGrid from '@/components/common/ProductGrid';
import Loading from '../loading';
import ProductItemCard from '@/components/common/ProductItemCard';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { LikedProduct, Product } from '@/types/Product';
import { getLikedProducts, getSearchProducts } from '@/utils/getProducts';
import SearchIcon from '@/components/icon/SearchIcon';
import FilterIcon from '@/components/icon/FilterIcon';

export default function SearchPage() {
  const user = useLoginStore(state => state.user);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [sortOption, setSortOption] = useState('latest');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [newQuery, setNewQuery] = useState<string | null>(query);
  const popoverRef = useRef<HTMLUListElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(newQuery);
    if (newQuery) {
      if (!newQuery.trim()) return;
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  useEffect(() => {
    setQuery(searchParams.get('q'));
  }, [searchParams]);

  // 정렬 핸들러
  const handleChange = (input: React.ChangeEvent<HTMLSelectElement> | string) => {
    let value;
    if (typeof input === 'string') value = input;
    else {
      value = input.target.value;
    }
    setSortOption(value);
  };

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 검색 상품 조회
        if (query) {
          const res = await getSearchProducts(query);
          if (res.ok) {
            setProducts(res.item);
            setSortOption('latest');
          }
        } else throw '검색어가 존재하지 않습니다.';
      } catch {
        console.error('조회 실패');
      }
    };
    fetchProducts();
  }, [query]);

  // 북마크 가져오기
  useEffect(() => {
    if (!user?.token?.accessToken) {
      setLoading(false);
      return;
    }
    const fetchLiked = async () => {
      setLoading(true);
      try {
        const res = await getLikedProducts(user.token.accessToken);
        const products = Object.values(res)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));
        setLikedProducts(products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [user]);

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
  useEffect(() => {
    if (!products) return;
    const copy = [...products];
    switch (sortOption) {
      case 'latest':
        setProducts(copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        break;
      case 'popular':
        setProducts(
          copy.sort((a, b) => {
            const aLeft = a.quantity - a.buyQuantity;
            const bLeft = b.quantity - b.buyQuantity;
            return aLeft - bLeft;
          }),
        );
        break;
      case 'lowPrice':
        setProducts(copy.sort((a, b) => a.price - b.price));
        break;
      case 'highPrice':
        setProducts(copy.sort((a, b) => b.price - a.price));
        break;
      default:
        setProducts(copy);
    }
    setIsOpen(false);
  }, [sortOption]);

  // 정렬
  const sortState = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '낮은가격순', value: 'lowPrice' },
    { label: '높은가격순', value: 'highPrice' },
  ];

  // 상단으로 올라가기
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">‘{query}’ 검색 결과</h2>
      <form onSubmit={handleSearch} className="flex flex-row flex-nowrap justify-between items-center border border-primary bg-white w-52 mt-4 p-2 text-sm lg:text-base">
        <input type="search" placeholder="상품을 검색해보세요!" className="w-[90%]" value={newQuery ? newQuery : ''} onChange={event => setNewQuery(event.target.value)} />
        <button type="submit" className="cursor-pointer">
          <SearchIcon className="w-6 h-6" />
        </button>
      </form>
      <div className="absolute -z-10 right-0 sm:right-0 top-20 sm:top-8 lg:top-0 w-[12.5rem] h-[6.25rem] sm:w-[18.75rem] sm:h-[9.375rem] lg:w-[25rem] lg:h-[12.5rem]">
        <Image src="/chiikawa-three.webp" alt="하치와레 치이카와 우사기" fill />
      </div>
      <article className="border border-primary w-full mt-6 p-8 pb-24 sm:pb-36 lg:pb-48 bg-white">
        <div className="flex flex-row flex-nowrap justify-between items-center mb-4 relative text-primary">
          <p>
            총 <strong className="text-base sm:text-lg">{products ? products.length : '0'}</strong>개의 검색 결과
          </p>
          <select value={sortOption} onChange={handleChange} className="sm:hidden">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="lowPrice">낮은가격순</option>
            <option value="highPrice">높은가격순</option>
          </select>
          <button type="button" className="hidden cursor-pointer sm:flex sm:flex-row sm:flex-nowrap sm:gap-4 sm:items-center" onClick={() => setIsOpen(!isOpen)}>
            <p>{sortState.find(item => item.value == `${sortOption}`)?.label}</p>
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
                    handleChange(option.value);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <>
          {loading ? (
            <Loading />
          ) : (
            products &&
            (products?.length ? (
              <ProductGrid>{likedProducts ? <ProductItemCard products={products} likedProducts={likedProducts}></ProductItemCard> : <ProductItemCard products={products}></ProductItemCard>}</ProductGrid>
            ) : (
              <div className="flex flex-col flex-nowrap justify-center items-center gap-4 w-full mx-auto">
                <Image src="/sad-dotori.png" alt="상품 없음" width={247} height={249}></Image>
                <p>해당하는 상품이 없습니다.</p>
              </div>
            ))
          )}
        </>
      </article>
      <div className="absolute bottom-0 right-0 cursor-pointer flex flex-col flex-nowrap items-center" onClick={scrollToTop}>
        <div className="w-24 h-24 sm:w-40 sm:h-40 lg:w-52 lg:h-52">
          <Image src="/kitty-color.png" title="페이지 상단으로 이동" alt="헬로키티" width={600} height={600}></Image>
        </div>
      </div>
    </>
  );
}
