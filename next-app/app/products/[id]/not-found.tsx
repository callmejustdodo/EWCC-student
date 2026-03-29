import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4">
      <span className="text-5xl">🔍</span>
      <h1 className="text-2xl font-bold">제품을 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">
        요청하신 제품이 존재하지 않거나 삭제되었습니다.
      </p>
      <Button asChild>
        <Link href="/products">컬렉션으로 돌아가기</Link>
      </Button>
    </div>
  );
}
