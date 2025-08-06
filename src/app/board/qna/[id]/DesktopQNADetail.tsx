'use client';

import { useState, useActionState } from 'react';
import TriangleIcon from '@/components/icon/TriangleIcon';
import { deletePost, createReply } from '@/data/actions/post';
import { useLoginStore } from '@/stores/loginStore';
import { Post, PostReply } from '@/types/Post';
import { ApiRes } from '@/types/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; //답변 완료 후 딜레이 주고 다시 그 경로로 가게 하기 위해(그래야 답변 추가된 화면 뜨니까) 써봅시다
import { createReplyNotification } from '@/data/actions/addNotification';
import { getUserById } from '@/utils/getUsers';
import { toast } from 'react-hot-toast';

interface DesktopProps {
  post: Post;
  posts: Post[];
  id: string;
  reply?: PostReply[];
}

export default function DesktopQNADetail({ post, posts, id, reply }: DesktopProps) {
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
    <article className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      <nav aria-label="브레드크럼">
        <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>&gt;</li>
          <li>
            <Link href="/board/qna">문의게시판</Link>
          </li>
        </ol>
      </nav>

      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">문의사항</h2>

      <table className="border-t-2 border-primary w-full text-sm lg:text-base">
        <caption className="sr-only">도토리섬 문의사항 게시글 확인</caption>
        <colgroup>
          <col width="12%" />
          <col width="32%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="20%" />
        </colgroup>
        <tbody>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">제목</th>
            <td className="p-4" colSpan={5}>
              <h3>{post.title}</h3>
            </td>
          </tr>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">작성자</th>
            <td className="p-4">{post.user.name}</td>
            <th className="py-4 bg-secondary">답변 여부</th>
            <td className="p-4">{reply && reply.length > 0 ? '답변 완료' : '답변 대기'}</td>
            <th className="py-4 bg-secondary">날짜</th>
            <td className="p-4">{post.createdAt}</td>
          </tr>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">문의 종류</th>
            <td className="p-4">{QNA_TYPES.find(item => item.value === post.extra?.qnatype)?.type}</td>
            <th className="py-4 bg-secondary">상품명</th>
            <td className="p-4" colSpan={3}>
              {post.extra?.productName ? post.extra.productName : '.'}
            </td>
          </tr>
        </tbody>
      </table>

      <section className="p-8 whitespace-pre-line text-sm lg:text-base">
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
        <ul className="flex flex-col flex-nowrap text-sm lg:text-base">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[0] ? <span>다음 글이 없습니다.</span> : <Link href={`/board/qna/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[1] ? <span>이전 글이 없습니다.</span> : <Link href={`/board/qna/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link>}
          </li>
          <li className="self-end mt-8 flex gap-4 flex-wrap">
            {isAuthor && (
              <>
                <Link href={`/board/qna/edit/${post._id}`} className="py-2 px-8 bg-primary-dark text-white hover:bg-[#966343]">
                  수정하기
                </Link>
                <button onClick={handleDelete} className="py-2 px-8 bg-primary-dark text-white hover:bg-[#966343] cursor-pointer">
                  삭제하기
                </button>
              </>
            )}
            {user?.type === 'admin' && (
              <button onClick={() => setShowReplyPopup(true)} className="py-2 px-8 bg-primary-dark text-white hover:bg-[#966343] cursor-pointer">
                답변 달기
              </button>
            )}
            <Link href="/board/qna" className="py-2 px-8 bg-primary-dark text-white hover:bg-[#966343] cursor-pointer">
              목록
            </Link>
          </li>
        </ul>
      </aside>

      {/* 답변 입력 모달 */}
      {showReplyPopup && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center" onClick={() => setShowReplyPopup(false)}>
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">답변 작성</h3>
            <form
              action={formAction}
              onSubmit={() => {
                setTimeout(() => {
                  router.refresh();
                }, 300);
                setShowReplyPopup(false);
              }}
            >
              <textarea name="content" className="w-full h-32 border border-gray-300 p-2 mb-4" placeholder="답변을 입력하세요" required />
              <input type="hidden" name="_id" value={post._id} />
              <input type="hidden" name="type" value="qna" />
              <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReplyPopup(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-pointer">
                  취소
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-dark text-white hover:bg-[#966343] rounded cursor-pointer" disabled={isPending}>
                  {isPending ? '등록 중...' : '등록'}
                </button>
              </div>
              {state?.ok === 0 && <p className="text-red-500 text-sm mt-2">{state.message || '답변 등록 실패'}</p>}
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
