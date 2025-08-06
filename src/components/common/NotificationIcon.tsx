'use client';

import Image from 'next/image';
import BellIcon from '../icon/BellIcon';
import { useEffect, useRef, useState } from 'react';
import TriangleIcon from '../icon/TriangleIcon';
import { useLoginStore } from '@/stores/loginStore';
import { patchNotification } from '@/data/actions/patchNotification';
import CloseIcon from '../icon/CloseIcon';
import { useNotificationStore } from '@/stores/notificationStore';
import Link from 'next/link';
import { User } from '@/types';
import { Product } from '@/types/Product';
import { Post } from '@/types/Post';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function NotificationIcon({ isMobile = false }: { isMobile?: boolean }) {
  const user = useLoginStore(state => state.user);
  const setUser = useNotificationStore(state => state.setUser);
  const fetchNotification = useNotificationStore(state => state.fetchNotification);
  const notification = useNotificationStore(state => state.notification);
  const deleteNotification = useNotificationStore(state => state.deleteNotification);

  const [open, setOpen] = useState(false);
  const [openedMessageId, setOpenedMessageId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 알림 종류
  const menu = {
    payment: '결제 알림',
    qna: '문의글 알림',
    reply: '댓글 알림',
    message: '쪽지 알림',
  } as const;

  // 모두 읽음 버튼
  const handleRead = async () => {
    if (user) {
      try {
        await patchNotification(user);
        deleteNotification();

        console.log('알림을 모두 읽었습니다.');
      } catch {
        console.log('데이터 읽음 처리 실패');
      }
    }
  };

  // 선택 읽음 버튼
  // const handleReadOne = async (id: string) => {
  //   if (user) {
  //     try {
  //       await patchNotificationId(user, id);

  //       await fetchNotification();

  //       console.log(`알림 ${id}번째를 읽었습니다.`);
  //     } catch {
  //       console.log('알림 읽음 처리 실패');
  //     }
  //   }
  // };

  // 클릭 외부 감지로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 알림 불러오기
  useEffect(() => {
    if (!user) {
      deleteNotification();
      return;
    }

    setUser(user);
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isFetching = false;

    const fetchData = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        await fetchNotification();
        console.log('알림 불러오기');
      } catch {
        toast.error('알림 불러오기 실패');
      }
    };

    // polling 시작
    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);

      fetchData(); // 포커스 복귀 시 즉시 한 번 호출
      intervalId = setInterval(fetchNotification, 10000);
    };

    // polling 중단
    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // 최초 시작
    startPolling();

    // visibility change 처리
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // cleanup
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const getUserImageSrc = (user: User) => {
    const fallback = '/default-profile.webp';

    // 외부 이미지가 문자열이면 바로 반환
    if (typeof user?.image === 'string') {
      console.log('typeof string:', user.image);
      return user.image;
    }

    // image가 객체이고 null이 아님일 때만 접근
    if (typeof user?.image === 'object' && user.image !== null) {
      if (user.image.originalname && user.image.path && API_URL) {
        console.log('API_URL:', user.image);
        return `${API_URL}/${user.image.path}`;
      }

      if (user.image.path) {
        console.log('이미지 path:', user.image);
        return user.image.path;
      }
    }

    return fallback;
  };
  const getProductImageSrc = (product: Product) => {
    const fallback = '/character/chiikawa.png';
    if (product.image?.path) return product.image.path;
    return fallback;
  };
  const getPostImageSrc = (post: Post | undefined) => {
    console.log(post);
    if (post?.extra?.imagePath) return post.extra.imagePath;
    return '/default-profile.webp';
  };

  // 모바일 버전
  if (isMobile) {
    return (
      <>
        <button type="button" className="cursor-pointer relative" aria-label="알림" onClick={() => setOpen(prev => !prev)}>
          <BellIcon pathProps={{ fill: '#A97452' }} svgProps={{ className: 'w-6 h-6 cursor-pointer' }} aria-label="알림" />
          {notification?.length > 0 && <div className="w-1 h-1 bg-red rounded-full absolute top-0 right-0"></div>}
        </button>
        {open && (
          <div className="fixed inset-0 bg-white flex flex-col z-[9999]">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-primary">
              <p className="font-bold text-lg">알림</p>
              <CloseIcon svgProps={{ onClick: () => setOpen(false), className: 'cursor-pointer', 'aria-label': '알림 화면 닫기' }} />
            </div>
            {/* 알림 목록 (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto bg-soft-gray p-4 pb-24">
              <ul className="flex flex-col gap-4">
                <li>
                  <button type="button" onClick={handleRead} className="bg-primary-dark cursor-pointer text-white rounded-lg px-4 py-2">
                    전체 알림 지우기
                  </button>
                </li>
                {notification && notification.length > 0 ? (
                  notification
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      if (!item.isRead)
                        return (
                          <li key={index} className="flex flex-col flex-nowrap relative p-4 bg-white rounded-2xl w-full">
                            <div className="flex flex-row flex-nowrap items-center gap-3">
                              <div className="min-w-18 min-h-18">
                                {item.type === 'payment' && (
                                  <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-gray relative">
                                    <Image src={getProductImageSrc(item.extra.product!)} alt={`${item.extra.product?.name} 상품 이미지`} fill className="object-cover" />
                                  </div>
                                )}
                                {item.type === 'message' && (
                                  <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                    {/* <div className="text-xs text-primary">새 댓글</div> */}
                                    <Image src={getUserImageSrc(item.user)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                  </div>
                                )}
                                {item.type === 'reply' && (
                                  <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                    {/* <div className="text-xs text-primary">새 댓글</div> */}
                                    <Image src={getUserImageSrc(item.user)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                  </div>
                                )}
                                {item.type === 'qna' && (
                                  <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                    {/* <div className="text-xs text-primary">새 댓글</div> */}
                                    <Image src={getPostImageSrc(item.extra.post)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                  </div>
                                )}
                              </div>
                              <div className="w-full">
                                <p className="font-bold">{menu[item.type]}</p>
                                {/* 결제 알림 */}
                                {item.type === 'payment' && (
                                  <>
                                    <span className="flex flex-row flex-nowrap items-center text-sm">
                                      [
                                      <Link
                                        href={`/products/${item.extra.product?._id}`}
                                        onClick={() => {
                                          setOpen(!open);
                                        }}
                                        className="text-primary-dark max-w-[14rem] truncate"
                                      >
                                        {item.extra.product?.name}
                                      </Link>
                                      ]
                                    </span>
                                    <span className="block text-sm">{item.content}</span>
                                    <span className="block text-sm">{item.createdAt}</span>
                                  </>
                                )}
                                {/* 댓글 알림 */}
                                {item.type === 'reply' && (
                                  <>
                                    <span className="flex flex-row flex-nowrap items-center text-sm">
                                      [
                                      <Link href={`/board/${item.extra.post?.type}/${item.extra.post?._id}`} onClick={() => setOpen(!open)} className="text-primary-dark max-w-[14rem] truncate">
                                        {item.extra.post?.title}
                                      </Link>
                                      ]
                                    </span>
                                    <span className="block text-sm">{item.content}</span>
                                    <span className="block text-sm">{item.createdAt}</span>
                                  </>
                                )}
                                {/* 문의글 알림 */}
                                {item.type === 'qna' && (
                                  <>
                                    <span className="flex flex-row flex-nowrap items-center text-sm">
                                      [
                                      <Link href={`/board/${item.extra.post?.type}/${item.extra.post?._id}`} onClick={() => setOpen(!open)} className="text-primary-dark max-w-[14rem] truncate">
                                        {item.extra.post?.title}
                                      </Link>
                                      ]
                                    </span>
                                    <span className="block text-sm">{item.content}</span>
                                    <span className="block text-sm">{item.createdAt}</span>
                                  </>
                                )}
                                {/* 메시지 알림 */}
                                {item.type === 'message' && (
                                  <>
                                    <button type="button" onClick={() => setOpenedMessageId(openedMessageId === item._id.toString() ? null : item._id.toString())} className="flex flex-row flex-nowrap cursor-pointer items-center text-sm">
                                      [<p className="text-primary-dark max-w-[14rem] truncate">{item.extra.message}</p>]
                                    </button>
                                    <span className="block text-sm">{item.content}</span>
                                    <span className="block text-sm">{item.createdAt}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {openedMessageId === item._id.toString() && item.type === 'message' && (
                              <div className="flex flex-col flex-nowrap p-4 gap-2 bg-background mt-4">
                                <p className="font-bold">쪽지 상세보기</p>
                                <p>{item.extra.message}</p>
                              </div>
                            )}
                          </li>
                        );
                    })
                ) : (
                  <div className="flex flex-col justify-center items-center h-[300px]">
                    <Image src="/empty-dotori.png" alt="도토리" width={120} height={120} />
                    <p>모든 알림을 확인하셨습니다.</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }

  // 데스크탑 버전
  return (
    <li className="relative">
      <button type="button" className="cursor-pointer relative" aria-label="알림" onClick={() => setOpen(prev => !prev)}>
        <BellIcon svgProps={{ className: 'w-6 h-6' }} pathProps={{ fill: 'white' }} />
        {notification?.length > 0 && <div className="w-1 h-1 bg-red rounded-full absolute top-0 right-0"></div>}
      </button>
      {/* 말풍선 */}
      {open && (
        <div ref={popoverRef} className="absolute top-full -left-[23rem] mt-2 z-50">
          <div className="flex justify-end">
            <TriangleIcon
              polygonProps={{ fill: 'white' }}
              svgProps={{
                className: 'h-8 w-8',
                style: {
                  filter: 'drop-shadow(0 -20px 10px rgba(0, 0, 0, 0.1))', // 위쪽 그림자
                  transform: 'translateY(0.25rem)',
                },
              }}
            />
          </div>
          {/* 알림 내용 */}
          <div className="bg-white text-black rounded shadow-md w-[400px]" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <p className="p-4 font-bold text-lg">알림</p>
            <ul className="bg-soft-gray p-4 flex flex-col flex-nowrap gap-4 min-h-[400px] max-h-[600px] overflow-y-auto">
              <li>
                <button type="button" onClick={handleRead} className="bg-primary-dark cursor-pointer text-white rounded-lg px-4 py-2">
                  전체 알림 지우기
                </button>
              </li>
              {notification && notification.length > 0 ? (
                notification
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    if (!item.isRead)
                      return (
                        <li key={index} className="flex flex-col flex-nowrap relative p-4 bg-white rounded-2xl w-full">
                          <div className="flex flex-row flex-nowrap items-center gap-3">
                            {/* 이미지 영역 */}
                            <div className="min-w-18 min-h-18">
                              {item.type === 'payment' && (
                                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-gray relative">
                                  <Image src={getProductImageSrc(item.extra.product!)} alt={`${item.extra.product?.name} 상품 이미지`} fill className="object-cover" />
                                </div>
                              )}
                              {item.type === 'message' && (
                                <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                  {/* <div className="text-xs text-primary">새 댓글</div> */}
                                  <Image src={getUserImageSrc(item.user)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                </div>
                              )}
                              {item.type === 'reply' && (
                                <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                  {/* <div className="text-xs text-primary">새 댓글</div> */}
                                  <Image src={getUserImageSrc(item.user)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                </div>
                              )}
                              {item.type === 'qna' && (
                                <div className="flex flex-row flex-nowrap justify-center items-center relative w-[72px] h-[72px]">
                                  {/* <div className="text-xs text-primary">새 댓글</div> */}
                                  <Image src={getPostImageSrc(item.extra.post)} alt={`${item.user.name}님의 프로필 사진`} fill style={{ objectFit: 'cover' }} className="rounded-full border border-gray" />
                                </div>
                              )}
                            </div>
                            {/* 메시지 영역 */}
                            <div className="w-full">
                              <p className="font-bold">{menu[item.type]}</p>
                              {/* 결제 알림 */}
                              {item.type === 'payment' && (
                                <>
                                  <span className="flex flex-row flex-nowrap items-center text-sm">
                                    [
                                    <Link
                                      href={`/products/${item.extra.product?._id}`}
                                      onClick={() => {
                                        setOpen(!open);
                                      }}
                                      className="text-primary-dark max-w-[14rem] truncate"
                                    >
                                      {item.extra.product?.name}
                                    </Link>
                                    ]
                                  </span>
                                  <span className="block text-sm">{item.content}</span>
                                  <span className="block text-sm">{item.createdAt}</span>
                                </>
                              )}
                              {/* 댓글 알림 */}
                              {item.type === 'reply' && (
                                <>
                                  <span className="flex flex-row flex-nowrap items-center text-sm">
                                    [
                                    <Link href={`/board/${item.extra.post?.type}/${item.extra.post?._id}`} onClick={() => setOpen(!open)} className="text-primary-dark max-w-[14rem] truncate">
                                      {item.extra.post?.title}
                                    </Link>
                                    ]
                                  </span>
                                  <span className="block text-sm">{item.content}</span>
                                  <span className="block text-sm">{item.createdAt}</span>
                                </>
                              )}
                              {/* 문의글 알림 */}
                              {item.type === 'qna' && (
                                <>
                                  <span className="flex flex-row flex-nowrap items-center text-sm">
                                    [
                                    <Link href={`/board/${item.extra.post?.type}/${item.extra.post?._id}`} onClick={() => setOpen(!open)} className="text-primary-dark max-w-[14rem] truncate">
                                      {item.extra.post?.title}
                                    </Link>
                                    ]
                                  </span>
                                  <span className="block text-sm">{item.content}</span>
                                  <span className="block text-sm">{item.createdAt}</span>
                                </>
                              )}
                              {/* 메시지 알림 */}
                              {item.type === 'message' && (
                                <>
                                  <button type="button" onClick={() => setOpenedMessageId(openedMessageId === item._id.toString() ? null : item._id.toString())} className="flex flex-row flex-nowrap cursor-pointer items-center text-sm">
                                    [<p className="text-primary-dark max-w-[14rem] truncate">{item.extra.message}</p>]
                                  </button>
                                  <span className="block text-sm">{item.content}</span>
                                  <span className="block text-sm">{item.createdAt}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {openedMessageId === item._id.toString() && item.type === 'message' && (
                            <div className="flex flex-col flex-nowrap p-4 gap-2 bg-background mt-4">
                              <p className="font-bold">쪽지 상세보기</p>
                              <p>{item.extra.message}</p>
                            </div>
                          )}
                        </li>
                      );
                  })
              ) : (
                <div className="flex flex-col flex-nowrap justify-center items-center h-[300px]">
                  <Image src="/empty-dotori.png" alt="도토리" width={120} height={120} />
                  <p>모든 알림을 확인하셨습니다.</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}
