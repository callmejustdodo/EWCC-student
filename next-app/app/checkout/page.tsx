"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { ShippingForm, type ShippingInfo } from "@/components/checkout/shipping-form";
import { PaymentMethod } from "@/components/checkout/payment-method";
import { OrderReview } from "@/components/checkout/order-review";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { items } = useCart();

  const [shipping, setShipping] = useState<ShippingInfo>({
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    zipCode: profile?.zip_code ?? "",
    memo: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};
    if (!shipping.name.trim()) newErrors.name = "수령인을 입력해주세요";
    if (!shipping.phone.trim()) newErrors.phone = "연락처를 입력해주세요";
    if (!shipping.address.trim()) newErrors.address = "주소를 입력해주세요";
    if (!shipping.zipCode.trim()) newErrors.zipCode = "우편번호를 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);
    const supabase = createClient();

    const { data: orderId, error } = await supabase.rpc("create_order", {
      p_shipping_name: shipping.name,
      p_shipping_phone: shipping.phone,
      p_shipping_address: shipping.address,
      p_shipping_zip_code: shipping.zipCode,
      p_shipping_memo: shipping.memo || null,
      p_payment_method: paymentMethod,
    });

    if (error) {
      setIsSubmitting(false);
      return;
    }

    router.push(`/order-complete?orderId=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">체크아웃</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <ShippingForm
            value={shipping}
            onChange={setShipping}
            errors={errors}
          />
          <Separator />
          <PaymentMethod
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderReview />
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "주문 처리 중..." : "주문 완료"}
          </Button>
        </div>
      </div>
    </div>
  );
}
