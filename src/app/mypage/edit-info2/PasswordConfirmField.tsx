'use client';

import { User } from '@/types';

export default function PasswordConfirmField({ userInfo }: { userInfo: User }) {
  return (
    <>
      {/* 비밀번호 확인 */}
      <label htmlFor="passwordCheck" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        비밀번호 확인 <span className="text-red">*</span>
      </label>
      <div className="flex flex-col sm:flex-row flex-nowrap py-2 sm:items-center gap-4 sm:gap-8 lg:gap-12">
        <input type="password" name="passwordCheck" id="passwordCheck" placeholder={`${'비밀번호를 다시 입력하세요.'}`} className={`border px-4 py-2 w-52 sm:min-w-60 lg:min-w-96 `} />
        <span className={`text-xs lg:text-sm `}>비밀번호가 다릅니다. 다시 확인해주세요.</span>
      </div>
    </>
  );
}
