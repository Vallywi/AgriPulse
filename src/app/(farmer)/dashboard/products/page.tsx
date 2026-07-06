"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Package, Edit, ToggleLeft } from "lucide-react";
import Link from "next/link";

// TODO: Replace with real data
const MOCK_PRODUCTS = [
  { id: "1", name: "Fresh Tomatoes", price: 85, unit: "kg", stock: 500, sold: 1200, rating: 4.7, isActive: true, image: null },
  { id: "2", name: "Eggplant", price: 60, unit: "kg", stock: 15, sold: 890, rating: 4.5, isActive: true, image: null },
  { id: "3", name: "Organic Lettuce", price: 120, unit: "kg", stock: 200, sold: 340, rating: 4.8, isActive: true, image: null },
  { id: "4", name: "Sweet Corn", price: 25, unit: "piece", stock: 0, sold: 560, rating: 4.3, isActive: false, image: null },
];

export default function ProductManagementPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (filter === "active" && !p.isActive) return false;
    if (filter === "inactive" && p.isActive) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            {f} ({MOCK_PRODUCTS.filter((p) =>
              f === "all" ? true : f === "active" ? p.isActive : !p.isActive
            ).length})
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filtered.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
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
                  <span>Stock: {product.stock}{product.unit}</span>
                  <span>Sold: {product.sold}</span>
                  <span>★ {product.rating}</span>
                </div>
                {product.stock <= 20 && product.stock > 0 && (
                  <Badge variant="warning" className="mt-1 text-xs">⚠️ Low stock</Badge>
                )}
                <div className="mt-2 flex gap-2">
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Edit className="h-3 w-3" /> Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                    <ToggleLeft className="h-3 w-3" /> {product.isActive ? "Deactivate" : "Activate"}
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
