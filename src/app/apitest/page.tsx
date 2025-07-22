import { getUsers } from '@/utils/getUsers';
import type { User } from '@/types/User';
import type { Post, BoardType } from '@/types/Post';
import { getProducts } from '@/utils/getProducts';
import type { Product } from '@/types/Product';
import Image from 'next/image';
import { getPosts } from '@/utils/getPosts';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const boards: { key: BoardType; label: string }[] = [
  { key: 'community', label: '커뮤니티' },
  { key: 'notice', label: '공지사항' },
  { key: 'qna', label: '질문게시판' },
];
export default async function Page() {
  /////회원 정보 조회
  const resUsers = await getUsers();
  if (resUsers.ok === 0) {
    return <p style={{ color: 'red' }}>⚠️ {resUsers.message}</p>;
  }
  // api.ts에 ServerValidationError 부분 넣었기 떄문에 ok === 1 로직으로 검증 먼저 해야함
  const users: User[] = resUsers.item;

  /////상품 목록 조회
  const resProducts = await getProducts();

  if (resProducts.ok === 0) {
    return <p>상품 목록 로딩 실패: {resProducts.message}</p>;
  }
  const products: Product[] = resProducts.item;
  //상품 목록 잘 가져왔는지 콘솔 확인
  // console.log(products);

  //게시글 조회
  const resPosts = await Promise.all(boards.map(board => getPosts(board.key)));
  ///게시글 목록 잘 가져왔는지 콘솔 확인
  // results.forEach((res, idx) => {
  //   const board = boards[idx];
  //   if (res.ok === 1) {
  //     console.log(`[${board.label}] 게시글 ${res.item.length}개`);
  //     console.log(res.item);
  //   } else {
  //     console.warn(`[${board.label}] 게시글 로딩 실패: ${res.message}`);
  //   }
  // });
  return (
    <>
      {/* 회원 정보 */}
      <div>
        <h1>유저 목록</h1>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.name} ({user.email}) / 생일: {user.extra?.birthday}
            </li>
          ))}
        </ul>
      </div>
      {/* 상품 목록  */}
      <div>
        <ul>
          {products.map(product => (
            <li key={product._id}>
              {product.name} - {product.price}원<br />
              <Image src={`${API_URL}/${product.mainImages[0].path}`} alt={product.mainImages[0]?.originalname} width={100} height={100} />
            </li>
          ))}
        </ul>
      </div>
      {/* 게시판 글 목록 */}
      <div style={{ padding: '40px' }}>
        {resPosts.map((res, idx) => {
          const board = boards[idx]; // 현재 게시판 정보
          return (
            <div key={board.key} className="mb-10">
              <h2 className="text-2xl font-bold mb-4">{board.label}</h2>

              {res.ok === 0 && <p className="text-red-500">{res.message}</p>}

              {res.ok === 1 && res.item.length === 0 && <p className="text-gray-500">게시글이 없습니다.</p>}

              {res.ok === 1 && res.item.length > 0 && (
                <ul className="space-y-4">
                  {res.item.map((post: Post) => (
                    <li key={post._id} className="p-4 border border-gray-300 rounded-lg">
                      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                      <p className="mb-2 text-gray-700">{post.content}</p>
                      <div className="text-sm text-gray-500 mb-2">
                        조회수: {post.views} / 댓글: {post.repliesCount} / 북마크: {post.bookmarks}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Image src={`${API_URL}/${post.user.image}`} alt={post.user.name} width={32} height={32} className="rounded-full" />
                        <span className="text-sm text-gray-800">{post.user.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// {
//   "ok": 1,
//   "item": [
//     {
//       "_id": 4,
//       "seller_id": 3,
//       "price": 45000,
//       "shippingFees": 3500,
//       "show": true,
//       "active": true,
//       "name": "레고 테크닉 42151 부가티 볼리드",
//       "quantity": 100,
//       "buyQuantity": 89,
//       "mainImages": [
//         {
//           "path": "files/openmarket/sample-bugatti.png",
//           "name": "sample-bugatti.png",
//           "originalname": "부가티.png"
//         }
//       ],
//       "createdAt": "2025.07.14 19:08:39",
//       "updatedAt": "2025.07.14 04:08:39",
//       "extra": {
//         "isNew": false,
//         "isBest": true,
//         "category": [
//           "PC03",
//           "PC0303"
//         ],
//         "sort": 1
//       },
//       "seller": {
//         "_id": 3,
//         "email": "s2@market.com",
//         "name": "어피치",
//         "phone": "01033334444",
//         "address": "서울시 강남구 도곡동 789",
//         "image": "user-apeach.webp",
//         "extra": {
//           "confirm": false,
//           "birthday": "11-24",
//           "membershipClass": "MC02",
//           "addressBook": [
//             {
//               "id": 2,
//               "name": "가게",
//               "value": "서울시 강남구 학동 234"
//             }
//           ]
//         }
//       },
//       "replies": 0,
//       "bookmarks": 2,
//       "rating": 4.5,
//       "myBookmarkId": 2,
//       "options": 0
//     }
//   ],
//   "pagination": {
//     "page": 1,
//     "limit": 0,
//     "total": 1,
//     "totalPages": 1
//   }
// }
