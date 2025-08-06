'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getUserById } from '@/utils/getUsers';
import { useLoginStore } from '@/stores/loginStore';
import { patchUserImage } from '@/data/actions/patchUserImage';
import { patchUserIntro } from '@/data/actions/patcUserIntro';
import { useUserStore } from '@/stores/userStore';
import Skeleton from '@/components/common/Skeleton';
import { toast } from 'react-hot-toast';

export default function ResidentCard() {
  const userState = useUserStore(state => state.user);
  const [editing, setEditing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchLoginUser = useLoginStore(state => state.fetchUser);
  const refreshUser = useLoginStore(state => state.refreshUser);

  const [user, setUser] = useState<null | {
    name: string;
    birthday: string;
    image: string;
    intro?: string;
  }>(null);
  const [introText, setIntroText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user: loginUser } = useLoginStore();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 이미지 로더
  const imageLoader = ({ src, width }: { src: string; width: number }) => {
    const isLg = width >= 1024;
    const targetImages = ['greencard', 'barcode'];
    const shouldApply2x = targetImages.some(name => src.includes(name));
    return isLg && shouldApply2x ? src.replace('.png', '@2x.png') : src;
  };

  // 유저 데이터 가져오기
  useEffect(() => {
    if (!loginUser?._id) return;
    const fetchUser = async () => {
      setIsLoading(true);
      const res = await getUserById(Number(loginUser._id));
      if (res.ok === 1 && res.item) {
        let image;
        if (typeof res.item.image === 'string') {
          image = res.item.image;
        } else if (res.item.image?.path) {
          image = res.item.image.path;
        } else {
          image = '/mypage-profile.png';
        }

        setUser({
          name: res.item.name,
          birthday: res.item.birthday ?? '생일을 작성해주세요',
          image: image,
          intro: res.item.extra?.intro || '',
        });
        setIntroText(res.item.extra?.intro || '');
      } else if (res.ok === 0) {
        console.error(res.message);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [loginUser?._id]);

  // 프로필 변경
  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    if (!loginUser?._id || !loginUser.token?.accessToken) {
      console.error('유저 정보 또는 토큰이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('attach', e.target.files[0]);

    // 파일 업로드
    const uploadRes = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { 'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || '' },
      body: formData,
    }).then(res => res.json());

    if (uploadRes.ok !== 1) {
      toast.error('이미지 업로드 실패');
      return;
    }

    const newImage = uploadRes.item[0];

    // 유저 이미지 업데이트
    const patchRes = await patchUserImage(loginUser._id, newImage, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      await refreshUser();
      toast.success('프로필 이미지가 변경되었습니다!');

      setUser(prev => prev && { ...prev, image: `${newImage.path}` });
      try {
        console.log(fetchLoginUser);
        await fetchLoginUser();
      } catch {
        console.log('스토어에 저장이 안댐');
      }
    } else {
      toast.error('이미지 변경 실패');
    }
  };

  const saveIntro = async () => {
    if (isSaving) return;
    setIsSaving(true);

    if (!loginUser?._id || !loginUser.token?.accessToken) return;
    const trimmedIntro = introText.trim();
    const patchRes = await patchUserIntro(loginUser._id, trimmedIntro, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      toast.success('한줄 소개가 변경되었습니다!');
      setUser(prev => prev && { ...prev, intro: trimmedIntro });
    } else {
      toast.error('한줄 소개 변경 실패');
    }
    setEditing(false);
    setIsSaving(false);
  };

  if (!user) return <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[450px] lg:h-[247.5px] mx-auto" />;

  return (
    <>
      {isLoading && <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[450px] lg:h-[247.5px] mx-auto" />}
      {!isLoading && (
        <div className="flex flex-col flex-nowrap text-xs sm:text-sm lg:text-base">
          <div className="relative rounded-xl flex flex-row flex-nowrap gap-8 px-8 items-center justify-center border-2 border-primary w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[450px] lg:h-[247.5px] bg-cover bg-center" style={{ backgroundImage: 'url("/mypage-greencard.png")' }}>
            {/* MEMBERSHIP CARD 텍스트 */}
            <div className="absolute top-1 w-full text-center flex flex-row flex-nowrap items-center justify-center gap-2">
              <div className="flex-1 ml-10 border-t border-[#95aa81]"></div>
              <h2 className="text-[#95aa81]  tracking-wide">MEMBERSHIP CARD</h2>
              <div className="flex-1 mr-10 border-t border-[#95aa81]"></div>
            </div>

            {/* 프로필 버튼 */}
            <button type="button" onClick={() => setShowProfileModal(true)} className="overflow-hidden">
              <div className="w-full h-full cursor-pointer">
                {user.image !== '/mypage-profile.png' ? (
                  <div className="relative w-[7rem] h-[7rem]">
                    <Image loader={imageLoader} src={user.image} fill alt="User Profile" className="object-cover z-2 rounded-2xl border-4 border-secondary-green" />
                  </div>
                ) : (
                  <div className="relative w-[7rem] h-[7rem]">
                    <Image src="/mypage-profile.png" alt="Default Profile Background" fill className="object-cover" />
                  </div>
                )}
              </div>
              <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleProfileChange} />
            </button>

            {showProfileModal && (
              <div className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.3)] flex justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-[300px] shadow-lg">
                  <h2 className="text-lg font-semibold mb-4 text-center">프로필 이미지 변경</h2>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        // 기본 이미지로 설정
                        if (!loginUser?._id || !loginUser.token?.accessToken) {
                          toast.error('로그인 정보가 없습니다.');
                          return;
                        }

                        const defaultImage = {
                          path: '/default-profile.webp',
                          originalname: 'default-profile.webp',
                          name: 'default-profile.webp',
                        };

                        patchUserImage(loginUser._id, defaultImage, loginUser.token.accessToken).then(res => {
                          if (res.ok === 1) {
                            refreshUser();
                            setUser(prev => prev && { ...prev, image: defaultImage.path });
                            fetchLoginUser();
                            toast.success('기본 프로필로 변경되었습니다.');
                          } else {
                            toast.error('기본 이미지 설정 실패');
                          }
                          setShowProfileModal(false);
                        });
                      }}
                      className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      기본 이미지로 변경
                    </button>

                    <button
                      onClick={() => {
                        document.getElementById('profile-upload')?.click();
                        setShowProfileModal(false);
                      }}
                      className="w-full bg-secondary-green text-white py-2 rounded hover:bg-[#627d4a] cursor-pointer"
                    >
                      이미지 업로드
                    </button>

                    <button onClick={() => setShowProfileModal(false)} className="w-full text-sm text-gray-500 mt-2 hover:underline cursor-pointer">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NAME & BIRTH */}
            <div className="flex flex-col flex-1 flex-nowrap gap-2 sm:gap-1">
              <div className="flex items-center border-b border-[#95aa81] ">
                <p className="text-[#95aa81] pr-2 ">NAME</p>
                <p className=" text-dark-gray font-test">{userState?.name ? userState.name : user.name}</p>
              </div>
              <div className="flex items-center border-b border-[#95aa81] ">
                <p className="text-[#95aa81] pr-2 ">BIRTH</p>
                <p className="text-dark-gray font-test">{userState?.birthday ? userState.birthday : user.birthday}</p>
              </div>
              <div className="flex items-center border-b border-[#95aa81] cursor-pointer group" onClick={() => setEditing(true)}>
                {editing ? (
                  <input
                    type="text"
                    value={introText}
                    onChange={e => setIntroText(e.target.value)}
                    onBlur={() => {
                      if (!isSaving) saveIntro();
                    }}
                    onKeyDown={async e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!isSaving) await saveIntro();
                      }
                    }}
                    className="text-dark-gray font-test w-full bg-transparent focus:outline-none placeholder-gray"
                    placeholder="한줄 소개를 작성해주세요"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between w-full font-test">
                    <p className={`  ${user.intro ? 'text-dark-gray' : 'text-gray'}`}>{user.intro || '한줄 소개를 작성해주세요'}</p>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">✏️</span>
                  </div>
                )}
              </div>
            </div>

            {/* 바코드 */}
            <div className="absolute bottom-0.5 left-5  w-30 h-5 lg:w-40 lg:h-7">
              <Image loader={imageLoader} src="/mypage-barcode.png" alt="Barcode" className="object-cover" fill />
            </div>

            {/* 작은 텍스트 */}
            <div className="absolute left-5 text-[#95aa81] text-[0.5rem] lg:text-[0.6rem] bottom-6 lg:lg:bottom-8.5">CONSOLE.10G</div>

            <div className="absolute bottom-0 right-10 w-10 h-10 lg:w-13 lg:h-13">
              <Image src="/dotoriQR.png" alt="Dotori QR" fill className="object-cover" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
