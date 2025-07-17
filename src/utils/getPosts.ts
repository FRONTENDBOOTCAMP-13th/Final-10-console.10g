// src/utils/getPosts.ts

import type { ApiResPromise } from '@/types/api';
import type { Post, BoardType, PostReply } from '@/types/Post';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 주어진 게시판 타입의 게시글 목록을 fetch합니다.
 * @param boardType - 'community' | 'notice' | 'qna'
 */
export async function getPosts(boardType: BoardType): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 게시글 목록을 불러오지 못했습니다.' };
  }
}

/**
 * 특정 게시글의 상세 정보를 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<Post>>} - 게시글 상세 정보 응답 객체
 */
export async function getPost(_id: number): ApiResPromise<Post> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} _id - 게시글의 고유 ID
 * @returns {Promise<ApiRes<PostReply[]>>} - 댓글 목록 응답 객체
 */
export async function getReplies(_id: number): ApiResPromise<PostReply[]> {
  try {
    const res = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}
