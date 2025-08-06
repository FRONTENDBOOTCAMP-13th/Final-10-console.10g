import { LoginUser, User } from '@/types';
import { Post } from '@/types/Post';
import { Product, ProductImage } from '@/types/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
/**
 * 결제 알림을 생성하는 함수
 * @param {string} product - 상품명
 * @param {ProductImage} image - 상품 이미지 정보
 * @param {LoginUser} user - 로그인 유저 정보
 * @returns {Promise<ApiRes<Post>>} - 생성 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 결제 완료 알림을 생성하고, 성공 시 POST 이후 반환된 Res객체를 받습니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function createPaymentNotification(product: Product, image: ProductImage, user: LoginUser) {
  const body = {
    type: 'payment',
    target_id: user?._id,
    content: '상품이 정상 결제되었습니다.',
    extra: {
      product: product,
      image: [{ path: image.path, name: image.name, originalname: image.originalname }],
    },
  };

  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${user.token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

/**
 * 댓글 알림을 생성하는 함수
 * 댓글 등록 함수 이후에 실행
 * @param {Post} post - 글 정보
 * @param {User} TargetUser - 글 작성자 유저 정보(댓글 작성자 아님)
 * @param {LoginUser} createUser - 댓글 유저 로그인 정보(알림 생성자)
 * @returns {Promise<ApiRes<Post>>} - 생성 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 결제 완료 알림을 생성하고, 성공 시 POST 이후 반환된 Res객체를 받습니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function createReplyNotification(post: Post, targetUser: User, createUser: LoginUser, qna?: boolean) {
  let body;

  if (qna) {
    body = {
      type: 'qna',
      target_id: targetUser._id,
      content: `문의글에 답변이 달렸습니다.`,
      extra: {
        post: post,
        sendUser: createUser,
      },
    };
  } else {
    body = {
      type: 'reply',
      target_id: targetUser._id,
      content: `${createUser.name}님이 댓글을 남기셨습니다.`,
      extra: {
        post: post,
        sendUser: createUser,
      },
    };
  }

  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${createUser.token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}

export async function createMessage(content: string, targetUser: User, createUser: LoginUser) {
  const body = {
    type: 'message',
    target_id: targetUser._id,
    content: `${createUser.name}님이 쪽지를 보내셨습니다.`,
    extra: {
      sendUser: createUser,
      message: content,
    },
  };

  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${createUser.token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

  
    return data;
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}
