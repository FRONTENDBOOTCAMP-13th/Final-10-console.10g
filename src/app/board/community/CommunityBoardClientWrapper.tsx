'use client';

import { useEffect, useState } from 'react';
import { getLikedPosts } from '@/utils/getPosts';
import { Post } from '@/types/Post';
import CommunityPostCard from './CommunityPostCard';
import { useLoginStore } from '@/stores/loginStore';
import Pagination from '@/components/common/Pagination';
import ArrowIcon from '@/components/icon/ArrowIcon';
import CommunityWriteButton from './CommunityWriteButton';

interface Props {
  posts: Post[]; // SSR에서 넘어온 전체(또는 image) 게시글 리스트
  apiUrl: string;
}

export default function CommunityBoardClientWrapper({ posts, apiUrl }: Props) {
  const user = useLoginStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [mergedPosts, setMergedPosts] = useState<Array<Post & { bookmarkId?: number }>>([]);
  const [filteredPosts, setFilteredPosts] = useState<Array<Post & { bookmarkId?: number }>>([]);

  // 검색 상태
  const [searchField, setSearchField] = useState<'title' | 'user'>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 모바일 상태 확인
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 기준 sm 미만이면 모바일
    };

    checkIsMobile(); // 초기 확인
    window.addEventListener('resize', checkIsMobile); // 리사이즈 대응

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // 북마크 정보와 게시글 합치기
  useEffect(() => {
    async function fetchBookmarks() {
      if (!user?.token?.accessToken) {
        setMergedPosts(posts);
        setLoading(false);
        return;
      }
      try {
        const res = await getLikedPosts(user.token.accessToken);

        if (res.ok !== 1 || !Array.isArray(res.item)) {
          // 북마크 불러오기 실패 시 원본 게시물만 설정
          setMergedPosts(posts);
          setLoading(false);
          return;
        }

        // 정상 응답 처리
        const bookmarkMap = new Map<number, number>();

        for (const b of res.item) {
          const postId = b.post?._id;
          const bookmarkId = b._id;

          if (typeof postId === 'number' && typeof bookmarkId === 'number') {
            bookmarkMap.set(postId, bookmarkId);
          }
        }

        const enriched = posts.map(post => {
          const rawId = post._id;
          const bookmarkId = bookmarkMap.get(Number(rawId));

          return {
            ...post,
            ...(bookmarkId ? { bookmarkId } : {}),
          };
        });

        setMergedPosts(enriched);
      } catch (err) {
        console.error('북마크 가져오기 실패:', err);
        setMergedPosts(posts);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [user, posts]);

  // 검색 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(mergedPosts);
    } else {
      const filtered = mergedPosts.filter(post => {
        const query = searchQuery.toLowerCase();

        if (searchField === 'title') {
          return post.title?.toLowerCase().includes(query) || post.content?.toLowerCase().includes(query);
        } else if (searchField === 'user') {
          return post.user?.name?.toLowerCase().includes(query);
        }

        return false;
      });
      setFilteredPosts(filtered);
    }

    // 검색 시 첫 페이지로 이동
    setCurrentPage(1);
  }, [mergedPosts, searchQuery, searchField]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value as 'title' | 'user');
  };

  if (loading) return <p className="text-gray-400 text-sm py-8">로딩 중...</p>;

  return (
    <>
      {/* 검색바 */}
      {!isMobile && (
        <div className="flex flex-row flex-nowrap px-4 justify-between mb-4">
          <CommunityWriteButton />
          <form onSubmit={handleSearch} className="flex items-center gap-2 justify-end">
            {/* 드롭다운 */}
            <div className="relative w-20 sm:w-24">
              <select name="searchField" value={searchField} onChange={handleSearchFieldChange} className="appearance-none w-full h-8 lg:h-10 pl-3 pr-8 border border-[#A97452] bg-white text-[#A97452] text-xs sm:text-sm lg:text-base rounded-md outline-none cursor-pointer">
                <option value="title">제목</option>
                <option value="user">작성자</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ArrowIcon svgProps={{ className: 'w-[10px] h-[6px] w-[12px] h-[8px] lg:w-[14px] lg:h-[9px]' }} />
              </div>
            </div>

            {/* 검색 input */}
            <div className="flex items-center gap-2 border border-[#A97452] rounded-md px-3 py-2 w-48 sm:w-60 lg:w-72 h-8 sm:h-8 lg:h-10 bg-white">
              <input type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={handleSearchInputChange} className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
            </div>
          </form>
        </div>
      )}
      {isMobile && (
        <div className="flex flex-col flex-nowrap w-full fixed z-20 bottom-0 bg-white border-t border-primary">
          <div className="flex flex-row flex-nowrap justify-between p-4">
            <CommunityWriteButton />
            <button type="button" className="w-full text-sm" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              검색하기
            </button>
          </div>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="flex flex-row flex-nowrap mb-4 gap-2 px-2">
              {/* 드롭다운 */}
              <div className="relative w-[40%]">
                <select name="searchField" value={searchField} onChange={handleSearchFieldChange} className="appearance-none p-4 w-full border border-primary text-center bg-white text-[#A97452] text-sm outline-none cursor-pointer">
                  <option value="title">제목</option>
                  <option value="user">작성자</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ArrowIcon svgProps={{ className: 'w-[10px] h-[6px] w-[12px] h-[8px] lg:w-[14px] lg:h-[9px]' }} />
                </div>
              </div>

              {/* 검색 input */}
              <div className="flex p-4 items-center gap-2 border border-[#A97452] w-full bg-white">
                <input type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={handleSearchInputChange} className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
              </div>
            </form>
          )}
        </div>
      )}

      {/* 이미지 그리드 */}
      <div className="px-4 my-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentPosts.map(post => (
            <CommunityPostCard key={post._id} post={post} apiUrl={apiUrl} bookmarkId={post.bookmarkId} />
          ))}
        </div>

        {/* 게시글이 없을 때 메시지 */}
        {currentPosts.length === 0 && !loading && <p className="text-gray-400 text-center py-8">{searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}</p>}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />}
    </>
  );
}
