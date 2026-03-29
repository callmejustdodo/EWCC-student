import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/hero-section";
import { BrandSection } from "@/components/home/brand-section";
import { BestsellerSection } from "@/components/home/bestseller-section";
import type { Product } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: bestsellers } = await supabase
    .from("products")
    .select("*")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <HeroSection />
      <BrandSection />
      <BestsellerSection products={(bestsellers as Product[]) ?? []} />
    </>
  );
}
