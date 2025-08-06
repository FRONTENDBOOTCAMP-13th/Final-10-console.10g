'use client';

import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleClose = () => {
    if (doNotShowToday) {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      localStorage.setItem('doNotShowUntil', tomorrow.toISOString());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 min-h-screen" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="relative bg-white p-8 sm:p-10 rounded-lg shadow-lg max-w-[90vw] sm:max-w-md text-center">
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" aria-label="닫기">
          &times;
        </button>

        {/* 타이틀 */}
        <h2 className="sm:text-xl font-bold mb-4 text-center text-primary-dark">🎉 도토리섬에 오신 걸 환영합니다 🎉</h2>

        {/* 설명 */}
        <p className="mb-6 text-primary-dark text-sm leading-relaxed">
          이 프로젝트는 <span className="font-semibold text-secondary-green">멋쟁이사자처럼 FrontEnd BootCamp 13기</span> 의 Final 프로젝트로, 10조 <span className="italic">console.10g</span>가 제작했습니다.
          <br />본 서비스는 <span className="font-semibold">비상업적 목적</span>으로 만들어졌으며, 실제 구매는 불가능한 점 양해 부탁드립니다.
        </p>

        {/* 하루동안 안보기 체크박스 */}
        <label className="inline-flex items-center text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={doNotShowToday} onChange={e => setDoNotShowToday(e.target.checked)} className="mr-2" />
          하루 동안 이 창을 보지 않기
        </label>
      </div>
    </div>
  );
}
