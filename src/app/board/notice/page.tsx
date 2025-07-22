//문의 게시판

import FilterIcon from '@/components/icon/FilterIcon';
import SearchIcon from '@/components/icon/SearchIcon';
import { Post } from '@/types/Post';
import { getPosts } from '@/utils/getPosts';
import Link from 'next/link';

export default async function NoticeBoardPage() {
  const res = await getPosts('notice');
  const posts: Post[] = res.ok === 1 ? res.item : [];
  return (
    <>
      <div className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
        {/* 좌측 '홈 > COMMUNITY' */}
        <div className="mb-3  text-xs sm:text-sm lg:text-base  text-gray-400">홈 &gt; COMMUNITY</div>

        {/* 제목 & 검색탭 */}
        <div className="flex items-start justify-between mb-6 relative">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#A97452]  pt-2">공지게시판</h1>
          {/* 우측 검색 */}
          <div className="flex flex-col items-end">
            {/* 검색-bar */}
            <div className="flex items-center justify-between gap-2 border border-[#A97452] rounded-3xl px-3 py-2 w-48 sm:w-60 lg:w-72 h-8 sm:h-8 lg:h-10 bg-white">
              <input type="text" placeholder="검색어를 입력하세요" className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base py-2" />
              <button type="submit" className="ml-2">
                <SearchIcon className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-[#A97452]" />
              </button>
            </div>
            {/* 필터 버튼 (검색창 바로 아래, 우측 정렬) */}
            <button type="button" className="mt-2 text-[#A97452] hover:bg-[#f8f0e9] p-2 rounded-full self-end" title="필터">
              <FilterIcon pathProps={{ fill: '#A97452' }} svgProps={{ className: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10' }} />
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-t-2 border-[#A97452] mb-1" />

        {/* 게시글 테이블 */}
        <table className="w-full text-center">
          <thead>
            <tr className="text-[#A97452] border-b border-[#965b29]">
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base w-14 sm:w-24 lg:w-32 " style={{ width: 60 }}>
                번호
              </th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base-xl w-14 sm:w-24 lg:w-32  ">제목</th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base w-14 sm:w-24 lg:w-32 " style={{ width: 150 }}>
                작성자
              </th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base w-14 sm:w-24 lg:w-32 " style={{ width: 120 }}>
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-xs sm:text-sm lg:text-base text-gray-400">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-xs sm:text-sm lg:text-base">{post._id}</td>
                  <td className="py-2 text-center px-2 text-xs sm:text-sm lg:text-base">
                    <Link href={`/board/notice/${post._id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2 text-xs sm:text-sm lg:text-base">도토리섬 관리자</td>
                  <td className="py-2 text-xs sm:text-sm lg:text-base">{post.createdAt?.substring(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 일단 더미로 넣어놓음 */}
        <div className="flex justify-center mt-7 gap-1 sm:gap-2 lg:gap-4 ">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <button key={i} className="px-3 py-1 rounded-full hover:bg-[#E5CBB7] text-xs sm:text-sm lg:text-base">
              {i}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
