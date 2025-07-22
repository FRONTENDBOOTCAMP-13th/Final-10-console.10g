'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/actions/file';
import { useActionState } from 'react';
import { createPost } from '@/actions/post';

export default function ImagePostForm({ boardType }: { boardType: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [state, formAction, isLoading] = useActionState(createPost, null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) return;

    // 1. 파일 업로드
    const formData = new FormData();
    formData.append('attach', fileRef.current.files[0]);
    const res = await uploadFile(formData);

    if (res.ok === 1 && res.item.length > 0) {
      setImagePath(res.item[0].path);
      setImageName(res.item[0].originalname || res.item[0].name);
    } else {
      alert('이미지 업로드 실패');
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="type" value={boardType} />
      <div className="my-4">
        <label>제목</label>
        <input name="title" type="text" placeholder="제목을 입력하세요" className="border px-2 py-1 w-full" />
      </div>
      <div className="my-4">
        <label>내용</label>
        <textarea name="content" rows={5} placeholder="내용을 입력하세요" className="border px-2 py-1 w-full" />
      </div>
      <div className="my-4">
        <label>이미지 업로드</label>
        <input type="file" ref={fileRef} name="attach" accept="image/*" />
        <button type="button" onClick={handleUpload}>
          이미지 업로드
        </button>
        {imagePath && (
          <div className="mt-2">
            <span>업로드된 이미지: {imageName}</span>
            <input type="hidden" name="product.image" value={imagePath} />
            <input type="hidden" name="product.name" value={imageName} />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 my-6">
        <button type="submit" className="px-4 py-2 rounded bg-[#A97452] text-white" disabled={isLoading}>
          등록
        </button>
      </div>
    </form>
  );
}
