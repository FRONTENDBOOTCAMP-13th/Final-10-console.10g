'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { getUserAddress } from '@/utils/getUsers';
import { patchUserAddresses } from '@/data/actions/patchUserAddresses';
import Loading from '@/app/loading';
import { UserAddress } from '@/types';

export default function Address() {
  const user = useLoginStore(state => state.user);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.token?.accessToken) return;
      setLoading(true);

      const res = await getUserAddress(user._id, user.token.accessToken);
      if (res.ok === 1 && res.item) {
        setAddresses(res.item);
        setShowAddress(res.item.length > 0);
      } else if (res.ok === 0) {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchAddresses();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  {
    /* 선택된 주소 id */
  }
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  {
    /* 토글 헬퍼 함수 */
  }
  const updateAddressState = (newAddresses: UserAddress[]) => {
    setAddresses(newAddresses);
    setShowAddress(newAddresses.length > 0);
  };

  {
    /* 대표 배송지 설정 */
  }
  /* 대표 배송지 설정 */
  const handleSetDefault = async (id: number) => {
    if (!user?.token?.accessToken) return;

    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    updateAddressState(updatedAddresses);

    try {
      const res = await patchUserAddresses(user._id, user.token.accessToken, updatedAddresses);
      if (res.ok === 1 && res.item) {
        const latestAddresses = res.item.extra.address;
        updateAddressState(latestAddresses);
      }
    } catch (error) {
      console.error('대표배송지 변경 중 에러 발생:', error);
      updateAddressState(addresses);
    }
  };

  {
    /* 주소 삭제 */
  }
  const handleDelete = async (id: number) => {
    if (!user?.token?.accessToken) return;
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    updateAddressState(updatedAddresses);

    try {
      const res = await patchUserAddresses(user._id, user.token.accessToken, updatedAddresses);
      if (res.ok === 1 && res.item) {
        const latestAddresses = res.item.extra.address;
        updateAddressState(latestAddresses);
      }
    } catch (error) {
      console.error('주소 삭제 중 에러 발생:', error);
      updateAddressState(addresses);
    }
  };

  {
    /* 선택 주소 삭제 */
  }
  const handleDeleteSelected = async () => {
    if (!user?.token?.accessToken) return;
    if (selectedIds.length === 0) return;

    const updatedAddresses = addresses.filter(addr => !selectedIds.includes(addr.id));
    updateAddressState(updatedAddresses);
    try {
      const res = await patchUserAddresses(user._id, user.token.accessToken, updatedAddresses);
      if (res.ok === 1 && res.item) {
        const latestAddresses = res.item.extra.address;
        updateAddressState(latestAddresses);
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('선택 삭제 실패:', error);
      updateAddressState(addresses);
    }
  };

  return (
    <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
      {/* 타이틀 */}
      <div className="mb-2 sm:mb-4 lg:mb-4">
        <h2 className="font-bold text-base sm:text-lg lg:text-xl">배송 주소록 관리</h2>
      </div>

      {/* 주소 목록 */}
      {!showAddress ? (
        <p className="text-gray text-xs sm:text-sm lg:text-base">등록된 주소가 없습니다.</p>
      ) : (
        <ul className="space-y-4 sm:table w-full rounded sm:border-none">
          {/* 주소 목록 */}
          {addresses.map(addr => (
            <li key={addr.id} className="border p-4 border-dark-gray ">
              <input type="checkbox" checked={selectedIds.includes(addr.id)} onChange={() => toggleSelect(addr.id)} className="accent-primary w-4 h-4 m-2" />
              <div className="flex justify-between items-center px-2 py-1 align-middle">
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className={`cursor-pointer px-2 py-1 rounded text-xs  font-medium 
                  ${addr.isDefault ? 'bg-primary text-background' : 'border border-primary bg-background text-primary'}`}
                >
                  {addr.isDefault ? '고정' : '해제'}
                </button>
                <div className="space-x-1">
                  <Link href={`/mypage/address/edit/${addr.id}`} className="cursor-pointer border px-2 py-1 whitespace-nowrap text-xs rounded inline-block text-center">
                    수정
                  </Link>
                  <button className="cursor-pointer border px-2 py-1 text-xs rounded text-red" onClick={() => handleDelete(addr.id)}>
                    삭제
                  </button>
                </div>
              </div>
              <div className="px-2 py-1 text-sm align-middle space-y-2">
                <p>
                  {addr.name} / {addr.recipient}
                </p>
                <p>{addr.value}</p>
                <p>{addr.detailAddress}</p>
                <p>{addr.mobile}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4 lg:mt-6 gap-2">
        <button onClick={handleDeleteSelected} className="hidden cursor-pointer sm:block border px-4 py-2 text-sm lg:text-base rounded">
          선택 전체 삭제
        </button>
        <Link href="/mypage/address/add" className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-dark-gray text-white rounded text-sm lg:text-base text-center">
          배송지 등록
        </Link>
      </div>
    </div>
  );
}
