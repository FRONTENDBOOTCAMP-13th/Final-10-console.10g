'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/utils/getProducts';
import type { Product } from '@/types/Product';
import Image from 'next/image';
interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductSearchModal({ isOpen, onClose, onSelectProduct }: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); //검색어를 입력 안한 초기 상태에 팝업 로딩 지연을 위해 검색어 입력했을때만 뜨게 하기 위해 추가

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setHasSearched(false); //검색 여부 초기값은 false여야함
      setFilteredProducts([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  // // 검색어에 따른 필터링
  // useEffect(() => {
  //   if (searchTerm.trim() === '') {
  //     setFilteredProducts(products);
  //   } else {
  //     const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  //     setFilteredProducts(filtered);
  //   }
  // }, [searchTerm, products]);

  //검색 버튼 누르면 제출할 form에 쓰일 메서드
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await getProducts();
      if (response.ok === 1 && response.item) {
        //여기서 필터 로직 적용
        const filtered = response.item.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error('상품 검색 실패:', error);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  //검색 후 선택 버튼 누를때 실행될 메서드
  const handleProductSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
    setSearchTerm('');
  };

  const handleModalClose = () => {
    onClose();
    setSearchTerm('');
    setHasSearched(false);
    setFilteredProducts([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold">상품검색</h2>
          <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700 lg:text-4xl sm:text-3xl text-2xl">
            ×
          </button>
        </div>

        {/* 검색 폼 */}
        <div className="p-2 sm:p-6 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <select className="border border-gray-300 rounded px-3 py-2  text-xs sm:text-sm lg:text-base">
              <option value="product">상품명</option>
            </select>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="상품명을 입력하세요" className="text-xs sm:text-sm lg:text-base flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452]" />
            <button type="submit" className="px-4 sm:px-6 py-2 bg-[#A97452] text-white rounded hover:bg-[#966343] transition-colors  text-xs sm:text-sm lg:text-base">
              검색하기
            </button>
          </form>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-auto p-6">
          {!hasSearched ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500 text-xs sm:text-sm lg:text-base">상품명을 입력하고 검색하기 버튼을 눌러주세요.</div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500 text-xs sm:text-sm lg:text-base">로딩 중...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs sm:text-sm lg:text-base">검색 결과가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              <div className="text-blue-600 mb-4 text-xs sm:text-sm lg:text-base">총 {filteredProducts.length}개의 상품이 검색되었습니다.</div>

              {/* 테이블 헤더 */}
              <div className="grid grid-cols-12 gap-4 pb-2 border-b font-semibold text-xs sm:text-sm lg:text-base text-gray-600">
                <div className="col-span-2 whitespace-nowrap text-center">상품 이미지</div>
                <div className="col-span-6 text-center">상품 정보</div>
                <div className="col-span-3 text-center">선택</div>
              </div>

              {/* 상품 목록 */}
              {filteredProducts.map(product => (
                <div key={product._id} className="grid grid-cols-12 gap-4 py-4 border-b items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    {product.mainImages ? (
                      <Image src={`${product.mainImages[0]?.path}`} alt={product.name} width={150} height={150} unoptimized={true} />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                        <span className="text-gray-400 text-xs sm:text-sm lg:text-base">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-6">
                    <div className="text-sm sm:text-base   font-medium mb-1">{product.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">가격: {product.price?.toLocaleString()}원</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      재고: {product.quantity}개 | 배송비: {product.shippingFees?.toLocaleString()}원
                    </div>
                  </div>

                  <div className="col-span-3 text-center">
                    <button onClick={() => handleProductSelect(product)} className="px-4 py-2 bg-[#A97452] text-white rounded hover:bg-[#966343] transition-colors text-xs sm:text-sm lg:text-base">
                      선택
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
