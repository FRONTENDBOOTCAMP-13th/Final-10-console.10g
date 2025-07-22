import TriangleIcon from '@/components/icon/TriangleIcon';
import { Post } from '@/types/Post';
import Link from 'next/link';

interface DesktopProps {
  post: Post;
  posts: Post[];
  id: string;
}

export default function DesktopNoticeDetail({ post, posts, id }: DesktopProps) {
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
    <article className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      <nav aria-label="브레드크럼">
        <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>&gt;</li>
          <li>
            <Link href="/board/notice">공지게시판</Link>
          </li>
        </ol>
      </nav>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">공지사항</h2>
      <table className="border-t-2 border-primary w-full text-sm lg:text-base">
        <caption className="sr-only">도토리섬 공지사항 게시글 확인</caption>
        <colgroup>
          <col width="15%" />
          <col width="50%" />
          <col width="15%" />
          <col width="20%" />
        </colgroup>

        <tbody>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">제목</th>
            <td className="p-4">
              <h3>{post.title}</h3>
            </td>
          </tr>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">작성자</th>
            <td className="p-4">{post.user.name}</td>
            <th className="py-4 bg-secondary">날짜</th>
            <td className="p-4">{post.createdAt}</td>
          </tr>
        </tbody>
      </table>

      <section className="p-8 text-center whitespace-pre-line text-sm lg:text-base">{post.content}</section>
      <aside>
        <ul className="flex flex-col flex-nowrap text-sm lg:text-base">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[0] && <span>다음 글이 없습니다.</span>}
            {asidePosts[0] && <Link href={`/board/notice/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[1] && <span>이전 글이 없습니다.</span>}
            {asidePosts[1] && <Link href={`/board/notice/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link>}
          </li>
        </ul>
      </aside>
    </article>
  );
}
