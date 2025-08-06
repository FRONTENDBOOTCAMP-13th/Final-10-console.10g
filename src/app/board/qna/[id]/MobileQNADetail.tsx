'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TriangleIcon from '@/components/icon/TriangleIcon';
import { deletePost, createReply } from '@/data/actions/post';
import { useLoginStore } from '@/stores/loginStore';
import { Post, PostReply } from '@/types/Post';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';
import { ApiRes } from '@/types/api';
import { getUserById } from '@/utils/getUsers';
import { createReplyNotification } from '@/data/actions/addNotification';
import { toast } from 'react-hot-toast';

interface MobileProps {
  post: Post;
  posts: Post[];
  id: string;
  reply?: PostReply[];
}

export default function MobileQNADetail({ post, posts, id, reply }: MobileProps) {
  const user = useLoginStore(state => state.user);
  const isAuthor = user?.token?.accessToken === post.accessToken;
  const router = useRouter();

  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [state, formAction, isPending] = useActionState(async (prevState: ApiRes<PostReply> | null, formData: FormData) => {
    const res = await createReply(prevState, formData);
    const targetUserRes = await getUserById(Number(post.user._id));

    if (targetUserRes.ok && user) {
      const notificationRes = await createReplyNotification(post, targetUserRes.item, user, true);
      if (notificationRes.ok) {
        toast.success(`${targetUserRes.item.name}님께 답변 알림을 보냈습니다.`);
      }
    }

    return res;
  }, null);

  const asidePosts: (Post | null)[] = [null, null];
  // 하단에 있는 다음글/이전글
  for (let i = 0; i < posts.length; i++) {
    if (posts[i]._id == id) {
      if (i != 0) asidePosts[0] = posts[i - 1];
      if (i != posts.length - 1) asidePosts[1] = posts[i + 1];
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

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const formData = new FormData();
      formData.append('_id', String(post._id));
      formData.append('accessToken', user?.token.accessToken ?? '');
      formData.append('boardType', 'qna');
      const result = await deletePost(null, formData);
      if (result?.ok) {
        toast.success('삭제가 완료되었습니다.');
        // deletePost 내부에서 페이지 이동 처리됨
      } else {
        toast.error(result?.message || '삭제에 실패했습니다.');
      }
    }
  };

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
        <h3 className="text-lg font-bold text-[#A97452] mt-2">{post.title}</h3>
        <table className="border-separate border-spacing-y-2">
          <caption className="sr-only">도토리섬 문의사항 게시글 확인</caption>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <tbody>
            <tr>
              <th className="text-left border-r-2 border-gray">문의 유형</th>
              <td className="pl-4">{QNA_TYPES.find(item => item.value === post.extra?.qnatype)?.type}</td>
            </tr>
            <tr>
              <th className="text-left border-r-2 border-gray">작성자</th>
              <td className="pl-4">{post.user.name}</td>
            </tr>
            <tr>
              <th className="text-left border-r-2 border-gray">답변 여부</th>
              <td className="pl-4">{reply && reply.length > 0 ? '답변 완료' : '답변 대기'}</td>
            </tr>
          </tbody>
        </table>
        {/* <span className=" pt-2">{QNA_TYPES.find(item => item.value === post.extra?.qnatype)?.type}</span>
        <span className="font-bold">{post.user.name}</span>
        <span className="text-blue-400">{reply && reply.length > 0 ? '답변 완료' : '답변 대기'}</span> */}

        <span className="text-gray">{post.createdAt}</span>
      </div>
      <hr className="border-light-gray my-4" />

      <section className="p-4 whitespace-pre-line text-sm">
        <div className="mb-12 flex flex-col flex-nowrap gap-4">
          {(post.extra?.productName || post.extra?.orderProductName) && (
            <div className="flex flex-row flex-nowrap w-full p-8 border border-primary items-center gap-8">
              <Image src={post.extra.qnatype === 'product' ? post.extra.imagePath : post.extra.orderProductImage} alt={`${post.extra.qnatype === 'product' ? post.extra.productName : post.extra.orderProductName} 상품 이미지`} width={100} height={100} />
              <div className="flex flex-col flex-nowrap">
                <p className="text-base font-bold">문의 상품</p>
                <p>{post.extra.qnatype === 'product' ? post.extra.productName : post.extra.orderProductName}</p>
                <Link href={`/products/${post.extra.qnatype === 'product' ? post.extra.productId : post.extra.orderProductId}`} className="bg-primary text-white p-2 w-fit mt-4">
                  상품 보러가기
                </Link>
              </div>
            </div>
          )}
          {post.content}
        </div>
        {reply && reply.length > 0 && (
          <div className="bg-secondary text-left p-8 flex flex-col flex-nowrap">
            <span className="font-bold">{reply[0].user.name}</span>
            <p>{reply[0].content}</p>
          </div>
        )}
      </section>

      <aside>
        <ul className="flex flex-col flex-nowrap my-4">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {asidePosts[0] ? <Link href={`/board/qna/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link> : <span>다음 글이 없습니다.</span>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-3 h-3' }} polygonProps={{ fill: '#757575' }} />
            {asidePosts[1] ? <Link href={`/board/qna/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link> : <span>이전 글이 없습니다.</span>}
          </li>
          <li className="self-end mt-8 flex gap-4">
            {isAuthor && (
              <>
                <Link href={`/board/qna/edit/${post._id}`} className="w-fit py-2 px-3 bg-primary-dark text-white  hover:bg-[#966343] transition-colors">
                  수정하기
                </Link>
                <button onClick={handleDelete} className="w-fit py-2 px-3 bg-primary-dark text-white hover:bg-[#966343] transition-colors cursor-pointer">
                  삭제하기
                </button>
              </>
            )}
            {user?.type === 'admin' && (
              <button onClick={() => setShowReplyPopup(true)} className="py-2 px-3 bg-primary-dark text-white hover:bg-[#966343] cursor-pointer">
                답변 달기
              </button>
            )}
            <Link href="/board/qna" className="py-2 px-3 bg-primary-dark text-white hover:bg-[#966343] ">
              목록
            </Link>
          </li>
        </ul>
      </aside>

      {showReplyPopup && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center" onClick={() => setShowReplyPopup(false)}>
          <div className="bg-white p-4 rounded shadow-md w-11/12 max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-2">답변 작성</h3>
            <form
              action={formAction}
              onSubmit={() => {
                setShowReplyPopup(false);
                setTimeout(() => {
                  router.refresh();
                }, 300);
              }}
            >
              <textarea name="content" required className="w-full h-24 border border-gray-300 p-2 mb-2 text-sm" placeholder="답변을 입력하세요" />
              <input type="hidden" name="_id" value={post._id} />
              <input type="hidden" name="type" value="qna" />
              <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReplyPopup(false)} className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded cursor-pointer">
                  취소
                </button>
                <button type="submit" disabled={isPending} className="px-3 py-1 bg-primary-dark text-white text-xs rounded hover:bg-[#966343] cursor-pointer">
                  {isPending ? '등록 중...' : '등록'}
                </button>
              </div>
              {state?.ok === 0 && <p className="text-red-500 text-xs mt-1">{state.message || '답변 등록 실패'}</p>}
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
