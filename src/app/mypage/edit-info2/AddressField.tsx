'use client';

import { User } from '@/types';
import { useState } from 'react';

interface AddressData {
  address: string; // 도로명 주소
  zonecode: string; // 우편번호
  jibunAddress: string; // 지번 주소
  buildingName: string; // 건물 이름 (있을 경우)
  apartment: string; // 'Y' or 'N'
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: AddressData) => void }) => { open: () => void };
    };
  }
}
export default function AddressField({ userInfo }: { userInfo: User }) {
  const [addresses, setAddresses] = useState<string[]>([]);
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: AddressData) => {
        setAddresses([data.address, data.zonecode]);
      },
    }).open();
  };

  let firstAddress, secondAddress, lastAddress;

  if (userInfo.extra?.address) {
    const addressData = userInfo.extra?.address.find(val => val.isDefault === true);
    const val = addressData!.value;
    firstAddress = val.slice(0, val.indexOf(' '));
    secondAddress = val.slice(val.indexOf(' ') + 1);
    lastAddress = addressData!.detailAddress!;
  }

  return (
    <>
      {/* 주소 */}
      <label htmlFor="address1" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        주소
      </label>
      <div className="flex flex-col flex-nowrap gap-2 py-2">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <input type="text" name="address1" id="address1" value={`${addresses[1] || firstAddress || ''}`} readOnly className="border px-4 py-2 w-24 sm:w-32 lg:w-60" />
          <button type="button" onClick={handleAddressSearch} className="border bg-light-yellow px-4 py-2 w-24 sm:w-24 lg:w-32 cursor-pointer">
            주소 검색
          </button>
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input type="text" name="address2" id="address2" value={`${addresses[0] || secondAddress || ''}`} readOnly className="border px-4 py-2 w-60 sm:w-76 lg:w-96" />
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input type="text" name="address3" id="address3" defaultValue={`${lastAddress || ''}`} className="border px-4 py-2 w-60 sm:w-76 lg:w-96" />
        </div>
      </div>
    </>
  );
}
