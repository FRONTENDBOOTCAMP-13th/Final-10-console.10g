'use client';

import Link from 'next/link';
import { useState } from 'react';

type Address = {
  id: number;
  deliveryName: string;
  recipient: string;
  address: string;
  mobile: string;
  isDefault: boolean;
};

export default function Address() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => (addr.id === id ? { ...addr, isDefault: !addr.isDefault } : { ...addr, isDefault: false })));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const handleDelete = (id: number) => {
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    if (updated.length === 0) setShowAddress(false);
  };

  return (
    <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
      {/* 타이틀 */}
      <div className="mb-2 sm:mb-4 lg:mb-4">
        <h2 className="font-bold text-base sm:text-lg lg:text-xl">배송 주소록 관리</h2>
      </div>

      {/* 주소 목록 */}
      {!showAddress ? (
        <p className="text-gray-500 text-sm sm:text-base">등록된 주소가 없습니다.</p>
      ) : (
        <div className="space-y-4 sm:space-y-0 sm:table w-full rounded sm:border-none">
          {/* 헤더 (데스크탑) */}
          <div className="hidden sm:table-header-group">
            <div className="table-row text-sm sm:text-xs lg:text-base  font-bold ">
              {['선택', '대표배송지', '배송지명', '수령인', '휴대전화', '주소', '관리'].map((col, idx) => (
                <div key={idx} className="table-cell text-center px-3 py-2 whitespace-nowrap border-b border-gray">
                  {col}
                </div>
              ))}
            </div>
          </div>

          {/* 주소 목록 */}
          {addresses.map(addr => (
            <div key={addr.id} className="sm:table-row border border-dark-gray">
              {/* 체크박스 (데스크탑) */}
              <div className="hidden sm:table-cell px-2 py-2 text-center">
                <input type="checkbox" checked={selectedIds.includes(addr.id)} onChange={() => toggleSelect(addr.id)} className="accent-primary w-4 h-4" />
              </div>

              {/* 대표배송지 토글 (데스크탑) */}
              <div className="hidden sm:table-cell px-2 py-2 text-center">
                <button
                  onClick={() => toggleDefault(addr.id)}
                  className={`cursor-pointer px-3 py-1 rounded text-xs font-medium 
                  ${addr.isDefault ? 'bg-primary text-background' : 'border border-primary bg-background text-primary'}`}
                >
                  {addr.isDefault ? '고정' : '해제'}
                </button>
              </div>

              {/* 모바일: 대표배송지 토글 & 수정/삭제 */}
              <div className="flex justify-between items-center sm:hidden px-2 py-2">
                <button
                  onClick={() => toggleDefault(addr.id)}
                  className={`cursor-pointer px-3 py-1 rounded text-xs font-medium 
      ${addr.isDefault ? 'bg-primary text-background' : 'border border-primary bg-background text-primary'}`}
                >
                  {addr.isDefault ? '고정' : '해제'}
                </button>
                <div className="space-x-1">
                  <button className="cursor-pointer border px-2 py-1 text-xs rounded" onClick={() => console.log(`수정 ${addr.id}`)}>
                    수정
                  </button>
                  <button className="cursor-pointer border px-2 py-1 text-xs rounded text-red" onClick={() => handleDelete(addr.id)}>
                    삭제
                  </button>
                </div>
              </div>

              {/* 모바일 */}
              <div className="sm:hidden px-2 py-1  text-sm">
                <p className="py-1 font-medium">
                  {addr.deliveryName} / {addr.recipient}
                </p>
                <p className="py-1 text-sm">{addr.mobile}</p>
              </div>

              {/* 배송지명 */}
              <div className="hidden sm:table-cell px-2 py-1 lg:text-sm y text-sm text-center">{addr.deliveryName}</div>

              {/* 수령인 */}
              <div className="hidden sm:table-cell px-2 py-1 lg:text-sm  text-sm text-center">{addr.recipient}</div>

              {/* 데스크탑: 휴대번호 */}
              <div className="hidden sm:table-cell px-2 py-1  text-sm sm:text-xs lg:text-sm text-center  whitespace-nowrap">{addr.mobile}</div>

              {/* 주소 */}
              <div className="sm:table-cell px-2 py-1 sm:p-2   text-sm sm:text-xs lg:text-sm">{addr.address}</div>

              {/* 관리 버튼 (데스크탑) */}
              <div className="hidden sm:flex sm:flex-col px-2 py-2 text-center sm:space-y-1">
                <button className="cursor-pointer border px-2 py-1 whitespace-nowrap text-xs rounded" onClick={() => console.log(`수정 ${addr.id}`)}>
                  수정
                </button>
                <button className="cursor-pointer border px-2 py-1 whitespace-nowrap text-xs rounded text-red" onClick={() => handleDelete(addr.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4">
        {/* 데스크탑: 양쪽 배치 */}
        <div className="hidden sm:flex  justify-between w-full">
          <Link href="/mypage/address/add" className="cursor-pointer px-4 py-2 bg-dark-gray text-white rounded text-sm">
            배송지 등록
          </Link>
        </div>

        {/* 모바일: 등록 버튼만 */}
        <div className="sm:hidden w-full">
          <Link href="/mypage/address/add" className="cursor-pointer px-4 py-2 bg-dark-gray text-white rounded text-sm">
            배송지 등록
          </Link>
        </div>
      </div>
    </div>
  );
}
