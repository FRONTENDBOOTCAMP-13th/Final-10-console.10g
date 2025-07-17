// hooks/useKakaoScript.ts
import { useEffect } from 'react';

export const useKakaoScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
        console.log('✅ Kakao SDK Initialized');
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};
