export interface UserExtra {
  intro?: string;
  address?: UserAddress[];
  receiveEmail: boolean;
}

export interface UserImage {
  path: string;
  name: string;
  originalname: string;
}

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}

export interface LoginUser {
  _id: number;
  email: string;
  name: string;
  type: 'user' | 'admin' | string;
  loginType: 'email' | 'kakao' | 'google' | string;
  phone: string;
  birthday: string;
  token: UserToken;
  image: UserImage;
  notifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  item: LoginUser;
  ok: number;
}

export interface User {
  _id: number | string;
  email: string;
  password: string;
  name: string;
  birthday?: string;
  phone: string;
  address: string;
  type: string;
  loginType: string;
  image: UserImage | null;
  createdAt: string;
  updatedAt: string;
  extra?: UserExtra;
}

export interface UserAddress {
  id: number;
  name: string;
  recipient: string;
  value: string;
  detailAddress?: string;
  mobile: string;
  isDefault: boolean;
}

export interface EditFormValues {
  type: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthday: string;
  phone1: string;
  phone2: string;
  phone3: string;
  attach?: FileList;
  receiveEmail: boolean;
  address1: string;
  address2: string;
  address3: string;
}

export interface UserInfo {
  email: string;
  name: string;
  password: string;
  phone: string;
  birthday: string;
  extra: {
    receiveEmail: boolean;
  };
}
