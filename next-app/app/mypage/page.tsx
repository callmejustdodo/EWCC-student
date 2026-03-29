import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Order, Profile } from "@/types";
import { ProfileInfo } from "@/components/mypage/profile-info";
import { OrderList } from "@/components/mypage/order-list";
import { LogoutButton } from "./logout-button";

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, images))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">마이페이지</h1>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        {profile && (
          <ProfileInfo
            profile={profile as Profile}
            email={user.email ?? ""}
          />
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">주문 내역</h2>
          <OrderList orders={(orders as Order[]) ?? []} />
        </div>
      </div>
    </div>
  );
}
