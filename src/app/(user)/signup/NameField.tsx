'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function NameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="mb-8">
      <label htmlFor="name" className="block font-semibold mb-2">
        이름
      </label>
      <input id="name" type="text" placeholder="이름을 입력하세요" className={`w-full px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.name ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`} {...register('name', { required: '이름을 입력해주세요.' })} />
      {errors.name && <p className="ml-2 mt-1 text-sm text-red-500">{errors.name.message}</p>}
    </div>
  );
}
