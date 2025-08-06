'use client';

import { useEffect, useState, useActionState, useCallback } from 'react';
import Image from 'next/image';
import { Post, PostReply } from '@/types/Post';
import { getReplies, getPost } from '@/utils/getPosts';
import { getUserById } from '@/utils/getUsers';
import { createReplyNotification } from '@/data/actions/addNotification';
import MypageIcon from '@/components/icon/MypageIcon';
import { createReply, deletePost, deleteReply } from '@/data/actions/post';
import { ApiRes } from '@/types/api';
import { useLoginStore } from '@/stores/loginStore';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[]; // 단일 imageSrc 대신 이미지 배열
  imageAlt: string;
  postId: number;
  postUserId?: string | number;
}

export default function ImageModal({ isOpen, onClose, images, imageAlt, postId, postUserId }: ImageModalProps) {
  const [comments, setComments] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // 활성화된 드롭다운
  const [postDropdownActive, setPostDropdownActive] = useState(false); // 게시글 드롭다운

  const user = useLoginStore(state => state.user);
  const isLogin = useLoginStore(state => state.isLogin);

  const [state, formAction, isPending] = useActionState(async (prevState: ApiRes<PostReply> | null, formData: FormData) => {
    const res = await createReply(prevState, formData);

    // 댓글 작성이 성공했을 때 알림 생성
    if (res?.ok === 1 && user) {
      try {
        // 게시글 정보 가져오기
        const postRes = await getPost(postId);

        if (postRes.ok === 1 && postRes.item) {
          // 게시글 작성자 정보 가져오기
          const targetUserRes = await getUserById(Number(postRes.item.user._id));

          if (targetUserRes.ok === 1 && targetUserRes.item) {
            // 댓글 작성자와 게시글 작성자가 다를 때만 알림 생성
            if (user._id !== targetUserRes.item._id) {
              const notiRes = await createReplyNotification(postRes.item, targetUserRes.item, user);

              if (notiRes.ok) {
                console.log('댓글 알림이 성공적으로 전송되었습니다.');
              } else {
                console.error('알림 전송 실패:', notiRes.message);
              }
            }
          }
        }
      } catch (error) {
        console.error('알림 생성 중 오류 발생:', error);
      }
    }

    return res;
  }, null);

  const [deleteState, deleteFormAction, isDeletePending] = useActionState(async (prevState: ApiRes<PostReply> | null, formData: FormData) => {
    const res = await deleteReply(prevState, formData);

    // 삭제 성공 시 댓글 목록에서 제거
    if (res?.ok === 1) {
      const replyId = Number(formData.get('replyId'));
      setComments(prev => prev.filter(comment => comment._id !== replyId));
      setActiveDropdown(null); // 드롭다운 닫기
    }

    return res;
  }, null);

  const [deletePostState, deletePostFormAction, isDeletePostPending] = useActionState(async (prevState: ApiRes<Post> | null, formData: FormData) => {
    const res = await deletePost(prevState, formData);

    // 삭제 성공 시 모달 닫기
    if (res?.ok === 1) {
      onClose();
    }

    return res;
  }, null);

  // 이전/다음 이미지로 이동
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  // 키보드 이벤트 (좌우 화살표키)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, images.length, goToNext, goToPrevious, onClose]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeDropdown !== null || postDropdownActive) {
        const target = e.target as Element;
        if (!target.closest('[data-dropdown]')) {
          setActiveDropdown(null);
          setPostDropdownActive(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown, postDropdownActive]);

  // 모달이 열릴 때마다 첫 번째 이미지로 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setActiveDropdown(null); // 드롭다운도 초기화
      setPostDropdownActive(false); // 게시글 드롭다운도 초기화
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getReplies(postId)
      .then(res => {
        if (res.ok === 1) setComments(res.item);
        else setComments([]);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [isOpen, postId]);

  useEffect(() => {
    if (state?.ok === 1 && state.item) {
      setComments(prev => [...prev, state.item]);
    }
  }, [state]);

  const handleInputClick = () => {
    if (!isLogin) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isLogin) {
      e.target.blur();
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleDropdownToggle = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  const handlePostDropdownToggle = () => {
    setPostDropdownActive(!postDropdownActive);
  };

  // 현재 사용자가 게시글 작성자인지 확인
  const isPostOwner = user && postUserId && (user._id === postUserId || user._id === Number(postUserId));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur" onClick={onClose}>
      <div className="flex flex-col sm:flex-row bg-transparent rounded-lg overflow-hidden shadow-2xl max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* 이미지 영역 */}
        <div className="bg-black flex items-center justify-center w-full h-[320px] sm:w-[600px] sm:h-[600px] max-w-[100vw] sm:max-w-[80vw] max-h-[40vh] sm:max-h-[80vh] relative">
          {/* 현재 이미지 */}
          <div className="w-full h-full relative">
            <Image src={images[currentImageIndex]} alt={`${imageAlt} ${currentImageIndex + 1}`} fill className="object-cover" unoptimized priority />
          </div>

          {/* 게시글 3점 메뉴 버튼 */}
          <div className="absolute top-4 right-4 z-20" data-dropdown>
            <button onClick={handlePostDropdownToggle} className="p-2 bg-[rgba(0,0,0,0.5)] text-white rounded-full hover:bg-opacity-70 transition-all" aria-label="게시글 옵션">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {/* 게시글 드롭다운 메뉴 */}
            {postDropdownActive && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[80px]">
                {/* 내 게시글인 경우 삭제 옵션 표시 */}
                {isPostOwner && (
                  <form action={deletePostFormAction} className="m-0">
                    <input type="hidden" name="_id" value={postId} />
                    <input type="hidden" name="boardType" value="community" />
                    <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
                    <button
                      type="submit"
                      disabled={isDeletePostPending}
                      className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50 disabled:opacity-50 text-sm"
                      onClick={e => {
                        if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {isDeletePostPending ? '삭제 중...' : '삭제'}
                    </button>
                  </form>
                )}
                <button onClick={() => setPostDropdownActive(false)} className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm">
                  취소
                </button>
              </div>
            )}
          </div>

          {/* 이전 버튼 */}
          {currentImageIndex > 0 && (
            <button onClick={goToPrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10" aria-label="이전 이미지">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {/* 다음 버튼 */}
          {currentImageIndex < images.length - 1 && (
            <button onClick={goToNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10" aria-label="다음 이미지">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {/* 이미지 인디케이터 (여러 이미지가 있을 때만 표시) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} aria-label={`${index + 1}번째 이미지로 이동`} />
              ))}
            </div>
          )}
          {/* 이미지 카운터 */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
        {/* 댓글 영역 */}
        <div className="bg-white w-full sm:w-[360px] h-[400px] sm:h-[600px] max-w-[100vw] sm:max-w-[90vw] max-h-[50vh] sm:max-h-[80vh] flex flex-col p-0">
          <div className="font-bold text-xl text-gray-800 border-b border-gray-300 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">댓글</div>
          {/* 댓글 리스트 */}
          <div className="flex-grow overflow-y-auto px-4 py-2 sm:px-6 sm:py-4 scrollbar-thin">
            {loading ? (
              <p className="text-gray-500">댓글 로딩 중...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400">댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map(comment => (
                  <li key={comment._id} className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {typeof comment.user.image === 'string' ? (
                        <Image src={comment.user.image} alt={`${comment.user.name} 프로필`} width={28} height={28} className="object-cover w-full h-full" unoptimized />
                      ) : comment.user.image?.path ? (
                        <Image src={comment.user.image.path} alt={`${comment.user.name} 프로필`} width={28} height={28} className="object-cover w-full h-full" unoptimized />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200">
                          <MypageIcon svgProps={{ className: 'w-5 h-5 text-gray-400' }} />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="font-semibold text-gray-900">{comment.user.name}</div>
                      <div className="text-gray-700">{comment.content}</div>
                    </div>

                    {/* 3점 메뉴 버튼 */}
                    <div className="relative" data-dropdown>
                      <button onClick={() => handleDropdownToggle(Number(comment._id))} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="댓글 옵션">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {activeDropdown === comment._id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[80px]">
                          {user && user._id === comment.user._id && (
                            <form action={deleteFormAction} className="m-0">
                              <input type="hidden" name="_id" value={postId} />
                              <input type="hidden" name="replyId" value={comment._id} />
                              <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
                              <button type="submit" disabled={isDeletePending} className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50 disabled:opacity-50 text-sm">
                                {isDeletePending ? '삭제 중...' : '삭제'}
                              </button>
                            </form>
                          )}
                          <button onClick={() => setActiveDropdown(null)} className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 text-sm">
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 댓글 입력 영역 */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-2 sm:py-3 bg-white flex-shrink-0">
            <form
              action={formAction}
              className="flex items-center"
              onSubmit={e => {
                if (!isLogin) {
                  e.preventDefault();
                  setLoginError(true);
                  setTimeout(() => setLoginError(false), 3000);
                  return;
                }
                const input = e.currentTarget.elements.namedItem('content') as HTMLInputElement;
                if (!input.value.trim()) {
                  e.preventDefault();
                }
              }}
              autoComplete="off"
            >
              <input type="text" name="content" placeholder={isLogin ? '댓글을 입력해주세요' : '로그인 후 댓글을 작성할 수 있습니다'} className={`flex-grow border-0 focus:ring-0 focus:outline-none text-gray-800 bg-transparent ${!isLogin ? 'cursor-pointer' : ''}`} disabled={isPending || !isLogin} spellCheck={false} autoComplete="off" onClick={handleInputClick} onFocus={handleInputFocus} readOnly={!isLogin} />
              <input type="hidden" name="_id" value={postId} />
              <input type="hidden" name="type" value="community" />
              <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
              <button type="submit" className="ml-2 text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-700" disabled={isPending || !isLogin}>
                게시
              </button>
            </form>

            {/* 에러 메시지 */}
            {loginError && <p className="text-red-500 text-sm mt-1">로그인이 필요합니다.</p>}
            {state?.ok === 0 && <p className="text-red-500 text-sm mt-1">{state.message || '댓글 작성 실패'}</p>}
            {deleteState?.ok === 0 && <p className="text-red-500 text-sm mt-1">{deleteState.message || '댓글 삭제 실패'}</p>}
            {deletePostState?.ok === 0 && <p className="text-red-500 text-sm mt-1">{deletePostState.message || '게시글 삭제 실패'}</p>}
          </div>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" aria-label="모달 닫기">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 안내 텍스트 */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">{images.length > 1 ? '← → 키나 스와이프로 이미지 전환 • ESC나 클릭으로 닫기' : '클릭하거나 ESC를 눌러 닫기'}</div> */}
    </div>
  );
}
