import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "./home-content";
import type { Product, Category } from "@/types";

export const metadata: Metadata = {
  title: "Home - AgriPulse",
};

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featured } = await supabase
    .from("products")
    .select(`
      *,
      images:product_images(*),
      farmer:farmers(id, farm_name, province, municipality, barangay, verification_status)
    `)
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order");

  // Transform data
  const transformedProducts = (featured ?? []).map((p: any) => ({
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
      municipality: p.farmer.municipality,
      barangay: p.farmer.barangay,
      verificationStatus: p.farmer.verification_status,
    } : undefined,
  }));

  const transformedCategories = (categories ?? []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    sortOrder: cat.sort_order,
  }));

  return <HomeContent featuredProducts={transformedProducts as Product[]} categories={transformedCategories as Category[]} />;
}
