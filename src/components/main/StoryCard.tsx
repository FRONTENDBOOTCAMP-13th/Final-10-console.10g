'use client';

import Link from 'next/link';
import Image from 'next/image';

interface StoryCardProps {
  story: {
    id: number;
    title: string;
    summary: string;
    image: string;
    slug: string;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  const href = `/story/${story.slug}`;

  return (
    <>
      {/* 640 미만: 이미지 + 타이틀만 */}
      <Link href={href} className="block sm:hidden">
        <div className="rounded-md border border-gray-200 shadow flex flex-col items-center p-4 text-center h-full cursor-pointer">
          <div className="w-16 h-16 relative mb-2">
            <Image src={story.image} alt={story.title} fill sizes="64px" className="object-contain" />
          </div>
          <h3 className="text-sm font-medium">{story.title}</h3>
        </div>
      </Link>

      {/* 640 이상: 요약 + 버튼 포함 */}
      <div className="hidden sm:flex rounded-md border border-gray-200 shadow flex-col items-center p-4 text-center h-full">
        <div className="w-16 h-16 relative mb-3">
          <Image src={story.image} alt={story.title} fill sizes="64px" className="object-contain" />
        </div>
        <h3 className="text-sm font-semibold mb-1">{story.title}</h3>
        <p className="text-xs text-gray-600 mb-3">{story.summary}</p>
        <div className="mt-auto">
          <Link href={href}>
            <button className="bg-[#7E8E63] text-white text-xs px-4 py-1 rounded hover:opacity-90 cursor-pointer">자세히보기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
