'use client';

import BarIcon from '@/components/icon/BarIcon';
import BellIcon from '@/components/icon/BellIcon';
import CartIcon from '@/components/icon/CartIcon';
import MypageIcon from '@/components/icon/MypageIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchIcon from '../icon/SearchIcon';
import { CHARACTER_CATEGORIES, LIVING_CATEGORIES, STATIONERY_CATEGORIES } from '@/constants/categories';
import { useLoginStore } from '@/stores/loginStore';

export default function DesktopHeader() {
  const { isLogin } = useLoginStore();

  // 햄버거 바 클릭 시 카테고리가 열려있는지 useState로 상태 관리
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 햄버거 바가 클릭 된 상태에서 현재 클릭된 세부 메뉴가 무엇인지 상태 관리
  const [detailOpen, setDetailOpen] = useState('신상품');

  // 카테고리 내부의 세부 내용들 상태 관리
  const [categoryData, setCategoryData] = useState<string[]>(['신상품 보러가기']);

  // 검색창 로직
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('검색어', query);
  };

  const categoryAddress = {
    신상품: 'new',
    인기상품: 'popular',
    캐릭터: 'character',
    미니어처: 'miniature',
    문구: 'stationery',
    '리빙&소품': 'living-accessories',
    COMMUNITY: 'board',
  } as const;

  type CategoryName = keyof typeof categoryAddress;

  useEffect(() => {
    switch (detailOpen) {
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

  return (
    <>
      <header className="max-w-[30rem] lg:max-w-[75rem] mx-auto mt-12">
        <nav aria-label="유저 상단 메뉴">
          <ul className="flex flex-row flex-nowrap gap-4 justify-end mr-8">
            <li>
              <Link href="/" aria-label="장바구니">
                <CartIcon svgProps={{ className: 'w-6 h-6' }} />
              </Link>
            </li>
            <li>
              {/* TODO 로그인이 안된 상태면 로그인 페이지로 이동 */}
              {isLogin && (
                <Link href="/mypage" aria-label="마이페이지">
                  <MypageIcon svgProps={{ className: 'w-6 h-6' }} />
                </Link>
              )}
              {!isLogin && (
                <Link href="/login" aria-label="로그인하기">
                  <MypageIcon svgProps={{ className: 'w-6 h-6' }} />
                </Link>
              )}
            </li>
            <li>
              <Link href="/" aria-label="알림">
                <BellIcon svgProps={{ className: 'w-6 h-6' }} />
              </Link>
            </li>
          </ul>
        </nav>
        <h1 className="flex justify-center my-16">
          <Link href="/">
            <Image src="/logo.png" alt="도토리섬 메인으로 이동" width={120} height={120}></Image>
          </Link>
        </h1>
        <form onSubmit={handleSearch} className="flex flex-row flex-nowrap justify-between items-center border rounded-full border-primary w-md lg:w-lg mx-auto py-2 lg:py-4 px-4 lg:px-8 my-6 lg:my-8 text-sm lg:text-base">
          <input type="search" placeholder="상품을 검색해보세요!" value={query} onChange={event => setQuery(event.target.value)} />
          <button type="submit" className="cursor-pointer">
            <SearchIcon className="w-6 h-6 lg:w-8 lg:h-8" />
          </button>
        </form>
        <nav aria-label="카테고리 메뉴">
          <ul className="flex flex-row flex-wrap lg:flex-nowrap gap-8 justify-center items-center text-sm lg:text-base">
            <li>
              <BarIcon
                className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                }}
              />
            </li>
            <li>
              <Link href="/category/new">신상품</Link>
            </li>
            <li>
              <Link href="/category/popular">인기상품</Link>
            </li>
            <li>
              <Link href="/category/character">캐릭터</Link>
            </li>
            <li>
              <Link href="/category/miniature">미니어처</Link>
            </li>
            <li>
              <Link href="/category/stationery">문구</Link>
            </li>
            <li>
              <Link href="/category/living-accessories">리빙&소품</Link>
            </li>
            <li>
              <Link href="/board">COMMUNITY</Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="relative">
        <hr className="mt-6 border-primary" />
        {isCategoryOpen && (
          <nav aria-label="세부 카테고리 메뉴" className="absolute z-[50] left-1/2 -translate-x-1/2 top-full w-[30rem] lg:w-[40rem] text-sm lg:text-base mx-auto bg-[#E5CBB7] flex flex-row border-b border-x border-primary">
            <ul className="flex flex-col flex-nowrap text-center">
              {['신상품', '인기상품', '캐릭터', '미니어처', '문구', '리빙&소품', 'COMMUNITY'].map(category => (
                <li key={category} className={`p-4 cursor-pointer ${detailOpen === category ? 'bg-background' : ''}`} onClick={() => setDetailOpen(category)}>
                  {category}
                </li>
              ))}
            </ul>
            <ul className="bg-background w-full flex flex-col flex-nowrap p-8 gap-4">
              {categoryData.map((item, i) => {
                const val = categoryAddress[detailOpen as CategoryName];

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
