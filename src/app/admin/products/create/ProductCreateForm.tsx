'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { addProduct } from '@/data/actions/addProduct';
import CategorySelector from '@/app/admin/products/components/CategorySelector';
import { toast } from 'react-hot-toast';

interface FormData {
  name: string;
  price: number;
  shippingFees: number;
  quantity: number;
  mainImage?: File;
  categoryMain?: string;
  categorySub?: string;
}

// 카테고리 이름을 코드로 변환하는 매핑
const CATEGORY_NAME_TO_CODE: Record<string, Record<string, string>> = {
  PC01: {
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
    필기류: '01',
    스티커: '02',
    마스킹테이프: '03',
    '다이어리/달력': '04',
    '포스터/엽서': '05',
    '메모지/노트': '06',
  },
  PC04: {
    키링: '01',
    '미용&악세사리': '02',
  },
};

function convertSubCategoryToCode(bigCategory: string, smallCategory: string): string {
  const categoryMap = CATEGORY_NAME_TO_CODE[bigCategory];
  if (!categoryMap) return smallCategory;

  const code = categoryMap[smallCategory];
  if (code) {
    return `${bigCategory}${code}`;
  }

  return smallCategory;
}

export default function ProductCreateForm() {
  const { isLogin, isAdmin, isLoading } = useLoginStore();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<FormData>({
    name: '',
    price: 0,
    shippingFees: 3000,
    quantity: 1,
    mainImage: undefined,
    categoryMain: 'PC01',
    categorySub: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data.mainImage) {
      const url = URL.createObjectURL(data.mainImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [data.mainImage]);

  const { user } = useLoginStore();
  useEffect(() => {
    if (!isLoading && (!isLogin || !isAdmin)) {
      router.push('/unauthorized');
    }
  }, [isLoading, isLogin, isAdmin, router]);

  if (isLoading) {
    return <div>권한 확인 중...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'mainImage' && files && files.length > 0) {
      setData(prev => ({ ...prev, mainImage: files[0] }));
      return;
    }

    setData(prev => ({
      ...prev,
      [name]: ['price', 'shippingFees', 'quantity'].includes(name) ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (main: string, sub: string) => {
    setData(prev => ({
      ...prev,
      categoryMain: main,
      categorySub: sub,
    }));
  };

  const handleSave = async () => {
    if (!user?.token.accessToken) {
      toast.error('로그인이 필요합니다.');

      return;
    }

    if (data.name.trim().length < 2) {
      toast.error('상품명은 2글자 이상 입력해 주세요.');
      return;
    }

    // 서브 카테고리가 없어도 되는 카테고리들
    const categoriesWithoutSub = ['PC02', 'new', 'popular'];
    const needsSubCategory = !categoriesWithoutSub.includes(data.categoryMain || '');

    if (!data.name.trim() || data.price <= 0 || data.quantity <= 0 || !data.mainImage || !data.categoryMain || (needsSubCategory && !data.categorySub)) {
      toast.error('모든 필드를 입력해 주세요.');
      return;
    }

    setSaving(true);

    try {
      // 특수 카테고리 처리
      let extraData: { category: string[]; isNew?: boolean; isBest?: boolean };

      if (data.categoryMain === 'new') {
        // 신상품인 경우
        extraData = {
          category: [],
          isNew: true,
        };
      } else if (data.categoryMain === 'popular') {
        // 인기상품인 경우
        extraData = {
          category: [],
          isBest: true,
        };
      } else if (data.categoryMain === 'PC02') {
        // 미니어처인 경우
        extraData = {
          category: [data.categoryMain],
        };
      } else {
        // 일반 카테고리인 경우
        const convertedSubCategory = convertSubCategoryToCode(data.categoryMain, data.categorySub || '');
        extraData = {
          category: [data.categoryMain, convertedSubCategory],
        };
      }

      const res = await addProduct(
        {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          content: '상품 설명이 없습니다.',
          shippingFees: data.shippingFees,
          extra: extraData,
          mainImage: data.mainImage,
        },
        user.token.accessToken,
      );

      if (res.ok) {
        toast.success('상품이 성공적으로 등록되었습니다!');
        router.push(`/products/${res.item._id}`);
      } else {
        toast.error(res.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      toast.error('상품 등록 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 취소 함수
  const handleCancel = () => {
    setData({
      name: '',
      price: 0,
      shippingFees: 3000,
      quantity: 1,
      mainImage: undefined,
      categoryMain: 'PC01',
      categorySub: '',
    });
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-8 mb-16">
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">상품명</label>
        <input name="name" value={data.name} onChange={handleChange} required className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder-gray-400" placeholder="상품명을 입력하세요" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">판매가</label>
          <div className="relative">
            <input name="price" type="number" value={data.price} onChange={handleChange} required className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300" min={0} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">원</span>
          </div>
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">배송비</label>
          <div className="relative">
            <input name="shippingFees" type="number" value={data.shippingFees} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300" min={0} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">원</span>
          </div>
        </div>
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">카테고리</label>
        <CategorySelector initialMain={data.categoryMain} initialSub={data.categorySub} onChange={handleCategoryChange} />
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">수량</label>
        <div className="relative w-full md:w-48">
          <input name="quantity" type="number" value={data.quantity} onChange={handleChange} required className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300" min={1} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">개</span>
        </div>
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">대표 이미지</label>

        <div className="relative border-2 border-dashed border-primary-light rounded-2xl p-8 transition-all duration-300 bg-gray-50/30 hover:border-primary hover:bg-primary/5">
          <input type="file" name="mainImage" accept="image/*" onChange={handleChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

          {previewUrl ? (
            <div className="text-center">
              <img src={previewUrl} alt="대표 이미지 미리보기" className="mx-auto max-h-48 object-contain rounded-xl shadow-md mb-4" />
              <p className="text-sm text-primary font-medium">이미지가 업로드되었습니다</p>
              <p className="text-xs text-gray-500 mt-1">다른 이미지로 바꾸려면 클릭하세요</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">이미지를 업로드해주세요</p>
              <p className="text-sm text-gray-500">클릭해서 파일을 선택하세요</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <button onClick={handleCancel} disabled={saving} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 transition-all duration-300 cursor-pointer">
          취소
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all duration-300 cursor-pointer">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              저장 중...
            </span>
          ) : (
            '저장하기'
          )}
        </button>
      </div>
    </div>
  );
}
