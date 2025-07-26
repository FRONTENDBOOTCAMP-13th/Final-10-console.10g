'use client';

import { SignupFormValues } from '@/app/(user)/signup/SignupForm';
import { User } from '@/types';
import { getUsersEmail } from '@/utils/getUsers';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function EmailField({ userInfo }: { userInfo: User }) {
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const {
    register,
    getValues,
    formState: { errors },
    setError, // 추가
    clearErrors, // 필요하면 추가
  } = useFormContext<SignupFormValues>();

  const handleCheckEmail = async () => {
    const email = getValues('email');
    setEmailCheckMessage('');
    setIsEmailChecked(false);

    if (!email || !email.includes('@')) {
      setEmailCheckMessage('이메일 형식이 올바르지 않습니다.');
      return;
    }

    try {
      const res = await getUsersEmail(email);

      console.log(res);

      if (res.ok) {
        setEmailCheckMessage('사용 가능한 이메일입니다.');
        clearErrors('email'); // 에러 초기화
      } else {
        setEmailCheckMessage('');
        setError('email', { message: res.message });
      }
    } catch {
      setEmailCheckMessage('일시적인 오류로 중복 검사를 실패했습니다.');
    }
  };

  return (
    <>
      <label htmlFor="email" className="self-center text-xs sm:text-sm lg:text-base font-medium">
        이메일 <span className="text-red">*</span>
      </label>
      <div className="flex flex-col flex-nowrap">
        <div className="flex flex-col sm:flex-row flex-nowrap py-2 sm:items-center gap-4 sm:gap-8 lg:gap-12">
          <input
            type="email"
            id="email"
            defaultValue={`${userInfo?.email}`}
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 주소를 입력해주세요.',
              },
            })}
            className={`border px-4 py-2 w-52 sm:w-60 lg:w-96 ${errors.email ? 'border-red-500' : ''}`}
          />
          <button type="button" onClick={handleCheckEmail} className="border p-2 cursor-pointer w-fit">
            중복확인
          </button>
        </div>
        {/* 에러 메시지 우선, 없으면 중복확인 결과 메시지 출력 */}
        {errors.email ? <p className="ml-2 mt-1 text-sm text-red-500">{errors.email.message}</p> : emailCheckMessage && <p className="ml-2 mt-1 text-sm text-green-500">{emailCheckMessage}</p>}
      </div>
    </>
  );
}
