'use client';

import { User } from '@/types';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import PasswordConfirmField from './PasswordConfirmField';
import NameField from './NameField';
import PhoneField from './PhoneField';
import AddressField from './AddressField';
import ReceiveEmailField from './ReceiveEmail';
import { useEffect, useState } from 'react';
import { getUserById } from '@/utils/getUsers';
import { useLoginStore } from '@/stores/loginStore';
import NotFound from '@/app/not-found';
import Loading from '@/app/loading';
import { FormProvider, useForm } from 'react-hook-form';
import { SignupFormValues } from '@/app/(user)/signup/SignupForm';

export default function EditForm() {
  const user = useLoginStore(state => state.user);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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

  const methods = useForm<SignupFormValues>({ mode: 'onChange' });

  const handleSubmit = () => {};

  return (
    <>
      {loading && <Loading />}
      {!loading && userInfo && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="grid grid-cols-[7rem_auto] lg:grid-cols-[9.375rem_auto]">
            <EmailField userInfo={userInfo} />

            <PasswordField userInfo={userInfo} />

            <PasswordConfirmField userInfo={userInfo} />

            <NameField userInfo={userInfo} />

            <PhoneField userInfo={userInfo} />

            <AddressField userInfo={userInfo} />

            <ReceiveEmailField userInfo={userInfo} />
          </form>

          <button type="button" className="text-sm p-2 bg-white border border-gray text-gray m-4 cursor-pointer">
            회원 탈퇴
          </button>
          <div className="flex flex-row flex-nowrap justify-center items-center gap-8 p-4">
            <button type="submit" className="p-4  bg-gray text-white cursor-pointer">
              회원 정보 수정
            </button>
            <button type="button" className="p-4 bg-white border border-gray text-gray cursor-pointer">
              취소
            </button>
          </div>
        </FormProvider>
      )}
    </>
  );
}
