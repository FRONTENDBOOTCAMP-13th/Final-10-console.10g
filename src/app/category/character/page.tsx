// 캐릭터 페이지
'use client';

import { CHARACTER_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../CategoryPage';

export default function CategoryCharacter() {
  const detailArray = CHARACTER_CATEGORIES.map((name, index) => ({
    name,
    address: `/character/${(index + 1).toString().padStart(2, '0')}`,
  }));
  return <CategoryPage category="character" title="캐릭터" detailArray={detailArray} />;
}
