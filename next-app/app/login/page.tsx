"use client";

import { useSearchParams } from "next/navigation";
import { GoogleLogin } from "@/components/auth/google-login";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? undefined;
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-sm text-muted-foreground">
            계정에 로그인하여 쇼핑을 시작하세요
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">
            로그인에 실패했습니다. 다시 시도해주세요.
          </p>
        )}

        <GoogleLogin redirectTo={redirect} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
