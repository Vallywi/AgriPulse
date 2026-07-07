"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Package, Edit, ToggleLeft, ToggleRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  availableQuantity: number;
  totalSold: number;
  ratingAverage: number;
  isActive: boolean;
  images: { thumbnailUrl: string | null; imageUrl: string }[];
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=50&mine=true");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          unit: p.unit,
          availableQuantity: p.availableQuantity ?? p.available_quantity ?? 0,
          totalSold: p.totalSold ?? p.total_sold ?? 0,
          ratingAverage: Number(p.ratingAverage ?? p.rating_average ?? 0),
          isActive: p.isActive ?? p.is_active ?? true,
          images: p.images ?? [],
        })));
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(productId: string) {
    if (!confirm("Are you sure you want to remove this product? It will no longer appear in the marketplace.")) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Product removed successfully");
      } else {
        toast.error(data.error || "Failed to remove product");
      }
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(product: Product) {
    setTogglingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => p.id === product.id ? { ...p, isActive: !p.isActive } : p)
        );
        toast.success(product.isActive ? "Product deactivated" : "Product activated");
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch {
      toast.error("Failed to update product");
    } finally {
      setTogglingId(null);
    }
  }

  const filtered = products.filter((p) => {
    if (filter === "active" && !p.isActive) return false;
    if (filter === "inactive" && p.isActive) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">My Products</h2>
        <Link href="/dashboard/products/new">
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {f} ({products.filter((p) =>
              f === "all" ? true : f === "active" ? p.isActive : !p.isActive
            ).length})
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              {products.length === 0
                ? "No products yet. Add your first product to start selling!"
                : "No products match your search."}
            </p>
          </div>
        )}
        {filtered.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                {product.images[0] ? (
                  <img
                    src={product.images[0].thumbnailUrl || product.images[0].imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm font-semibold text-primary">
                      {formatCurrency(product.price)}/{product.unit}
                    </p>
                  </div>
                  <Badge variant={product.isActive ? "success" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>Stock: {product.availableQuantity}</span>
                  <span>Sold: {product.totalSold}</span>
                  {product.ratingAverage > 0 && <span>★ {product.ratingAverage.toFixed(1)}</span>}
                </div>
                {product.availableQuantity > 0 && product.availableQuantity <= 20 && (
                  <Badge variant="warning" className="mt-1 text-xs">⚠️ Low stock</Badge>
                )}
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1"
                    onClick={() => handleToggleActive(product)}
                    disabled={togglingId === product.id}
                  >
                    {togglingId === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : product.isActive ? (
                      <ToggleLeft className="h-3 w-3" />
                    ) : (
                      <ToggleRight className="h-3 w-3" />
                    )}
                    {product.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
