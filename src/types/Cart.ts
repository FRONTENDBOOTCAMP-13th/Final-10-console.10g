import type { Product, ProductImage } from './Product';

interface CartProduct extends Product {
  image: ProductImage; // 장바구니 응답 전용
}

export interface CartItem {
  _id: number;
  product_id?: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product: CartProduct;
}

export interface CartCost {
  products: number;
  shippingFees: number;
  discount: {
    products: number;
    shippingFees: number;
  };
  total: number;
}

export interface CartResponse {
  ok: number;
  item: CartItem[];
  cost: CartCost;
}
