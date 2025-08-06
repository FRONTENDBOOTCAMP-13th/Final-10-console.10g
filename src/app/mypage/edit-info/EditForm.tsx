'use client';

import { EditFormValues, User, UserInfo } from '@/types';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import PasswordConfirmField from './PasswordConfirmField';
import NameField from './NameField';
import PhoneField from './PhoneField';
import ReceiveEmailField from './ReceiveEmailField';
import { useEffect, useState } from 'react';
import { getUserById, getUsersEmail } from '@/utils/getUsers';
import { useLoginStore } from '@/stores/loginStore';
import NotFound from '@/app/not-found';
import Loading from '@/app/loading';
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { patchUserInfo } from '@/data/actions/patchUserInfo';
import { useRouter } from 'next/navigation';
import BirthdayField from './BirthdayField';
import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function EditForm() {
  const user = useLoginStore(state => state.user);
  const logout = useLoginStore(state => state.logout);
  const fetchUser = useUserStore(state => state.fetchUser);
  const setUserId = useUserStore(state => state.setId);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [emailCheckMessage, setEmailCheckMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
    const fetchUserData = async () => {
      if (!user) return;
      const userRes = await getUserById(user._id);
      if (userRes.ok) {
        setUserInfo(userRes.item);

        setLoading(false);
      } else {
        setLoading(false);
        return <NotFound />;
      }
    };

    fetchUserData();
  }, [user]);

  const methods = useForm<EditFormValues>({
    mode: 'onChange',
  });
  const {
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  /**
   * 회원 정보 수정 시 실행되는 함수
   * @param data 폼 입력값 전체
   */
  const onSubmit: SubmitHandler<EditFormValues> = async data => {
    setFormMessage(null);
    setEmailCheckMessage(null);

    if (!user) return;

    const newData: UserInfo = {
      email: data.email,
      name: data.name,
      password: data.password,
      phone: data.phone1 + data.phone2 + data.phone3,
      birthday: data.birthday,
      extra: {
        receiveEmail: data.receiveEmail,
      },
    };

    try {
      const result = await patchUserInfo(user._id, user.token.accessToken, { ...newData });


      if (result.ok) {
        toast.success('회원 정보 수정이 완료되었습니다.');
        setUserId(user._id);
        await fetchUser();
        toast('보안을 위해 다시 로그인해주세요.');
        logout();
        setTimeout(() => router.replace('/'), 1500);
      } else {
        // setError();
        toast.error(result.message || '회원 정보 수정에 실패했습니다.');
      }
    } catch {
      toast.error('일시적인 네트워크 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  /**
   * 폼 유효성 검사 실패 시 실행
   * 첫 번째 에러 필드로 포커스 및 스크롤 이동
   */
  const onError = (errors: FieldErrors<EditFormValues>) => {
    if (errors.email) {
      const el = document.getElementById('email');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const firstErrorKey = Object.keys(errors)[0] as keyof EditFormValues;
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
    setEmailCheckMessage('');

    if (!email || !email.includes('@')) {
      setEmailCheckMessage('이메일 형식이 올바르지 않습니다.');
      return;
    }

    try {
      const res = await getUsersEmail(email);


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
      {loading && <Loading />}
      {!loading && userInfo && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col flex-nowrap justify-center sm:bg-background rounded-4xl sm:border border-primary p-4 sm:p-8 lg:p-16">
            <Image src="/login-logo.webp" alt="도토리섬 회원가입" width={100} height={100} className="mb-8 sm:mb-12" />

            {formMessage && <p className="mb-4 text-center text-sm text-red-500">{formMessage}</p>}

            <div className="flex flex-col flex-nowrap gap-4">
              <EmailField userInfo={userInfo} onCheck={handleCheckEmail} message={emailCheckMessage} />
              <PasswordField />
              <PasswordConfirmField />
              <NameField userInfo={userInfo} />
              <BirthdayField userInfo={userInfo} />
              <PhoneField userInfo={userInfo} />
              <ReceiveEmailField userInfo={userInfo} />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full my-8 rounded-2xl p-4 bg-primary text-white cursor-pointer">
              회원 정보 수정
            </button>
          </form>
        </FormProvider>
      )}
    </>
  );
}
