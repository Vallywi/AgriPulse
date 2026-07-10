"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Leaf, Apple, Wheat, Carrot, Drumstick, Fish, Flower2, Egg } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
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

interface HomeContentProps {
  featuredProducts: Product[];
  categories: Category[];
}

export function HomeContent({ featuredProducts, categories }: HomeContentProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

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
    <div className="container px-4 py-4 space-y-6 pb-20">
      {/* Greeting header */}
      <div className="animate-fade-in-up flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-sm text-gray-500">Fresh from Filipino farms</p>
        </div>
        <Logo showText={false} iconSize="h-10 w-10" imageWidth={44} imageHeight={44} />
      </div>

      {/* Banner */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-6 text-white shadow-lg" style={{ animationDelay: "100ms", opacity: 0 }}>
        <div className="relative z-10">
          <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
            <Sparkles className="h-3 w-3" /> New Harvest
          </div>
          <h2 className="text-lg font-bold">Fresh Produce Available!</h2>
          <p className="mt-1 text-sm text-white/80">Straight from verified farmers in your area.</p>
          <Link href="/marketplace" className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline decoration-white/50 underline-offset-2 hover:decoration-white">
            Shop Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Categories grid */}
      <div className="animate-fade-in-up" style={{ animationDelay: "200ms", opacity: 0 }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Categories</h2>
          <Link href="/marketplace" className="text-xs font-medium text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Leaf;
            return (
              <Link
                key={cat.id}
                href={`/marketplace?category=${cat.id}`}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-white border p-3 shadow-sm transition-all duration-150 hover:shadow-md hover:scale-105 active:scale-95"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured products */}
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms", opacity: 0 }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Fresh Picks</h2>
          <Link href="/marketplace" className="text-xs font-medium text-primary hover:underline">
            See All
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 4) * 75}ms`, opacity: 0 }}
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
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <Leaf className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-500">No products yet</p>
            <p className="mt-1 text-xs text-gray-400">Fresh produce will appear here once farmers list their harvest.</p>
          </div>
        )}
      </div>
    </div>
  );
}
