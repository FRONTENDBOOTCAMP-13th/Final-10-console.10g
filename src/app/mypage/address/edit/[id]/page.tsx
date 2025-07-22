'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserAddress } from '@/utils/getUsers';
import { patchUserAddresses } from '@/data/actions/patchUserAddresses';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';

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
  mobile: string;
  isDefault: boolean;
}

export default function EditAddress() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const addressId = parseInt(params.id, 10);

  const user = useLoginStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);

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
        setForm({
          deliveryName: target.name,
          recipient: target.recipient,
          postcode,
          address,
          detailAddress: target.detailAddress || '',
          mobile: target.mobile,
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
  }, [user, addressId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
          }
        : null,
    );
  };

  const handleAddressSearch = () => {
    try {
      if (!window.daum || !window.daum.Postcode) {
        throw new Error('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      }

      new window.daum.Postcode({
        oncomplete: (data: AddressData) => {
          const fullAddress = data.buildingName ? `${data.address} ${data.buildingName}` : data.address;

          setForm(prev =>
            prev
              ? {
                  ...prev,
                  postcode: data.zonecode,
                  address: fullAddress,
                }
              : null,
          );
        },
      }).open();
    } catch (err) {
      console.error('주소 검색 오류:', err);
      alert(err instanceof Error ? err.message : '주소 검색 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form || !user?.token?.accessToken) {
      alert('로그인 후 이용해주세요.');
      return;
    }

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
              name: form.deliveryName,
              recipient: form.recipient,
              value: `${form.postcode} ${form.address}`.trim(),
              detailAddress: form.detailAddress.trim(),
              mobile: form.mobile,
              isDefault: form.isDefault,
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

  if (loading || !form) return <Loading />;

  return (
    <div className="w-full mx-auto p-4 mt-4 text-dark-gray">
      <h2 className="font-bold text-lg mb-4">배송 주소록 수정</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-[100px_1fr_auto] sm:grid-cols-[150px_minmax(300px,300px)_150px] lg:grid-cols-[200px_minmax(200px,350px)_150px] gap-y-4 sm:gap-y-6 lg:gap-y-6 gap-x-2">
        {/* 배송지명 */}
        <label htmlFor="deliveryName" className="self-center text-xs sm:text-sm lg:text-base font-medium">
          배송지명 <span className="text-red">*</span>
        </label>
        <input id="deliveryName" name="deliveryName" value={form.deliveryName} onChange={handleChange} placeholder="예) 집, 회사" required className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 수령인 */}
        <label htmlFor="recipient" className="self-center text-xs sm:text-sm lg:text-base font-medium">
          수령인 <span className="text-red">*</span>
        </label>
        <input id="recipient" name="recipient" value={form.recipient} onChange={handleChange} required className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 주소 */}
        <label htmlFor="postcode" className="self-center text-xs sm:text-sm lg:text-base font-medium">
          주소 <span className="text-red">*</span>
        </label>
        <input id="postcode" name="postcode" value={form.postcode} onChange={handleChange} placeholder="우편번호" readOnly required className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full" />
        <button type="button" onClick={handleAddressSearch} className="bg-primary cursor-pointer text-white rounded px-4 py-2 text-xs sm:text-sm lg:text-base">
          주소 검색
        </button>

        {/* 기본 주소 */}
        <div></div>
        <input name="address" value={form.address} onChange={handleChange} placeholder="기본 주소" readOnly required className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 상세 주소 */}
        <div></div>
        <input name="detailAddress" value={form.detailAddress} onChange={handleChange} placeholder="상세 주소" className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-full col-span-2" />

        {/* 휴대전화 */}
        <label htmlFor="mobile1" className="self-center text-xs sm:text-sm lg:text-base font-medium">
          휴대전화 <span className="text-red">*</span>
        </label>
        <div className="flex gap-2 col-span-2">
          {/* 앞자리 선택 */}
          <select
            id="mobile1"
            name="mobile1"
            value={form.mobile.slice(0, 3)}
            onChange={e => {
              const mid = form.mobile.slice(3, 7);
              const last = form.mobile.slice(7, 11);
              setForm(prev => prev && { ...prev, mobile: `${e.target.value}${mid}${last}` });
            }}
            className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-20"
            required
          >
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>

          {/* 중간 번호 */}
          <input
            type="text"
            name="mobile2"
            value={form.mobile.slice(3, 7)}
            onChange={e => {
              const mid = e.target.value.replace(/[^0-9]/g, '');
              const last = form.mobile.slice(7, 11);
              setForm(prev => prev && { ...prev, mobile: `${form.mobile.slice(0, 3)}${mid}${last}` });
            }}
            placeholder="0000"
            maxLength={4}
            className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-24"
            required
          />

          {/* 끝 번호 */}
          <input
            type="text"
            name="mobile3"
            value={form.mobile.slice(7, 11)}
            onChange={e => {
              const last = e.target.value.replace(/[^0-9]/g, '');
              const mid = form.mobile.slice(3, 7);
              setForm(prev => prev && { ...prev, mobile: `${form.mobile.slice(0, 3)}${mid}${last}` });
            }}
            placeholder="0000"
            maxLength={4}
            className="border rounded px-2 py-2 text-xs sm:text-sm lg:text-base w-24"
            required
          />
        </div>

        {/* 기본 배송지 체크 */}
        <div className="col-span-3">
          <label className="flex items-center w-full text-xs sm:text-sm lg:text-base">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="w-4 h-4 mr-2 accent-primary" />
            기본 배송지로 저장
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="col-span-3 w-full flex gap-2 mt-2">
          <button type="submit" className="flex-1 bg-primary cursor-pointer text-white rounded px-4 py-2 text-xs sm:text-sm lg:text-base" disabled={loading}>
            {loading ? '수정 중...' : '수정'}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 cursor-pointer border rounded px-4 py-2 text-xs sm:text-sm lg:text-base" disabled={loading}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
