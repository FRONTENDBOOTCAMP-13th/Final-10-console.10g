'use client';

import BarIcon from '@/components/icon/BarIcon';
import CartIcon from '@/components/icon/CartIcon';
import MypageIcon from '@/components/icon/MypageIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CHARACTER_CATEGORIES, LIVING_CATEGORIES, STATIONERY_CATEGORIES } from '@/constants/categories';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import NotificationIcon from './NotificationIcon';
import SearchIconHeader from '../icon/SearchIconHeader';
import CloseIcon from '../icon/CloseIcon';
import { getProducts } from '@/utils/getProducts';
import { Product } from '@/types/Product';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';

export default function DesktopHeader() {
  const router = useRouter();
  const { isLogin } = useLoginStore();
  const user = useLoginStore(state => state.user);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState('신상품');
  const [categoryData, setCategoryData] = useState<string[]>(['신상품 보러가기']);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null); //헤더 전체 영역 참조하는 ref
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); //드롭다운 타임아웃 처리를 위한ㄴ ref
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLLIElement>(null); // 검색 영역 참조
  const inputRef = useRef<HTMLInputElement>(null); // 검색 입력창 참조
  const { count } = useCartBadgeStore();

  // 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      if (response.ok === 1 && response.item) {
        setProducts(response.item);
      }
    };
    fetchProducts();
  }, []);

  // 검색어에 따른 상품 필터링
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5); // 최대 5개까지만 표시

    setFilteredProducts(filtered);
    setShowSuggestions(filtered.length > 0 && isSearchOpen);
  }, [query, products, isSearchOpen]);

  // 검색 query를 url로 제출
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setIsSearchOpen(false);
    setShowSuggestions(false);
  };

  // 상품 선택 시 해당 상품 페이지로 이동
  const handleProductSelect = (productId: number) => {
    router.push(`/products/${productId}`);
    setQuery('');
    setShowSuggestions(false);
    setIsSearchOpen(false);
    inputRef.current?.blur();
  };

  // 검색창 포커스 해제 시 자동완성 숨기기 (딜레이 200ms)
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // 검색창 포커스 시 자동완성 다시 표시
  const handleInputFocus = () => {
    if (filteredProducts.length > 0 && query.trim() !== '') {
      setShowSuggestions(true);
    }
  };

  // 클릭 외부 감지로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      }

      // 검색 자동완성 처리
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // 컴포넌트 언마운트 시 타이머 정리
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const categoryAddress = {
    전체상품: 'all',
    신상품: 'new',
    인기상품: 'popular',
    캐릭터: 'character',
    미니어처: 'miniature',
    문구: 'stationery',
    '리빙&소품': 'living-accessories',
    COMMUNITY: 'board',
  } as const;

  type CategoryName = keyof typeof categoryAddress;

  const boardAddress = ['notice', 'community', 'qna'];

  useEffect(() => {
    switch (detailOpen) {
      case '전체상품':
        setCategoryData(['전체상품 보러가기']);
        break;
      case '신상품':
        setCategoryData(['신상품 보러가기']);
        break;
      case '인기상품':
        setCategoryData(['인기상품 보러가기']);
        break;
      case '캐릭터':
        setCategoryData(CHARACTER_CATEGORIES);
        break;
      case '미니어처':
        setCategoryData(['미니어처 보러가기']);
        break;
      case '문구':
        setCategoryData(STATIONERY_CATEGORIES);
        break;
      case '리빙&소품':
        setCategoryData(LIVING_CATEGORIES);
        break;
      case 'COMMUNITY':
        setCategoryData(['공지사항', '자유게시판', '문의게시판']);
        break;
    }
  }, [detailOpen]);

  // 카테고리에 hover 했을 때 실행할 핸들러(baricon은 그대로 클릭임)
  const handleCategoryHover = (category: string) => {
    // 기존 타이머가 있으면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDetailOpen(category);
    setIsCategoryOpen(true);
  };

  // 카테고리 leave 핸들러
  const handleCategoryLeave = () => {
    // 마우스 떼고 150ms 후에 닫긩
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  // hover 했을때 펼쳐지는 드롭다운 영역 hover 핸들러
  const handleDropdownHover = () => {
    // 기존 타이머가 있으면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };
  //hover 했을때 펼쳐지는 드롭다운 영역 leave 핸들러
  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  return (
    <>
      <nav aria-label="유저 상단 메뉴" className="bg-primary-dark p-3 sticky top-0 z-50">
        <div className="flex flex-row flex-nowrap max-w-[600px] lg:max-w-[1000px] mx-auto justify-between items-center">
          <Link href={'/'} className="flex flex-row flex-nowrap items-center gap-2">
            <Image src={'/favicon.png'} alt="도토리섬" width={45} height={45} />
            <span className="font-logo text-2xl text-white">도토리섬</span>
          </Link>
          <ul className="flex flex-row flex-nowrap gap-4 justify-end">
            {!isSearchOpen && (
              <>
                <li className="relative">
                  {user?.type === 'admin' ? (
                    <></>
                  ) : (
                    <Link href="/cart" aria-label="장바구니" className="relative">
                      <CartIcon svgProps={{ className: 'w-6 h-6' }} pathProps={{ stroke: 'white' }} />
                      {count > 0 && <span className="absolute -top-1 -right-1 bg-red font-bold text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full">{count}</span>}
                    </Link>
                  )}
                </li>
                <li>
                  {isLogin && (
                    <Link href="/mypage" aria-label="마이페이지">
                      <MypageIcon svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
                    </Link>
                  )}
                  {!isLogin && (
                    <Link href="/login" aria-label="로그인하기">
                      <MypageIcon svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
                    </Link>
                  )}
                </li>
                <NotificationIcon />
                <li>
                  <button type="button" className="cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                    <SearchIconHeader svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
                  </button>
                </li>
              </>
            )}
            {isSearchOpen && (
              <li ref={searchRef} className="flex flex-row flex-nowrap gap-4 slide-in relative">
                <div className="relative">
                  <form onSubmit={handleSearch} className="flex flex-row flex-nowrap justify-between items-center border-b border-white w-sm lg:w-md text-sm px-4 py-2 lg:text-base">
                    <input ref={inputRef} type="search" aria-label="상품 검색창" placeholder="상품을 검색해보세요!" className="w-[90%] text-white placeholder:text-white bg-transparent outline-none" value={query} onChange={event => setQuery(event.target.value)} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                    <button type="submit" className="cursor-pointer" aria-label="상품 검색 버튼">
                      <SearchIconHeader svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
                    </button>
                  </form>

                  {/* 검색 자동완성 드롭다운 */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <div key={product._id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={() => handleProductSelect(Number(product._id))}>
                          {product.mainImages && product.mainImages[0] && (
                            <div className="w-10 h-10 bg-gray-100 rounded mr-3 flex-shrink-0 overflow-hidden">
                              <Image src={`${product.mainImages[0].path}`} alt={product.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                            </div>
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.price.toLocaleString()}원</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="cursor-pointer">
                  <CloseIcon svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <header ref={headerRef} className="bg-white">
        <h1 className="flex justify-center my-8">
          <Link href="/">
            <Image src="/logo.png" alt="도토리섬 메인으로 이동" width={120} height={120}></Image>
          </Link>
        </h1>

        <nav aria-label="카테고리 메뉴">
          <ul className="flex flex-row flex-wrap gap-8 justify-center items-center text-sm lg:text-base">
            <li>
              <BarIcon
                className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                }}
                aria-label="메뉴 토글 버튼"
              />
            </li>
            {Object.entries(categoryAddress).map(([title, address]) => (
              <li key={title} onMouseEnter={() => handleCategoryHover(title)} onMouseLeave={handleCategoryLeave} className="relative">
                <Link
                  href={address === 'board' ? `/${address}` : `/category/${address}`}
                  onClick={() => {
                    setIsCategoryOpen(false);
                  }}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="relative">
        <hr className="mt-6 border-primary" />
        {isCategoryOpen && (
          <nav ref={popoverRef} aria-label="세부 카테고리 메뉴" className="absolute z-20 left-1/2 -translate-x-1/2 top-full w-[30rem] lg:w-[40rem] text-sm lg:text-base mx-auto bg-[#E5CBB7] flex flex-row border-b border-x border-primary" onMouseEnter={handleDropdownHover} onMouseLeave={handleDropdownLeave}>
            <ul className="flex flex-col flex-nowrap text-center">
              {['전체상품', '신상품', '인기상품', '캐릭터', '미니어처', '문구', '리빙&소품', 'COMMUNITY'].map(category => (
                <li key={category} className={`p-4 cursor-pointer ${detailOpen === category ? 'bg-background' : ''}`} onClick={() => setDetailOpen(category)} onMouseEnter={() => setDetailOpen(category)}>
                  {category}
                </li>
              ))}
            </ul>
            <ul className="bg-background w-full flex flex-col flex-nowrap p-8 gap-4">
              {categoryData.map((item, i) => {
                const val = categoryAddress[detailOpen as CategoryName];

                if (['character', 'stationery', 'living-accessories'].includes(val)) {
                  return (
                    <li key={i}>
                      <Link href={`/category/${val}/0${i + 1}`} onClick={() => setIsCategoryOpen(false)}>
                        {item} &gt;
                      </Link>
                    </li>
                  );
                } else if (val === 'board') {
                  return (
                    <li key={i}>
                      <Link href={`/${val}/${boardAddress[i]}`} onClick={() => setIsCategoryOpen(false)}>
                        {item} &gt;
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={i}>
                    <Link href={`/category/${val}`} onClick={() => setIsCategoryOpen(false)}>
                      {item} &gt;
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
