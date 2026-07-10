"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, MapPin, Leaf, Zap } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, onBuyNow, className }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const imageUrl = primaryImage?.thumbnailUrl || primaryImage?.imageUrl || "/placeholder-product.svg";

  // Build a friendly location string: "Municipality, Province" or fall back gracefully
  const locationParts = [
    product.farmer?.municipality,
    product.farmer?.province,
  ].filter(Boolean);
  const locationText = locationParts.join(", ");

  return (
    <div className={cn("group relative rounded-2xl border bg-card shadow-md transition-all duration-150 ease-in-out hover:shadow-lg hover:scale-[1.02] active:scale-95", className)}>
      {/* Image */}
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isOrganic && (
              <Badge variant="organic" className="text-[10px]">
                <Leaf className="mr-0.5 h-3 w-3" /> Organic
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="accent" className="text-[10px]">⭐ Featured</Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4 text-gray-400" />
      </button>

      {/* Content */}
      <div className="p-4">
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.name}</h3>
        </Link>

        {/* Price */}
        <p className="mt-1 text-base font-bold text-primary">
          {formatCurrency(Number(product.price))}/{product.unit}
        </p>

        {/* Rating */}
        {product.totalReviews > 0 && (
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-xs font-medium text-gray-700">
              {Number(product.ratingAverage).toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({product.totalReviews})</span>
          </div>
        )}

        {/* Farmer location */}
        {product.farmer && locationText && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{locationText}</span>
            {product.farmer.verificationStatus === "approved" && (
              <span className="ml-auto text-primary" title="Verified Farmer">✓</span>
            )}
          </div>
        )}

        {/* Action buttons: Add to Cart + Buy Now */}
        {(onAddToCart || onBuyNow) && (
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {onAddToCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="flex items-center justify-center gap-1 rounded-xl bg-primary-50 py-2 text-xs font-medium text-primary transition-all duration-150 ease-in-out hover:bg-primary-100 hover:scale-[1.02] active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            )}
            {onBuyNow && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBuyNow();
                }}
                className="flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-medium text-white transition-all duration-150 ease-in-out hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
              >
                <Zap className="h-3.5 w-3.5" />
                Buy Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
