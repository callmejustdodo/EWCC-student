"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/contexts/cart-context";
import { formatPrice, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types";
import { Suspense } from "react";

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, images))")
        .eq("id", orderId)
        .single();

      if (data) {
        setOrder(data as Order);
        await clearCart();
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">주문 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="space-y-4">
        <span className="text-5xl">✅</span>
        <h1 className="text-2xl font-bold">주문이 완료되었습니다</h1>
        <p className="text-muted-foreground">
          주문번호: <span className="font-mono font-medium text-foreground">{order.order_number}</span>
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-lg border p-6 text-left">
        <h2 className="font-semibold">주문 내역</h2>
        <p className="text-sm text-muted-foreground">
          {formatDate(order.created_at)}
        </p>

        <Separator />

        <div className="space-y-2">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.products?.name} ({item.color}) x {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>총액</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      <Button asChild size="lg" className="mt-8">
        <Link href="/products">쇼핑 계속하기</Link>
      </Button>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense>
      <OrderCompleteContent />
    </Suspense>
  );
}
