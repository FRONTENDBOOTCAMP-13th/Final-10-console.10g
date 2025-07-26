import Breadcrumb from '@/components/common/Breadcrumb';
import OrderWrapper from './OrderWrapper';

export default function OrderPage() {
  return (
    <div className="bg-background py-8">
      <div className="max-w-[900px] mx-auto p-4">
        <div className="mb-4">
          <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '결제하기' }]} />
        </div>
        <OrderWrapper />
      </div>
    </div>
  );
}
