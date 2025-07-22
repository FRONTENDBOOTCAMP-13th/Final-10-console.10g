import ImagePostForm from './ImagePostForm';

export default function ImageNewPage() {
  const boardType = 'community';
  return (
    <main className="flex-1 min-w-[320px] p-4">
      <div className="py-4">
        <h2 className="text-center text-2xl font-bold text-black">이미지 게시글 등록</h2>
      </div>
      <section className="mb-8 p-4">
        <ImagePostForm boardType={boardType} />
      </section>
    </main>
  );
}
