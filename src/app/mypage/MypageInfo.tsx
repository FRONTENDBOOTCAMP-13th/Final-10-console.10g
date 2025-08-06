'use client';

import { useLoginStore } from '@/stores/loginStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ResidentCard from './ResidentCard';
import { useUserStore } from '@/stores/userStore';
import Skeleton from '@/components/common/Skeleton';
import Logout from './Logout';

export default function MypageInfo() {
  const [name, setName] = useState('회원');
  const [userType, setUserType] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  const user = useLoginStore(state => state.user);
  const setUserId = useUserStore(state => state.setId);
  const fetchUser = useUserStore(state => state.fetchUser);
  const userState = useUserStore(state => state.user);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      setIsLoading(true);
      setUserId(user._id);
      await fetchUser(); // 상태 갱신
      setIsLoading(false);
    };

    init();
  }, [user]);

  useEffect(() => {
    if (userState) {
      setName(userState.name);
      setUserType(userState.type);
    }
  }, [userState]);

  if (!user) return;

  return (
    <section className="flex flex-col lg:flex-row flex-nowrap gap-12 sm:gap-6 w-full sm:max-w-[800px] lg:max-w-[1200px] justify-center items-center lg:items-stretch mx-auto my-8 py-12 sm:py-8 px-4">
      <div className="flex flex-col flex-nowrap w-[90%] sm:w-[600px] lg:w-[350px] bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8">
        {isLoading ? (
          <>
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-48" height="h-6" className="mb-8" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-2xl" className="mb-2" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-2xl" />
          </>
        ) : (
          <>
            <p className="text-primary-dark font-bold pb-2">{userType == 'user' ? '일반 회원' : '관리자'}</p>
            <p className="text-2xl pb-12 font-test">
              <strong>{name}</strong>님
              <br />
              안녕하세요!🐿️
            </p>
            <div className="flex flex-col flex-nowrap gap-2">
              {user.type === 'admin' ? (
                <Link href="/mypage/edit-admin" className="w-full text-center bg-primary text-white p-4 rounded-2xl mb-2">
                  관리자 정보 변경
                </Link>
              ) : (
                <Link href="/cart" className="w-full text-center bg-primary text-white p-4 rounded-2xl mb-2">
                  장바구니
                </Link>
              )}
              <Logout />
            </div>
          </>
        )}
      </div>
      {isLoading ? (
        <div className="flex flex-col lg:flex-row flex-nowrap w-[98%] sm:w-[600px] lg:flex-1 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8">
          <Skeleton width="w-24" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[500px] lg:h-[275px] mx-auto" />
        </div>
      ) : user.type === 'admin' ? (
        <div className="flex flex-col flex-nowrap gap-12 w-full sm:w-[600px] lg:flex-1 bg-white sm:rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-12">
          <p className="text-primary-dark font-bold text-xl text-nowrap">도토리섬 사이트 관리</p>

          <ul className="flex flex-row flex-wrap sm:flex-nowrap justify-center w-full pb-4 sm:px-12 gap-4">
            <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[8rem]">
              <Link href="/mypage" className="flex flex-col flex-nowrap text-xs lg:text-sm w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center gap-1 lg:gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 lg:w-13 aspect-square size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <p>관리자 메인</p>
              </Link>
            </li>
            <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[8rem]">
              <Link href="/category/all" className="flex flex-col flex-nowrap text-xs lg:text-sm w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center gap-1 lg:gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 lg:w-13 aspect-square size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <p>상품 관리</p>
              </Link>
            </li>
            <li className="w-full sm:hidden"></li>
            <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[8rem]">
              <Link href="/admin/orders" className="flex flex-col flex-nowrap text-xs lg:text-sm w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center gap-1 lg:gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 lg:w-13 aspect-square size-10">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203c-.536.072-.974.478-1.021 1.017a4.559 4.559 0 0 0-.018.402c0 .464.336.844.775.994l2.95 1.012c.44.15.775.53.775.994 0 .136-.006.27-.018.402-.047.539-.485.945-1.021 1.017a9.077 9.077 0 0 1-3.461-.203M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <p>주문 관리</p>
              </Link>
            </li>
            <li className="flex flex-col flex-nowrap justify-center gap-2 items-center w-[8rem]">
              <Link href="/admin/stats" className="flex flex-col flex-nowrap text-xs lg:text-sm w-[8rem] shadow-[0_0_5px_rgba(0,0,0,0.1)] aspect-square  p-2 sm:p-4 bg-white rounded-2xl sm:rounded-4xl justify-center items-center gap-1 lg:gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 lg:w-13 aspect-square size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                <p>판매 실적 조회</p>
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex flex-col flex-nowrap w-[98%] sm:w-[600px] lg:w-fit bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8">
          <p className="text-primary-dark font-bold pb-4 text-xl text-nowrap">나의 주민증</p>
          <div className="w-full flex justify-center items-center px-8 lg:pb-4">
            <ResidentCard />
          </div>
        </div>
      )}
    </section>
  );
}
