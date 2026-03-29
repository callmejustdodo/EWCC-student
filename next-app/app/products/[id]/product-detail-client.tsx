"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { ImageGallery } from "@/components/product/image-gallery";
import { ColorSwatch } from "@/components/product/color-swatch";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    setIsAdding(true);
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .eq("color", selectedColor)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        color: selectedColor,
        quantity,
      });
    }

    toast.success("장바구니에 추가되었습니다");
    setIsAdding(false);
  };

  return (
    <div className="grid gap-12 md:grid-cols-2">
      {/* Left: Image Gallery */}
      <ImageGallery images={product.images} productName={product.name} />

      {/* Right: Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl">{formatPrice(product.price)}</p>
        </div>

        <Separator />

        <p className="leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="space-y-4">
          <div className="text-sm">
            <span className="text-muted-foreground">소재:</span>{" "}
            <span className="font-medium">{product.material}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">사이즈:</span>{" "}
            <span className="font-medium">{product.sizes.join(" / ")}</span>
          </div>
        </div>

        <Separator />

        {product.colors.length > 0 && (
          <ColorSwatch
            colors={product.colors}
            selected={selectedColor}
            onChange={setSelectedColor}
          />
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">수량</p>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? "추가 중..." : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
}
