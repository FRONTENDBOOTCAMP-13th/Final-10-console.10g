import StoryCard from './StoryCard';

export default function StoryCardList() {
  const storyProducts = [
    {
      id: 100,
      title: '먼가 작고 귀여운 녀석들',
      summary: '작고 귀여운 캐릭터들이 전하는 일상의 작은 위로와 기쁨을 담은 먼작귀 굿즈 컬렉션입니다.',
      image: '/chiikawa-thumb.png',
      slug: 'chiikawa',
    },
    {
      id: 101,
      title: '진실을 담은 코난 굿즈 컬렉션',
      summary: '추리와 비밀, 감정이 겹겹이 쌓인 코난의 세계를 굿즈로 만나보세요.',
      image: '/conan-thumb.png',
      slug: 'conan',
    },
    {
      id: 102,
      title: '유쾌한 가족, 아따맘마',
      summary: '평범하지만 소중한 가족의 일상을 담아낸, 포근하고 사랑스러운 아따맘마 굿즈들입니다.',
      image: '/atashinchi-thumb.png',
      slug: 'atashinchi',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 justify-center">
      {storyProducts.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
