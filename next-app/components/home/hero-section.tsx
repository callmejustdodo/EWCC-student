import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-muted">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background" />

      <div className="relative z-10 space-y-8 px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
          Premium Eyewear
        </p>
        <h1 className="text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 md:text-7xl lg:text-8xl">
          See Different.
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          당신의 시선을 완성하는 프리미엄 아이웨어.
          <br />
          미니멀한 디자인, 최상의 착용감.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/products">컬렉션 보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
