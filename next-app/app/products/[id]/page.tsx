import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { ProductDetailClient } from "./product-detail-client";
import { ProductCard } from "@/components/product/product-card";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", id)
    .limit(3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ProductDetailClient product={product as Product} />

      {related && related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-xl font-bold">관련 제품</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {(related as Product[]).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
