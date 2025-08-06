'use client';

import { useState } from 'react';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';
import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import { addBookmark } from '@/data/actions/addBookmark';
import { useLoginStore } from '@/stores/loginStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, bookmarkId: initialBookmarkId }: { product: Product; bookmarkId: number }) {
  const router = useRouter();
  const user = useLoginStore(state => state.user);
  const thumbnail = product.mainImages[0].path;
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState(initialBookmarkId);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user?.token?.accessToken) {
      toast.error('로그인이 필요합니다!');
      return;
    }

    try {
      if (isLiked) {
        setIsLiked(false);
        await deleteBookmark(bookmarkId, user.token.accessToken);
        setBookmarkId(0);
      } else {
        const res = await addBookmark(Number(product._id), 'product', user.token.accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패', error);
      setIsLiked(!isLiked);
    }
  };

  return (
    <li className="overflow-hidden cursor-pointer rounded shadow hover:shadow-lg relative" onClick={() => router.push(`/products/${product._id}`)}>
      <div>
        <div className="relative w-full aspect-square">
          <Image src={thumbnail} alt={product.name} fill className="object-cover" unoptimized />
          <button type="button" className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform" onClick={handleLikeToggle}>
            {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}
          </button>
        </div>
        <div className="p-2 bg-white">
          <p className="text-xs lg:text-sm text-dark-gray truncate">{product.name}</p>
          <p className="font-bold text-xs sm:text-sm lg:text-base">{product.price.toLocaleString()}원</p>
        </div>
      </div>
    </li>
  );
}
