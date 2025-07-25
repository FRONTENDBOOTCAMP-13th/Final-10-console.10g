'use client';

import Image from 'next/image';
import Link from 'next/link';

// 나중에 DB로 불러오는 로직을 위해 컴포넌트로 빼놨습니다.

export default function MypageOrderHistory() {
  return (
    <>
      <div className="w-full border border-light-gray rounded-md">
        <div className="flex flex-row flex-nowrap p-8 lg:p-12 pb-4 lg:pb-6 gap-4 items-center">
          <p className="text-lg lg:text-xl font-bold text-secondary-green">주문내역 조회</p>
          <p className="text-xs lg:text-sm">최근 3개월 주문 기준</p>
        </div>

        <hr className="border-light-gray" />

        <div className="p-8 flex flex-col flex-nowrap gap-8">
          <div>
            <p className="pb-2 font-bold">2025-07-20</p>
            <ul className="flex flex-col flex-nonp gap-4">
              <li className="flex flex-row flex-nowrap items-center">
                <p className="hidden sm:block pr-8">4</p>
                <div className="w-full border border-light-gray rounded-md p-4">
                  <p className="text-lg font-bold">결제완료</p>
                  <hr className="border-light-gray py-2" />
                  <div className="flex flex-row flex-nowrap gap-4 items-center">
                    <Image src="/character/chiikawa.png" alt="치이카와 상품" width={100} height={100} className="w-16 sm:w-20 lg:w-24 aspect-square rounded-md" />
                    <div className="flex flex-col flex-nowrap">
                      <p>치이카와 인형</p>
                      <p>상품 개수: 3개</p>
                      <p className="text-lg font-bold text-red">15,000원</p>
                      <Link href="/mypage" className="hidden sm:block [@media(min-width:850px)]:hidden text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                        리뷰 작성하기
                      </Link>
                    </div>
                    <Link href="/mypage" className="sm:hidden [@media(min-width:850px)]:block text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                      리뷰 작성하기
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <p className="pb-2 font-bold">2025-07-08</p>
            <ul className="flex flex-col flex-nonp gap-4">
              <li className="flex flex-row flex-nowrap items-center">
                <p className="hidden sm:block pr-8">3</p>
                <div className="w-full border border-light-gray rounded-md p-4">
                  <p className="text-lg font-bold">취소완료</p>
                  <hr className="border-light-gray py-2" />
                  <div className="flex flex-row flex-nowrap gap-4 items-center">
                    <Image src="/character/chiikawa.png" alt="치이카와 상품" width={100} height={100} className="w-16 sm:w-20 lg:w-24 aspect-square rounded-md" />
                    <div className="flex flex-col flex-nowrap">
                      <p>치이카와 인형</p>
                      <p>상품 개수: 3개</p>
                      <p className="text-lg font-bold text-red">15,000원</p>
                      <Link href="/mypage" className="hidden sm:block [@media(min-width:850px)]:hidden text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                        리뷰 작성하기
                      </Link>
                    </div>
                    <Link href="/mypage" className="sm:hidden [@media(min-width:850px)]:block text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                      리뷰 작성하기
                    </Link>
                  </div>
                </div>
              </li>
              <li className="flex flex-row flex-nowrap items-center">
                <p className="hidden sm:block pr-8">2</p>
                <div className="w-full border border-light-gray rounded-md p-4">
                  <p className="text-lg font-bold">배송중</p>
                  <hr className="border-light-gray py-2" />
                  <div className="flex flex-row flex-nowrap gap-4 items-center">
                    <Image src="/character/chiikawa.png" alt="치이카와 상품" width={100} height={100} className="w-16 sm:w-20 lg:w-24 aspect-square rounded-md" />
                    <div className="flex flex-col flex-nowrap">
                      <p>치이카와 인형</p>
                      <p>상품 개수: 3개</p>
                      <p className="text-lg font-bold text-red">15,000원</p>
                      <Link href="/mypage" className="hidden sm:block [@media(min-width:850px)]:hidden text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                        리뷰 작성하기
                      </Link>
                    </div>
                    <Link href="/mypage" className="sm:hidden [@media(min-width:850px)]:block text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                      리뷰 작성하기
                    </Link>
                  </div>
                </div>
              </li>
              <li className="flex flex-row flex-nowrap items-center">
                <p className="hidden sm:block pr-8">1</p>
                <div className="w-full border border-light-gray rounded-md p-4">
                  <p className="text-lg font-bold">배송완료</p>
                  <hr className="border-light-gray py-2" />
                  <div className="flex flex-row flex-nowrap gap-4 items-center">
                    <Image src="/character/chiikawa.png" alt="치이카와 상품" width={100} height={100} className="w-16 sm:w-20 lg:w-24 aspect-square rounded-md" />
                    <div className="flex flex-col flex-nowrap">
                      <p>치이카와 인형</p>
                      <p>상품 개수: 3개</p>
                      <p className="text-lg font-bold text-red">15,000원</p>
                      <Link href="/mypage" className="hidden sm:block [@media(min-width:850px)]:hidden text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                        리뷰 작성하기
                      </Link>
                    </div>
                    <Link href="/mypage" className="sm:hidden [@media(min-width:850px)]:block text-xs lg:text-base px-4 lg:px-8 py-2 border border-primary text-primary ml-auto">
                      리뷰 작성하기
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
