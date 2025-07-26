'use client';

import { User } from '@/types';

export default function PhoneField({ userInfo }: { userInfo: User }) {
  const phoneData = userInfo.phone;
  let firstPhone, secondPhone, lastPhone;
  if (phoneData.length === 7) {
    firstPhone = phoneData.slice(0, 3);
    secondPhone = phoneData.slice(3, 6);
    lastPhone = phoneData.slice(6);
  } else {
    firstPhone = phoneData.slice(0, 3);
    secondPhone = phoneData.slice(3, 7);
    lastPhone = phoneData.slice(7);
  }

  const handleChange = () => {};

  return (
    <>
      {/* 휴대전화 */}
      <label htmlFor="phone" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        휴대전화 <span className="text-red">*</span>
      </label>
      <div className="flex gap-4">
        <select value={firstPhone || '010'} onChange={handleChange} className="border px-4 py-2 w-20 lg:w-24">
          <option value="010">010</option>
          <option value="011">011</option>
          <option value="016">016</option>
          <option value="017">017</option>
          <option value="018">018</option>
          <option value="019">019</option>
        </select>

        <input defaultValue={secondPhone} maxLength={4} className="border px-4 py-2 w-24 lg:w-32" />

        <input defaultValue={lastPhone} maxLength={4} className="border px-4 py-2 w-24 lg:w-32" />
      </div>
    </>
  );
}
