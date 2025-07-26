'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserAddress } from '@/utils/getUsers';
import { patchUserAddresses } from '@/data/actions/patchUserAddresses';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import { useForm } from 'react-hook-form';

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: AddressData) => void }) => { open: () => void };
    };
  }
}

interface AddressData {
  address: string;
  zonecode: string;
  jibunAddress: string;
  buildingName: string;
  apartment: string;
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

export default function EditAddress() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const addressId = parseInt(params.id, 10);

  const user = useLoginStore(state => state.user);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormState>({
    defaultValues: {
      mobile1: '010',
      mobile2: '',
      mobile3: '',
    },
  });

  const splitAddress = (value: string) => {
    const parts = value.trim().split(' ');
    const postcode = parts.shift() || '';
    const address = parts.join(' ');
    return { postcode, address };
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user?.token?.accessToken) return;

      try {
        const res = await getUserAddress(user._id, user.token.accessToken);
        if (!res.ok || !res.item) {
          throw new Error('주소 정보를 불러오지 못했습니다.');
        }

        const target = res.item.find(addr => addr.id === addressId);
        if (!target) {
          throw new Error('해당 주소를 찾을 수 없습니다.');
        }

        const { postcode, address } = splitAddress(target.value);
        const mobile = target.mobile;

        reset({
          deliveryName: target.name,
          recipient: target.recipient,
          postcode,
          address,
          detailAddress: target.detailAddress || '',
          mobile1: mobile.slice(0, 3),
          mobile2: mobile.slice(3, 7),
          mobile3: mobile.slice(7, 11),
          isDefault: target.isDefault,
        });
      } catch (err) {
        console.error('주소 불러오기 실패:', err);
        alert(err instanceof Error ? err.message : '주소 정보를 불러오지 못했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [user, addressId, router, reset]);

  const handleAddressSearch = () => {
    try {
      if (!window.daum || !window.daum.Postcode) {
        throw new Error('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      }

      new window.daum.Postcode({
        oncomplete: (data: AddressData) => {
          const fullAddress = data.buildingName ? `${data.address} ${data.buildingName}` : data.address;

          setValue('postcode', data.zonecode);
          setValue('address', fullAddress);
        },
      }).open();
    } catch (err) {
      console.error('주소 검색 오류:', err);
      alert(err instanceof Error ? err.message : '주소 검색 중 오류가 발생했습니다.');
    }
  };

  const onSubmit = async (data: FormState) => {
    if (!user?.token?.accessToken) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const mobile = `${data.mobile1}${data.mobile2}${data.mobile3}`;

    setLoading(true);

    try {
      const res = await getUserAddress(user._id, user.token.accessToken);
      if (!res.ok || !res.item) {
        throw new Error('주소 정보를 불러오지 못했습니다.');
      }

      const updatedAddresses = res.item.map(addr =>
        addr.id === addressId
          ? {
              ...addr,
              name: data.deliveryName,
              recipient: data.recipient,
              value: `${data.postcode} ${data.address}`.trim(),
              detailAddress: data.detailAddress.trim(),
              mobile,
              isDefault: data.isDefault,
            }
          : addr,
      );

      const result = await patchUserAddresses(user._id, user.token.accessToken, updatedAddresses);

      if (!result.ok) {
        throw new Error(result.message || '배송지 수정에 실패했습니다.');
      }

      alert('배송지가 수정되었습니다.');
      router.push('/mypage/address');
    } catch (err) {
      console.error('배송지 수정 실패:', err);
      alert(err instanceof Error ? err.message : '배송지 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full mx-auto p-4 mt-4 text-dark-gray">
      <h2 className="font-bold text-lg mb-4">배송 주소록 수정</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[100px_1fr_auto] sm:grid-cols-[minmax(70px,150px)_minmax(150px,auto)_100px] lg:grid-cols-[200px_minmax(200px,auto)_150px] gap-y-4 sm:gap-y-6 lg:gap-y-6 gap-x-2">
        {/* 배송지명 */}
        <label className="self-center">
          배송지명 <span className="text-red">*</span>
        </label>
        <input {...register('deliveryName', { required: true })} placeholder="예) 집, 회사" className="border rounded px-2 py-2 col-span-2" />

        {/* 수령인 */}
        <label className="self-center">
          수령인 <span className="text-red">*</span>
        </label>
        <input {...register('recipient', { required: true })} className="border rounded px-2 py-2 col-span-2" />

        {/* 주소 */}
        <label className="self-center">
          주소 <span className="text-red">*</span>
        </label>
        <input {...register('postcode', { required: true })} placeholder="우편번호" readOnly className="border rounded px-2 py-2" />
        <button type="button" onClick={handleAddressSearch} className="bg-primary text-white rounded px-4 py-2">
          주소 검색
        </button>

        <div></div>
        <input {...register('address', { required: true })} placeholder="기본 주소" readOnly className="border rounded px-2 py-2 col-span-2" />

        <div></div>
        <input {...register('detailAddress')} placeholder="상세 주소" className="border rounded px-2 py-2 col-span-2" />

        {/* 휴대전화 */}
        <label className="self-center">
          휴대전화 <span className="text-red">*</span>
        </label>
        <div className="flex gap-2 col-span-2">
          <select {...register('mobile1', { required: true })} className="border rounded px-2 py-2 w-20">
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>
          <input {...register('mobile2', { required: true, maxLength: 4 })} placeholder="중간번호" className="border rounded px-2 py-2 w-24" />
          <input {...register('mobile3', { required: true, maxLength: 4 })} placeholder="끝번호" className="border rounded px-2 py-2 w-24" />
        </div>

        {/* 기본 배송지 */}
        <div className="col-span-3">
          <label className="flex items-center">
            <input {...register('isDefault')} type="checkbox" className="mr-2 accent-primary" />
            기본 배송지로 저장
          </label>
        </div>

        {/* 버튼 */}
        <div className="col-span-3 flex gap-2 mt-2">
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white rounded px-4 py-2">
            {isSubmitting ? '수정 중...' : '수정'}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 border rounded px-4 py-2">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
