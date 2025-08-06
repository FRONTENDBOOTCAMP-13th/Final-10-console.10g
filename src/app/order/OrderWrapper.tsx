'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCarts } from '@/utils/getCarts';
import { getUserAddress } from '@/utils/getUsers';
import OrderClient from './OrderClient';
import type { CartItem } from '@/types/Cart';
import type { OrderForm } from '@/types/Order';
import { getProductById } from '@/utils/getProducts';
import { createOrder } from '@/data/actions/createOrder';
import { deleteCartItems } from '@/data/actions/deleteCartItems';
import { getFullImageUrl } from '@/utils/getFullImageUrl';
import Loading from '../loading';
import { createPaymentNotification } from '@/data/actions/addNotification';
import { useNotificationStore } from '@/stores/notificationStore';
import { UserAddress } from '@/types';
import { useCartBadgeStore } from '@/stores/cartBadgeStore';
import toast from 'react-hot-toast';

export default function OrderWrapper() {
  const { user } = useLoginStore();
  const token = user?.token?.accessToken;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const currentQuery = searchParams.toString();
  const redirectUrl = currentQuery ? `/order?${currentQuery}` : '/order';
  const { decrease } = useCartBadgeStore();
  const methods = useForm<OrderForm>({
    defaultValues: {
      user: { name: '', phone: '' },
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
    details: '',
  });
  const [cartCost, setCartCost] = useState({
    products: 0,
    shippingFees: 0,
    discount: { products: 0, shippingFees: 0 },
    total: 0,
  });

  const setUserToNotif = useNotificationStore(state => state.setUser);
  const fetchNotification = useNotificationStore(state => state.fetchNotification);
  const handleAddressAdd = () => {
    router.push(`/mypage/address/add?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  useEffect(() => {
    if (!loading && addresses.length === 0) {
      toast.error('배송지를 등록해야 주문이 가능합니다.');
      handleAddressAdd();
    }
  }, [loading, addresses.length]);

  useEffect(() => {
    if (user) setUserToNotif(user);
  }, [user, setUserToNotif]);

  // 주문 제출 핸들러
  const onSubmit = async (data: OrderForm) => {
    if (!token) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    const res = await createOrder(data, token);

    if (res.ok) {
      // 결제 완료 알림 보내기
      try {
        const firstProduct = cartItems[0]?.product;
        if (firstProduct) {
          const image = {
            path: getFullImageUrl(firstProduct.image.path) ?? '/default.png',
            name: firstProduct.image.name,
            originalname: '',
          };

          const notifRes = await createPaymentNotification(firstProduct, image, user);
          if (notifRes.ok) {
            await fetchNotification();
          }
        }
      } catch (err) {
        console.error('결제 알림 생성 실패', err);
      }

      // 장바구니 아이템 삭제 (장바구니 주문일 경우만)
      try {
        const idsParam = searchParams.get('ids');
        if (idsParam) {
          const selectedIds = idsParam.split(',').map(Number);
          await deleteCartItems(selectedIds, token);
          decrease(selectedIds.length);
        }
      } catch (err) {
        console.error('선택된 장바구니 삭제 실패', err);
      }

      router.push(`/order/complete/${res.item._id}`);
    } else {
      toast.error(res.message || '주문 실패');
    }
  };

  // 초기 데이터 로드
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
          const selectedItems = cartRes.item
            .filter(item => selectedIds.includes(item._id))
            .map(item => ({
              ...item,
              product: {
                ...item.product,
                image: {
                  ...item.product.image,
                  path: getFullImageUrl(item.product.image.path) ?? '/default.png',
                },
              },
            }));

          const productsTotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          const shippingFee = cartRes.cost.shippingFees;
          const total = productsTotal + shippingFee;

          setCartItems(selectedItems);
          setCartCost({ products: productsTotal, shippingFees: shippingFee, discount: { products: 0, shippingFees: 0 }, total });

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
              image: {
                ...(product.mainImages?.[0] ?? { name: '', path: '' }),
                path: getFullImageUrl(product.mainImages?.[0]?.path) ?? '/default.png',
              },
            },
          };

          setCartItems([tempItem]);
          setCartCost({ products: product.price * qty, shippingFees: product.shippingFees, discount: { products: 0, shippingFees: 0 }, total: product.price * qty + product.shippingFees });
          methods.setValue('products', [{ _id: product._id, quantity: qty }]);
        }

        // 유저 주소 로드
        const userRes = await getUserAddress(user._id, token);
        if (userRes.ok && userRes.item.length > 0) {
          setAddresses(userRes.item); // 전체 주소 저장

          const defaultAddress = userRes.item.find(a => a.isDefault) ?? userRes.item[0];
          setUserInfo({
            name: defaultAddress.name,
            recipient: defaultAddress.recipient,
            phone: defaultAddress.mobile,
            address: defaultAddress.value,
            details: defaultAddress.detailAddress || '',
          });
          const fullAddress = `${defaultAddress.value} ${defaultAddress.detailAddress || ''}`;

          methods.setValue('address', { name: defaultAddress.name, value: fullAddress });
          methods.setValue('user', { name: defaultAddress.recipient, phone: defaultAddress.mobile });
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
      <OrderClient cartItems={cartItems} cartCost={cartCost} addresses={addresses} userInfo={userInfo} onSubmit={onSubmit} onAddAddress={handleAddressAdd} />
    </FormProvider>
  );
}
