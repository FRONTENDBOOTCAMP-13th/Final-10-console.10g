'use client';

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API || ''; // 카카오 REST API Key
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '';

export default function KakaoLoginButton() {
  const handleClick = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button onClick={handleClick} className="bg-[#FEE500] text-black p-4 rounded-xl w-full mt-4">
      카카오로 로그인
    </button>
  );
}
