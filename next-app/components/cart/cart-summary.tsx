"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function CartSummary() {
  const { subtotal, shippingFee, totalAmount, totalItems } = useCart();

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">주문 요약</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">소계</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">배송비</span>
          <span>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-muted-foreground">
            {formatPrice(FREE_SHIPPING_THRESHOLD)} 이상 구매 시 무료 배송
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-semibold">
        <span>총액</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>

      <Button asChild size="lg" className="w-full" disabled={totalItems === 0}>
        <Link href="/checkout">주문하기</Link>
      </Button>
    </div>
  );
}
