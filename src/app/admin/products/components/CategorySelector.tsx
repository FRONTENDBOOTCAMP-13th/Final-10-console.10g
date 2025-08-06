'use client';

import { useState, useEffect } from 'react';
import { CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES, CATEGORY_MAP } from '@/constants/categories';

const CATEGORY_DETAIL_MAP: Record<string, string[]> = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
};

const MAIN_CATEGORIES = Object.entries(CATEGORY_MAP).filter(([code]) => ['PC01', 'PC02', 'PC03', 'PC04', 'new', 'popular'].includes(code));

interface CategorySelectorProps {
  initialMain?: string;
  initialSub?: string;
  onChange: (main: string, sub: string) => void;
}

export default function CategorySelector({ initialMain, onChange }: CategorySelectorProps) {
  const [main, setMain] = useState(initialMain || 'PC01');
  const [sub, setSub] = useState('');

  const subCategories = CATEGORY_DETAIL_MAP[main] || [];

  // main 변경 시 서브 카테고리 초기화
  useEffect(() => {
    setMain(initialMain || 'PC01');
  }, [initialMain]);

  useEffect(() => {
    if (subCategories.length > 0) {
      setSub(subCategories[0]);
    } else {
      setSub('');
    }
  }, [main]);

  // main 또는 sub 변경 시 onChange
  useEffect(() => {
    onChange(main, sub);
  }, [main, sub]);

  return (
    <div className="flex gap-3">
      <select value={main} onChange={e => setMain(e.target.value)} className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300">
        {MAIN_CATEGORIES.map(([code, info]) => (
          <option key={code} value={code}>
            {info.label}
          </option>
        ))}
      </select>

      <select value={sub} onChange={e => setSub(e.target.value)} className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300">
        {/* 서브 카테고리가 없으면 기본 선택지 */}
        {subCategories.length === 0 && <option value="">선택 안함</option>}

        {subCategories.map(subCat => (
          <option key={subCat} value={subCat}>
            {subCat}
          </option>
        ))}
      </select>
    </div>
  );
}
