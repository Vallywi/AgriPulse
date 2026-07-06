import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { OrdersList } from "./orders-list";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container px-4 py-8 text-center">
        <p className="text-gray-500">Please sign in to view your orders.</p>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        id, product_name, unit_price, quantity, unit,
        product:products(id, images:product_images(thumbnail_url))
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return <OrdersList orders={orders ?? []} />;
}
