import { Product } from '@/types/Product';
import ProductCard from './ProductCard';

interface LikedProduct extends Product {
  bookmarkId: number;
}

interface ProductItemCardProps {
  products: Product[] | null;
  likedProducts?: LikedProduct[] | null;
}

export default function ProductItemCard({ products, likedProducts }: ProductItemCardProps) {
  likedProducts?.map((product, index) => {
    console.log(index, product);
  });

  return (
    <>
      {products &&
        products.map((product, index) => {
          const liked = likedProducts?.find(likedProduct => likedProduct._id === product._id);
          const bookmarkId = liked ? liked.bookmarkId : 0;
          return <ProductCard key={index} product={product} bookmarkId={bookmarkId} />;
        })}
    </>
  );
}
