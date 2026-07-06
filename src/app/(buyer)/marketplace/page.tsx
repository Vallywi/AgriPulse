import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MarketplaceContent } from "./marketplace-content";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse fresh farm produce from verified Filipino farmers",
};

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order");

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*),
      farmer:farmers(id, farm_name, province, verification_status, rating_average)
    `)
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <MarketplaceContent
      categories={categories ?? []}
      initialProducts={products ?? []}
    />
  );
}
