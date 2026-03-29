import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-muted transition-shadow duration-300 group-hover:shadow-lg">
        <div className="flex h-full items-center justify-center text-muted-foreground transition-transform duration-500 ease-out group-hover:scale-105">
          <span className="text-4xl">👓</span>
        </div>
      </div>
      <div className="space-y-1 px-1">
        <h3 className="text-sm font-medium transition-colors group-hover:text-foreground/80">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
