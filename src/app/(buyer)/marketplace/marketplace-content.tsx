"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SearchX,
  LayoutGrid,
  Leaf,
  Apple,
  Wheat,
  Carrot,
  Drumstick,
  Fish,
  Flower2,
  Egg,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  vegetables: Leaf,
  fruits: Apple,
  "rice-grains": Wheat,
  "root-crops": Carrot,
  "poultry-meat": Drumstick,
  seafood: Fish,
  "herbs-spices": Flower2,
  "dairy-eggs": Egg,
};

interface MarketplaceContentProps {
  categories: Category[];
  initialProducts: Product[];
}

export function MarketplaceContent({ categories, initialProducts }: MarketplaceContentProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleAddToCart(product: Product) {
    try {
      addItem(product, Number(product.minimumOrder) || 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  }

  function handleBuyNow(product: Product) {
    try {
      addItem(product, Number(product.minimumOrder) || 1);
      router.push("/checkout");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to proceed to checkout");
    }
  }

  return (
    <div className="container px-4 py-4 space-y-4">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-4 shadow-md">
        <h1 className="text-xl font-bold text-gray-900">Fresh Produce</h1>
        <p className="text-sm text-gray-600">From verified Filipino farmers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search vegetables, fruits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ease-in-out inline-flex items-center gap-1.5",
            !selectedCategory
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <LayoutGrid className={cn(
            "h-4 w-4 transition-all duration-200 ease-in-out",
            !selectedCategory ? "opacity-100 scale-110" : "opacity-70 scale-100"
          )} />
          All
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug];
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ease-in-out inline-flex items-center gap-1.5",
                isSelected
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {Icon && <Icon className={cn(
                "h-4 w-4 transition-all duration-200 ease-in-out",
                isSelected ? "opacity-100 scale-110" : "opacity-70 scale-100"
              )} />}
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms`, opacity: 0 }}
            >
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onBuyNow={() => handleBuyNow(product)}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No products found"
          description="Try adjusting your search or browse a different category."
        />
      )}
    </div>
  );
}
