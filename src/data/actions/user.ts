import axios from 'axios';
import { ApiRes, User, UserImage } from '@/types';
import { uploadFile } from '@/data/actions/file';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function createUser(_: ApiRes<User> | null, formData: FormData): Promise<ApiRes<User>> {
  let image: UserImage | undefined;
  const attach = formData.get('attach') as File | null;

  if (attach && attach.size > 0) {
    const fileRes = await uploadFile(formData);
    if (fileRes.ok) {
      image = {
        path: fileRes.item[0].path,
        name: fileRes.item[0].name,
        originalname: fileRes.item[0].originalname,
      };
      console.log('생성된 image 객체:', image);
    } else {
      console.log('파일 업로드 실패:', fileRes);
      return fileRes;
    }
  }
  const body = {
    type: (formData.get('type') as string) || 'user',
    name: formData.get('name') as string | null,
    email: formData.get('email') as string | null,
    password: formData.get('password') as string | null,
    birthday: formData.get('birthday') as string | null,
    phone: (formData.get('phone1') as string) + (formData.get('phone2') as string) + (formData.get('phone3') as string),
    extra: {
      receiveEmail: formData.get('receiveEmail') === 'true',
    },
    ...(image ? { image } : {}),
  };
  console.log('회원가입 요청 body:', body);

  try {
    const res = await axios.post<ApiRes<User>>(`${API_URL}/users`, body, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (error) {
    let message = '일시적인 네트워크 문제가 발생했습니다.';
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? message;
    }
    console.error(error);
    return { ok: 0, message };
  }
}
