'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserAddress } from '@/utils/getUsers';
import { patchUserAddresses } from '@/data/actions/patchUserAddresses';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import AddressNameField from '../../components/AddressNameField';
import AddressRecipientField from '../../components/AddressRecipientField';
import AddressField from '../../components/AddressField';
import AddressPhoneField from '../../components/AddressPhoneField';
import AddressDefaultField from '../../components/AddressDefaultField';
import { toast } from 'react-hot-toast';

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

export default function EditAddress() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const addressId = parseInt(params.id, 10);

  const user = useLoginStore(state => state.user);
  const [loading, setLoading] = useState(true);

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
    reset,
    formState: { isSubmitting },
  } = methods;

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
        toast.error(err instanceof Error ? err.message : '주소 정보를 불러오지 못했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [user, addressId, router, reset]);

  const onSubmit = async (data: AddressFormState) => {
    if (!user?.token?.accessToken) {
      toast.error('로그인 후 이용해주세요.');
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

      toast.success('배송지가 수정되었습니다.');
      router.push('/mypage/address');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '배송지 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
      {loading && <Loading />}
      {!loading && (
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
                {isSubmitting ? '수정 중...' : '수정'}
              </button>
              <button type="button" onClick={() => router.back()} className="cursor-pointer flex-1 border rounded-2xl p-4 bg-white border-primary text-primary">
                취소
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  );
}
