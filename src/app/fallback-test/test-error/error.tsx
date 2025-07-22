'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-cente py-32">
        <Image src="/error-dotori.png" alt="에러 도토리 이미지" width={200} height={200} priority />
        <h1 className="mt-10 text-center">
          앗, 도토리가 길을 잃었어요🍂
          <br />
          잠시 후 다시 시도해 주세요!
        </h1>
      </main>
    </div>
  );
}
