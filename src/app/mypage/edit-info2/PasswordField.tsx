'use client';

import { User } from '@/types';

export default function PasswordField({ userInfo }: { userInfo: User }) {
  // 비밀번호 유효성 검사 8~15자리만 검사
  // const isValidPassword = (password: string) => {
  //   return /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/.test(password);
  // };

  return (
    <>
      {/* 비밀번호 */}
      <label htmlFor="password" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        비밀번호 <span className="text-red">*</span>
      </label>
      <div className="flex flex-col sm:flex-row flex-nowrap py-2 sm:items-center gap-4 sm:gap-8 lg:gap-12">
        <input type="password" name="password" id="password" placeholder={`${'새로운 비밀번호를 입력하세요.'}`} className={`border px-4 py-2 w-52 sm:min-w-60 lg:min-w-96 `} />
        <span className={`text-xs lg:text-sm `}>영문 소문자/숫자/특수문자 포함 8~15자</span>
      </div>
    </>
  );
}
