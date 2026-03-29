"use client";

import type { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/format";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const product = item.products;
  if (!product) return null;

  return (
    <div className="flex gap-4 py-4">
      {/* Image placeholder */}
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-muted">
        <span className="text-3xl">👓</span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{item.color}</p>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => updateQuantity(item.id, q)}
          />
          <p className="text-sm font-medium">
            {formatPrice(product.price * item.quantity)}
          </p>
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="sm"
        className="self-start text-muted-foreground"
        onClick={() => removeItem(item.id)}
      >
        &times;
      </Button>
    </div>
  );
}
