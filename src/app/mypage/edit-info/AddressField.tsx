'use client';

import { EditFormValues, User } from '@/types';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<EditFormValues>();

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      toast.error('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: AddressData) => {
        setValue('address1', data.zonecode);
        setValue('address2', data.address);
      },
    }).open();
  };

  useEffect(() => {
    if (userInfo.extra?.address) {
      const addressData = userInfo.extra.address.find(val => val.isDefault === true);
      const val = addressData?.value || '';
      const first = val.slice(0, val.indexOf(' '));
      const second = val.slice(val.indexOf(' ') + 1);
      const detail = addressData?.detailAddress || '';

      setValue('address1', first);
      setValue('address2', second);
      setValue('address3', detail);
    }
  }, [setValue, userInfo]);

  return (
    <>
      {/* 주소 */}
      <label htmlFor="address1" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        주소
      </label>
      <div className="flex flex-col flex-nowrap gap-2 py-2">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <input type="text" id="address1" {...register('address1')} readOnly className="border px-4 py-2 w-24 sm:w-32 lg:w-60" />
          <button type="button" onClick={handleAddressSearch} className="border bg-light-yellow px-4 py-2 w-24 sm:w-24 lg:w-32 cursor-pointer">
            주소 검색
          </button>
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input type="text" id="address2" {...register('address2')} readOnly className="border px-4 py-2 w-60 sm:w-76 lg:w-96" />
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input
            type="text"
            id="address3"
            {...register('address3', {
              required: true,
            })}
            className={`border px-4 py-2 w-60 sm:w-76 lg:w-96 ${errors.address3 && 'border-red-500'}`}
          />
        </div>
        {errors.address3 && <p className="ml-2 mt-1 text-sm text-red-500">{'주소를 올바르게 입력해주세요.'}</p>}
      </div>
    </>
  );
}
