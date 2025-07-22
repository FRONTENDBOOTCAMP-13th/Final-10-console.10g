import Image from 'next/image';

export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex justify-center my-6">
      <div className="inline-flex items-center gap-2 px-1 py-1 border-b-2 border-dashed border-primary">
        {/* 왼쪽 도토리 - 항상 보임 */}
        <Image src="/main-dotori.png" alt="도토리" width={800} height={300} className="w-6 h-6" />

        {/* 타이틀 */}
        <h2 className="text-lg font-bold text-primary">{title}</h2>

        {/* 오른쪽 도토리 - 640px 이하에서만 보임 */}
        <div className="sm:hidden">
          <Image src="/main-dotori.png" alt="도토리" width={800} height={300} className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
