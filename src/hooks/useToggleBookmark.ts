import { useState, useEffect, useRef } from 'react';
import { addBookmark } from '@/data/actions/addBookmark';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useToggleBookmark(initialBookmarkId: number | undefined, productId: number, accessToken?: string) {
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState<number | undefined>(initialBookmarkId);
  const isToggling = useRef(false); // 토글 중복 방지용 플래그
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    setIsLiked(!!initialBookmarkId);
    setBookmarkId(initialBookmarkId);
  }, [initialBookmarkId]);

  const toggle = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (isToggling.current) return;
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isLiked && !bookmarkId) {
      console.warn('삭제할 bookmarkId가 없습니다.');
      return;
    }

    isToggling.current = true;
    try {
      if (isLiked) {
        await deleteBookmark(bookmarkId!, accessToken);
        setBookmarkId(undefined);
        setIsLiked(false);
      } else {
        const res = await addBookmark(productId, 'product', accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
      // 토글 성공 후 이벤트 발생
      window.dispatchEvent(new CustomEvent('bookmarkChanged'));
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      setIsLiked(prev => !prev);
    } finally {
      isToggling.current = false;
    }
  };

  return { isLiked, toggle };
}
