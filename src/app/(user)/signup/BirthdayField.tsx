'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function BirthdayField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="mb-8">
      <label htmlFor="birthday" className="block font-semibold mb-2">
        생년월일
      </label>
      <input id="birthday" type="date" className={`w-full px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.birthday ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`} {...register('birthday', { required: '생년월일을 입력해주세요.' })} />
      {errors.birthday && <p className="ml-2 mt-1 text-sm text-red-500">{errors.birthday.message}</p>}
    </div>
  );
}
