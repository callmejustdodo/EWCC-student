"use client";

import { useState } from "react";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

interface OrderListProps {
  orders: Order[];
}

const STATUS_MAP: Record<string, string> = {
  pending: "주문 확인 중",
  confirmed: "주문 확인",
  shipping: "배송 중",
  delivered: "배송 완료",
};

export function OrderList({ orders }: OrderListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        주문 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border">
          <button
            onClick={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="space-y-1">
              <p className="font-mono text-sm font-medium">
                {order.order_number}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                {formatPrice(order.total_amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {STATUS_MAP[order.status] ?? order.status}
              </p>
            </div>
          </button>

          {expandedId === order.id && order.order_items && (
            <div className="border-t px-4 pb-4 pt-3">
              <Separator className="mb-3" />
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.products?.name} ({item.color}) x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
