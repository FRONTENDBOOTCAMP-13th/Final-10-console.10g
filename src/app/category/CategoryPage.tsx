'use client';

import ProductGrid from '@/components/common/ProductGrid';
import { Product } from '@/types/Product';
import { getLikedProducts, getProducts, getProductsCategory } from '@/utils/getProducts';
import ProductItemCard from '@/components/common/ProductItemCard';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import Image from 'next/image';
import FilterIcon from '@/components/icon/FilterIcon';

interface LikedProduct extends Product {
  bookmarkId: number;
}

interface CategoryPageProps {
  category: string;
  title: string;
  detailArray?: detailArray[];
}

interface detailArray {
  name: string;
  address: string;
}

export default function CategoryPage({ category, title, detailArray }: CategoryPageProps) {
  // 유저 로그인 정보 (찜목록 갱신)
  const user = useLoginStore(state => state.user);
  // 상품 목록
  const [products, setProducts] = useState<Product[] | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 찜목록
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  // 정렬 상태
  const [sortOption, setSortOption] = useState('latest');
  // 데스크탑 정렬 상태 열림/닫힘
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    console.log('선택된 정렬 기준:', value);
    // TODO: 여기에 정렬 로직 추가
  };

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 전체 상품 조회
        if (category === 'all') {
          const res = await getProducts();
          if (res.ok) {
            setProducts(res.item);
          }
        }
        // 카테고리 상품 조회
        else {
          const res = await getProductsCategory(category);
          if (res.ok) {
            setProducts(res.item);
          }
        }
      } catch {
        console.log('실패');
      }
    };

    fetchProducts();
  }, []);

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
        console.log('북마크 상품', likedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user]);

  return (
    <main className="flex flex-col-reverse sm:flex-row px-4 sm:max-w-[664px] lg:max-w-[1000px] mx-auto py-4 sm:py-12">
      <section className="w-full text-xs sm:text-sm lg:text-base">
        {/* 페이지 제목 */}
        {/* TODO Props로 세부 카테고리일 경우 하위 카테고리 추가 */}
        <nav aria-label="Breadcrumb">
          <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href={`/category/${category}`}>{title}</Link>
            </li>
          </ol>
        </nav>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">{title}</h2>

        {/* 세부 카테고리 */}
        {/* TODO 나중에 Props로 입력 받아서 선택된 카테고리에 배경색 입히기 */}
        {detailArray && (
          <aside>
            <div className="w-full overflow-x-auto scrollbar-hide">
              <ul className=" flex flex-row flex-nowrap sm:flex-wrap sm:justify-center items-center gap-2 overflow-x-auto w-max sm:w-full">
                {detailArray.map((item, index) => {
                  if (index === 2)
                    return (
                      <Fragment key={index}>
                        <li className="border border-primary rounded-lg sm:rounded-2xl px-4 py-2">
                          <Link href={`/category/${item.address}`}>{item.name}</Link>
                        </li>
                        <li className="hidden sm:block sm:w-full sm:h-0" />
                      </Fragment>
                    );
                  return (
                    <li key={index} className="border border-primary rounded-lg sm:rounded-2xl px-4 py-2">
                      <Link href={`/category/${item.address}`}>{item.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        <div className="flex flex-row flex-nowrap justify-between items-center py-4 relative">
          <p>TOTAL {products ? products.length : 0} ITEMS</p>
          <select value={sortOption} onChange={handleChange} className="sm:hidden">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="lowPrice">낮은가격순</option>
            <option value="highPrice">높은가격순</option>
          </select>
          <button type="button" className="hidden sm:block cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <FilterIcon svgProps={{ className: 'w-8 h-8' }} />
          </button>
          {isOpen && (
            // TODO 여기에 이벤트 걸어서 정렬 로직 만들기
            <ul className="absolute bg-white p-4 flex flex-col flex-nowrap gap-2 right-0 top-12 z-10 border border-primary">
              <li className="cursor-pointer" onClick={() => setSortOption('latest')}>
                최신순
              </li>
              <li className="cursor-pointer" onClick={() => setSortOption('popular')}>
                인기순
              </li>
              <li className="cursor-pointer" onClick={() => setSortOption('lowPrice')}>
                낮은가격순
              </li>
              <li className="cursor-pointer" onClick={() => setSortOption('highPrice')}>
                높은가격순
              </li>
            </ul>
          )}
        </div>
        {loading ? (
          <Loading />
        ) : products?.length ? (
          <ProductGrid>{likedProducts ? <ProductItemCard products={products} likedProducts={likedProducts}></ProductItemCard> : <ProductItemCard products={products}></ProductItemCard>}</ProductGrid>
        ) : (
          <div className="flex flex-col flex-nowrap justify-center items-center gap-4 w-full mx-auto">
            <Image src="/sad-dotori.png" alt="상품 없음" width={247} height={249}></Image>
            <p>해당하는 상품이 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}
