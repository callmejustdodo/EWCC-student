"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileDrawer } from "./mobile-drawer";
import { ShoppingBagIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <MobileDrawer />
          </div>
          <Link href="/" className="text-xl font-bold tracking-widest">
            LENS
          </Link>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            컬렉션
          </Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <HugeiconsIcon icon={ShoppingBagIcon} size={20} />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {!isLoading && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={user ? "/mypage" : "/login"}>
                <HugeiconsIcon icon={UserIcon} size={20} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
