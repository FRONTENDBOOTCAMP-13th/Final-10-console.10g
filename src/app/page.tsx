import Carousel from '@/components/main/Carousel';
import CategorySlider from '@/components/main/CategorySlider';
import SectionTitle from '@/components/main/SectionTitle';
import ReviewSlider from '@/components/main/ReviewSlider';
import StoryCardList from '@/components/main/StoryCardList';
import NewProductsSection from '@/components/main/NewProductsSection';

export default async function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* 캐러셀 섹션 */}
      <Carousel />

      {/* TODO 링크 걸어두기 */}
      <section className="w-full px-4 max-w-[800px]">
        {/* 인기 캐릭터 상품 섹션 */}
        <div className="mb-20 mt-10">
          <SectionTitle title="도토리섬 인기 캐릭터 상품" />
          <CategorySlider />
        </div>

        {/* 신상품 섹션 */}
        <div className="mb-20">
          <SectionTitle title="도토리섬 신상품 둘러보기" />
          <NewProductsSection />
        </div>

        {/* 베스트 포토리뷰 섹션 */}
        <div className="mb-20">
          <SectionTitle title="도토리섬 베스트 포토리뷰" />
          <ReviewSlider />
        </div>

        {/* 이야기 섹션 */}
        <div className="mb-40">
          <SectionTitle title="도토리섬 이야기" />
          <StoryCardList />
        </div>
      </section>
    </main>
  );
}
