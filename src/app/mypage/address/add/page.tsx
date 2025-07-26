'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { addAddress } from '@/data/actions/addAddress';
import type { UserAddress } from '@/types/User';
import { useForm } from 'react-hook-form';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: AddressData) => void }) => { open: () => void };
    };
  }
}

interface AddressData {
  address: string; // 도로명 주소
  zonecode: string; // 우편번호
  jibunAddress: string; // 지번 주소
  buildingName: string; // 건물 이름 (있을 경우)
  apartment: string; // 'Y' or 'N'
}

interface FormState {
  deliveryName: string;
  recipient: string;
  postcode: string;
  address: string;
  detailAddress: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  isDefault: boolean;
}

export default function AddAddress() {
  const router = useRouter();
  const user = useLoginStore(state => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormState>({
    defaultValues: {
      deliveryName: '',
      recipient: '',
      postcode: '',
      address: '',
      detailAddress: '',
      mobile1: '010',
      mobile2: '',
      mobile3: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: AddressData) => {
        const fullAddress = data.buildingName ? `${data.address} ${data.buildingName}` : data.address;
        setValue('postcode', data.zonecode);
        setValue('address', fullAddress);
      },
    }).open();
  };

  const onSubmit = async (data: FormState) => {
    if (!user || !user.token?.accessToken) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const mobile = `${data.mobile1}${data.mobile2}${data.mobile3}`;

    const newAddress: Omit<UserAddress, 'id'> = {
      name: data.deliveryName,
      recipient: data.recipient,
      value: `${data.postcode} ${data.address}`.trim(),
      detailAddress: data.detailAddress.trim(),
      mobile,
      isDefault: data.isDefault,
    };

    try {
      const result = await addAddress(user._id, user.token.accessToken, newAddress);
      if (!result.ok) throw new Error('배송지 추가에 실패했습니다.');

      alert('배송지가 추가되었습니다.');
      router.push('/mypage/address');
    } catch (err) {
      console.error('배송지 추가 실패:', err);
      alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full mx-auto p-4 mt-4 text-dark-gray">
      <h2 className="font-bold text-lg mb-4">배송 주소록 등록</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[100px_1fr_auto] sm:grid-cols-[minmax(70px,150px)_minmax(150px,auto)_100px] lg:grid-cols-[200px_minmax(200px,auto)_150px] gap-y-4 sm:gap-y-6 lg:gap-y-6 gap-x-2">
        {/* 배송지명 */}
        <label className="self-center text-xs sm:text-sm lg:text-base font-medium">
          배송지명 <span className="text-red">*</span>
        </label>
        <input {...register('deliveryName', { required: true })} placeholder="예) 집, 회사" className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 수령인 */}
        <label className="self-center text-xs sm:text-sm lg:text-base font-medium">
          수령인 <span className="text-red">*</span>
        </label>
        <input {...register('recipient', { required: true })} className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 주소 */}
        <label className="self-center text-xs sm:text-sm lg:text-base font-medium">
          주소 <span className="text-red">*</span>
        </label>
        <input {...register('postcode', { required: true })} placeholder="우편번호" readOnly className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full" />
        <button type="button" onClick={handleAddressSearch} className="bg-primary cursor-pointer text-white rounded px-4 py-2 text-xs sm:text-sm lg:text-base">
          주소검색
        </button>

        <div></div>
        <input {...register('address', { required: true })} placeholder="기본 주소" readOnly className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        <div></div>
        <input {...register('detailAddress')} placeholder="상세 주소" className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 휴대전화 */}
        <label className="self-center text-xs sm:text-sm lg:text-base font-medium">
          휴대전화 <span className="text-red">*</span>
        </label>
        <div className="flex gap-2 col-span-2">
          <select {...register('mobile1', { required: true })} className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-20">
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>

          <input
            {...register('mobile2', {
              required: true,
              pattern: /^[0-9]{3,4}$/,
            })}
            placeholder="중간번호"
            maxLength={4}
            className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-24"
          />

          <input
            {...register('mobile3', {
              required: true,
              pattern: /^[0-9]{4}$/,
            })}
            placeholder="끝번호"
            maxLength={4}
            className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-24"
          />
        </div>

        {/* 기본 배송지 체크 */}
        <div className="col-span-3">
          <label className="flex items-center w-full text-xs sm:text-sm lg:text-base">
            <input {...register('isDefault')} type="checkbox" className="w-4 h-4 mr-2 accent-primary" />
            기본 배송지로 저장
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="col-span-3 w-full flex gap-2 mt-2">
          <button type="submit" className="flex-1 bg-primary cursor-pointer text-white rounded px-4 py-2 text-xs sm:text-sm lg:text-base" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 cursor-pointer border rounded px-4 py-2 text-xs sm:text-sm lg:text-base" disabled={isSubmitting}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
