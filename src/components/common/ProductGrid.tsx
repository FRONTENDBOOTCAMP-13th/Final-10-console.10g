interface ProductGridProps {
  children: React.ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
  return <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-8">{children}</div>;
}
