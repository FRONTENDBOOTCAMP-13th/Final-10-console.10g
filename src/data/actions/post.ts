'use server';

import { ApiRes, ApiResPromise } from '@/types';
import { DynamicFormData, Post, PostReply } from '@/types/Post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadFile } from '@/data/actions/file';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 게시글을 생성하는 함수
 * @param {ApiRes<Post> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 게시글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<Post>>} - 생성 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 게시글을 생성하고, 성공 시 해당 게시판으로 리다이렉트합니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function createPost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  // FormData를 일반 Object로 변환
  const body: DynamicFormData = Object.fromEntries(formData.entries());
  const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';
  body.extra = {};
  Object.keys(body).forEach(key => {
    if (key.startsWith('extra.')) {
      const subKey = key.split('.')[1];
      if (body.extra && subKey) {
        body.extra[subKey] = body[key] as FormDataEntryValue;
        delete body[key];
      }
    }
  });
  //이미지 있으면  Post 타입의 image 배열에 경로 할당
  const attachedFiles = formData.getAll('attach') as File[];
  const validFiles = attachedFiles.filter(file => file instanceof File && file.size > 0);

  if (validFiles.length > 0) {
    try {
      const fileFormData = new FormData();
      validFiles.forEach(file => fileFormData.append('attach', file));

      const uploadResult = await uploadFile(fileFormData);

      if (uploadResult.ok === 1) {
        const uploadedFiles = uploadResult.item;

        // 업로드된 파일들의 전체 URL 경로를 생성하여 image 배열에 저장
        const uploadedPaths = uploadedFiles.map(item => `${item.path}`);

        // Post의 image 필드에 경로 배열 저장
        body.image = uploadedPaths;
      } else {
        console.error('[createPost] 파일 업로드 실패:', uploadResult);
        return { ok: 0, message: '이미지 업로드에 실패했습니다.' };
      }
    } catch (error) {
      console.error('[createPost] 파일 업로드 중 에러:', error);
      return { ok: 0, message: '이미지 업로드 중 오류가 발생했습니다.' };
    }
  } else {
    console.error('[createPost] 업로드할 파일이 없습니다.');
  }

  let res: Response;
  let data: ApiRes<Post>;

  try {
    res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }), //accessToken존재하면 헤더에 포함하고 아니면 안함
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }

  // redirect는 예외를 throw 하는 방식이라서 try 문에서 사용하면 catch로 처리되므로 제대로 동작하지 않음
  if (data.ok) {
    // console.log(body.type); 여기서 type이 게시판 타입임
    revalidatePath(`/board/${body.type}`);
    redirect(`/board/${body.type}`);
  } else {
    return data;
  }
}

/**
 * 댓글을 생성하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 생성 결과 응답 객체
 * @description
 * 댓글을 생성하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */
export async function createReply(state: ApiRes<PostReply> | null, formData: FormData): ApiResPromise<PostReply> {
  const body: DynamicFormData = Object.fromEntries(formData.entries());
  const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';

  let res: Response;
  let data: ApiRes<PostReply>;

  try {
    res = await fetch(`${API_URL}/posts/${body._id}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }), //accessToken존재하면 헤더에 포함하고 아니면 안함
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }

  return data;
}

/**
 * 댓글을 삭제하는 함수
 * @param {ApiRes<PostReply> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 삭제할 댓글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<PostReply>>} - 삭제 결과 응답 객체
 * @description
 * 댓글을 삭제하고, 성공 시 해당 게시글의 댓글 목록을 갱신합니다.
 */
export async function deleteReply(state: ApiRes<PostReply> | null, formData: FormData): ApiResPromise<PostReply> {
  const _id = formData.get('_id');
  const replyId = formData.get('replyId');
  const accessToken = formData.get('accessToken');

  let res: Response;
  let data: ApiRes<PostReply>;

  try {
    res = await fetch(`${API_URL}/posts/${_id}/replies/${replyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  return data;
}

/**
 * 게시글을 수정하는 함수
 * @param {ApiRes<Post> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 게시글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<Post>>} - 수정 결과 응답 객체
 * @description
 * 게시글을 수정하고, 성공 시 해당 게시글 상세 페이지로 이동합니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function updatePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const _id = formData.get('_id'); // 게시글 고유 ID
  const accessToken = formData.get('accessToken'); // 인증 토큰

  const body = {
    title: formData.get('title'),
    content: formData.get('content'),
  };

  let res: Response;
  let data: ApiRes<Post>;

  try {
    // 게시글 수정 API 호출
    res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      body: JSON.stringify(body),
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    revalidatePath('/board/qna'); // 게시글 목록 페이지 갱신
    revalidatePath(`/board/qna/${_id}`); // 게시글 상세 페이지 갱신

    // 상세 페이지로 리다이렉트 (목록이 아닌)
    redirect(`/board/qna/${_id}`);
  } else {
    return data;
  }
}

/**
 * 테스트용 댓글 생성 함수
 */
export async function testReply(content: string, accessToken: string, post: number) {
  try {
    const res = await fetch(`${API_URL}/posts/${post}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }), //accessToken존재하면 헤더에 포함하고 아니면 안함
      },
      body: JSON.stringify({ content: content }),
    });

    const data = await res.json();

    if (res.ok) return data;
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

/**
 * 게시글을 삭제하는 함수
 * @param {ApiRes<Post> | null} state - 이전 상태(사용하지 않음)
 * @param {FormData} formData - 삭제할 게시글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<Post>>} - 삭제 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 게시글을 삭제하고, 성공 시 해당 게시판 목록 페이지로 리다이렉트합니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function deletePost(state: ApiRes<Post> | null, formData: FormData): ApiResPromise<Post> {
  const _id = formData.get('_id');
  const accessToken = formData.get('accessToken');
  const boardType = formData.get('boardType') || 'qna'; // 기본값은 qna

  let res: Response;
  let data: ApiRes<{ ok: 0 | 1 }>;

  try {
    res = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }

  if (data.ok) {
    revalidatePath(`/board/${boardType}`); // 게시글 목록 페이지 갱신

    // 상세 페이지로 리다이렉트 (목록이 아닌)
    redirect(`/board/${boardType}`);
  } else {
    return data;
  }
}
