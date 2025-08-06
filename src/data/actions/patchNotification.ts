import { LoginUser } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function patchNotification(user: LoginUser) {
  try {
    const res = await fetch(`${API_URL}/notifications/read`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token.accessToken}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('patchUserAddresses 에러:', error);
    return { ok: 0, message: '주소 업데이트 실패' };
  }
}

export async function patchNotificationId(user: LoginUser, notificationId: string) {
  try {
    const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token.accessToken}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('patchUserAddresses 에러:', error);
    return { ok: 0, message: '주소 업데이트 실패' };
  }
}
