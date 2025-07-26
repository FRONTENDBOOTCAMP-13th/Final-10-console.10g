'use client';

import { User } from '@/types';

export default function NameField({ userInfo }: { userInfo: User }) {
  return (
    <>
      {/* 이름 */}
      <label htmlFor="name" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        이름 <span className="text-red">*</span>
      </label>
      <div className="flex flex-col flex-nowrap py-2 gap-2">
        <input type="text" name="name" id="name" defaultValue={`${userInfo?.name}`} className={`border px-4 py-2 w-52 sm:w-60 lg:w-96 `} />
        <span className={`text-xs lg:text-sm `}>이름을 입력해주세요.</span>
      </div>
    </>
  );
}
