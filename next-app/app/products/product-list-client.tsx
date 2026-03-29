"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { ProductFilter } from "@/components/product/product-filter";
import { ProductSort } from "@/components/product/product-sort";
import { ProductGrid } from "@/components/product/product-grid";

interface ProductListClientProps {
  products: Product[];
}

export function ProductListClient({ products }: ProductListClientProps) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let result = products;

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [products, category, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductFilter selected={category} onChange={setCategory} />
        <ProductSort selected={sort} onChange={setSort} />
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
