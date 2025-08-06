'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Pagination from '@/components/common/Pagination';
import ReviewModal from '@/components/common/ReviewModal';
import ReviewImageModal from './ReviewImageModal';
import { usePathname, useRouter } from 'next/navigation';
import { getReviews, getMyReviews } from '@/utils/getReviews';
import { getOrders } from '@/utils/getOrders';
import { deleteReview } from '@/data/actions/deleteReview';
import type { Order } from '@/types/Order';
import type { Product } from '@/types/Product';
import type { UserImage } from '@/types/User';
import { useLoginStore } from '@/stores/loginStore';

import ReviewFilterTabs from './ReviewFilterTabs';
import ReviewList from './ReviewList';
import { ReviewWriteButton, ReviewToggleButton } from './ReviewWriteButton';
import ReviewSortDropdown, { ReviewSortOption } from './ReviewSortDropdown';
import toast from 'react-hot-toast';

const REVIEWS_PER_PAGE = 5;

export interface ProductReviewsProps {
  productId: string | number;
  productName: string;
  orderId?: string | number;
  orderProducts?: Product[];
}

interface Review {
  _id: number;
  productId: number | string;
  user: {
    _id: number;
    name: string;
    image?: string | UserImage;
  };
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 사용자 정보 및 토큰 가져오기
  const currentUser = useLoginStore(state => state.user);
  const accessToken = currentUser?.token?.accessToken;

  // 상태 관리
  const [sortOption, setSortOption] = useState<ReviewSortOption>('latest');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyReviewsOnly, setShowMyReviewsOnly] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'photos' | 'normal'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<number>>(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalReviewImages, setModalReviewImages] = useState<string[]>([]);
  const [modalCurrentImageIdx, setModalCurrentImageIdx] = useState(0);
  const [reviewToEdit, setReviewToEdit] = useState<{
    reviewId: number;
    rating: number;
    content: string;
    images?: string[];
  } | null>(null);

  // 주문 관련 상태
  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [, setReviewCount] = useState(0);
  const [hasOrderedProduct, setHasOrderedProduct] = useState(false);
  const [orderIdForProduct, setOrderIdForProduct] = useState<string | number | null>(null);

  // 상태 초기화 함수
  const resetOrderAndReviewState = () => {
    setHasOrderedProduct(false);
    setOrderIdForProduct(null);
    setHasWrittenReview(false);
    setOrderCount(0);
    setReviewCount(0);
  };

  // 사용자가 상품을 주문했는지, 작성한 후기가 몇 개인지 확인
  useEffect(() => {
    async function fetchUserOrdersAndReviews() {
      if (!accessToken) {
        resetOrderAndReviewState();
        return;
      }
      try {
        const ordersRes = await getOrders(accessToken);
        let hasOrdered = false;
        let orderId = null;
        let orderCountLocal = 0;

        if (ordersRes.ok && Array.isArray(ordersRes.item)) {
          const orders: Order[] = ordersRes.item;
          // 해당 상품을 포함하는 주문만 필터링
          const ordersWithProduct = orders.filter(order => order.products.some(p => String(p._id) === String(productId)));

          if (ordersWithProduct.length > 0) {
            hasOrdered = true;
            orderId = ordersWithProduct[0]._id;
            orderCountLocal = ordersWithProduct.length;
            setOrderCount(orderCountLocal);
          }
        }

        setHasOrderedProduct(hasOrdered);
        setOrderIdForProduct(orderId);

        if (hasOrdered) {
          const myReviews = await getMyReviews(accessToken);
          const reviewsForThisProduct = myReviews.filter(review => String(review.productId) === String(productId));
          const currentReviewCount = reviewsForThisProduct.length;
          setReviewCount(currentReviewCount);

          setHasWrittenReview(currentReviewCount >= orderCountLocal);
        } else {
          resetOrderAndReviewState();
        }
      } catch {
        resetOrderAndReviewState();
      }
    }
    fetchUserOrdersAndReviews();
  }, [accessToken, productId]);

  // 후기 불러오기 함수
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      if (showMyReviewsOnly) {
        if (!accessToken) {
          setReviews([]);
          setLoading(false);
          return;
        }
        const myReviews = await getMyReviews(accessToken);
        const filtered = myReviews.filter(r => String(r.productId) === String(productId));
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(filtered);
      } else {
        const reviewsData = await getReviews(productId);
        reviewsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(reviewsData);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, showMyReviewsOnly, accessToken]);

  // 후기 불러오기
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 후기 내용 확장/축소 상태 토글 함수
  const toggleExpand = (reviewId: number) => {
    setExpandedReviewIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) newSet.delete(reviewId);
      else newSet.add(reviewId);
      return newSet;
    });
  };

  // 탭별 후기 개수 정보
  const tabInfo = useMemo(
    () =>
      [
        { key: 'all', label: '전체', count: reviews.length },
        { key: 'photos', label: '사진 후기', count: reviews.filter(r => r.images && r.images.length > 0).length },
        { key: 'normal', label: '일반', count: reviews.filter(r => !r.images || r.images.length === 0).length },
      ] as const,
    [reviews],
  );

  // 탭 필터에 따라 후기 필터링
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filterTab === 'photos') return review.images && review.images.length > 0;
      if (filterTab === 'normal') return !review.images || review.images.length === 0;
      return true;
    });
  }, [filterTab, reviews]);

  // 정렬 적용
  const sortedFilteredReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    switch (sortOption) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'ratingHigh':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLow':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'latest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [filteredReviews, sortOption]);

  // 페이징 계산 및 현재 페이지 후기 목록
  const totalPages = Math.ceil(sortedFilteredReviews.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = sortedFilteredReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);

  // 후기 작성 가능 여부
  const canWriteReview = hasOrderedProduct && !hasWrittenReview;

  // 수정 모드 활성화 함수
  const openEditModal = (review: { reviewId: number; rating: number; content: string; images?: string[] }) => {
    setReviewToEdit(review);
    setIsModalOpen(true);
  };

  // 후기 삭제 함수
  const handleDeleteReview = async (reviewId: number) => {
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(reviewId, accessToken);
      toast.success('후기가 삭제되었습니다.');

      // 삭제 후 상태 업데이트
      await fetchReviews();

      // 리뷰 개수 다시 계산 (삭제된 리뷰가 내 리뷰라면)
      if (hasOrderedProduct) {
        const myReviews = await getMyReviews(accessToken);
        const reviewsForThisProduct = myReviews.filter(review => String(review.productId) === String(productId));
        const currentReviewCount = reviewsForThisProduct.length;
        setReviewCount(currentReviewCount);
        setHasWrittenReview(currentReviewCount >= orderCount);
      }
    } catch (error) {
      console.error('후기 삭제 중 오류:', error);
      toast.error('후기 삭제에 실패했습니다.');
    }
  };

  // 후기 작성 버튼 텍스트 및 툴팁
  const getButtonText = () => {
    if (!hasOrderedProduct) return '후기 남기기';
    return hasWrittenReview ? '후기 작성 완료' : '후기 남기기';
  };

  const getButtonTooltip = () => {
    if (!hasOrderedProduct) return '구매한 상품에 대해서만 후기를 작성할 수 있습니다.';
    if (hasWrittenReview) return '주문하신 모든 건에 대해 후기를 작성하셨습니다.';
    return undefined;
  };

  // 이미지 모달 열기/닫기 및 이미지 넘기기 함수
  const openImageModal = (images: string[], index: number) => {
    setModalReviewImages(images);
    setModalCurrentImageIdx(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalReviewImages([]);
    setModalCurrentImageIdx(0);
  };

  const showPrevImage = () => {
    setModalCurrentImageIdx(prev => (prev === 0 ? modalReviewImages.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setModalCurrentImageIdx(prev => (prev === modalReviewImages.length - 1 ? 0 : prev + 1));
  };

  // 후기 작성/수정 성공 콜백
  const handleReviewSubmitSuccess = async () => {
    setCurrentPage(1);
    await fetchReviews();

    // 작성/수정된 후기가 내 후기라면 상태 업데이트
    if (hasOrderedProduct && accessToken) {
      const myReviews = await getMyReviews(accessToken);
      const reviewsForThisProduct = myReviews.filter(review => String(review.productId) === String(productId));
      const currentReviewCount = reviewsForThisProduct.length;
      setReviewCount(currentReviewCount);
      setHasWrittenReview(currentReviewCount >= orderCount);
    }
  };

  return (
    <section className="max-w-full px-6 py-8 bg-background">
      <h2 className="text-lg font-bold mb-2">상품 후기</h2>

      {/* 후기 필터 탭 (전체, 사진, 일반) */}
      {reviews.length > 0 && <ReviewFilterTabs tabInfo={tabInfo} filterTab={filterTab} setFilterTab={setFilterTab} setCurrentPage={setCurrentPage} />}

      {/* 후기 정렬 드롭다운 */}
      {filteredReviews.length > 0 && (
        <div className="flex justify-end mb-4">
          <ReviewSortDropdown selected={sortOption} onChange={setSortOption} />
        </div>
      )}

      {/* 후기 목록 */}
      <div className="min-h-[430px] flex flex-col justify-center">
        <ReviewList reviews={currentReviews} loading={loading} currentUser={currentUser} expandedReviewIds={expandedReviewIds} toggleExpand={toggleExpand} openImageModal={openImageModal} onEditClick={openEditModal} onDeleteClick={handleDeleteReview} showMyReviewsOnly={showMyReviewsOnly} />
      </div>

      {/* 페이지네이션 */}
      {sortedFilteredReviews.length > REVIEWS_PER_PAGE && (
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={page => setCurrentPage(page)} />
        </div>
      )}

      {/* 후기 작성 및 내 후기 보기 토글 버튼 */}
      <div className="mt-8 flex justify-center gap-4">
        <ReviewWriteButton
          canWriteReview={canWriteReview}
          getButtonText={getButtonText}
          getButtonTooltip={getButtonTooltip}
          onClick={() => {
            if (!canWriteReview) return;
            if (!currentUser) {
              toast.error('후기를 작성하려면 로그인해주세요.');
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setReviewToEdit(null);
            setIsModalOpen(true);
          }}
        />

        <ReviewToggleButton
          showMyReviewsOnly={showMyReviewsOnly}
          onClick={() => {
            setShowMyReviewsOnly(!showMyReviewsOnly);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 후기 작성/수정 모달 */}
      <ReviewModal
        productId={productId}
        productName={productName}
        orderId={orderIdForProduct ?? ''}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReviewToEdit(null);
        }}
        onSubmitSuccess={handleReviewSubmitSuccess}
        reviewToEdit={reviewToEdit ?? undefined}
      />

      {/* 이미지 모달 */}
      <ReviewImageModal images={modalReviewImages} currentIndex={modalCurrentImageIdx} isOpen={isImageModalOpen} onClose={closeImageModal} onPrev={showPrevImage} onNext={showNextImage} />
    </section>
  );
}
