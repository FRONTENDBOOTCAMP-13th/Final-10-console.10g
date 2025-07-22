import NewQnaForm from './NewQnaForm';

export default async function NewQnaPage() {
  const boardType = 'qna';

  return (
    <main className="flex-1 min-w-[320px] p-4">
      <div className="py-4">
        <div className="mb-3  text-xs sm:text-sm lg:text-base  text-gray-400">홈 &gt; 문의게시판 &gt; 문의하기</div>

        <h2 className="text-center  text-2xl font-bold text-black ">문의하기</h2>
      </div>
      <section className="mb-8 p-4">
        <NewQnaForm boardType={boardType} />
      </section>
    </main>
  );
}
