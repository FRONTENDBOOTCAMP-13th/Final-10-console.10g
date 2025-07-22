// 스토리 콘텐츠 블록 하나
'use client';

import Image from 'next/image';
import type { ContentBlock } from '@/types/story';

export default function StoryBlock({ title, content, imageUrl }: ContentBlock) {
  const paragraphs = content.split('\n');
  return (
    <div className="w-full flex flex-col items-center mb-12">
      <div className="w-[50%] h-0.5 bg-black my-12" />
      <div className="w-full max-w-[800px]">
        <Image src={imageUrl} alt={title} width={800} height={300} />
        <h2 className="text-xl font-extrabold mt-4">{title}</h2>

        {paragraphs.map((text, idx) => (
          <p key={idx} className="mt-2 text-base text-gray-600 leading-relaxed">
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
