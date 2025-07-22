// 문구 페이지
'use client';

import { STATIONERY_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../CategoryPage';

export default function CategoryStationery() {
  const detailArray = STATIONERY_CATEGORIES.map((name, index) => ({
    name,
    address: `/stationery/${(index + 1).toString().padStart(2, '0')}`,
  }));
  return <CategoryPage category="stationery" title="문구" detailArray={detailArray} />;
}
