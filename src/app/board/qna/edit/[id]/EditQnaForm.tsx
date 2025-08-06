'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { updatePost } from '@/data/actions/post';
import { Post } from '@/types/Post';
import { useRouter } from 'next/navigation';

interface EditQnaFormProps {
  post: Post;
}

export default function EditQnaForm({ post }: EditQnaFormProps) {
  const router = useRouter();
  const [state, formAction, isLoading] = useActionState(updatePost, null);

  const user = useLoginStore(state => state.user);

  // 수정 성공 시 상세 페이지로 이동
  useEffect(() => {
    if (state?.ok === 1) {
      router.push(`/board/qna/${post._id}`);
    }
  }, [state, router, post._id]);

  return (
    <>
      <form action={formAction}>
        {isLoading && (
          <div className="absolute inset-0 z-10  bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-end">
            {/* 로딩 원(스피너) */}
            <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-white font-semibold text-sm">처리 중...</span>
          </div>
        )}
        {/* 수정을 위한 필수 정보 */}
        <input type="hidden" name="_id" value={post._id} />
        <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
        <input type="hidden" name="type" value="qna" />
        <div className="my-4">
          <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="title">
            제목
          </label>
          <input id="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md text-xs sm:text-sm lg:text-base-xl  border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1  focus:ring-2 focus:ring-[#A97452]" name="title" defaultValue={post.title} />
          <p className="ml-2 mt-1 text-sm text-red-500">{state?.ok === 0 && state.errors?.title?.msg}</p>
        </div>
        <div className="my-4">
          <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="content">
            내용
          </label>
          <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1 focus:ring-2 focus:ring-[#A97452] " name="content" defaultValue={post.content}></textarea>
          <p className="ml-2 mt-1 text-sm text-red-500 ">{state?.ok === 0 && state.errors?.content?.msg}</p>
        </div>

        <div className="flex justify-end my-6 gap-2">
          <button type="submit" className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors cursor-pointer" disabled={isLoading}>
            수정
          </button>
          <Link href={`/board/qna/${post._id}`}>
            <button type="button" className="px-4 py-2 rounded-xl w-20 sm:w-24 lg:w-28 bg-white text-[#A97452] text-xs sm:text-sm lg:text-base hover:bg-[#F5EEE6] transition-colors border-2 border-[#A97452] cursor-pointer" disabled={isLoading}>
              취소
            </button>
          </Link>
        </div>
      </form>

      {/* 상품 검색 모달 */}
    </>
  );
}
