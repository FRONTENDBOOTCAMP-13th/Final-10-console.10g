'use client';

import { startTransition, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { createPost } from '@/data/actions/post';

interface PreviewImage {
  file: File;
  preview: string;
  id: string;
  name: string;
}

export default function ImagePostForm({ boardType }: { boardType: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [state, formAction, isLoading] = useActionState(createPost, null);
  const user = useLoginStore(state => state.user);

  const MAX_IMAGES = 5; // 최대 이미지 개수 제한

  console.log(state);

  // 박스 클릭 → 파일선택창 열림
  const onClickBox = () => {
    if (!isLoading && previewImages.length < MAX_IMAGES) {
      setUploadError('');
      fileRef.current?.click();
    }
  };

  // 다중 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    // 현재 이미지 개수 + 새로 선택한 파일 개수가 최대치를 넘으면 제한
    const remainingSlots = MAX_IMAGES - previewImages.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);

    if (imageFiles.length > remainingSlots) {
      setUploadError(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`);
    } else if (files.length !== imageFiles.length) {
      setUploadError('이미지 파일만 업로드할 수 있습니다.');
    } else {
      setUploadError('');
    }

    // 각 파일에 대해 미리보기 생성
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: PreviewImage = {
          file,
          preview: reader.result as string,
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
        };

        setPreviewImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // input 초기화 (같은 파일 재선택 가능하도록)
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  // 개별 이미지 삭제
  const removeImage = (id: string) => {
    setPreviewImages(prev => prev.filter(img => img.id !== id));
    setUploadError('');
  };

  // 폼 제출 처리
  const handleSubmit = () => {
    // 유효성 검사
    if (previewImages.length === 0) {
      setUploadError('최소 1개의 이미지를 첨부해주세요!');
      return;
    }

    if (!titleRef.current?.value.trim()) {
      setUploadError('제목을 입력해주세요!');
      titleRef.current?.focus();
      return;
    }

    if (!contentRef.current?.value.trim()) {
      setUploadError('내용을 입력해주세요!');
      contentRef.current?.focus();
      return;
    }

    setUploadError('');

    // FormData 생성
    const formData = new FormData();
    formData.append('accessToken', user?.token?.accessToken ?? '');
    formData.append('type', boardType);
    formData.append('title', titleRef.current.value.trim());
    formData.append('content', contentRef.current.value.trim());

    // 모든 이미지 파일 추가
    previewImages.forEach(img => {
      formData.append('attach', img.file);
    });

    // createPost 액션 호출
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.3)] flex flex-col items-center justify-center rounded-lg">
          <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-white font-semibold text-sm">게시글 등록 중...</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 파일 선택 input */}
        <input type="file" ref={fileRef} accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={isLoading} />

        {/* 이미지 업로드 영역 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">이미지 첨부</h3>
            <span className="text-sm text-gray-500">
              {previewImages.length}/{MAX_IMAGES}
            </span>
          </div>

          {/* 이미지 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 기존 이미지들 */}
            {previewImages.map(img => (
              <div key={img.id} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200">
                  <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                  {/* 삭제 버튼 */}
                  <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1 right-1 w-6 h-6 text-red-500 rounded-full text-2xl hover:text-red-700 transition  flex items-center justify-center" aria-label="이미지 삭제">
                    ×
                  </button>
                </div>
                {/* 파일명 표시 */}
                <div className="mt-1 text-xs text-gray-500 truncate" title={img.name}>
                  {img.name}
                </div>
              </div>
            ))}

            {/* 이미지 추가 버튼 */}
            {previewImages.length < MAX_IMAGES && (
              <div
                onClick={onClickBox}
                className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-[#A97452] hover:bg-[#F5EEE6]'}
                `}
              >
                <div className="text-gray-400 text-center select-none">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-sm font-medium">이미지 추가</div>
                  <div className="text-xs text-gray-400 mt-1">최대 {MAX_IMAGES}개</div>
                </div>
              </div>
            )}
          </div>

          {/* 상태 메시지 */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{uploadError}</p>
            </div>
          )}

          {/* 이미지 개수 안내 */}
          {previewImages.length > 0 && !uploadError && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">📁 {previewImages.length}개의 이미지가 선택되었습니다.</p>
            </div>
          )}
        </div>

        {/* 제목 입력 */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-gray-700">
            제목 <span className="text-red-500">*</span>
          </label>
          <input id="title" ref={titleRef} type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] text-sm sm:text-base" disabled={isLoading} />
        </div>

        {/* 내용 입력 */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-bold text-gray-700">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea id="content" ref={contentRef} rows={6} placeholder="내용을 입력하세요..." className="w-full p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] resize-vertical" disabled={isLoading} />
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-end pt-4">
          <button type="button" onClick={handleSubmit} disabled={isLoading || previewImages.length === 0} className="px-6 py-2 bg-[#A97452] text-white font-semibold rounded-xl hover:bg-[#966343] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base cursor-pointer">
            {isLoading ? '등록 중...' : '게시글 등록'}
          </button>
        </div>

        {/* 서버 응답 에러 표시 */}
        {state && !state.ok && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
