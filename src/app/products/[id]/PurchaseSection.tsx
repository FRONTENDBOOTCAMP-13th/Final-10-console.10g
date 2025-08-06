'use client';

import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { CATEGORY_MAP, CHARACTER_CATEGORIES, STATIONERY_CATEGORIES, LIVING_CATEGORIES } from '@/constants/categories';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { useRemainingStock } from '@/hooks/useRemainingStock';
import useQuantityHandlers from '@/hooks/useQuantityHandlers';
import { useLoginStore } from '@/stores/loginStore';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';
import ShareIcon from '@/components/icon/ShareIcon';
import { useRouter, usePathname } from 'next/navigation';
import type { Review } from '@/types/Review';
import { addToCart } from '@/data/actions/addToCart';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';
import { getCarts } from '@/utils/getCarts';
import { getFullImageUrl } from '@/utils/getFullImageUrl';
import { getBookmarkStatus } from '@/utils/getBookmarkStatus';
import toast from 'react-hot-toast';

interface PurchaseSectionProps {
  product: Product & { myBookmarkId?: number };
  reviews: Review[];
  loadingReviews: boolean;
}

// 카테고리별 서브카테고리 매핑
const CATEGORY_MAPPINGS = {
  PC01: CHARACTER_CATEGORIES,
  PC03: STATIONERY_CATEGORIES,
  PC04: LIVING_CATEGORIES,
} as const;

// 서브카테고리 정보를 가져오는 함수
function getSubCategoryInfo(categoryCode: string, smallCategoryCode: string, bigCategory: { label: string; href: string }) {
  const categories = CATEGORY_MAPPINGS[categoryCode as keyof typeof CATEGORY_MAPPINGS];

  if (!categories) {
    return { label: '', href: '' };
  }

  let index = -1;

  if (smallCategoryCode.startsWith(categoryCode)) {
    const codeNumber = smallCategoryCode.slice(categoryCode.length);
    index = parseInt(codeNumber) - 1;
  } else if (/^\d+$/.test(smallCategoryCode)) {
    index = parseInt(smallCategoryCode) - 1;
  } else {
    index = categories.findIndex(cat => cat === smallCategoryCode);
  }

  if (index >= 0 && index < categories.length) {
    return {
      label: categories[index],
      href: `${bigCategory.href}/${String(index + 1).padStart(2, '0')}`,
    };
  }

  return { label: '', href: '' };
}

// Breadcrumb 아이템 생성 함수
function getBreadcrumbItems(product: Product) {
  // 신상품/인기상품 처리
  if (product.extra?.isNew) {
    return [
      { label: '홈', href: '/' },
      { label: '신상품', href: '/category/new' },
      { label: product.name, href: `/products/${product._id}` },
    ];
  }

  if (product.extra?.isBest) {
    return [
      { label: '홈', href: '/' },
      { label: '인기상품', href: '/category/popular' },
      { label: product.name, href: `/products/${product._id}` },
    ];
  }

  // 일반 카테고리 처리
  const categoryCode = product.extra?.category?.[0] ?? '';
  const smallCategoryCode = product.extra?.category?.[1] ?? '';
  const bigCategory = CATEGORY_MAP[categoryCode] ?? { label: '카테고리', href: '#' };
  const subCategory = getSubCategoryInfo(categoryCode, smallCategoryCode, bigCategory);

  return [{ label: '홈', href: '/' }, { label: bigCategory.label, href: bigCategory.href }, ...(subCategory.label ? [{ label: subCategory.label, href: subCategory.href }] : []), { label: product.name, href: `/products/${product._id}` }];
}

export default function PurchaseSection({ product, reviews, loadingReviews }: PurchaseSectionProps) {
  // 로그인 사용자 정보 및 토큰
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;
  const isAdmin = useLoginStore(state => state.isAdmin);

  // 초기 북마크 아이디
  const [initialBookmarkId, setInitialBookmarkId] = useState<number | undefined>(product.myBookmarkId);
  useEffect(() => {
    if (!accessToken) return;

    async function fetchBookmark() {
      const productId = String(product._id);
      const res = await getBookmarkStatus(productId, accessToken!);
      if (res.ok && res.item) {
        setInitialBookmarkId(res.item._id);
      } else {
        setInitialBookmarkId(undefined);
      }
    }

    fetchBookmark();
  }, [product._id, accessToken]);

  // 좋아요 토글 훅
  const { isLiked, toggle } = useToggleBookmark(initialBookmarkId, Number(product._id), accessToken);

  // 남은 재고 계산 훅
  const remainingStock = useRemainingStock(product.quantity, product.buyQuantity);

  // 수량 선택 훅
  const { quantity, increaseQuantity, decreaseQuantity } = useQuantityHandlers();

  // 품절 여부
  const isSoldOut = remainingStock <= 0;

  // 총 가격 계산
  const totalPrice = product.price * quantity;

  // Breadcrumb 아이템 생성
  const breadcrumbItems = getBreadcrumbItems(product);

  // 배송비 포함 가격 계산
  const shippingFeeToUse = product.shippingFees;
  const finalPrice = totalPrice + shippingFeeToUse;

  // 공유하기 함수
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `이 상품을 공유합니다: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('주소 복사에 실패했습니다. 수동으로 복사해 주세요.');
      }
    }
  };

  // 구매하기 버튼 이동
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isSoldOut) {
      toast('구매 페이지로 이동합니다.');
      router.push(`/order?productId=${product._id}&qty=${quantity}`);
    }
  };

  // 관리자용: 수정하기 버튼 이동
  const handleEditClick = () => {
    router.push(`/admin/products/edit/${product._id}`);
  };

  // 장바구니 버튼
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isSoldOut) {
      toast.error('품절된 상품은 장바구니에 담을 수 없습니다.');
      return;
    }

    try {
      const cartRes = await getCarts(accessToken!);

      //현재 장바구니 개수를 배지 스토어에 반영 (초기 세팅)
      useCartBadgeStore.setState({ count: cartRes.item.length });

      const alreadyExists = cartRes.item.some(item => item.product._id === product._id);

      await addToCart(Number(product._id), quantity, accessToken!);

      // 새로운 상품일 때만 카운트 +1
      if (!alreadyExists) {
        useCartBadgeStore.setState(state => ({ count: state.count + 1 }));
      }
      toast.success('장바구니에 상품이 추가되었습니다!');
    } catch {
      toast.error('장바구니 추가에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const imageArray = product.mainImages?.filter(img => !!img.path) || [];
  const mainImageUrl = imageArray[0] ? getFullImageUrl(imageArray[0].path) : null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full p-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="sm:w-1/2 relative">
            {/* 이미지 영역 */}
            <div className="relative">
              <div className="relative w-full pb-[100%]">
                {mainImageUrl ? (
                  <Image src={mainImageUrl} alt={product.name} fill className="object-contain w-full h-full" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}
              </div>
            </div>
            {/* 배송 정보 */}
            <div className="text-sm text-gray-500 mt-2">
              <p>배송비: {product.shippingFees.toLocaleString()}원</p>
            </div>
          </div>

          {/* 오른쪽 - 상품 정보 */}
          <div className="sm:w-1/2 space-y-2">
            <div className="border-t-2 border-primary" />

            {/* 제품명 */}
            <h1 className="text-lg font-bold p-2">{product.name}</h1>

            <div className="border-t border-primary mb-4" />

            <div className="p-2 mb-4">
              {/* 가격 */}
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-500">판매가</span>
                <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
              </div>

              {/* 평점 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">사용후기</span>
                <div className="flex items-center">
                  <span className="mb-1 text-red-500">★</span>
                  <span className="text-sm ml-1">{loadingReviews ? '로딩중...' : reviews.length > 0 ? `${(reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / reviews.length).toFixed(1)} 리뷰 ${reviews.length}개` : '리뷰 없음'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-primary " />

            <div className="flex items-center justify-between py-4 p-2 gap-2">
              <span className="text-sm truncate">{product.name}</span>
              <div className="flex items-center gap-4">
                {/* 수량 조절 버튼 */}
                <div className="flex items-center border overflow-hidden">
                  <button onClick={decreaseQuantity} className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button onClick={increaseQuantity} className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled={quantity >= remainingStock}>
                    +
                  </button>
                </div>
                {/* 총 상품금액 */}
                <span className="text-sm font-semibold min-w-[60px] text-right">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <div className="border-t border-primary mb-4" />

            {/* 총 결제금액 */}
            <div className="text-sm font-medium text-gray-700 my-6 text-right">
              total price <span className="text-lg font-bold">{finalPrice.toLocaleString()}원</span> ({quantity}개)
            </div>

            {/* 구매 버튼 및 관리자 수정 버튼 */}
            {!isAdmin ? (
              <div className="space-y-3">
                <button onClick={handleClick} disabled={isSoldOut} className={`w-full py-4 rounded-md font-medium transition disabled:opacity-50 ${isSoldOut ? 'bg-gray-300 cursor-not-allowed pointer-events-none text-black' : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'}`}>
                  {isSoldOut ? '품절' : '바로 구매하기'}
                </button>

                <div className="flex gap-3">
                  {/* 장바구니 */}
                  <button onClick={handleAddToCart} className="cursor-pointer flex-1 border border-primary text-primary py-3 rounded-md font-medium">
                    장바구니
                  </button>

                  {/* 관심상품 등록 버튼 */}
                  <button type="button" onClick={toggle} className="cursor-pointer w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition" aria-label={isLiked ? '북마크 취소' : '북마크 추가'}>
                    {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 text-red-500' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 text-gray-400' }} />}
                  </button>

                  {/* 공유하기 버튼 */}
                  <button className="cursor-pointer w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition relative" aria-label="공유하기" onClick={handleShare}>
                    <ShareIcon className="w-5 h-5 text-gray-500" />
                    {copied && <span className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-3 py-1 z-50">링크가 복사되었습니다.</span>}
                  </button>
                </div>
              </div>
            ) : (
              // 관리자 전용 수정 버튼
              <button onClick={handleEditClick} className="py-4 w-full cursor-pointer text-white bg-secondary-green rounded-md hover:bg-[#6c8c53cc] transition whitespace-nowrap">
                수정하기
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
