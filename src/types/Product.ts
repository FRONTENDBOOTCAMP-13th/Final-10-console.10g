// src/types/Product.ts

export interface ProductImage {
  path: string;
  name: string;
  originalname: string;
}

export interface ProductExtra {
  isNew?: boolean;
  isBest?: boolean;
  category?: string[];
  sort?: number;
  // extra에 추가 필요한 부분 여기다 써주면 됨
}

export interface Product {
  _id: number | string;
  seller_id: number;
  price: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  name: string;
  quantity: number;
  buyQuantity: number;
  mainImages: ProductImage[];
  content: string;
  createdAt: string;
  updatedAt: string;
  extra?: ProductExtra;
}
