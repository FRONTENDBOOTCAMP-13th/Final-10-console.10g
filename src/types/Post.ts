// src/types/Post.ts
import { User } from '@/types/User';
export type BoardType = 'community' | 'notice' | 'qna'; //커뮤니티, 공지, 문의 게시판 3개

export interface PostProduct {
  name: string;
  image: string | null;
}

export interface PostExtra {
  qnatype?: string;
}

//댓글 추가
export interface PostReply {
  _id: number | string;
  user: Pick<User, '_id' | 'name' | 'image'>;
  content: string;
  like: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: number | string;
  type: BoardType;
  views: number;
  user: Pick<User, '_id' | 'name' | 'image'>;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bookmarks: number;
  repliesCount: number;
  product: PostProduct;
  replies?: PostReply[];
  extra?: {
    qnatype: string;
  };
  image: string;
}

/**
 * 게시글 작성/수정 폼에서 사용하는 타입
 * - Partial<Pick<Post, 'type' | 'title' | 'content' | '_id'>>: Post 타입에서 type, title, content, _id만 선택해 모두 옵셔널로 만듦
 * - image, tags는 옵션
 */
export type PostForm = Partial<Pick<Post, 'type' | 'title' | 'content' | '_id'>> & {
  // 게시글 이미지
  image?: string | string[];
  // 게시글 태그(쉼표로 구분된 문자열)
  tags?: string;
};

//  답글 작성 폼에서 사용하는 타입 (content만 포함)
export type PostReplyForm = Pick<PostReply, 'content'>;
