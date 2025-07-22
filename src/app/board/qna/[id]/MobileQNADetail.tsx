import TriangleIcon from '@/components/icon/TriangleIcon';
import { Post } from '@/types/Post';
import Link from 'next/link';

interface MobileProps {
  post: Post;
  posts: Post[];
  id: string;
}

export default function MobileQNADetail({ post, posts, id }: MobileProps) {
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

  //문의 종류 배열
  const QNA_TYPES = [
    { type: '상품 문의', value: 'product' },
    { type: '배송 문의', value: 'delivery' },
    { type: '주문/결제', value: 'order' },
    { type: '반품/교환', value: 'return' },
    { type: '환불 문의', value: 'refund' },
    { type: '재입고 문의', value: 'restock' },
    { type: '기타 문의', value: 'etc' },
  ];

  console.log(posts);

  return (
    <article className="bg-white pt-6 pb-12 min-h-[80vh] text-xs">
      <h2 className="sr-only">문의사항</h2>
      <div className="flex flex-col flex-nowrap px-4">
        <nav aria-label="브레드크럼">
          <ol className="text-xs text-secondary-green flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href="/board/qna">문의게시판</Link>
            </li>
          </ol>
        </nav>
        <span className=" pt-2">{QNA_TYPES.find(item => item.value === post.extra?.qnatype)?.type}</span>
        <h3 className="text-lg font-bold text-[#A97452] pb-2">{post.title}</h3>
        <span className="font-bold">{post.user.name}</span>
        <span className="text-blue-400">{post.replies ? '답변 완료' : '답변 대기'}</span>
        <span className="text-gray">{post.createdAt}</span>
      </div>
      <hr className="border-light-gray my-4" />

      <section className="p-4 whitespace-pre-line text-sm">
        <div className="mb-12 flex flex-col flex-nowrap gap-4">
          <span>상품명 {post.product.name}</span>
          {post.content}
        </div>
        {post.replies && (
          <div className="bg-secondary text-left p-8 flex flex-col flex-nowrap">
            <span className="font-bold">{post.replies[0].user.name}</span>
            <p>{post.replies[0].content}</p>
          </div>
        )}
      </section>
      <aside>
        <ul className="flex flex-col flex-nowrap my-4">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[0] && <span>다음 글이 없습니다.</span>}
            {asidePosts[0] && <Link href={`/board/qna/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[1] && <span>이전 글이 없습니다.</span>}
            {asidePosts[1] && <Link href={`/board/qna/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link>}
          </li>
        </ul>
      </aside>
    </article>
  );
}
