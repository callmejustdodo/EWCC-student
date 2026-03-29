import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-widest">LENS</h3>
            <p className="text-sm text-muted-foreground">
              당신의 시선을 완성하는 프리미엄 아이웨어
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">고객 지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  배송 및 반품
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">문의</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@lens.co.kr</li>
              <li>02-1234-5678</li>
              <li>평일 10:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LENS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
