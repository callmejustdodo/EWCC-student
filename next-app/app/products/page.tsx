import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { ProductListClient } from "./product-list-client";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">컬렉션</h1>
      <ProductListClient products={(products as Product[]) ?? []} />
    </div>
  );
}
