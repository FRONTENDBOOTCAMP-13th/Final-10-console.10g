// 리빙&소품 페이지
'use client';

import { LIVING_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../CategoryPage';

export default function CategoryLivingAccessories() {
  const detailArray = LIVING_CATEGORIES.map((name, index) => ({
    name,
    address: `/living-accessories/${(index + 1).toString().padStart(2, '0')}`,
  }));
  return <CategoryPage category="living-accessories" title="리빙&소품" detailArray={detailArray} />;
}
