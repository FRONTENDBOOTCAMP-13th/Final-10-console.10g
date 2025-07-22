import { Metadata } from 'next';
import SignupForm from './SignupForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `회원가입 - 도토리섬`,
    description: `회원 가입 후 도토리섬의 모든 서비스를 이용하세요.`,
    openGraph: {
      title: `회원가입 - 도토리섬`,
      description: `회원 가입 후 도토리섬의 모든 서비스를 이용하세요.`,
      url: '/signup',
      images: [
        {
          url: '/logo.png',
        },
      ],
    },
  };
}

export default function SignupPage() {
  return (
    <>
      <main className="min-h-screen flex-grow flex items-center justify-center bg-background px-4 py-16">
        <div className="p-12 rounded-lg w-full max-w-[600px] bg-white">
          <h2 className="text-xl sm:text-2xl  font-bold mb-10 mt-8 ">회원가입</h2>
          <SignupForm />
        </div>
      </main>
    </>
  );
}
