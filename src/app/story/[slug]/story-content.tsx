'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StoryBlock from './content-block';
import storyMap from '@/data/stories';

type StorySlug = keyof typeof storyMap;

export default function StoryContent({ slug }: { slug: StorySlug }) {
  const story = storyMap[slug];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const offset = rect.top;

      const fadeDistance = 400;
      const newOpacity = offset > 0 ? 1 : Math.max(0, 1 + offset / fadeDistance);
      setContentOpacity(newOpacity);
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="px-6 pt-8">
        <nav className="breadcrumb mb-2 text-sm text-gray-600 max-w-[800px] mx-auto">
          <Link href="/">홈</Link>
          <span className="mx-2">{' > '}</span>
          <span>도토리숲 이야기</span>
        </nav>
        <h2 className="max-w-[800px] mx-auto text-primary font-bold text-xl mb-8">에디터 비하인드 스토리</h2>
      </div>

      {/* Cover Section */}
      <section ref={sectionRef} className="w-full bg-[#F5EEE6]">
        <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto  ">
          {/* 이미지 */}
          <div
            className="w-full md:w-1/2 mb-4 md:mb-0"
            style={{
              opacity: contentOpacity,
              transform: `translateY(${(1 - contentOpacity) * 20}px)`,
              transition: 'opacity 1s ease, transform 1s ease',
            }}
          >
            <Image src={story.coverImageUrl} alt={story.title} width={600} height={600} className="w-full h-auto  object-cover" priority />
          </div>

          {/* 텍스트*/}
          <div
            className="w-full p-6 md:w-1/2 md:pl-6 flex flex-col justify-center text-gray-700"
            style={{
              opacity: contentOpacity,
              transform: `translateY(${(1 - contentOpacity) * 60}px)`,
              transition: 'opacity 1.2s ease, transform 1.2s ease',
            }}
          >
            <h2 className="text-2xl font-extrabold mb-8 ">
              [PICK] {story.title}
              <br />
              비하인드 스토리:
            </h2>
            <h3 className="text-xl font-extrabold mb-2 ">{story.subtitle}</h3>
            <p className="text-sm font-medium mb-2">{story.date.toDateString()}</p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <main className="p-8 max-w-[800px] mx-auto">
        <div className="border-t border-gray-300 mt-20 my-16" />
        {story.description}
        {story.contentBlocks.map((block, idx) => (
          <StoryBlock key={idx} title={block.title} content={block.content} imageUrl={block.imageUrl} />
        ))}
        <div className="font-semibold mt-20">{story.closing}</div>

        {/* Main Characters Section */}
        <section className="max-w-[800px] mx-auto mt-16 mb-20">
          <hr></hr>
          <h2 className="text-xl font-bold my-6">ABOUT MAIN CHARACTER</h2>
          <div className="flex items-center mb-10 gap-6">
            <Image src={story.mainCharacter.imageUrl} alt={story.mainCharacter.name} width={120} height={120} className="rounded-lg object-cover" />
            <div>
              <h3 className="text-xl font-semibold">{story.mainCharacter.name}</h3>
              <p className="mt-2 text-gray-700">{story.mainCharacter.description}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
