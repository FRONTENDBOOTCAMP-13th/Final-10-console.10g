'use client';

import ProductGrid from '@/components/common/ProductGrid';
import { LikedProduct, Product } from '@/types/Product';
import { getLikedProducts, getProducts, getProductsCategory } from '@/utils/getProducts';
import ProductItemCard from '@/components/common/ProductItemCard';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import FilterIcon from '@/components/icon/FilterIcon';
import Pagination from '@/components/common/Pagination';
import { deleteProduct } from '@/data/actions/deleteProduct';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CategoryPageProps {
  category: string;
  title: string;
  detailArray?: detailArray[];
  detail?: string;
  categoryName?: string;
}

interface detailArray {
  name: string;
  address: string;
}
/**
 * 카테고리 레이아웃과 카테고리 별 상품을 반환합니다.
 * @param {string} category - 카테고리 영문명 (상품 조회시 사용)
 * @param {string} title - 카테고리 한글명 (UI에 사용)
 * @param {name: string, address: string} detailArray[] - 세부 카테고리 이름과 주소 목록 / ex. '스튜디오 지브리, /character/01'
 * @param {string} detail - 세부 카테고리 이름 ex. 스튜디오 지브리면 01
 * @param {string} categoryName - 카테고리 한글명 (UI에 사용)
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 */
export default function CategoryPage({ category, title, detailArray, detail, categoryName }: CategoryPageProps) {
  const user = useLoginStore(state => state.user);
  const isAdmin = user?.type === 'admin';
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [sortOption, setSortOption] = useState('latest');
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLUListElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const itemsPerPage = 12;
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isProduct, setIsProduct] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640); // 모바일 기준 폭 설정
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paginatedProducts = useMemo(() => {
    if (products) {
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      if (isMobile) {
        return products.slice(0, endIdx);
      } else {
        return products.slice(startIdx, endIdx);
      }
    } else {
      return [];
    }
  }, [products, currentPage, isMobile]);

  // 정렬 핸들러
  const handleChange = (input: React.ChangeEvent<HTMLSelectElement> | string) => {
    let value;
    if (typeof input === 'string') value = input;
    else {
      value = input.target.value;
    }
    setSortOption(value);
  };

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

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 전체 상품 조회
        if (category === 'all') {
          const res = await getProducts();
          if (res.ok) {
            setProducts(res.item);
            setTotalPage(Math.ceil(res.item.length / itemsPerPage));
            setIsProduct(true);
          }
        }
        // 카테고리 상품 조회
        else {
          let res;
          if (detail) res = await getProductsCategory(category, detail);
          else res = await getProductsCategory(category);
          if (res.ok) {
            setProducts(res.item);
            setTotalPage(Math.ceil(res.item.length / itemsPerPage));
            setIsProduct(true);
          }
        }
      } catch {
        console.error('상품 조회 실패');
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
        if (!res.ok) {
          throw res.message;
        }

        const items = res.item as unknown as { _id: number; product: Product }[];

        const products = items.map(v => ({
          ...v.product,
          bookmarkId: v._id,
        }));
        setLikedProducts(products);
        setIsBookmark(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [user]);

  // 관리자용: 선택 상품 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error('삭제할 상품을 선택해주세요.');
      return;
    }

    // 선택한 상품 이름 추출
    const selectedProductNames = products?.filter(product => selectedIds.includes(Number(product._id))).map(product => product.name) ?? [];
    const maxDisplayCount = 5; // 최대 5개만 표시
    const displayNames = selectedProductNames.length > maxDisplayCount ? selectedProductNames.slice(0, maxDisplayCount).join(', ') + ' 외 ' + (selectedProductNames.length - maxDisplayCount) + '개' : selectedProductNames.join(', ');

    if (!confirm(`선택한 상품: ${displayNames}\n\n삭제하시겠습니까?`)) {
      return;
    }

    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => deleteProduct(id.toString(), user!.token.accessToken!)));
      toast.success('선택한 상품이 삭제되었습니다.');

      // 삭제 후 상품 목록 다시 가져오기
      const res = category === 'all' ? await getProducts() : detail ? await getProductsCategory(category, detail) : await getProductsCategory(category);
      if (res.ok) {
        setProducts(res.item);
        setTotalPage(Math.ceil(res.item.length / itemsPerPage));
        setSelectedIds([]);
      }
    } catch (error) {
      toast.error('상품 삭제 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 정렬
  const sortState = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '낮은가격순', value: 'lowPrice' },
    { label: '높은가격순', value: 'highPrice' },
  ];

  return (
    <main className="flex flex-col-reverse sm:flex-row p-4 sm:max-w-[664px] lg:max-w-[1000px] mx-auto sm:py-12">
      <section className="w-full text-xs sm:text-sm lg:text-base">
        {/* 페이지 제목 */}
        <nav aria-label="Breadcrumb">
          <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            {!detail ? (
              <li>
                <Link href={`/category/${category}`}>{title}</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href={`/category/${category}`}>{categoryName}</Link>
                </li>
                <li>&gt;</li>
                <li>
                  <Link href={`/category/${category}/${detail}`}>{title}</Link>
                </li>
              </>
            )}
          </ol>
        </nav>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">{title}</h2>
        {/* 세부 카테고리 */}
        {detailArray && (
          <aside>
            <div className="w-full overflow-x-auto scrollbar-hide">
              <ul className=" flex flex-row flex-nowrap sm:flex-wrap sm:justify-center items-center gap-2 overflow-x-auto w-max sm:w-full">
                {detailArray.map((item, index) => {
                  const isSelected = item.name === title;
                  const className = isSelected ? 'bg-primary text-white rounded-lg sm:rounded-2xl px-4 py-2' : 'border border-primary rounded-lg sm:rounded-2xl px-4 py-2';
                  return (
                    <Fragment key={index}>
                      <li className={className}>
                        <Link href={`/category/${item.address}`}>{item.name}</Link>
                      </li>
                      {index === 2 && <li className="hidden sm:block sm:w-full sm:h-0" />}
                    </Fragment>
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
        {loading ? (
          <Loading />
        ) : isProduct && isBookmark ? (
          paginatedProducts && paginatedProducts.length > 0 ? (
            <ProductGrid>
              <ProductItemCard products={paginatedProducts} likedProducts={likedProducts} showCheckbox={true} selectedIds={selectedIds} onSelect={toggleSelect} />
            </ProductGrid>
          ) : (
            <div className="flex flex-col flex-nowrap justify-center items-center gap-4 w-full mx-auto">
              <Image src="/sad-dotori.png" alt="상품 없음" width={247} height={249} />
              <p>해당하는 상품이 없습니다.</p>
            </div>
          )
        ) : null}

        <div className="hidden sm:block">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={page => {
              setCurrentPage(page);
            }}
          />
        </div>

        {/* 관리자용 삭제/추가 버튼 */}
        {isAdmin && (
          <div className="flex gap-2 justify-end mt-12 mb-16">
            <button onClick={handleDeleteSelected} className="px-3 py-1.5 bg-black cursor-pointer text-white rounded-xs text-sm">
              선택 상품 삭제
            </button>
            <Link href="/admin/products/create" className="px-3 py-1.5 cursor-pointer bg-transparent border text-black rounded-xs text-sm">
              상품 추가
            </Link>
          </div>
        )}

        {products && currentPage * itemsPerPage < products.length && (
          <button type="button" onClick={() => setCurrentPage(page => page + 1)} className="w-full border p-4 mb-40 cursor-pointer sm:hidden">
            상품 더보기
          </button>
        )}
      </section>
    </main>
  );
}
