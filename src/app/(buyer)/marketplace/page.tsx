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

  // Transform snake_case from Supabase to camelCase for frontend
  const transformedCategories = (categories ?? []).map((cat: any) => ({
    id: cat.id,
    parentId: cat.parent_id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    iconUrl: cat.icon_url,
    sortOrder: cat.sort_order,
    isActive: cat.is_active,
  }));

  const transformedProducts = (products ?? []).map((p: any) => ({
    id: p.id,
    farmerId: p.farmer_id,
    categoryId: p.category_id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    unit: p.unit,
    availableQuantity: p.available_quantity,
    minimumOrder: p.minimum_order,
    harvestDate: p.harvest_date,
    isOrganic: p.is_organic,
    isActive: p.is_active,
    isFeatured: p.is_featured,
    ratingAverage: Number(p.rating_average || 0),
    totalReviews: p.total_reviews || 0,
    totalSold: p.total_sold || 0,
    viewCount: p.view_count || 0,
    createdAt: p.created_at,
    images: (p.images ?? []).map((img: any) => ({
      id: img.id,
      productId: img.product_id,
      imageUrl: img.image_url,
      thumbnailUrl: img.thumbnail_url,
      sortOrder: img.sort_order,
      isPrimary: img.is_primary,
    })),
    farmer: p.farmer ? {
      id: p.farmer.id,
      farmName: p.farmer.farm_name,
      province: p.farmer.province,
      verificationStatus: p.farmer.verification_status,
      ratingAverage: Number(p.farmer.rating_average || 0),
    } : undefined,
  }));

  return (
    <MarketplaceContent
      categories={transformedCategories}
      initialProducts={transformedProducts}
    />
  );
}
