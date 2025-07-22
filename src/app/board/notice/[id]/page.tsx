'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/types/Post';
import { getPost, getPosts } from '@/utils/getPosts';
import DesktopNoticeDetail from './DesktopNoticeDetail';
// import MobileNoticeDetail from './MobileNoticeDetail';
import { notFound } from 'next/navigation';
import Loading from '@/app/loading';
import MobileNoticeDetail from './MobileNoticeDetail';

export default function NoticeDetailWrapper() {
  const params = useParams();
  const id = params.id as string;

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize(); // 처음 렌더링 시 창 너비 감지
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const postRes = await getPost(Number(id));
      if (!postRes.ok) {
        notFound();
        return;
      }

      const noticeRes = await getPosts('notice');

      setPost(postRes.item);
      setPosts(noticeRes.ok === 1 ? noticeRes.item : []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading || !post) return <Loading></Loading>;

  if (isMobile) {
    return <MobileNoticeDetail id={id} post={post} posts={posts} />;
  }

  return <DesktopNoticeDetail id={id} post={post} posts={posts} />;
}
