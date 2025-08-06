'use client';

// import { createMessage } from '@/data/actions/addNotification';
import { useLoginStore } from '@/stores/loginStore';
import { User } from '@/types';
import { getUsers } from '@/utils/getUsers';
import { useEffect, useState } from 'react';
import MessageModal from './SendMessage';
import Image from 'next/image';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AdminList() {
  const [adminList, setAdminList] = useState<User[]>([]);
  const [target, setTarget] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = useLoginStore(state => state.user);

  // 관리자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUsers();

      if (res.ok) {
        const userData: User[] = [];
        for (let i = 0; i < res.item.length; i++) {
          if (res.item[i].type === 'admin') {
            userData.push(res.item[i]);
          }
        }

        setAdminList(userData);
      } else {
        console.log('네트워크 문제로 유저 정보를 얻어오지 못했습니다.');
      }
    };
    fetchUser();
  }, [user]);

  const handleMessage = (target: User) => {
    if (!user) return;

    setTarget(target);
    setModalOpen(true);
    // const sendMessage = async () => {
    //   const res = await createMessage('', target, user);

    //   if (res.ok) {
    //     console.log('메시지 보내기 성공');
    //   }
    // };

    // sendMessage();
  };

  // 모바일 상태 확인
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 기준 sm 미만이면 모바일
    };

    checkIsMobile(); // 초기 확인
    window.addEventListener('resize', checkIsMobile); // 리사이즈 대응

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getUserImageSrc = (user: User) => {
    const fallback = '/default-profile.webp';

    // 외부 이미지가 문자열이면 바로 반환
    if (typeof user?.image === 'string') {
      return user.image;
    }

    // image가 객체이고 null이 아님일 때만 접근
    if (typeof user?.image === 'object' && user.image !== null) {
      if (user.image.originalname && user.image.path && API_URL) {
        return `${API_URL}/${user.image.path}`;
      }

      if (user.image.path) {
        return user.image.path;
      }
    }

    return fallback;
  };

  return (
    <>
      {isMobile && (
        <article className="w-full pb-24">
          {/* 타이틀 */}
          <div className="flex flex-col flex-nowrap px-4 sm:px-0 pb-4">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">도토리섬 관리자 정보</h2>
            <p>도토리섬 관리자들의 정보입니다.</p>
          </div>{' '}
          <ul className="w-full flex flex-col flex-nowrap gap-8 p-10">
            {adminList
              .slice()
              .reverse()
              .map(admin => (
                <li key={admin._id} className="flex flex-row flex-nowrap gap-4 items-center shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-2xl p-4">
                  <div className="relative w-[75px] h-[75px] rounded-full overflow-hidden border border-gray">
                    <Image src={getUserImageSrc(admin)} alt={`${admin.name}님의 프로필 사진`} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="">ID: {admin._id}</p>
                    <p className="font-bold pb-1">{admin.name}</p>
                    <p className="">{admin.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</p>
                  </div>
                  <div className="ml-auto pr-8 flex justify-center items-center">
                    {admin._id !== user?._id && (
                      <button type="button" onClick={() => handleMessage(admin)} className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
          {modalOpen && target && user && <MessageModal target={target} user={user} isOpen={modalOpen} setIsOpen={setModalOpen} />}{' '}
        </article>
      )}
      {!isMobile && (
        <article className="w-full pb-24">
          {/* 타이틀 */}
          <div className="flex flex-col flex-nowrap px-4 sm:px-0 pb-4">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">도토리섬 관리자 정보</h2>
            <p>도토리섬 관리자들의 정보입니다.</p>
          </div>
          <table className="w-full">
            <thead className="text-sm lg:text-base">
              <tr className="border-t-2 border-primary-dark bg-primary-light">
                <th className="p-4 border-r-1 border-white">ID</th>
                <th className="p-4 border-r-1 border-white">이름</th>
                <th className="p-4 border-r-1 border-white">전화번호</th>
                <th className="p-4 border-r-1 border-white">직급</th>
                <th className="p-4">
                  쪽지
                  <br />
                  보내기
                </th>
              </tr>
            </thead>
            <tbody className="border-b-1 border-light-gray text-sm lg:text-base">
              {adminList
                .slice()
                .reverse()
                .map(admin => (
                  <tr key={admin._id} className="text-center border-t-1 border-light-gray">
                    <td className="border-r-1 border-light-gray p-2">{admin._id}</td>
                    <td className="border-r-1 border-light-gray p-2">{admin.name}</td>
                    <td className="border-r-1 border-light-gray p-2">{admin.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</td>
                    <td className="border-r-1 border-light-gray p-2">관리자</td>
                    <td className="flex justify-center p-2">
                      {admin._id !== user?._id && (
                        <button type="button" onClick={() => handleMessage(admin)} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {modalOpen && target && user && <MessageModal target={target} user={user} isOpen={modalOpen} setIsOpen={setModalOpen} />}{' '}
        </article>
      )}
    </>
  );
}
