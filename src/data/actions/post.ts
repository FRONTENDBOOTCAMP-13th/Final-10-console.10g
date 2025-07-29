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
  //이미지 있으면  Post 타입의 image 속성에 경로 할당
  if (formData.get('attach') instanceof File) {
    const uploadRes = await uploadFile(formData);
    if (uploadRes.ok === 1 && uploadRes.item.length > 0) {
      const uploadedPath = uploadRes.item[0].path;
      //   //uploadRes.item 찍어보니까 아래와 같이 나옴
      // originalname: 'KakaoTalk_20250624_224418829.jpg',
      // name: 'SYOW6vB_t.jpg',
      // path: 'files/febc13-final10-emjf/SYOW6vB_t.jpg'
      console.log(uploadRes.item);
      console.log(`업로드 패쓰 : ${uploadedPath}`);
      body.image = `${API_URL}/${uploadedPath}`;
    }
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
