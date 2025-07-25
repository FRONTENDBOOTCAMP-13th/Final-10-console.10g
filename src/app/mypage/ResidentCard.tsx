'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getUserById } from '@/utils/getUsers';
import { useLoginStore } from '@/stores/loginStore';
import { patchUserImage } from '@/data/actions/patchUserImage';
import { patchUserIntro } from '@/data/actions/patcUserIntro';

export default function ResidentCard() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<null | {
    name: string;
    birthday: string;
    image: string;
    intro?: string;
  }>(null);
  const [introText, setIntroText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user: loginUser } = useLoginStore();
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
      const res = await getUserById(Number(loginUser._id));
      if (res.ok === 1 && res.item) {
        setUser({
          name: res.item.name,
          birthday: res.item.birthday ?? '생일을 작성해주세요',
          image: res.item.image?.path ? `${API_URL}/${res.item.image.path}` : '/mypage-profile.png',
          intro: res.item.extra?.intro || '',
        });
        setIntroText(res.item.extra?.intro || '');
      } else if (res.ok === 0) {
        console.error(res.message);
      }
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
      alert('이미지 업로드 실패');
      return;
    }

    const newImage = uploadRes.item[0];

    // 유저 이미지 업데이트
    const patchRes = await patchUserImage(loginUser._id, newImage, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      alert('프로필 이미지가 변경되었습니다!');
      setUser(prev => prev && { ...prev, image: `${API_URL}/${newImage.path}` });
    } else {
      alert('이미지 변경 실패');
    }
  };

  const saveIntro = async () => {
    if (isSaving) return;
    setIsSaving(true);

    if (!loginUser?._id || !loginUser.token?.accessToken) return;
    const trimmedIntro = introText.trim();
    const patchRes = await patchUserIntro(loginUser._id, trimmedIntro, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      alert('한줄 소개가 변경되었습니다!');
      setUser(prev => prev && { ...prev, intro: trimmedIntro });
    } else {
      alert('한줄 소개 변경 실패');
    }
    setEditing(false);
    setIsSaving(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-fit flex items-center justify-center py-8">
      <div className="relative rounded-md border border-primary w-fit">
        <Image loader={imageLoader} src="/mypage-greencard.png" alt="Green Card" className="rounded-lg w-75 h-30 sm:w-115 sm:h-45 lg:w-140 lg:h-55 object-cover" width={280} height={100} priority />

        {/* 프로필 버튼 */}
        <button type="button" onClick={() => document.getElementById('profile-upload')?.click()} className="absolute top-7 left-4 w-[3.75rem] h-[3.75rem] sm:left-8 sm:top-11 sm:w-[5rem] sm:h-[5rem] lg:w-[7rem] lg:h-[7rem] lg:left-10 lg:top-12 rounded-xl overflow-hidden">
          <div className="relative w-full h-full cursor-pointer">
            <Image src="/mypage-profile.png" alt="Default Profile Background" fill className="object-cover" />
            {user.image !== '/mypage-profile.png' && <Image loader={imageLoader} src={user.image} fill alt="User Profile" className="absolute inset-0 m-auto p-[2px] rounded-2xl sm:p-[3px] sm:rounded-[20px] lg:p-1 lg:rounded-[30px] object-cover z-2" />}
          </div>
          <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleProfileChange} />
        </button>

        {/* MEMBERSHIP CARD 텍스트 */}
        <div className="absolute top-0.5 left-10 right-10 text-center flex items-center justify-center gap-2">
          <div className="flex-1 border-t border-[#95aa81]"></div>
          <h2 className="text-[#95aa81] text-[.5rem] sm:text-[0.75rem] lg:text-base tracking-wide">MEMBERSHIP CARD</h2>
          <div className="flex-1 border-t border-[#95aa81]"></div>
        </div>

        {/* NAME & BIRTH */}
        <div className="absolute top-7 left-20 space-y-1 sm:top-11 sm:left-35 sm:space-y-2 lg:left-50 lg:top-14">
          <div className="flex items-center w-45 border-b border-[#95aa81] mb-1.5 sm:w-60 sm:mb-2.5 lg:w-80">
            <p className="text-[#95aa81] text-[.6rem] pr-2 sm:text-[0.75rem] lg:text-base">NAME</p>
            <p className="text-[.6rem] sm:text-[0.75rem] lg:text-base text-dark-gray">{user.name}</p>
          </div>
          <div className="flex items-center w-45 border-b border-[#95aa81] mb-1.5 sm:w-60 sm:mb-2.5 lg:w-80">
            <p className="text-[#95aa81] text-[.6rem] pr-2 sm:text-[0.75rem] lg:text-base">BIRTH</p>
            <p className="text-dark-gray text-[.6rem] sm:text-[0.75rem] lg:text-base">{user.birthday}</p>
          </div>
          <div className="flex items-center w-45 border-b border-[#95aa81] sm:w-60 lg:w-80 cursor-pointer group" onClick={() => setEditing(true)}>
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
                className="text-dark-gray text-[.6rem] sm:text-[0.75rem] lg:text-base w-full bg-transparent focus:outline-none placeholder-gray"
                placeholder="한줄 소개를 작성해주세요"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between w-full">
                <p className={`text-[.6rem] sm:text-[0.75rem] lg:text-base ${user.intro ? 'text-dark-gray' : 'text-gray'}`}>{user.intro || '한줄 소개를 작성해주세요'}</p>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[.6rem] sm:text-[0.75rem] lg:text-base">✏️</span>
              </div>
            )}
          </div>
        </div>

        {/* 바코드 */}
        <div className="absolute bottom-0 right-7 w-22 h-4 sm:right-10 sm:w-30 sm:h-5 lg:w-40 lg:h-7">
          <Image loader={imageLoader} src="/mypage-barcode.png" alt="Barcode" className="object-cover" fill />
        </div>

        {/* 작은 텍스트 */}
        <div className="absolute bottom-1 left-5 text-[#95aa81] text-[.45rem] sm:text-[0.5rem] sm:bottom-2 lg:text-[0.75rem] lg:bottom-3">CONSOLE.10G</div>
      </div>
    </div>
  );
}
