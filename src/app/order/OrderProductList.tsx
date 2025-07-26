import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/Cart';

interface Props {
  items: CartItem[];
}

export default function OrderProductList({ items }: Props) {
  const router = useRouter();
  const getImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;

  const handleNavigate = (productId: number | string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-2 rounded-xl sm:rounded-2xl sm:space-y-4 lg:space-y-4 lg:rounded-3xl bg-white text-dark-gray">
      <h2 className="text-base sm:text-lg font-semibold">주문상품</h2>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item._id} className={`flex items-start gap-4 py-4 ${idx === 0 ? 'border-t' : ''} border-b border-gray-200 `}>
            {/* 상품 이미지 */}
            <div onClick={() => handleNavigate(item.product._id)} className="w-20 h-20 relative flex-shrink-0 sm:w-24 sm:h-24 lg:w-30 lg:h-30 cursor-pointer } ">
              <Image unoptimized src={getImageUrl(item.product.image.path)} alt={item.product.name} fill className="rounded object-cover" sizes="80px" />
            </div>

            {/* 상품 정보 */}
            <div className="flex flex-col justify-between text-sm sm:text-base space-y-1">
              <p
                className="font-semibold cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleNavigate(item.product._id);
                }}
              >
                {item.product.name}
              </p>
              <p className="text-gray text-xs sm:text-sm lg:text-base">
                {item.product.price.toLocaleString()}원 / 수량 {item.quantity}개
              </p>
              <p className="text-xs sm:text-sm lg:text-base">총 가격 : {(item.product.price * item.quantity).toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
