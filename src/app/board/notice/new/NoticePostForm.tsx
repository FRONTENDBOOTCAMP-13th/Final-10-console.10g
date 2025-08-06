'use client';

import { useLoginStore } from '@/stores/loginStore';
import { useActionState } from 'react';
import { createPost } from '@/data/actions/post';
import Link from 'next/link';

export default function NoticePostForm({ boardType }: { boardType: string }) {
  const [state, formAction, isLoading] = useActionState(createPost, null);
  const user = useLoginStore(state => state.user);

  return (
    <form action={formAction}>
      {/* 서버 액션으로 넘길 기본 정보 */}
      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
      <input type="hidden" name="type" value={boardType} />

      {/* 제목 입력 */}
      <div className="my-4">
        <label htmlFor="title" className="block mb-2 font-bold text-sm">
          제목
        </label>
        <input id="title" type="text" name="title" placeholder="제목을 입력하세요." className="w-full py-2 px-3 border rounded-md text-sm border-gray-300 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452]" />
        {state?.ok === 0 && <p className="mt-1 text-sm text-red-500">{state.errors?.title?.msg}</p>}
      </div>

      {/* 내용 입력 */}
      <div className="my-4">
        <label htmlFor="content" className="block mb-2 font-bold text-sm">
          내용
        </label>
        <textarea id="content" name="content" rows={12} placeholder="내용을 입력하세요." className="w-full p-3 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452]" />
        {state?.ok === 0 && <p className="mt-1 text-sm text-red-500">{state.errors?.content?.msg}</p>}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 mt-6">
        <button type="submit" className="px-4 py-2 w-24 rounded-md bg-[#A97452] text-white text-sm hover:bg-[#966343] transition-colors cursor-pointer" disabled={isLoading}>
          등록
        </button>
        <Link href={`/board/${boardType}`}>
          <button type="button" className="px-4 py-2 w-24 rounded-md border-2 border-[#A97452] bg-white text-[#A97452] text-sm hover:bg-[#F5EEE6] transition-colors cursor-pointer" disabled={isLoading}>
            취소
          </button>
        </Link>
      </div>
    </form>
  );
}
