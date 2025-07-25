'use client';

import Image from 'next/image';
import BellIcon from '../icon/BellIcon';
import { useEffect, useRef, useState } from 'react';
import TriangleIcon from '../icon/TriangleIcon';
import { useLoginStore } from '@/stores/loginStore';
import { getUserNotifications } from '@/utils/getNotifications';
import { Notification } from '@/types/notification';
import { patchNotification } from '@/data/actions/patchNotification';
import CloseIcon from '../icon/CloseIcon';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function NotificationIcon({ isMobile = false }: { isMobile?: boolean }) {
  const user = useLoginStore(state => state.user);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 알림 종류
  const menu = {
    payment: '결제 알림',
    qna: '문의글 알림',
    community: '커뮤니티 알림',
  } as const;

  // 모두 읽음 버튼
  const handleRead = async () => {
    if (user) {
      try {
        const res = await patchNotification(user);
        setNotifications([]);
        console.log(res.ok);
      } catch {
        console.log('데이터 읽음 처리 실패');
      }
    }
  };

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
    if (!user?.token?.accessToken) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isFetching = false;

    const fetchNotification = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const res = await getUserNotifications(user.token.accessToken);
        if (res.ok) {
          const data: Notification[] = [];
          res.item.forEach(note => {
            if (!note.isRead) data.push(note);
          });
          setNotifications(data);
        } else {
          throw '알림 불러오기 실패';
        }
      } catch (err) {
        console.error(err);
      } finally {
        isFetching = false;
      }
    };

    // polling 시작
    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      fetchNotification(); // 포커스 복귀 시 즉시 한 번 호출
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

  // 모바일 버전
  if (isMobile) {
    return (
      <>
        <button type="button" className="cursor-pointer relative" aria-label="알림" onClick={() => setOpen(prev => !prev)}>
          <BellIcon pathProps={{ fill: '#A97452' }} svgProps={{ className: 'w-6 h-6 cursor-pointer' }} aria-label="알림" />
          {notifications && notifications?.length > 0 && <div className="w-1 h-1 bg-red rounded-full absolute top-0 right-0"></div>}
        </button>
        {open && (
          <div className="fixed inset-0 bg-white flex flex-col z-50">
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
                {notifications && notifications.length > 0 ? (
                  notifications
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      if (!item.isRead)
                        return (
                          <li key={index} className="flex items-center gap-3 p-4 bg-white rounded-2xl w-full">
                            <div className="min-w-18 min-h-18">
                              <Image src={item.extra.image ? `${API_URL}/${item.extra.image[0].path}` : `/character/chiikawa.png`} alt={`${item.extra.product} 상품 이미지`} width={72} height={72} className="rounded-full" />
                            </div>
                            <div className="w-full">
                              <p className="font-bold">{menu[item.type]}</p>
                              <span className="flex items-center text-sm">
                                [<span className="text-primary-dark max-w-[14rem] truncate">{item.extra.product}</span>]
                              </span>
                              <span className="block text-sm">{item.content}</span>
                              <span className="block text-sm">{item.createdAt}</span>
                            </div>
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
        <BellIcon svgProps={{ className: 'w-6 h-6' }} />
        {notifications && notifications?.length > 0 && <div className="w-1 h-1 bg-red rounded-full absolute top-0 right-0"></div>}
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
              {notifications && notifications.length > 0 ? (
                notifications
                  .slice()
                  .reverse()
                  .map((item, index) => {
                    if (!item.isRead)
                      return (
                        <li key={index} className="flex flex-row flex-nowrap items-center gap-3 p-4 bg-white rounded-2xl w-full">
                          <div className="min-w-18 min-h-18">
                            <Image src={item.extra.image ? `${API_URL}/${item.extra.image[0].path}` : `/character/chiikawa.png`} alt={`${item.extra.product} 상품 이미지`} width={72} height={72} className="rounded-full" />
                          </div>
                          <div className="w-full">
                            <p className="font-bold">{menu[item.type]}</p>
                            <span className="flex flex-row flex-nowrap items-center text-sm">
                              [<span className="text-primary-dark max-w-[14rem] truncate">{item.extra.product}</span>]
                            </span>
                            <span className="block text-sm">{item.content}</span>
                            <span className="block text-sm">{item.createdAt}</span>
                          </div>
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
