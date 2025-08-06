export default function ShoppingGuide() {
  return (
    <>
      <style>{`
        .custom-dotted-border {
          border-style: dotted;
          border-width: 3px;
          border-color: #a97452; 
          border-radius: 1rem; 
        }
      `}</style>

      <section className="max-w-full px-4 py-6 bg-background">
        {/* 배송 안내 */}
        <div className="custom-dotted-border p-6 mb-8 mt-6">
          <h3 className="text-primary-dark font-bold text-lg mb-3">배송 안내</h3>
          <p className="text-sm mb-1">배송 방법: 택배</p>
          <p className="text-sm mb-1">배송 지역: 전국지역</p>
          <p className="text-sm mb-1">배송 비용: 상품에 따라 상이</p>
          <p className="text-sm mb-1">배송 기간: 3일 - 7일</p>
          <p className="text-xs text-gray-600 mt-2">- 산간벽지나 도서지방은 별도의 추가 금액을 지불하셔야 합니다.</p>
        </div>

        {/* 교환 및 반품 안내 */}
        <div className="custom-dotted-border p-6 mb-8">
          <h3 className="text-primary-dark font-bold text-lg mb-3">교환 및 반품 안내</h3>
          <p className="text-sm font-semibold mb-2">교환 및 반품 주소</p>
          <p className="text-sm mb-4">광화문 156-34 8층 멋쟁이 사자처럼</p>
          <p className="text-sm font-semibold mb-2">교환 및 반품이 가능한 경우</p>
          <p className="text-sm mb-2">- 상품을 공급 받으신 날로부터 7일 이내 단, 가전제품의 경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.</p>
          <p className="text-sm mb-2">- 공급받으신 상품 및 용역의 내용이 표시, 광고 내용과 다르거나 이행된 경우에는 공급받은 날로부터 3월 이내, 그 사실을 알게 된 날로부터 30일 이내</p>
          <p className="text-sm font-semibold mb-2">교환 및 반품이 불가능한 경우</p>
          <p className="text-sm mb-1">- 고객님의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우. 단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외</p>
          <p className="text-sm mb-1">- 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우 (예: 가전제품, 식품, 음반 등, 단 액정화면이 부착된 노트북, LCD모니터, 디지털 카메라 등의 불량화소에 따른 반품/교환은 제조사 기준에 따릅니다.)</p>
          <p className="text-sm mb-1">- 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우 단, 화장품 등의 경우 시용제품을 제공한 경우에 한합니다.</p>
          <p className="text-sm mb-1">- 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</p>
          <p className="text-sm mb-4">- 복제가 가능한 상품 등의 포장을 훼손한 경우</p>
          <p className="text-xs text-gray-600">(자세한 내용은 고객만족센터 1:1 E-MAIL 상담을 이용해 주시기 바랍니다.)</p>
          <p className="text-xs text-gray-600 mt-4">※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다. (색상 교환, 사이즈 교환 등 포함)</p>
        </div>

        {/* 결제 안내 */}
        <div className="custom-dotted-border p-6 mb-6">
          <h3 className="text-primary-dark font-bold text-lg mb-3">결제 안내</h3>
          <p className="text-sm mb-4">고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문 등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.</p>
          <p className="text-sm mb-2">무통장 입금은 상품 구매 대금은 PC방, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다.</p>
          <p className="text-sm mb-2">주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.</p>
        </div>
      </section>
    </>
  );
}
