'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import AddressNameField from '../components/AddressNameField';
import AddressRecipientField from '../components/AddressRecipientField';
import AddressField from '../components/AddressField';
import AddressPhoneField from '../components/AddressPhoneField';
import AddressDefaultField from '../components/AddressDefaultField';
import { addAddress } from '@/data/actions/addAddress';
import { UserAddress } from '@/types';
import { toast } from 'react-hot-toast';

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

export interface AddressFormState {
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
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const user = useLoginStore(state => state.user);

  const methods = useForm<AddressFormState>({
    mode: 'onChange',
    defaultValues: {
      mobile1: '010',
      mobile2: '',
      mobile3: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const onSubmit = async (data: AddressFormState) => {
    if (!user || !user.token?.accessToken) {
      toast.error('로그인 후 이용해주세요.');
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

      toast.success('배송지가 추가되었습니다.');

      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/mypage/address');
      }
    } catch (err) {
      console.error('배송지 추가 실패:', err);
      toast.error(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const onError = (errors: FieldErrors<AddressFormState>) => {
    if (errors.deliveryName) {
      const el = document.getElementById('deliveryName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const firstErrorKey = Object.keys(errors)[0] as keyof AddressFormState;
    const el = document.getElementById(firstErrorKey);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-nowrap gap-4 justify-center sm:bg-background rounded-4xl sm:border border-primary p-4 sm:p-8 lg:p-16">
          {/* 배송지명 */}
          <AddressNameField />
          {/* 수령인 */}
          <AddressRecipientField />
          {/* 주소 */}
          <AddressField />
          {/* 휴대전화 */}
          <AddressPhoneField />
          {/* 기본 배송지 */}
          <AddressDefaultField />
          {/* 버튼 */}
          <div className="flex flex-row flex-nowrap gap-4 py-4">
            <button type="submit" disabled={isSubmitting} className="cursor-pointer flex-1 bg-primary text-white rounded-2xl p-4">
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
            <button type="button" onClick={() => router.back()} className="cursor-pointer flex-1 border rounded-2xl p-4 bg-white border-primary text-primary">
              취소
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
