'use client';

import { useState, useEffect } from 'react';
import Loading from './loading';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 10초 후 로딩 끝
    const timer = setTimeout(() => setIsLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <p>로딩 테스트 페이지</p>
      </main>
    </div>
  );
}
