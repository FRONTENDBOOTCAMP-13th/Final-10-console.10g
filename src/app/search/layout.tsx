'use client';

import ProductGrid from '@/components/common/ProductGrid';
import ProductItemCard from '@/components/common/ProductItemCard';
import SearchIcon from '@/components/icon/SearchIcon';
import { useLoginStore } from '@/stores/loginStore';
import { LikedProduct, Product } from '@/types/Product';
import { getLikedProducts, getProductsCategory } from '@/utils/getProducts';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const user = useLoginStore(state => state.user);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [query, setQuery] = useState<string | null>(q);
  const [newQuery, setNewQuery] = useState<string | null>(query);

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 인기 상품 조회
        const res = await getProductsCategory('popular');
        if (res.ok) {
          const copy = [...res.item].sort(() => Math.random() - 0.5);
          const copySlice = copy.slice(0, 6);
          setProducts(copySlice);
        }
      } catch {
        console.error('조회 실패');
      }
    };
    fetchProducts();
  }, []);

  // 북마크 가져오기
  useEffect(() => {
    if (!user?.token?.accessToken) {
      return;
    }
    const fetchLiked = async () => {
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
      }
    };
    fetchLiked();
  }, [user]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(newQuery);
    setNewQuery('');

    if (newQuery) {
      if (!newQuery.trim()) return;
      router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  useEffect(() => {
    const newParams = searchParams.get('q');
    setQuery(newParams);
  }, [searchParams]);

  return (
    <main className="flex flex-col-reverse sm:flex-row px-4 sm:max-w-[664px] lg:max-w-[1000px] mx-auto py-4 sm:py-12">
      <section className="w-full text-xs sm:text-sm lg:text-base relative">
        <nav aria-label="Breadcrumb">
          <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href="/search">검색</Link>
            </li>
          </ol>
        </nav>
        {query ? (
          children
        ) : (
          <>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">검색하기</h2>
            <div className="absolute -z-10 right-0 sm:right-0 top-20 sm:top-8 lg:top-0 w-[12.5rem] h-[6.25rem] sm:w-[18.75rem] sm:h-[9.375rem] lg:w-[25rem] lg:h-[12.5rem]">
              <Image src="/chiikawa-three.webp" alt="하치와레 치이카와 우사기" fill />
            </div>
            <article className="border border-primary w-full mt-20 p-8 bg-white">
              <form onSubmit={handleSearch} className="flex flex-row flex-nowrap justify-between items-center border border-primary p-2 text-sm lg:text-base">
                <input type="search" placeholder="상품을 검색해보세요!" className="w-[90%]" value={newQuery ? newQuery : ''} onChange={event => setNewQuery(event.target.value)} />
                <button type="submit" className="cursor-pointer">
                  <SearchIcon className="w-6 h-6" />
                </button>
              </form>
              <aside className="my-4 flex flex-col flex-nowrap gap-4">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">인기 상품 미리 보기</p>
                <ProductGrid>{likedProducts ? <ProductItemCard products={products} likedProducts={likedProducts}></ProductItemCard> : <ProductItemCard products={products}></ProductItemCard>}</ProductGrid>
              </aside>
            </article>
          </>
        )}
      </section>
    </main>
  );
}
