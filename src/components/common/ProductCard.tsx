'use client';

import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import Favorite from '../icon/FavoriteIcon';
import FavoriteBorder from '../icon/FavoriteBorderIcon';
import { useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import { addBookmark } from '@/data/actions/addBookmark';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductCard({ product, bookmarkId: initialBookmarkId }: { product: Product; bookmarkId?: number }) {
  const user = useLoginStore(state => state.user);
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState(initialBookmarkId);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user?.token?.accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isLiked) {
        setIsLiked(false);
        await deleteBookmark(bookmarkId!, user.token.accessToken);
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

  // 재고 계산
  const remaining = product.quantity - product.buyQuantity;

  // TODO 각 상품 페이지로 링크 걸기
  return (
    <Link href="/">
      <div className="relative w-full aspect-square">
        <Image src={`${API_URL}/${product.mainImages[0]?.path}`} alt={product.name} fill className="object-cover rounded-md" sizes="(max-width: 640px) 100vw, 238px" />
        <button
          type="button"
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow hover:scale-110 active:scale-95 transition-transform cursor-pointer
              w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center"
          onClick={handleLikeToggle}
        >
          {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}
        </button>
      </div>

      <div className="p-2">
        {/* 재고 상태 배지 */}
        {remaining <= 0 ? <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">SOLD OUT</span> : remaining <= 5 ? <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 whitespace-nowrap inline-block mb-1">{remaining}개 남음</span> : null}

        <p>{product.name}</p>
        <p className="font-semibold">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  );
}
