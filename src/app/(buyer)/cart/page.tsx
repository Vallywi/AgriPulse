"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 100 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the marketplace to add fresh produce to your cart."
        actionLabel="Browse Produce"
        actionHref="/marketplace"
      />
    );
  }

  return (
    <div className="container px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
        <button onClick={clearCart} className="text-xs text-gray-400 hover:text-destructive">
          Clear all
        </button>
      </div>

      {/* Cart items */}
      <div className="space-y-3">
        {items.map((item) => {
          const image = item.product.images?.[0]?.thumbnailUrl || "/placeholder-product.svg";
          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-2xl border bg-white p-3"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image src={image} alt={item.product.name} fill unoptimized className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(Number(item.product.price))}/{item.product.unit}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-300 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border bg-white p-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery fee</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <Link href="/checkout" className="block">
        <Button size="xl" className="w-full text-base">
          Checkout — {formatCurrency(total)}
        </Button>
      </Link>
    </div>
  );
}
