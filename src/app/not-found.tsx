'use client';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center py-32">
        <Image src="/404-dotori.png" alt="404 도토리 이미지" width={200} height={200} priority />

        <h1 className="mt-10 text-center">
          여긴 도토리섬 주민들도 모르는 곳이에요.
          <br />
          다른 경로를 따라가 볼까요?🐿️
        </h1>
      </main>
    </div>
  );
}
