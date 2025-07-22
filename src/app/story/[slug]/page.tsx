import { notFound } from 'next/navigation';
import StoryContent from './story-content';

import conan from '@/data/stories/conan';
import chiikawa from '@/data/stories/chiikawa';
import atashinchi from '@/data/stories/atashinchi';

const storyMap = {
  conan,
  chiikawa,
  atashinchi,
} as const;

type StorySlug = keyof typeof storyMap;

export default async function StoryPage({ params }: { params: { slug: StorySlug } }) {
  const { slug } = await params;

  if (!(slug in storyMap)) {
    return notFound();
  }

  return <StoryContent slug={slug} />;
}
