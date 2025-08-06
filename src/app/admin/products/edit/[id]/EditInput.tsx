'use client';

import type { Product } from '@/types/Product';
import { useLoginStore } from '@/stores/loginStore';
import { useState } from 'react';
import { patchProduct, PatchProductData } from '@/data/actions/patchProduct';
import CategorySelector from '@/app/admin/products/components/CategorySelector';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

// 카테고리 이름을 코드로 변환하는 매핑
const CATEGORY_NAME_TO_CODE: Record<string, Record<string, string>> = {
  PC01: {
    // 캐릭터
    '스튜디오 지브리': '01',
    '디즈니/픽사': '02',
    산리오: '03',
    미피: '04',
    핑구: '05',
    '짱구는 못말려': '06',
    치이카와: '07',
    스누피: '08',
  },
  PC03: {
    // 문구
    필기류: '01',
    스티커: '02',
    마스킹테이프: '03',
    '다이어리/달력': '04',
    '포스터/엽서': '05',
    '메모지/노트': '06',
  },
  PC04: {
    // 리빙&소품
    키링: '01',
    '미용&악세사리': '02',
  },
};

// 코드를 이름으로 변환하는 매핑
const CATEGORY_CODE_TO_NAME: Record<string, string[]> = {
  PC01: ['스튜디오 지브리', '디즈니/픽사', '산리오', '미피', '핑구', '짱구는 못말려', '치이카와', '스누피'],
  PC03: ['필기류', '스티커', '마스킹테이프', '다이어리/달력', '포스터/엽서', '메모지/노트'],
  PC04: ['키링', '미용&악세사리'],
};

// 소카테고리 이름을 올바른 코드 형식으로 변환하는 함수
function convertSubCategoryToCode(bigCategory: string, smallCategory: string): string {
  const categoryMap = CATEGORY_NAME_TO_CODE[bigCategory];
  if (!categoryMap) return smallCategory;

  const code = categoryMap[smallCategory];
  if (code) {
    return `${bigCategory}${code}`; // PC0101, PC0302
  }

  return smallCategory;
}

// 코드를 이름으로 변환하는 함수
function convertCodeToSubCategoryName(bigCategory: string, smallCategoryCode: string): string {
  const categories = CATEGORY_CODE_TO_NAME[bigCategory];
  if (!categories) return smallCategoryCode;

  // PC0103 형태인 경우
  if (smallCategoryCode.startsWith(bigCategory)) {
    const codeNumber = smallCategoryCode.slice(bigCategory.length);
    const index = parseInt(codeNumber) - 1;
    if (index >= 0 && index < categories.length) {
      return categories[index];
    }
  }

  // 숫자만 있는 경우 (예: "03")
  if (/^\d+$/.test(smallCategoryCode)) {
    const index = parseInt(smallCategoryCode) - 1;
    if (index >= 0 && index < categories.length) {
      return categories[index];
    }
  }

  return smallCategoryCode;
}

export default function AdminProductEditPage({ product }: { product: Product }) {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;
  const router = useRouter();

  // 기존 상품 정보 파싱
  const initialBigCategory = product.extra?.category?.[0] ?? '';
  const initialSmallCategoryCode = product.extra?.category?.[1] ?? '';
  const initialSmallCategoryName = convertCodeToSubCategoryName(initialBigCategory, initialSmallCategoryCode);

  const initialName = product.name;
  const initialPrice = product.price;
  const initialShippingFees = product.shippingFees;

  // 상태
  const [bigCategory, setBigCategory] = useState(initialBigCategory);
  const [smallCategory, setSmallCategory] = useState(initialSmallCategoryName);
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [shippingFees, setShippingFees] = useState(initialShippingFees);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const convertedSmallCategory = convertSubCategoryToCode(bigCategory, smallCategory);

      const patchData: PatchProductData = {
        name,
        price,
        shippingFees,
        extra: {
          category: [bigCategory, convertedSmallCategory],
        },
      };

      await patchProduct(String(product._id), patchData, accessToken ?? '');
      setSuccessMsg('상품 정보가 성공적으로 수정되었습니다.');
      router.push(`/products/${product._id}`);
    } catch (e) {
      let message = '알 수 없는 오류가 발생했습니다.';
      if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
        message = (e as { message: string }).message;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setBigCategory(initialBigCategory);
    setSmallCategory(initialSmallCategoryName);
    setName(initialName);
    setPrice(initialPrice);
    setShippingFees(initialShippingFees);

    setError(null);
    setSuccessMsg(null);
  }

  function handleCategoryChange(main: string, sub: string) {
    setBigCategory(main);
    setSmallCategory(sub);
  }

  const mainImageUrl = getFullImageUrl(product.mainImages[0]?.path);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* 왼쪽 이미지 영역 */}
        <div className="sm:w-1/2 relative pt-2">
          <div className="relative w-full pb-[100%]">{mainImageUrl ? <Image src={mainImageUrl} alt={product.name} fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">이미지 없음</div>}</div>
        </div>

        {/* 오른쪽 편집 폼 영역 */}
        <div className="sm:w-1/2 space-y-2">
          <div className="border-t-2 border-primary" />

          {/* 제품명 */}
          <h1 className="text-lg font-bold pl-2">상품 정보 수정</h1>

          <div className="border-t border-primary mb-4" />

          <div className="pl-2 space-y-4">
            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-semibold mb-2">카테고리</label>
              <CategorySelector initialMain={bigCategory} initialSub={smallCategory} onChange={handleCategoryChange} />
            </div>

            {/* 제품명 */}
            <div>
              <label className="block text-sm font-semibold mb-2">제품명</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-primary focus:border-transparent" placeholder="제품명을 입력하세요" />
            </div>

            {/* 가격 */}
            <div>
              <label className="block text-sm font-semibold mb-2">가격 (원)</label>
              <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-primary focus:border-transparent" placeholder="가격을 입력하세요" />
            </div>

            {/* 배송비 */}
            <div>
              <div className="flex mb-2">
                <label className="text-sm font-semibold">배송비 (원)</label>
              </div>
              <input type="number" min={0} value={shippingFees} onChange={e => setShippingFees(Number(e.target.value))} className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-primary focus:border-transparent" placeholder="배송비를 입력하세요" />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="p-2">
            <div className="flex space-x-2">
              <button onClick={handleSave} disabled={saving} className="cursor-pointer flex-1 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition">
                {saving ? '저장 중...' : '저장'}
              </button>

              <button onClick={handleCancel} disabled={saving} className="cursor-pointer flex-1 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                취소
              </button>
            </div>
          </div>

          {/* 상태 메시지 */}
          {error && (
            <div className="p-2">
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-2">
              <p className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">{successMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
