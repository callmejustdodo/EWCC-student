import { Geist_Mono, Roboto } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { HeaderWithCart } from "@/components/layout/header-with-cart";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LENS - Premium Eyewear",
    template: "%s | LENS",
  },
  description: "당신의 시선을 완성하는 프리미엄 아이웨어. 미니멀한 디자인, 최상의 착용감.",
};

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        roboto.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
            <div className="flex min-h-svh flex-col">
              <HeaderWithCart />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
