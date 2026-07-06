"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, Star } from "lucide-react";

export default function FarmerAnalyticsPage() {
  const metrics = [
    { label: "Total Revenue", value: formatCurrency(45250), change: "+18%", up: true, icon: DollarSign },
    { label: "Total Orders", value: "234", change: "+12%", up: true, icon: ShoppingCart },
    { label: "Product Views", value: "5,420", change: "+8%", up: true, icon: Eye },
    { label: "Avg Rating", value: "4.8", change: "+0.2", up: true, icon: Star },
  ];

  const topProducts = [
    { name: "Fresh Tomatoes", revenue: 18500, orders: 95, unit: "kg" },
    { name: "Eggplant", revenue: 12300, orders: 68, unit: "kg" },
    { name: "Organic Lettuce", revenue: 8200, orders: 45, unit: "kg" },
    { name: "Sweet Corn", revenue: 6250, orders: 89, unit: "piece" },
  ];

  return (
    <div className="container px-4 py-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Last 30 days performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between">
              <m.icon className="h-4 w-4 text-gray-400" />
              <Badge variant={m.up ? "success" : "destructive"} className="text-[10px]">
                {m.up ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
                {m.change}
              </Badge>
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-500">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex h-40 items-end gap-1">
          {[40, 55, 45, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-primary/20 transition-all hover:bg-primary/40" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-gray-400">
          <span>Jun 5</span><span>Jun 12</span><span>Jun 19</span><span>Jul 5</span>
        </div>
      </Card>

      {/* Top Products */}
      <div>
        <h3 className="mb-3 font-semibold text-gray-900">Top Products</h3>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <Card key={p.name} className="flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">{p.orders} orders</p>
              </div>
              <p className="font-semibold text-sm">{formatCurrency(p.revenue)}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
