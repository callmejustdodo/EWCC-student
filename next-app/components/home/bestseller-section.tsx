import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";

interface BestsellerSectionProps {
  products: Product[];
}

export function BestsellerSection({ products }: BestsellerSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">
        Bestsellers
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
