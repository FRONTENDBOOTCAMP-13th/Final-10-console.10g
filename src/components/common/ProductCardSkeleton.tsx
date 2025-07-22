export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl p-4 w-full h-[300px]">
      <div className="h-[180px] bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
