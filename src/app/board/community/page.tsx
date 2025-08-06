//자유 게시판
// import ArrowIcon from '@/components/icon/ArrowIcon';
// import SearchIcon from '@/components/icon/SearchIcon';
import { Post } from '@/types/Post';
import { getPosts } from '@/utils/getPosts';
// import Link from 'next/link';
// import Image from 'next/image';
// import FavoriteBorderIcon from '@/components/icon/FavoriteBorderIcon';
// import CommunityPostCard from './CommunityPostCard';
import CommunityBoardClientWrapper from './CommunityBoardClientWrapper';
import Breadcrumb from '@/components/common/Breadcrumb';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const dynamic = 'force-dynamic';
export default async function CommunityBoardPage() {
  const res = await getPosts('community');
  const posts: Post[] = res.ok === 1 ? res.item : [];
  // console.log(posts);
  // product.image가 있는 게시글만 필터링
  const imagePosts = posts.filter(post => post.image);
  // console.log(imagePosts);
  // console.log(`${API_URL}/files/${CLIENT_ID}`);
  // imagePosts.map(post => console.log(`${API_URL}/files/${CLIENT_ID}/${post.product.image}`));
  return (
    <>
      <div className="bg-white pb-12 min-h-[80vh] flex flex-col flex-nowrap">
        <div className="p-4 sm:pt-8">
          <Breadcrumb
            items={[
              { label: '홈', href: '/' },
              { label: 'COMMMUNITY', href: '/board' },
              { label: '자유게시판', href: '/board/community' },
            ]}
          />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">자유게시판</h2>
        </div>
        {/* 이미지 그리드와 페이지네이션 */}
        <CommunityBoardClientWrapper posts={imagePosts} apiUrl={API_URL!} />
      </div>
    </>
  );
}
