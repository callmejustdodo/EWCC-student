"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function OrderReview() {
  const { items, subtotal, shippingFee, totalAmount } = useCart();

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">주문 내역</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.products?.name} ({item.color}) x {item.quantity}
            </span>
            <span>{formatPrice((item.products?.price ?? 0) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">소계</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">배송비</span>
          <span>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold">
        <span>총액</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
    </div>
  );
}
