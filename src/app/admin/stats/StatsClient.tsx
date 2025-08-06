'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { getProductStatistics } from '@/utils/getStats';
import { ProductStatistics, DayStatistics, StatisticsParams } from '@/types/stats';
import { useRouter } from 'next/navigation';

interface PreviewData {
  period: string;
  condition: string;
  totalItems: number;
  totalSales: number;
}

// statisticsData 타입 유니언 지정
type StatisticsData = ProductStatistics[] | DayStatistics[];

export default function StatsClient() {
  const [formData, setFormData] = useState<StatisticsParams>({
    start: '',
    finish: '',
    by: 'product',
  });

  const [statisticsData, setStatisticsData] = useState<StatisticsData>([]);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const user = useLoginStore(state => state.user);
  const { isLogin, isAdmin, isLoading } = useLoginStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLogin || !isAdmin)) {
      router.push('/unauthorized');
    }
  }, [isLoading, isLogin, isAdmin, router]);

  if (isLoading) {
    return <div>권한 확인 중...</div>;
  }

  // 날짜 포맷 변환: "YYYY-MM-DD" -> "YYYY.MM.DD"
  function formatDotDate(dateStr: string) {
    return dateStr.replace(/-/g, '.');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    //이 초기화 코드 들어가야 일자별 --> 상품별로 바꿨을때 image 없어서 렌더링 안되는 문제가 안 뜸
    if (name === 'by') {
      setStatisticsData([]);
      setHasSearched(false);
      setError(null);
      setPreviewData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.start || !formData.finish) {
      setError('시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    if (new Date(formData.start) > new Date(formData.finish)) {
      setError('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = user?.token?.accessToken || '';
      const params: StatisticsParams = {
        start: formatDotDate(formData.start),
        finish: formatDotDate(formData.finish),
        by: formData.by,
      };

      const result = await getProductStatistics(params, accessToken);

      if (result.ok) {
        setStatisticsData(result.item);
        setHasSearched(true);

        // 총 합계 계산 (상품별과 일자별 모두 대응)
        const totalSales = result.item.reduce((sum, item) => sum + (item.totalSales ?? 0), 0);
        const totalQuantity = result.item.reduce((sum, item) => sum + (item.totalQuantity ?? 0), 0);

        setPreviewData({
          period: `${formData.start} ~ ${formData.finish}`,
          condition: formData.by === 'product' ? '상품별' : '일자별',
          totalItems: totalQuantity,
          totalSales: totalSales,
        });
      } else {
        setError(result.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount ?? 0);

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    return 'bg-gradient-to-r from-[#A97452] to-[#966343] text-white';
  };

  const isProductStats = formData.by === 'product';

  return (
    <div className="space-y-8">
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
            <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <span className="text-[#4A5568] font-semibold text-lg">데이터를 불러오는 중...</span>
          </div>
        </div>
      )}

      {/* 검색 폼 */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="start" className="block text-sm font-bold ">
                시작일 <span className="text-[#E53E3E]">*</span>
              </label>
              <input type="date" id="start" name="start" value={formData.start} onChange={handleInputChange} required disabled={loading} className="w-full py-3 px-4 border-2 border-[#E5D5C8] rounded-xl focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] focus:ring-opacity-20 transition text-sm sm:text-base disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label htmlFor="finish" className="block text-sm font-bold ">
                종료일 <span className="text-[#E53E3E]">*</span>
              </label>
              <input type="date" id="finish" name="finish" value={formData.finish} onChange={handleInputChange} required disabled={loading} className="w-full py-3 px-4 border-2 border-[#E5D5C8] rounded-xl focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] focus:ring-opacity-20 transition text-sm sm:text-base disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <label htmlFor="by" className="block text-sm font-bold">
                조회 조건
              </label>
              <select id="by" name="by" value={formData.by} onChange={handleInputChange} disabled={loading} className="w-full py-3 px-4 border-2 border-[#E5D5C8] rounded-xl focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] focus:ring-opacity-20 transition bg-white text-sm sm:text-base disabled:opacity-50">
                <option value="product">상품별</option>
                <option value="day">일자별</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button type="submit" disabled={loading || !formData.start || !formData.finish} className="px-8 py-3 bg-[#A97452] text-white font-bold rounded-xl hover:bg-[#966343] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 text-sm sm:text-base shadow-lg cursor-pointer">
              {loading ? '조회 중...' : '📈 통계 조회'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-2">⚠️</span>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 결과 섹션 */}
      {hasSearched && !loading && !error && (
        <div className="space-y-6">
          {/* 요약 */}
          {previewData && (
            <div className="bg-gradient-to-r from-[#A97452] to-[#966343] text-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-base sm:text-xl font-bold">📅</div>
                  <div className="text-sm sm:text-base opacity-90">조회 기간</div>
                  <div className="font-semibold">{previewData.period}</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold">📊</div>
                  <div className="text-sm sm:text-base opacity-90">조회 조건</div>
                  <div className="font-semibold">{previewData.condition}</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold">📦</div>
                  <div className="text-sm sm:text-base opacity-90">총 판매량</div>
                  <div className="font-semibold">{previewData.totalItems.toLocaleString()}개</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold">💰</div>
                  <div className="text-sm sm:text-base opacity-90">총 매출</div>
                  <div className="font-semibold">{formatCurrency(previewData.totalSales)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#A97452] to-[#966343] text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-base sm:text-xl font-bold">📊 조회 결과</h2>
                <span className="text-sm sm:text-base bg-[rgba(169,116,82,0.2)] px-4 py-2 rounded-full  font-medium">총 {statisticsData.length}개 항목</span>
              </div>
            </div>

            {statisticsData.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-[#718096] text-xl font-medium">해당 기간에 판매 데이터가 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5EEE6]">
                    {isProductStats ? (
                      <tr>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold  border-b-2 border-[#E5D5C8]">순위</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold  border-b-2 border-[#E5D5C8]">상품 이미지</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold  border-b-2 border-[#E5D5C8]">상품명</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-[#A97452] border-b-2 border-[#E5D5C8]">단가</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold  text-secondary-green border-b-2 border-[#E5D5C8]">판매 수량</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-red border-b-2 border-[#E5D5C8]">총 매출</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-[#4A5568] border-b-2 border-[#E5D5C8]">날짜</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-[#38A169] border-b-2 border-[#E5D5C8]">판매 수량</th>
                        <th className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-red border-b-2 border-[#E5D5C8]">총 매출</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {isProductStats
                      ? (statisticsData as ProductStatistics[]).map((item, index) => (
                          <tr key={item._id ?? index} className="hover:bg-[#F5EEE6] transition-colors border-b border-[#E5D5C8] last:border-b-0">
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-sm font-bold ${getRankBadgeColor(index + 1)}`}>{index + 1}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#E5D5C8] shadow-sm">
                                <img
                                  src={item.product.image?.path ? `${item.product.image.path}` : '/placeholder.png'}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.png';
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold  max-w-xs">{item.product.name}</td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold text-[#A97452]">{formatCurrency(item.product.price)}</td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold text-secondary-green">{item.totalQuantity.toLocaleString()}개</td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-red">{formatCurrency(item.totalSales)}</td>
                          </tr>
                        ))
                      : (statisticsData as DayStatistics[]).map((item, index) => (
                          <tr key={item.date ?? index} className="hover:bg-[#F5EEE6] transition-colors border-b border-[#E5D5C8] last:border-b-0">
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold ">{item.date}</td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold text-secondary-green">{item.totalQuantity.toLocaleString()}개</td>
                            <td className="px-4 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-bold text-red">{formatCurrency(item.totalSales)}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
