'use client';

import Image from 'next/image';
import BarIcon from '../icon/BarIcon';
import SearchIcon from '../icon/SearchIcon';
import Link from 'next/link';
import CartIcon from '../icon/CartIcon';
import { Fragment, useState } from 'react';
import CloseIcon from '../icon/CloseIcon';
import ArrowIcon from '../icon/ArrowIcon';
import { CHARACTER_CATEGORIES, LIVING_CATEGORIES, STATIONERY_CATEGORIES } from '@/constants/categories';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import NotificationIcon from './NotificationIcon';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';
import { toast } from 'react-hot-toast';

export default function MobileHeader() {
  const { isLogin, logout } = useLoginStore();
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [selectMenu, setSelectMenu] = useState<'category' | 'board' | 'myInfo' | 'adminInfo'>('category');
  const { count } = useCartBadgeStore();
  const user = useLoginStore(state => state.user);

  // 메뉴 종류
  const menuContent = {
    category: ['전체상품', '신상품', '인기상품', '캐릭터', '미니어처', '문구', '리빙&소품'],
    board: ['공지사항', '자유게시판', '문의게시판'],
    myInfo: ['마이페이지', '내가 쓴 글', '배송 주소록 관리', '장바구니', '관심 상품', '회원 정보 수정', '로그아웃'],
    adminInfo: ['관리자 마이페이지', '로그아웃'],
  };

  // 더 세부적인 카테고리(캐릭터, 문구, 리빙&소품) 토글하는 함수
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const handleToggle = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  const menuLink = {
    전체상품: 'category/all',
    신상품: 'category/new',
    인기상품: 'category/popular',
    미니어처: 'category/miniature',
    마이페이지: 'mypage',
    '내가 쓴 글': 'mypage/myposts',
    '배송 주소록 관리': 'mypage/address',
    장바구니: 'cart',
    '관심 상품': 'mypage/wishlist',
    '회원 정보 수정': 'mypage/edit-info',
    '관리자 마이페이지': 'mypage',
    공지사항: 'board/notice',
    자유게시판: 'board/community',
    문의게시판: 'board/qna',
  };

  const CATEGORY_MAP: Record<string, { basePath: string; items: string[] }> = {
    캐릭터: { basePath: 'character', items: CHARACTER_CATEGORIES },
    문구: { basePath: 'stationery', items: STATIONERY_CATEGORIES },
    '리빙&소품': { basePath: 'living-accessories', items: LIVING_CATEGORIES },
  };

  return (
    <>
      <header className="sticky top-0 left-0 z-20 text-sm bg-white border-b border-primary">
        <nav>
          <div aria-label="상단 메뉴" className="flex flex-row flex-nowrap px-4 py-2 justify-between gap-8 items-center h-[60px]">
            <div className="flex flex-row flex-nowrap gap-6">
              <button type="button" aria-label="메뉴 열기" onClick={() => setIsOpenMenu(true)}>
                <BarIcon className="w-6 h-6 cursor-pointer" />
              </button>
              <NotificationIcon isMobile={true} />
            </div>
            <h1>
              <Link href="/">
                <Image aria-label="메인 로고" src="/logo.png" alt="도토리섬 메인으로 이동" width={60} height={60}></Image>
              </Link>
            </h1>
            <div className="flex flex-row flex-nowrap gap-6">
              <Link href="/search">
                <SearchIcon className="w-6 h-6" aria-label="상품 검색" />
              </Link>

              {user?.type === 'admin' ? (
                <></>
              ) : (
                <Link href="/cart" className="relative">
                  <CartIcon pathProps={{ stroke: '#A97452' }} svgProps={{ className: 'w-6 h-6' }} aria-label="장바구니" />
                  {count > 0 && <span className="absolute -top-1 -right-1 bg-red text-white font-bold text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full">{count}</span>}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      {isOpenMenu && (
        <nav className="fixed top-0 left-0 z-30 w-full h-full bg-white">
          <div className="p-4 text-sm flex flex-col flex-nowrap gap-4 h-full overflow-y-auto">
            {/* 로고와 닫기 버튼 */}
            <div className="flex flex-row flex-nowrap justify-between items-center">
              <Link href="/" onClick={() => setIsOpenMenu(false)}>
                <Image aria-label="메인 로고" src="/logo.png" alt="도토리섬 메인으로 이동" width={80} height={80}></Image>
              </Link>
              <button type="button" onClick={() => setIsOpenMenu(false)} className="cursor-pointer">
                <CloseIcon svgProps={{ className: 'w-8 h-8' }} />
              </button>
            </div>
            {/* 로그인과 회원가입 */}
            {!isLogin && (
              <div className="flex flex-row flex-nowrap items-center gap-2">
                <Link href="/login" onClick={() => setIsOpenMenu(false)} className="w-1/2 text-center py-2 px-4 text-white bg-primary rounded-lg">
                  로그인
                </Link>
                <Link href="/signup" onClick={() => setIsOpenMenu(false)} className="w-1/2 text-center py-2 px-4 text-primary border border-primary rounded-lg">
                  회원가입
                </Link>
              </div>
            )}
            <ul className="flex flex-row flex-nowrap justify-center items-center">
              <li className={`cursor-pointer w-1/3 py-2 text-center text-primary font-bold ${selectMenu === 'category' ? 'border-b-2 border-primary' : 'border-b border-primary'}`} onClick={() => setSelectMenu('category')}>
                카테고리
              </li>
              <li className={`cursor-pointer w-1/3 py-2 text-center text-primary font-bold ${selectMenu === 'board' ? 'border-b-2 border-primary' : 'border-b border-primary'}`} onClick={() => setSelectMenu('board')}>
                게시판
              </li>
              {user?.type === 'admin' ? (
                <li className={`cursor-pointer w-1/3 py-2 text-center text-primary font-bold ${selectMenu === 'adminInfo' ? 'border-b-2 border-primary' : 'border-b border-primary'}`} onClick={() => setSelectMenu('adminInfo')}>
                  관리자 전용
                </li>
              ) : (
                <li className={`cursor-pointer w-1/3 py-2 text-center text-primary font-bold ${selectMenu === 'myInfo' ? 'border-b-2 border-primary' : 'border-b border-primary'}`} onClick={() => setSelectMenu('myInfo')}>
                  내정보
                </li>
              )}
            </ul>
            <ul className="flex flex-col flex-nowrap p-4 gap-8 text-primary-dark">
              {menuContent[selectMenu].map((item, i) => {
                if (!isLogin && selectMenu === 'myInfo') {
                  return '';
                }
                if (item === '캐릭터' || item === '문구' || item === '리빙&소품')
                  return (
                    <Fragment key={i}>
                      <li onClick={() => handleToggle(item)} className="cursor-pointer flex flex-row flex-nowrap justify-between items-center">
                        {item} <ArrowIcon pathProps={{ fill: '#7A543C' }} svgProps={openCategory === item ? { className: 'scale-y-[-1]' } : { className: '' }} />
                      </li>
                      <ul className={`${openCategory === item ? 'flex flex-col flex-nowrap pl-4 gap-2' : 'hidden'}`}>
                        {CATEGORY_MAP[item] && (
                          <>
                            {CATEGORY_MAP[item].items.map((subItem, i) => (
                              <li key={i}>
                                <Link href={`/category/${CATEGORY_MAP[item].basePath}/0${i + 1}`} onClick={() => setIsOpenMenu(false)}>
                                  {subItem}
                                </Link>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </Fragment>
                  );
                if (item === '로그아웃')
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setIsOpenMenu(false);
                        logout();
                        toast.success('로그아웃 되었습니다.');
                        router.push('/');
                      }}
                      className="cursor-pointer"
                    >
                      {item}
                    </li>
                  );
                return (
                  <li key={i}>
                    <Link href={`/${menuLink[item as keyof typeof menuLink] || ''}`} onClick={() => setIsOpenMenu(false)}>
                      {item}
                    </Link>
                  </li>
                );
              })}
              {!isLogin && selectMenu === 'myInfo' && <span>로그인 후 확인 가능합니다.</span>}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
