'use client';

import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  recipient: string;
  phone: string;
  address: string;
}

export default function OrderUserInfo({ name, recipient, phone, address }: Props) {
  const { register, setValue, watch } = useFormContext();
  const memo = watch('memo');

  const predefinedOptions = ['문 앞에 놓아주세요', '부재 시 연락 부탁드려요', '배송 전 미리 연락부탁드려요'];
  const isPredefined = predefinedOptions.includes(memo);

  const isInitial = useRef(true);

  const handleMemoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    isInitial.current = false;

    const value = e.target.value;
    if (value === '직접 입력') {
      setValue('memo', '');
    } else {
      setValue('memo', value);
    }
  };

  const memoOption = isInitial.current && memo === '' ? '' : isPredefined ? memo : '직접 입력';

  const formatPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  const formattedAddress = (() => {
    const match = address.match(/^(\d{5})\s*(.+)$/);
    return match ? `[${match[1]}] ${match[2]}` : address;
  })();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-2 rounded-xl sm:rounded-2xl sm:space-y-4 lg:space-y-4 lg:rounded-3xl bg-white text-dark-gray">
      <div className="text-base sm:text-lg font-semibold">배송정보</div>

      <div className="space-y-2 text-sm sm:text-base">
        <p className="font-semibold  sm:text-base ">
          <span>[{name}]</span> {recipient}
        </p>
        <p>{formatPhone}</p>
        <p>{formattedAddress}</p>
      </div>

      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        <select value={memoOption} onChange={handleMemoChange} className="w-full border border-primary text-xs sm:text-sm lg:text-base rounded px-1 py-1 sm:px-2 sm:py-2">
          <option value="" disabled hidden>
            -- 메시지 선택 (선택사항) --
          </option>
          {predefinedOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="직접 입력">직접 입력</option>
        </select>

        {memoOption === '직접 입력' && (
          <>
            <textarea {...register('memo')} placeholder="배송 시 요청사항을 입력해주세요" className="w-full border text-xs sm:text-sm lg:text-base border-primary rounded px-2 py-2 sm:px-3 h-24" maxLength={50} />
            <p className="text-right text-xs text-gray">{memo?.length || 0}/50</p>
          </>
        )}
      </div>
    </div>
  );
}
