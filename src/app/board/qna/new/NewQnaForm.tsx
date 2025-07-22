'use client';

import { createPost } from '@/actions/post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useActionState, useEffect, useState } from 'react';
import ProductSearchModal from './ProductSearchModal';
import type { Product } from '@/types/Product';
import Image from 'next/image';
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

  // 버튼 1줄, 2줄로 나누기
  const firstRow = QNA_TYPES.slice(0, 3);
  const secondRow = QNA_TYPES.slice(3);

  // 선택에 따라 아래쪽 버튼 텍스트 활성화를 위한 로직. 경우의 수 수정되면 이 부분 바꿔주면 됨
  let selectLabel = '';
  if (selectedType === 'product') selectLabel = '상품 선택';
  else if (selectedType === 'delivery' || selectedType === 'order') selectLabel = '주문 선택';

  ////검색 후 선택 버튼 누를때 실행될 메서드 props로 전달해줘야함
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(false);
  };

  //문의가 상품일 경우 모달 여는 메서드
  const handleProductButtonClick = () => {
    if (selectedType === 'product') {
      setIsModalOpen(true);
    }
  };

  //테스트용
  // console.log(isLoading, state);
  // console.log(`board/${boardType}`);
  //회원쪽 끝나면 작업해봅시다.
  //  const router = useRouter();
  // useEffect(() => {
  //   if(!user){
  //     // 렌더링 중에 페이지를 이동하면 에러가 발생하므로 렌더링 완료 후 이동한다.
  //     router.replace(`/login?redirect=${boardType}/new`);
  //   }
  // }, [user]);

  return (
    <>
      <form action={formAction}>
        {/* 로그인 된 사용자일 경우 서버 액션에 accessToken 전달 */}
        {/* <input type="hidden" name="accessToken" value={ user?.token?.accessToken ?? ''} /> */}
        <input type="hidden" name="type" value={boardType} />

        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-2 mb-2">
            {firstRow.map(item => (
              <button
                key={item.value}
                type="button"
                className={`px-4 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors
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
                className={`px-4 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors
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
        {/* 선택된 상품 정보 전달 */}
        {selectedProduct && <input type="hidden" name="extra.productId" value={selectedProduct._id} />}

        {/* 선택된 유형에 따라 선택 버튼 노출 */}
        {selectLabel && (
          <div className="mb-6 flex justify-center">
            <button type="button" className="w-full max-w-xl flex justify-between items-center px-6 py-3 border-2 rounded-2xl border-[#A97452] text-[#A97452] bg-white text-xs sm:text-sm lg:text-base font-semibold hover:bg-[#F5EEE6] transition-colors" onClick={handleProductButtonClick}>
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
                  <Image src={`${API_URL}/${selectedProduct.mainImages[0].path}`} alt={selectedProduct.name} width={100} height={100} unoptimized={true} className="w-20 h-20 object-cover rounded border" />
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

        <div className="my-4">
          <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="title">
            제목
          </label>
          <input id="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md text-xs sm:text-sm lg:text-base-xl dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1  focus:ring-2 focus:ring-[#A97452]" name="title" />
          <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.title?.msg}</p>
        </div>

        <div className="my-4">
          <label className="block text-lg content-center" htmlFor="content">
            내용
          </label>
          <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1 focus:ring-2 focus:ring-[#A97452]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" name="content"></textarea>
          <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.content?.msg}</p>
        </div>

        <div className="flex justify-end my-6 gap-2">
          <button type="submit" className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors" disabled={isLoading}>
            등록
          </button>
          <Link href={`/board/${boardType}`}>
            <button className="px-4 py-2 rounded-xl w-20 sm:w-24 lg:w-28 bg-white text-[#A97452] text-xs sm:text-sm lg:text-base hover:bg-[#F5EEE6] transition-colors border-2 border-[#A97452]" disabled={isLoading}>
              취소
            </button>
          </Link>
        </div>
      </form>

      {/* 상품 검색 모달 */}
      <ProductSearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectProduct={handleProductSelect} />
    </>
  );
}
