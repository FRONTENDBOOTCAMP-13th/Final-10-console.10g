'use client';

import { useState } from 'react';
import axios from 'axios';
import { useForm, FormProvider, SubmitHandler, FieldErrors } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AgreementSection, { AgreementMap } from './AgreementSection';
import { createUser } from '@/data/actions/user';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import PasswordConfirmField from './PasswordConfirmField';
import NameField from './NameField';
import BirthdayField from './BirthdayField';
import PhoneField from './PhoneField';
import ProfileImageField from './ProfileImageField';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// 폼 입력값 타입 정의
export interface SignupFormValues {
  type: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthday: string;
  phone1: string;
  phone2: string;
  phone3: string;
  attach?: FileList;
  receiveEmail: boolean;
}

// 이메일 중복확인 API 응답 타입 정의
interface ApiEmailCheckRes {
  ok: number;
  message?: string;
}

// 폼 데이터를 FormData 타입으로 변환하는 함수
function convertToFormData(data: SignupFormValues): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'attach') {
      if (value && value.length > 0) {
        formData.append('attach', value[0]);
      }
    } else {
      formData.append(key, value as string);
    }
  });
  return formData;
}

// react-hook-form으로 폼 상태 및 메서드 생성, onChange 모드로 유효성 검사
export default function SignupForm() {
  const router = useRouter();
  const methods = useForm<SignupFormValues>({ mode: 'onChange' });
  const {
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState<AgreementMap>({
    all: false,
    age: false,
    tos: false,
    privacy: false,
    thirdParty: false,
    optionalPrivacy: false,
    email: false,
  });

  const [showAgreementError, setShowAgreementError] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [emailCheckMessage, setEmailCheckMessage] = useState<string | null>(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  /**
   * 회원가입 폼 제출 시 실행되는 함수
   * @param data 폼 입력값 전체
   */
  const onSubmit: SubmitHandler<SignupFormValues> = async data => {
    setFormMessage(null);
    setEmailCheckMessage(null);

    // 필수 약관 항목 체크 여부 확인
    const requiredChecked = agreements.age && agreements.tos && agreements.privacy;
    if (!requiredChecked) {
      setShowAgreementError(true);
      return;
    }
    setShowAgreementError(false);

    if (!isEmailChecked) {
      setError('email', { message: '이메일 중복확인을 해주세요.' });
      const el = document.getElementById('email');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const formData = convertToFormData({ ...data, type: 'user', receiveEmail: agreements.email });

    try {
      // createUser API 호출 (서버에 회원가입 요청)
      const result = await createUser(null, formData);

      if (result.ok) {
        toast.success('회원 가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => router.replace('/login'), 1500);
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, error]) => {
          setError(field as keyof SignupFormValues, { message: error?.msg });
        });
      } else {
        toast.error(result.message || '회원가입에 실패했습니다.');
      }
    } catch {
      toast.error('일시적인 네트워크 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  /**
   * 폼 유효성 검사 실패 시 실행
   * 첫 번째 에러 필드로 포커스 및 스크롤 이동
   */
  const onError = (errors: FieldErrors<SignupFormValues>) => {
    if (errors.email) {
      const el = document.getElementById('email');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const firstErrorKey = Object.keys(errors)[0] as keyof SignupFormValues;
    const el = document.getElementById(firstErrorKey);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  /**
   * 이메일 중복 확인 함수
   * - 이메일 형식 체크
   * - API 요청으로 중복 여부 확인
   * - 결과에 따라 메시지 및 에러 상태 처리
   */
  const handleCheckEmail = async () => {
    const email = watch('email');
    setEmailCheckMessage(null);
    setIsEmailChecked(false);

    if (!email || !email.includes('@')) {
      setError('email', { message: '이메일 형식이 올바르지 않습니다.' });
      return;
    }

    try {
      const res = await axios.get<ApiEmailCheckRes>(`${process.env.NEXT_PUBLIC_API_URL}/users/email`, {
        params: { email },
        headers: { 'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || '' },
        validateStatus: status => status >= 200 && status < 500,
      });

      if (res.data.ok) {
        clearErrors('email');
        setEmailCheckMessage('사용 가능한 이메일입니다.');
        setIsEmailChecked(true);
      } else {
        setError('email', { message: res.data.message ?? '이미 등록된 이메일입니다.' });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error 응답:', error.response);
        if (error.response) {
          console.log('에러 상태:', error.response.status);
          console.log('에러 데이터:', error.response.data);
          setError('email', { message: error.response.data?.message ?? '이메일 중복 확인 중 오류가 발생했습니다.' });
        } else {
          setError('email', { message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도하세요.' });
        }
      } else {
        console.error('알 수 없는 에러:', error);
        setError('email', { message: '알 수 없는 오류가 발생했습니다.' });
      }
    }
  };

  // 상단으로 올라가기
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="flex flex-col flex-nowrap gap-4">
          {formMessage && <p className="mb-4 text-center text-sm text-red-500">{formMessage}</p>}

          <EmailField onCheck={handleCheckEmail} message={emailCheckMessage} />
          <PasswordField />
          <PasswordConfirmField />
          <NameField />
          <BirthdayField />
          <PhoneField />
          <ProfileImageField />
          <AgreementSection agreements={agreements} setAgreements={setAgreements} showError={showAgreementError} />

          <div className="flex justify-center items-center">
            <button type="submit" disabled={isSubmitting} className="p-4 w-full bg-secondary-green text-white rounded-xl mt-4 cursor-pointer">
              가입하기
            </button>
          </div>
        </form>
      </FormProvider>
      <aside className="hidden sm:block">
        <div className="absolute bottom-0 right-0 cursor-pointer flex flex-col flex-nowrap items-center" onClick={scrollToTop}>
          <div className="sm:w-32 sm:h-32 lg:w-48 lg:h-48">
            <Image src="/kitty-color.png" title="페이지 상단으로 이동" alt="헬로키티" width={600} height={600}></Image>
          </div>
        </div>
      </aside>
    </>
  );
}
