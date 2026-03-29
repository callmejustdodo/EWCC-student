import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center bg-muted">
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          See Different.
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          당신의 시선을 완성하는 프리미엄 아이웨어.
          <br />
          미니멀한 디자인, 최상의 착용감.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/products">컬렉션 보기</Link>
        </Button>
      </div>
    </section>
  );
}
