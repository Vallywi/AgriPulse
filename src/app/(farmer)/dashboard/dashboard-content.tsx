"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Star,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export function FarmerDashboardContent() {
  // TODO: Replace with real data from API
  const stats = {
    revenue: 15250,
    revenueGrowth: 12,
    pendingOrders: 3,
    activeProducts: 18,
    rating: 4.8,
  };

  const recentOrders = [
    { id: "AP-20260706-001", product: "Fresh Tomatoes", qty: "5kg", amount: 425, status: "pending" },
    { id: "AP-20260706-002", product: "Eggplant", qty: "3kg", amount: 180, status: "confirmed" },
    { id: "AP-20260705-003", product: "Lettuce", qty: "2kg", amount: 240, status: "in_transit" },
  ];

  return (
    <div className="container px-4 py-4 space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Good morning, Farmer! 🌱</h2>
        <p className="text-sm text-gray-500">Here&apos;s your farm overview today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-5 w-5 text-primary" />
            <Badge variant="success" className="text-xs">+{stats.revenueGrowth}%</Badge>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
          <p className="text-xs text-gray-500">Revenue this month</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <ShoppingCart className="h-5 w-5 text-accent" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          <p className="text-xs text-gray-500">Pending orders</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Package className="h-5 w-5 text-secondary" />
            <span className="text-xs text-gray-500">Listed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
          <p className="text-xs text-gray-500">Active products</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Star className="h-5 w-5 text-accent" />
            <span className="text-xs text-gray-500">Avg</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.rating}</p>
          <p className="text-xs text-gray-500">Rating</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/products/new" className="flex-1">
          <Button size="lg" className="w-full gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
        <Link href="/dashboard/orders" className="flex-1">
          <Button size="lg" variant="outline" className="w-full gap-2">
            <ShoppingCart className="h-4 w-4" /> View Orders
          </Button>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm text-primary">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Card key={order.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.product}</p>
                <p className="text-xs text-gray-500">{order.id} · {order.qty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(order.amount)}</p>
                <Badge
                  variant={
                    order.status === "pending" ? "warning" :
                    order.status === "confirmed" ? "default" : "success"
                  }
                  className="text-xs"
                >
                  {order.status.replace("_", " ")}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
