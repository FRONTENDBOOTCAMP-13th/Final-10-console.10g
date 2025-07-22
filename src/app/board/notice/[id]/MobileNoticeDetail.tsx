import TriangleIcon from '@/components/icon/TriangleIcon';
import { Post } from '@/types/Post';
import Link from 'next/link';

interface MobileProps {
  post: Post;
  posts: Post[];
  id: string;
}

export default function MobileNoticeDetail({ post, posts, id }: MobileProps) {
  const asidePosts: (Post | null)[] = [null, null];

  for (let i = 0; i < posts.length; i++) {
    if (posts[i]._id == id) {
      if (i != 0) {
        asidePosts[0] = posts[i - 1];
      }

      if (i != posts.length - 1) {
        asidePosts[1] = posts[i + 1];
      }
      break;
    }
  }
  return (
    <article className="bg-white pt-6 pb-12 min-h-[80vh] text-xs">
      <h2 className="sr-only">공지사항</h2>
      <div className="flex flex-col flex-nowrap px-4">
        <nav aria-label="브레드크럼">
          <ol className="text-xs text-secondary-green flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href="/board/notice">공지게시판</Link>
            </li>
          </ol>
        </nav>
        <h3 className="text-lg font-bold text-[#A97452] py-2">{post.title}</h3>
        <span className="font-bold">{post.user.name}</span>
        <span className="text-gray">{post.createdAt}</span>
      </div>
      <hr className="border-light-gray my-4" />

      <section className="p-4 text-center whitespace-pre-line text-sm">{post.content}</section>
      <aside>
        <ul className="flex flex-col flex-nowrap my-4">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[0] && <span>다음 글이 없습니다.</span>}
            {asidePosts[0] && <Link href={`/board/notice/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[1] && <span>이전 글이 없습니다.</span>}
            {asidePosts[1] && <Link href={`/board/notice/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link>}
          </li>
        </ul>
      </aside>
    </article>
  );
}
