'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function PasswordConfirmField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="mb-8">
      <label htmlFor="passwordConfirm" className="block font-semibold mb-2">
        비밀번호 확인
      </label>
      <input
        id="passwordConfirm"
        type="password"
        placeholder="비밀번호를 다시 입력하세요"
        className={`w-full px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.passwordConfirm ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`}
        {...register('passwordConfirm', {
          required: '비밀번호 확인을 입력해주세요.',
          validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다.',
        })}
      />
      {errors.passwordConfirm && <p className="ml-2 mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>}
    </div>
  );
}
