"use client";

import { useCart } from "@/contexts/cart-context";
import { Header } from "./header";

export function HeaderWithCart() {
  const { totalItems } = useCart();
  return <Header cartItemCount={totalItems} />;
}
