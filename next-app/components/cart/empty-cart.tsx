import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <span className="text-6xl">🛒</span>
      <h2 className="text-xl font-semibold">장바구니가 비어있습니다</h2>
      <p className="text-muted-foreground">마음에 드는 제품을 담아보세요</p>
      <Button asChild>
        <Link href="/products">쇼핑하러 가기</Link>
      </Button>
    </div>
  );
}
