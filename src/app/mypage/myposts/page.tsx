'use client';

import { useEffect, useState } from 'react';
import type { Post } from '@/types/Post';
import { getPosts } from '@/utils/getPosts';
import Loading from '@/app/loading';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [community, notice, qna] = await Promise.all([getPosts('community'), getPosts('notice'), getPosts('qna')]);
        if (community.ok && notice.ok && qna.ok) {
          const combinedPosts = [...(community.item ?? []), ...(notice.item ?? []), ...(qna.item ?? [])];
          setPosts(combinedPosts);
        } else {
          console.warn('일부 게시판 데이터 가져오기 실패', {
            community,
            notice,
            qna,
          });
        }
      } catch (err) {
        console.error('fetchData 에러', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
      <div className="space-y-4">
        <h2 className="font-bold text-base mb-2 sm:mb-4 sm:text-lg lg:mb-8 lg:text-xl">내가 쓴 글</h2>

        {/* 모바일 리스트형 */}
        <ul className="block sm:hidden">
          {posts.map((post, index) => (
            <li key={post._id} className={`p-2  border-b border-gray-300 ${index === 0 ? 'border-t-1 border-t-dark-gray' : ''}`}>
              <div className="flex gap-2 space-y-2">
                <span className="text-sm font-bold">[{post.type}]</span>
                <span className="text-sm">{post.title}</span>
              </div>
              <p className="text-xs text-gray">
                {post.user.name} · {post.createdAt.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>

        {/* 태블릿/데스크탑 테이블형 */}
        <table className="hidden sm:table w-full text-sm lg:text-base border-t border-gray">
          <thead className="bg-secondary ">
            <tr>
              <th className="py-2 px-2 text-left">번호</th>
              <th className="py-2 px-2 text-left">제목</th>
              <th className="py-2 px-2 text-left">분류</th>
              <th className="py-2 px-2 text-left">작성자</th>
              <th className="py-2 px-2 text-left">작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post._id} className="border-b border-gray-300 ">
                <td className="py-2 px-2 lg:py-4 lg:px-4">{idx + 1}</td>
                <td className="py-2 px-2 lg:py-4 lg:px-4">{post.title}</td>
                <td className="py-2 px-2 lg:py-4 lg:px-4">{post.type}</td>
                <td className="py-2 px-2 lg:py-4 lg:px-4">{post.user.name}</td>
                <td className="py-2 px-2 lg:py-4 lg:px-4">{post.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 검색 필터 정렬 */}
        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:justify-between">
          <div className="sm:w-32 w-full">
            <select className="border w-1/5 sm:w-auto border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary lg:text-base">
              <option>제목</option>
              <option>내용</option>
              <option>작성자</option>
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="text" placeholder="검색어 입력" className="border flex-1 w-2/3 sm:w-auto border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary lg:text-base" />
            <button className="bg-primary text-background  px-4 py-2 rounded cursor-pointer w-1/3 sm:w-auto">검색</button>
          </div>
        </div>
      </div>
    </div>
  );
}
