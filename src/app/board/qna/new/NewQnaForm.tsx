'use client';

import Link from 'next/link';
import { useActionState, useState, useEffect } from 'react';
import ProductSearchModal from './ProductSearchModal';
import type { Product } from '@/types/Product';
import Image from 'next/image';
import { useLoginStore } from '@/stores/loginStore';
import { createPost } from '@/data/actions/post';
import { useSearchParams } from 'next/navigation';
import OrderModal from './OrderModal';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
//문의 종류 배열
const QNA_TYPES = [
  { type: '상품 문의', value: 'product' },
  { type: '배송 문의', value: 'delivery' },
  { type: '주문/결제', value: 'order' },
  { type: '반품/교환', value: 'return' },
  { type: '환불 문의', value: 'refund' },
  { type: '재입고 문의', value: 'restock' },
  { type: '기타 문의', value: 'etc' },
];

export default function NewQnaForm({ boardType }: { boardType: string }) {
  const [state, formAction, isLoading] = useActionState(createPost, null);
  const [selectedType, setSelectedType] = useState<string>('product');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const searchParams = useSearchParams();
  const productIdFromQuery = searchParams.get('productId');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productIdFromQuery) {
      async function fetchProduct() {
        try {
          const res = await fetch(`${API_URL}/products/${productIdFromQuery}`, {
            headers: {
              'client-id': process.env.NEXT_PUBLIC_CLIENT_ID || '',
            },
          });
          // console.log('API 호출 응답 상태:', res.status);
          if (res.ok) {
            const data = await res.json();
            setSelectedProduct(data.item);
          } else {
            const errorText = await res.text();
            console.error('API 호출 실패:', res.status, errorText);
          }
        } catch (error) {
          console.error('상품 정보 불러오기 실패', error);
        }
      }
      fetchProduct();
    }
  }, [productIdFromQuery]);
  // 문의 유형 바뀔때 초기화하는 use effect
  useEffect(() => {
    setSelectedProduct(null);
    setSelectedOrderProduct(null);
  }, [selectedType]);

  // 버튼 1줄, 2줄로 나누기
  const firstRow = QNA_TYPES.slice(0, 3);
  const secondRow = QNA_TYPES.slice(3);

  // 선택에 따라 아래쪽 버튼 텍스트 활성화를 위한 로직. 경우의 수 수정되면 이 부분 바꿔주면 됨
  let selectLabel = '';
  if (selectedType === 'product') selectLabel = '상품 선택';
  else if (selectedType === 'delivery' || selectedType === 'order' || selectedType === 'return' || selectedType === 'refund') selectLabel = '주문 선택';

  ////검색 후 선택 버튼 누를때 실행될 메서드 props로 전달해줘야함
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(false);
  };
  // 주문 선택할때 실행될 메서드 props로 전달
  const handleOrderSelect = (product: Product) => {
    setSelectedOrderProduct(product);
    setIsOrderModalOpen(false);
  };

  //문의가 상품, 주문일 경우 열 모달 호출 메서드
  const handleProductButtonClick = () => {
    if (selectedType === 'product') {
      setIsModalOpen(true);
    } else if (selectedType === 'delivery' || selectedType === 'order' || selectedType === 'return' || selectedType === 'refund') {
      setIsOrderModalOpen(true);
    }
  };

  const user = useLoginStore(state => state.user);

  return (
    <>
      <form action={formAction}>
        {isLoading && (
          <div className="absolute inset-0 z-10  bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-end">
            {/* 로딩 원(스피너) */}
            <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-white font-semibold text-sm">처리 중...</span>
          </div>
        )}
        {/* 로그인 된 사용자일 경우 서버 액션에 accessToken 전달 */}
        <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
        <input type="hidden" name="type" value={boardType} />
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-2 mb-2">
            {firstRow.map(item => (
              <button
                key={item.value}
                type="button"
                className={`px-4 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors cursor-pointer
                  ${selectedType === item.value ? 'bg-[#A97452] text-white border-[#A97452]' : 'bg-white text-[#A97452] border-[#A97452] hover:bg-[#F5EEE6]'}
                `}
                onClick={() => setSelectedType(item.value)}
              >
                {item.type}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {secondRow.map(item => (
              <button
                key={item.value}
                type="button"
                className={`px-2 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors cursor-pointer
                  ${selectedType === item.value ? 'bg-[#A97452] text-white border-[#A97452]' : 'bg-white text-[#A97452] border-[#A97452] hover:bg-[#F5EEE6]'}
                `}
                onClick={() => setSelectedType(item.value)}
              >
                {item.type}
              </button>
            ))}
          </div>
        </div>
        {/* 실제 서버로 값 전달 */}
        <input type="hidden" name="extra.qnatype" value={selectedType} />
        {/* 상품 문의일 경우 선택된 상품 정보 전달 */}
        {selectedProduct && <input type="hidden" name="extra.productId" value={selectedProduct._id} />}
        {selectedProduct && <input type="hidden" name="extra.productName" value={selectedProduct.name} />}
        {selectedProduct && <input type="hidden" name="extra.imagePath" value={selectedProduct.mainImages[0].path} />}
        {/* 주문 문의일 경우 선택된 주문 정보 전달 */}
        {selectedOrderProduct && (
          <>
            <input type="hidden" name="extra.orderProductId" value={selectedOrderProduct._id} />
            <input type="hidden" name="extra.orderProductName" value={selectedOrderProduct.name} />
            <input type="hidden" name="extra.orderProductImage" value={selectedOrderProduct.image?.path} />
          </>
        )}
        {/* 선택된 유형에 따라 선택 버튼 노출 */}
        {selectLabel && (
          <div className="mb-6 flex justify-center">
            <button type="button" className="w-full max-w-xl flex justify-between items-center px-6 py-3 border-2 rounded-2xl border-[#A97452] text-[#A97452] bg-white text-xs sm:text-sm lg:text-base font-semibold hover:bg-[#F5EEE6] transition-colors cursor-pointer" onClick={handleProductButtonClick}>
              {selectLabel}
              <span className="text-xs sm:text-sm lg:text-base font-semibold">&#x25BC;</span>
            </button>
          </div>
        )}
        {/* 선택된 상품 정보 표시 */}
        {selectedProduct && selectedType === 'product' && (
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-xl p-4 border-2 border-[#A97452] rounded-2xl bg-[#F5EEE6]">
              <div className="flex items-center gap-4">
                {selectedProduct.mainImages && selectedProduct.mainImages.length > 0 ? (
                  <Image src={`${selectedProduct.mainImages[0].path}`} alt={selectedProduct.name} width={100} height={100} unoptimized={true} className="w-20 h-20 object-cover rounded border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center">
                    <span className="text-gray-400 text-xs">이미지 없음</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base mb-1">{selectedProduct.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">가격: {selectedProduct.price?.toLocaleString()}원</div>
                  <div className="text-xs text-gray-500">재고: {selectedProduct.quantity}개</div>
                </div>
                <button type="button" onClick={() => setSelectedProduct(null)} className="text-red-500 hover:text-red-700 font-bold text-lg">
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedOrderProduct && selectedType !== 'product' && (
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-xl p-4 border-2 border-[#A97452] rounded-2xl bg-[#F5EEE6]">
              <div className="flex items-center gap-4">
                {selectedOrderProduct.image?.path ? (
                  <Image src={`${selectedOrderProduct.image.path}`} alt={selectedOrderProduct.name} width={100} height={100} unoptimized className="w-20 h-20 object-cover rounded border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded border flex items-center justify-center">
                    <span className="text-gray-400 text-xs">이미지 없음</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base mb-1">{selectedOrderProduct.name}</div>
                  <div className="text-xs text-gray-500">수량: {selectedOrderProduct.quantity}개</div>
                </div>
                <button type="button" onClick={() => setSelectedOrderProduct(null)} className="text-red-500 hover:text-red-700 font-bold text-lg">
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="my-4">
          <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="title">
            제목
          </label>
          <input id="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md text-xs sm:text-sm lg:text-base-xl border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1  focus:ring-2 focus:ring-[#A97452]" name="title" />
          <p className="ml-2 mt-1 text-sm text-red-500">{state?.ok === 0 && state.errors?.title?.msg}</p>
        </div>
        <div className="my-4">
          <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="content">
            내용
          </label>
          <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1 focus:ring-2 focus:ring-[#A97452] " name="content"></textarea>
          <p className="ml-2 mt-1 text-sm text-red-500">{state?.ok === 0 && state.errors?.content?.msg}</p>
        </div>
        <div className="flex justify-end my-6 gap-2">
          <button type="submit" className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors cursor-pointer" disabled={isLoading}>
            등록
          </button>
          <Link href={`/board/${boardType}`}>
            <button className="px-4 py-2 rounded-xl w-20 sm:w-24 lg:w-28 bg-white text-[#A97452] text-xs sm:text-sm lg:text-base hover:bg-[#F5EEE6] transition-colors border-2 border-[#A97452] cursor-pointer" disabled={isLoading}>
              취소
            </button>
          </Link>
        </div>
      </form>

      {/* 상품 검색 모달 */}
      <ProductSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectProduct={handleProductSelect} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} onSelectOrderProduct={handleOrderSelect} />
    </>
  );
}
