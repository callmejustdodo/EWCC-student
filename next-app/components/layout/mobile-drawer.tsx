"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-xl tracking-widest">
            LENS
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-4">
          <Link
            href="/products"
            onClick={close}
            className="text-lg font-medium"
          >
            컬렉션
          </Link>

          <Separator />

          {user ? (
            <>
              <Link
                href="/mypage"
                onClick={close}
                className="text-lg font-medium"
              >
                마이페이지
              </Link>
              <button
                onClick={() => {
                  signOut();
                  close();
                }}
                className="text-left text-lg font-medium text-muted-foreground"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className="text-lg font-medium"
            >
              로그인
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
