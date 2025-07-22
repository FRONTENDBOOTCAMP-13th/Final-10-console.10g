'use client';

import KakaotalkIcon from '@/components/icon/KakaotalkIcon';
import NaverIcon from '@/components/icon/NaverIcon';
import { LoginResponse } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export default function Login() {
  const router = useRouter();
  const loginStore = useLoginStore();
  const [errorMsg, setErrorMsg] = useState('');
  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 비밀번호 유효성 검사 8~15자리만 검사
  const isValidPassword = (password: string) => {
    return password.length >= 8 && password.length <= 15;
  };

  // TODO 회원이랑 일치하는 로그인 정보가 있는지 확인하기

  // 서버에 로그인 정보 전달!!
  // TODO 로그인 이후 작업 zustand?
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 폼 데이터를 이벤트에서 가져오기
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(email, password);

    // Form을 작성하면 유효성부터 검사하기
    if (!isValidEmail(email) || !isValidPassword(password)) {
      setErrorMsg('아이디 혹은 비밀번호를 확인해주세요.');
      return;
    } else {
      setErrorMsg('');
    }
    // TODO 회원이랑 일치하는 로그인 정보가 있는지 확인하기
    // 확인하고 로그인 하기
    const handleLogin = async () => {
      try {
        const res = await axios.post<LoginResponse>(
          `${API_URL}/users/login`,
          {
            email,
            password,
          },
          {
            headers: {
              'Client-Id': CLIENT_ID,
              'Content-Type': 'application/json',
            },
          },
        );

        const userData = res.data.item;
        loginStore.login({
          _id: userData._id,
          birthday: userData.birthday,
          createdAt: userData.createdAt,
          email: userData.email,
          image: userData.image,
          loginType: userData.loginType,
          name: userData.name,
          notifications: userData.notifications,
          phone: userData.phone,
          token: userData.token,
          type: userData.type,
          updatedAt: userData.updatedAt,
        });

        alert(`${res.data.item.name}님, 환영합니다!`);
        setErrorMsg('');
        router.push('/');
      } catch {
        setErrorMsg('아이디 혹은 비밀번호를 확인해주세요.');
      }
    };

    handleLogin();
  };

  return (
    <>
      <main className="bg-background py-10">
        <section className="sm:bg-white sm:rounded-2xl lg:rounded-3xl text-xs sm:text-sm lg:text-base w-full sm:w-[30rem] lg:w-[40rem] h-full mx-auto px-10 sm:p-10 sm:pb-80 lg:pb-96">
          <Image src="/login-logo.webp" alt="도토리섬 로그인" width={100} height={100}></Image>
          <h2 className="text-xl lg:text-2xl font-bold my-4">로그인</h2>
          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-nowrap gap-4">
            <div className="flex flex-col flex-nowrap gap-2">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" name="email" placeholder="이메일을 입력해주세요." className="p-4 border border-black rounded-xl bg-white" />
            </div>
            <div className="flex flex-col flex-nowrap gap-2">
              <label htmlFor="password">비밀번호</label>
              <input type="password" id="password" name="password" placeholder="비밀번호를 입력해주세요." className="p-4 border border-black rounded-xl bg-white" />
            </div>
            <span className="text-red">{errorMsg}</span>
            <button type="submit" className="p-4 w-full bg-secondary-green text-white rounded-xl mt-4 cursor-pointer">
              로그인
            </button>
          </form>

          <ul className="flex flex-row flex-nowrap justify-center items-center gap-4 p-8">
            <li className="cursor-pointer">아이디 찾기</li>
            <li className="cursor-pointer">비밀번호 찾기</li>
          </ul>

          <button type="button" className="p-4 w-full bg-[#06be34] text-white rounded-xl mt-4 relative flex items-center justify-center text-center cursor-pointer">
            <NaverIcon className="absolute left-4 w-8 h-8" />
            네이버 로그인
          </button>
          <button type="button" className="p-4 w-full bg-[#FFE812]  text-black rounded-xl mt-4 relative flex items-center justify-center text-center cursor-pointer">
            <KakaotalkIcon className="absolute left-4 w-8 h-8" />
            카카오 로그인
          </button>

          <Link href="/signup" className="p-4 block text-center w-full border-2 border-secondary-green text-secondary-green rounded-xl mt-8 lg:mt-12 cursor-pointer">
            회원 가입
          </Link>
        </section>
      </main>
    </>
  );
}
