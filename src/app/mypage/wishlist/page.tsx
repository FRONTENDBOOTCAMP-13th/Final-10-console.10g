'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { getLikedProducts } from '@/utils/getProducts';
import ProductCard from './ProductCard';
import type { Product } from '@/types/Product';
import Loading from '@/app/loading';

interface LikedProduct extends Product {
  bookmarkId: number;
}

export default function WishList() {
  const user = useLoginStore(state => state.user);
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    if (!user?.token?.accessToken) return;

    const fetchLiked = async () => {
      setLoading(true);
      try {
        const res = await getLikedProducts(user.token.accessToken);
        const products = Object.values(res)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

        setLikedProducts(products);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user]);

  const sortedProducts = [...likedProducts].sort((a, b) => {
    if (sortOption === 'priceLow') return a.price - b.price;
    if (sortOption === 'priceHigh') return b.price - a.price;
    if (sortOption === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
      <div className="mb-2 sm:mb-4 lg:mb-4 flex justify-between items-center">
        <h2 className="font-bold text-base sm:text-lg lg:text-xl">관심 상품</h2>
        <select className="px-1 py-1 rounded text-xs  sm:text-sm lg:text-base" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="priceLow">가격 낮은순</option>
          <option value="priceHigh">가격 높은순</option>
          <option value="date">담은 날짜순</option>
        </select>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} bookmarkId={product.bookmarkId} />
          ))}
        </ul>
      )}
    </div>
  );
}
