'use client';

import { User } from '@/types';

export default function ReceiveEmailField({ userInfo }: { userInfo: User }) {
  const handleEmail = () => {
    console.log();
  };

  const receiveEmail = userInfo.extra?.receiveEmail ?? true;

  return (
    <>
      {/* 이메일 수신 여부 */}
      <span className="self-center text-xs sm:text-sm lg:text-base font-medium">
        이메일 수신 여부 <span className="text-red">*</span>
      </span>
      <div className="flex flex-row flex-nowrap items-center gap-4  p-4">
        <input type="radio" id="receive" name="receive" checked={receiveEmail === true} onChange={handleEmail} />
        <label htmlFor="receive">수신함</label>
        <input type="radio" id="noreceive" name="receive" checked={receiveEmail === false} onChange={handleEmail} />
        <label htmlFor="noreceive">수신하지 않음</label>
      </div>
    </>
  );
}
