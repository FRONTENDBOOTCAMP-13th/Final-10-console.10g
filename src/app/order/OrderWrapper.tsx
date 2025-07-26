'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLoginStore } from '@/stores/loginStore';
import { useSearchParams } from 'next/navigation';
import { getCarts } from '@/utils/getCarts';
import { getUserAddress } from '@/utils/getUsers';
import OrderClient from './OrderClient';
import type { CartItem } from '@/types/Cart';
import type { OrderForm } from '@/types/Order';
import { getProductById } from '@/utils/getProducts';
import { createOrder } from '@/data/actions/createOrder';
import { deleteCartItems } from '@/data/actions/deleteCartItems';
import Loading from '../loading';

export default function OrderWrapper() {
  const { user } = useLoginStore();
  const token = user?.token?.accessToken;
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const methods = useForm<OrderForm>({
    defaultValues: {
      products: [],
      address: { name: '', value: '' },
      memo: '',
    },
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    recipient: '',
    phone: '',
    address: '',
  });
  const [cartCost, setCartCost] = useState({
    products: 0,
    shippingFees: 0,
    discount: { products: 0, shippingFees: 0 },
    total: 0,
  });

const onSubmit = async (data: OrderForm) => {
  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  const res = await createOrder(data, token);
  if (res.ok) {
    console.log('주문 성공', res.item);

    // 장바구니 주문일 경우, 선택된 아이템 삭제
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const selectedIds = idsParam.split(',').map(Number);
      await deleteCartItems(selectedIds, token);
    }

    // 주문 완료 페이지로 이동
    // router.push(`/order/complete/${res.item._id}`);
  } else {
    alert(res.message || '주문 실패');
  }
};

  useEffect(() => {
    if (!token || !user?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const idsParam = searchParams.get('ids');
        const productId = searchParams.get('productId');
        const qty = Number(searchParams.get('qty') || 1);
        if (idsParam) {
          // 장바구니 주문
          const selectedIds = idsParam.split(',').map(Number);
          const cartRes = await getCarts(token);
          const selectedItems = cartRes.item.filter(item => selectedIds.includes(item._id));

          const productsTotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          const shippingFee = cartRes.cost.shippingFees; // 정책에 따라 선택상품에도 동일하게 부과
          const total = productsTotal + shippingFee;

          setCartItems(selectedItems);
          setCartCost({
            products: productsTotal,
            shippingFees: shippingFee,
            discount: { products: 0, shippingFees: 0 },
            total,
          });

          methods.setValue(
            'products',
            selectedItems.map(item => ({
              _id: item.product._id,
              quantity: item.quantity,
            })),
          );
        } else if (productId) {
          // 바로 구매
          const productRes = await getProductById(productId);
          if (!productRes.ok) {
            console.error('상품 정보를 불러올 수 없습니다.');
            return;
          }

          const product = productRes.item;

          const tempItem: CartItem = {
            _id: -1,
            quantity: qty,
            product: {
              ...product,
              image: product.mainImages?.[0] ?? { path: '/default.png', name: '', originalname: '' },
            },
          };

          setCartItems([tempItem]);
          setCartCost({
            products: product.price * qty,
            shippingFees: product.shippingFees,
            discount: { products: 0, shippingFees: 0 },
            total: product.price * qty + product.shippingFees,
          });
          methods.setValue('products', [{ _id: product._id, quantity: qty }]);
        }

        // 유저 주소 공통 로드
        const userRes = await getUserAddress(user._id, token);
        if (userRes.ok && userRes.item.length > 0) {
          const defaultAddress = userRes.item.find(a => a.isDefault) ?? userRes.item[0];
          setUserInfo({
            name: defaultAddress.name,
            recipient: defaultAddress.recipient,
            phone: user.phone,
            address: defaultAddress.value,
          });
          methods.setValue('address', {
            name: defaultAddress.name,
            value: defaultAddress.value,
          });
        }
      } catch (err) {
        console.error('주문 데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, searchParams, methods]);

  if (loading) return <Loading />;

  return (
    <FormProvider {...methods}>
      <OrderClient cartItems={cartItems} cartCost={cartCost} userInfo={userInfo} onSubmit={onSubmit} />
    </FormProvider>
  );
}
