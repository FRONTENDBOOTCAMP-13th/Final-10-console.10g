'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/types/Post';
import { useLoginStore } from '@/stores/loginStore';
import { addBookmark } from '@/data/actions/addBookmark';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';
import ImageModal from './ImageModal';
import MypageIcon from '@/components/icon/MypageIcon';
import CommentBubble from '@/components/icon/CommentIcon';
import { toast } from 'react-hot-toast';

interface Props {
  post: Post;
  apiUrl: string;
  bookmarkId?: number; // 상위에서 전달받는 북마크 ID (있으면 좋아요된 상태)
}

export default function CommunityPostCard({ post, bookmarkId: initialBookmarkId }: Props) {
  const user = useLoginStore(state => state.user);
  // 좋아요 여부 및 bookmarkId 상태
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState<number | undefined>(initialBookmarkId);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks ?? 0);

  // 이미지 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log('Post image:', post.image); // 디버깅용
  // console.log(clientId);

  // bookmarkId가 props로 바뀌면 상태 동기화
  useEffect(() => {
    setIsLiked(!!initialBookmarkId);
    setBookmarkId(initialBookmarkId);
  }, [initialBookmarkId]);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user?.token?.accessToken) {
      toast.error('로그인이 필요합니다!');
      return;
    }

    try {
      if (isLiked && bookmarkId !== undefined) {
        setIsLiked(false);
        setBookmarkCount(prev => prev - 1);
        await deleteBookmark(bookmarkId, user.token.accessToken);
        setBookmarkId(undefined);
      } else {
        const res = await addBookmark(post._id as number, 'post', user.token.accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
          setBookmarkCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패', error);
      // rollback UI
      setIsLiked(prev => !prev);
    }
  };

  // 이미지 클릭 핸들러
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg border border-[#E5CBB7] overflow-hidden hover:shadow-lg transition-shadow">
        {/* 이미지 부분 - 클릭 시 모달 열기 */}
        <div className="relative aspect-square cursor-pointer group bg-gray-100 overflow-hidden" onClick={handleImageClick}>
          <Image
            src={post.image[0]}
            alt={post.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            unoptimized
            onError={e => {
              console.error('Image loading error:', e);
            }}
          />
        </div>

        <div className="p-2">
          {/* 작성자 프로필 */}
          <div className="flex items-center mb-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
              {typeof post.user.image === 'string' ? (
                // 이미지 등록한 경우 (Cloudinary 등 외부 URL)
                <Image src={post.user.image} alt={post.user.name ?? '기본 프로필'} fill style={{ objectFit: 'cover' }} />
              ) : post.user.image?.path ? (
                // 기본 이미지 경로 (object로 온 경우)
                <Image src={post.user.image.path} alt={post.user.name ?? '기본 프로필'} fill style={{ objectFit: 'cover' }} />
              ) : (
                // 어떤 이미지도 없을 때 (예외 처리)
                <MypageIcon svgProps={{ className: 'w-5 h-5' }} />
              )}
            </div>
            <span className="font-semibold text-xs text-gray-800">{post.user.name}</span>
          </div>

          {/* 게시글 내용 */}
          {post.content && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.content}</p>}

          {/* 하트 + 댓글 수 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={handleLikeToggle} className="flex items-center space-x-1" aria-label="북마크 토글">
                {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}

                <span className="text-xs text-gray-600">{bookmarkCount}</span>
              </button>

              {/* 댓글 수 (아이콘은 동일) */}
              <div className="flex items-center space-x-1">
                <CommentBubble svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray-400' }} />
                <span className="text-xs text-gray-600">{post.repliesCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 이미지 모달 */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleClose}
        images={post.image} // 이미지 배열 전달
        imageAlt={post.title}
        postId={Number(post._id)}
        postUserId={post.user._id}
      />
    </>
  );
}
