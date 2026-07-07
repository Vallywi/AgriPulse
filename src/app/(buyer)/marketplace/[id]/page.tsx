"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, ShieldCheck, ShoppingCart, Minus, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          images:product_images(*),
          farmer:farmers(id, farm_name, province, verification_status, rating_average, farming_experience_years)
        `)
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setProduct({
        id: data.id,
        farmerId: data.farmer_id,
        categoryId: data.category_id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        unit: data.unit,
        availableQuantity: data.available_quantity,
        minimumOrder: data.minimum_order,
        harvestDate: data.harvest_date,
        isOrganic: data.is_organic,
        isActive: data.is_active,
        isFeatured: data.is_featured,
        ratingAverage: Number(data.rating_average || 0),
        totalReviews: data.total_reviews || 0,
        totalSold: data.total_sold || 0,
        viewCount: data.view_count || 0,
        createdAt: data.created_at,
        images: (data.images ?? []).map((img: any) => ({
          id: img.id,
          productId: img.product_id,
          imageUrl: img.image_url,
          thumbnailUrl: img.thumbnail_url,
          sortOrder: img.sort_order,
          isPrimary: img.is_primary,
        })),
        farmer: data.farmer ? {
          id: data.farmer.id,
          farmName: data.farmer.farm_name,
          province: data.farmer.province,
          verificationStatus: data.farmer.verification_status,
          ratingAverage: Number(data.farmer.rating_average || 0),
          farmingExperienceYears: data.farmer.farming_experience_years,
        } as any : undefined,
      });
      setQuantity(data.minimum_order || 1);
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} (x${quantity}) added to cart`);
  }

  function handleBuyNow() {
    if (!product) return;
    addItem(product, quantity);
    router.push("/checkout");
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Product not found</h2>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || primaryImage?.thumbnailUrl || "/placeholder-product.svg";

  return (
    <div className="container pb-32">
      {/* Back button */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm px-4 py-3 border-b">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      {/* Product image */}
      <div className="relative aspect-square w-full bg-gray-50">
        <Image src={imageUrl} alt={product.name} fill unoptimized className="object-cover" />
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md">
          <Heart className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Product info */}
      <div className="px-4 py-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}/{product.unit}
            </span>
            {product.isOrganic && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Organic</span>
            )}
          </div>
        </div>

        {/* Rating & sold */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {product.totalReviews > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {product.ratingAverage.toFixed(1)} ({product.totalReviews} reviews)
            </span>
          )}
          <span>{product.totalSold} sold</span>
          <span>{product.availableQuantity} available</span>
        </div>

        {/* Farmer info */}
        {product.farmer && (
          <div className="rounded-xl border bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
                {(product.farmer as any).farmName?.charAt(0) || "F"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{(product.farmer as any).farmName}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /> {product.farmer.province}
                </p>
              </div>
              {product.farmer.verificationStatus === "approved" && (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-gray-900">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Quantity selector */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Quantity ({product.unit})</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(product.minimumOrder, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-gray-600 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] text-center text-lg font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-gray-600 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-500">
              Min: {product.minimumOrder} {product.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white px-4 py-3 safe-bottom">
        <div className="mx-auto flex max-w-md gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button size="lg" className="flex-1" onClick={handleBuyNow}>
            Buy Now — {formatCurrency(product.price * quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
}
