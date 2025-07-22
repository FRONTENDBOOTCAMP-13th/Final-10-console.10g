import dayjs from 'dayjs';

function getTime(day = 0, second = 0) {
  return dayjs().add(day, 'days').add(second, 'seconds').format('YYYY.MM.DD HH:mm:ss');
}

export const initData = async (clientId, nextSeq) => {
  return {
    // 회원
    user: [
      {
        _id: await nextSeq('user'),
        email: 'admin@market.com',
        password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
        name: '무지',
        phone: '01011112222',
        address: '서울시 강남구 역삼동 123',
        type: 'admin',
        loginType: 'email',
        image: `files/${clientId}/user-muzi.png`,
        createdAt: getTime(-100, -60 * 60 * 3),
        updatedAt: getTime(-100, -60 * 60 * 3),
        extra: {
          birthday: '03-23',
        },
      },
      {
        _id: await nextSeq('user'),
        email: 's1@market.com',
        password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
        name: '네오',
        phone: '01022223333',
        address: '서울시 강남구 삼성동 456',
        type: 'seller',
        loginType: 'email',
        image: `files/${clientId}/user-neo.png`,
        createdAt: getTime(-50),
        updatedAt: getTime(-30, -60 * 60 * 3),
        extra: {
          birthday: '11-23',
        },
      },
    ],

    // 상품
    product: [
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 22000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '지브리 토토로 릴패스 파우치',
        quantity: 1,
        buyQuantity: 5,
        mainImages: [
          {
            path: `files/${clientId}/PC0101_01.webp`,
            name: 'PC0101_01.webp',
            originalname: '지브리 토토로 릴패스 파우치.png',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC01', 'PC0101'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 5900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '스튜디오 지브리 손수건 9종',
        quantity: 10,
        buyQuantity: 0,
        mainImages: [
          {
            path: `files/${clientId}/PC0101_02.webp`,
            name: 'PC0101_02.webp',
            originalname: '스튜디오 지브리 손수건 9종.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC01', 'PC0101'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '미키마우스 미니마우스 와펜',
        quantity: 5,
        buyQuantity: 10,
        mainImages: [
          {
            path: `files/${clientId}/PC0102_01.webp`,
            name: 'PC0102_01.webp',
            originalname: '미키마우스 미니마우스 와펜.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC01', 'PC0102'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 5000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '디즈니 스펀지 키친 매트',
        quantity: 1,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0102_02.webp`,
            name: 'PC0102_02.webp',
            originalname: '디즈니 스펀지 키친 매트.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0102'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '키티 얼굴 다용도 멀티 케이스',
        quantity: 10,
        buyQuantity: 1,
        mainImages: [
          {
            path: `files/${clientId}/PC0103_01.webp`,
            name: 'PC0103_01.webp',
            originalname: '키티 얼굴 다용도 멀티 케이스.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC01', 'PC0103'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '마이멜로디 4칸 다용도 케이스',
        quantity: 10,
        buyQuantity: 1,
        mainImages: [
          {
            path: `files/${clientId}/PC0103_02.webp`,
            name: 'PC0103_02.webp',
            originalname: '마이멜로디 4칸 다용도 케이스.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC01', 'PC0103'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '미피 랜덤 액자 마그넷',
        quantity: 0,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0104_01.webp`,
            name: 'PC0104_01.webp',
            originalname: '미피 랜덤 액자 마그넷.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0104'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 6500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '미피 스퀘어 메모패드',
        quantity: 10,
        buyQuantity: 0,
        mainImages: [
          {
            path: `files/${clientId}/PC0104_02.webp`,
            name: 'PC0104_02.webp',
            originalname: '미피 스퀘어 메모패드.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC01', 'PC0104'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 19000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '핑구 일상시리즈 인형 키링',
        quantity: 0,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0105_01.webp`,
            name: 'PC0105_01.webp',
            originalname: '핑구 일상시리즈 인형 키링.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0105'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 23000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: 'PINGU 핑구 랜덤 인형 키링',
        quantity: 10,
        buyQuantity: 5,
        mainImages: [
          {
            path: `files/${clientId}/PC0105_02.webp`,
            name: 'PC0105_02.webp',
            originalname: 'PINGU 핑구 랜덤 인형 키링.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC01', 'PC0105'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 9000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '짱구는못말려 랜덤 액자 마그넷',
        quantity: 10,
        buyQuantity: 5,
        mainImages: [
          {
            path: `files/${clientId}/PC0106_01.webp`,
            name: 'PC0106_01.webp',
            originalname: '짱구는못말려 랜덤 액자 마그넷.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC01', 'PC0106'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 33000,
        shippingFees: 0,
        show: true,
        active: true,
        name: '치이카와 택 키링 7종',
        quantity: 10,
        buyQuantity: 5,
        mainImages: [
          {
            path: `files/${clientId}/PC0107_01.webp`,
            name: 'PC0107_01.webp',
            originalname: '치이카와 택 키링 7종.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC01', 'PC0107'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 33000,
        shippingFees: 0,
        show: true,
        active: true,
        name: 'MINISO 치이카와 키링 미니백 마스코트',
        quantity: 3,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0107_02.webp`,
            name: 'PC0107_02.webp',
            originalname: 'MINISO 치이카와 키링 미니백 마스코트.webp',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC01', 'PC0107'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 8000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '스누피 랜덤 자석 마그넷',
        quantity: 0,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0108_01.webp`,
            name: 'PC0108_01.webp',
            originalname: '스누피 랜덤 자석 마그넷',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0108'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 1500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '스누피 에폭시 스티커',
        quantity: 3,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0108_02.webp`,
            name: 'PC0108_02.webp',
            originalname: '스누피 에폭시 스티커',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0108'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '미니어처 책상 의자 세트',
        quantity: 3,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0201_01.webp`,
            name: 'PC0201_01.webp',
            originalname: '미니어처 책상 의자 세트',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC02', 'PC0201'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '컴퓨터 미니어처 소품 피규어',
        quantity: 3,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0201_02.webp`,
            name: 'PC0201_02.webp',
            originalname: '컴퓨터 미니어처 소품 피규어',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC02', 'PC0201'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 8000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 캐릭터 볼펜 5종 세트',
        quantity: 5,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0301_01.webp`,
            name: 'PC0301_01.webp',
            originalname: '산리오 캐릭터 볼펜 5종 세트',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0301'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 12000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 흔들흔들 스윙 볼펜',
        quantity: 5,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0301_02.webp`,
            name: 'PC0301_02.webp',
            originalname: '산리오 흔들흔들 스윙 볼펜',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0301'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '꼬마마법사 레미 폭신 스티커 2종',
        quantity: 0,
        buyQuantity: 100,
        mainImages: [
          {
            path: `files/${clientId}/PC0302_01.webp`,
            name: 'PC0302_01.webp',
            originalname: '꼬마마법사 레미 폭신 스티커 2종',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC03', 'PC0302'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 스티커 4P 세트',
        quantity: 5,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0302_02.webp`,
            name: 'PC0302_02.webp',
            originalname: '산리오 스티커 4P 세트',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0302'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 2000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '치이카와 랜덤 마스킹테이프',
        quantity: 0,
        buyQuantity: 300,
        mainImages: [
          {
            path: `files/${clientId}/PC0303_01.webp`,
            name: 'PC0303_01.webp',
            originalname: '치이카와 랜덤 마스킹테이프',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC03', 'PC0303'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '디즈니 캐릭터 마스킹테이프',
        quantity: 0,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0303_02.webp`,
            name: 'PC0303_02.webp',
            originalname: '디즈니 캐릭터 마스킹테이프',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0303'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 12000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 정품 3공 다이어리',
        quantity: 2,
        buyQuantity: 40,
        mainImages: [
          {
            path: `files/${clientId}/PC0304_01.webp`,
            name: 'PC0304_01.webp',
            originalname: '산리오 정품 3공 다이어리',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC03', 'PC0304'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '2025 산리오 탁상용 달력',
        quantity: 0,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0304_02.webp`,
            name: 'PC0304_02.webp',
            originalname: '2025 산리오 탁상용 달력',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC03', 'PC0304'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '빈티지 디저트 레시피 페이퍼 10P',
        quantity: 10,
        buyQuantity: 0,
        mainImages: [
          {
            path: `files/${clientId}/PC0305_01.webp`,
            name: 'PC0305_01.webp',
            originalname: '빈티지 디저트 레시피 페이퍼 10P',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC03', 'PC0304'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '빈티지 케이크 페이퍼 10P',
        quantity: 10,
        buyQuantity: 0,
        mainImages: [
          {
            path: `files/${clientId}/PC0305_02.webp`,
            name: 'PC0305_02.webp',
            originalname: '빈티지 케이크 페이퍼 10P',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          category: ['PC03', 'PC0305'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 모두의 타보 메모지',
        quantity: 10,
        buyQuantity: 20,
        mainImages: [
          {
            path: `files/${clientId}/PC0306_01.webp`,
            name: 'PC0306_01.webp',
            originalname: '산리오 모두의 타보 메모지',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0306'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '산리오 케로케로케로피 메모지',
        quantity: 10,
        buyQuantity: 0,
        mainImages: [
          {
            path: `files/${clientId}/PC0306_02.webp`,
            name: 'PC0306_02.webp',
            originalname: '산리오 케로케로케로피 메모지',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: false,
          isBest: false,
          category: ['PC03', 'PC0306'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 4000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '일본 고전 만화책 자체제작 키링',
        quantity: 20,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0401_01.webp`,
            name: 'PC0401_01.webp',
            originalname: '일본 고전 만화책 자체제작 키링',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC04', 'PC0401'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '벚꽃 스트랩 키링',
        quantity: 20,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0401_02.webp`,
            name: 'PC0401_02.webp',
            originalname: '벚꽃 스트랩 키링',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC04', 'PC0401'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 2500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '오목눈이 뱁새 헤어핀',
        quantity: 20,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0402_01.webp`,
            name: 'PC0402_01.webp',
            originalname: '오목눈이 뱁새 헤어핀',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC04', 'PC0402'],
          sort: 5,
          // options: 1,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 1,
        price: 2500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: '레트로 디저트 헤어핀',
        quantity: 20,
        buyQuantity: 50,
        mainImages: [
          {
            path: `files/${clientId}/PC0402_02.webp`,
            name: 'PC0402_02.webp',
            originalname: '레트로 디저트 헤어핀',
          },
        ],
        content: `
          <div class="product-detail">
            <p>상품 살세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC04', 'PC0402'],
          sort: 5,
          // options: 1,
        },
      },
    ],

    // 주문
    order: [],

    // 후기
    review: [],

    // 장바구니
    cart: [],

    // 즐겨찾기/북마크
    bookmark: [
      {
        _id: await nextSeq('bookmark'),
        user_id: 2,
        user: {
          _id: 2,
          name: '무지',
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: 'post',
        target_id: 3,
        memo: '첫째 크리스마스 선물.',
        createdAt: getTime(-3, -60 * 60 * 2),
      },
    ],

    // QnA, 공지사항 등의 게시판
    //community가 자유게시판, notice가 공지게시판, qna 문의게시판
    post: [
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 2,
          name: '네오',
          image: `files/${clientId}/user-neo.png`,
        },
        title: '회원 가입했어요.',
        content: '잘 부탁드려요.',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
        product: {
          image: null,
        },
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '무지',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지글 테스트',
        content: '공지글 컨텐츠 테스트',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'qna',
        views: 23,
        user: {
          _id: 2,
          name: '네오',
          image: `files/${clientId}/user-neo.png`,
        },
        title: '회원 가입했어요.',
        content: '잘 부탁드려요.',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
        replies: [
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 2,
              name: '네오',
              image: 'user-neo.png',
            },
            content: '크기는 상품 상세정보에 나와 있습니다.',
            like: 5,
            createdAt: getTime(-2, -60 * 60 * 20),
            updatedAt: getTime(-2, -60 * 60 * 2),
          },
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 4,
              name: '제이지',
              image: 'user-jayg.webp',
            },
            content: '어디있나 모르겠어요.',
            like: 7,
            createdAt: getTime(-2, -60 * 60 * 10),
            updatedAt: getTime(-2, -60 * 60 * 1),
          },
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 2,
              name: '네오',
              image: 'user-neo.png',
            },
            content: '높이 60cm 입니다.',
            like: 3,
            createdAt: getTime(-2, -60 * 60 * 9),
            updatedAt: getTime(-1, -60 * 60 * 20),
          },
        ],
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '어피치',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '2025년 여름 세일 안내',
        content: '2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지공지',
        content: '공지사항',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지공지',
        content: '공지사항',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트1 제목',
        content: '게시글 테스트1 내용',
        // image: `files/${clientId}/sample-bugatti.png`,
        // product: {
        //   image: `files/${clientId}/sample-bugatti.png`,
        //   name: '샘플 이미지',
        // },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트2 제목',
        content: '게시글 테스트2 내용',
        product: {
          image: `files/${clientId}/sample-bugatti.png`,
          name: '샘플 이미지',
        },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트3 제목',
        content: '게시글 테스트3 내용',
        product: {
          image: `files/${clientId}/sample-bugatti.png`,
          name: '샘플 이미지',
        },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
    ],

    // 코드
    code: [],

    // 설정
    config: [],
  };
};
