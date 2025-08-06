'use client';

import { useFormContext } from 'react-hook-form';
import { AddressFormState } from '../edit/[id]/EditAddress';
import { toast } from 'react-hot-toast';

interface AddressData {
  address: string;
  zonecode: string;
  jibunAddress: string;
  buildingName: string;
  apartment: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: AddressData) => void }) => { open: () => void };
    };
  }
}
export default function AddressField() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<AddressFormState>();

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      toast.error('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: AddressData) => {
        setValue('postcode', data.zonecode);
        setValue('address', data.address);
      },
    }).open();
  };

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 주소 */}
      <label htmlFor="postcode">
        주소 <span className="text-red">*</span>
      </label>
      <div className="flex flex-col flex-nowrap gap-2">
        <div className="flex flex-row flex-nowrap items-center gap-2">
          <input type="text" id="postcode" {...register('postcode')} readOnly className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full`} />
          <button type="button" onClick={handleAddressSearch} className="p-4 border text-white rounded-xl bg-primary cursor-pointer">
            주소 검색
          </button>
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input type="text" id="address" {...register('address')} readOnly className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full`} />
        </div>
        <div className="flex flex-row flex-nowrap items-center">
          <input
            type="text"
            id="detailAddress"
            {...register('detailAddress', {
              required: true,
            })}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.detailAddress ? 'border-red-500' : 'border-primary'}`}
          />
        </div>
        {errors.detailAddress && <p className="ml-2 mt-1 text-sm text-red-500">{'주소를 올바르게 입력해주세요.'}</p>}
      </div>
    </div>
  );
}
