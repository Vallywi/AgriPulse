"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Check, Truck } from "lucide-react";

const MOCK_ORDERS = [
  { id: "AP-20260706-001", buyer: "Maria Santos", product: "Fresh Tomatoes", qty: 5, unit: "kg", amount: 425, status: "pending", date: "2026-07-06" },
  { id: "AP-20260706-002", buyer: "Chef Rico", product: "Eggplant", qty: 10, unit: "kg", amount: 600, status: "confirmed", date: "2026-07-06" },
  { id: "AP-20260705-003", buyer: "Juan Dela Cruz", product: "Lettuce", qty: 3, unit: "kg", amount: 360, status: "in_transit", date: "2026-07-05" },
  { id: "AP-20260704-004", buyer: "Aling Nena", product: "Sweet Corn", qty: 20, unit: "piece", amount: 500, status: "delivered", date: "2026-07-04" },
];

export default function FarmerOrdersPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = MOCK_ORDERS.filter((o) =>
    filter === "all" ? true : o.status === filter
  );

  return (
    <div className="container px-4 py-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Orders</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "confirmed", "in_transit", "delivered"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">{order.id}</p>
                <p className="font-medium text-gray-900">{order.product}</p>
                <p className="text-sm text-gray-600">
                  {order.qty} {order.unit} · {order.buyer}
                </p>
                <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.amount)}</p>
                <Badge
                  variant={
                    order.status === "pending" ? "warning" :
                    order.status === "delivered" ? "success" : "default"
                  }
                  className="mt-1"
                >
                  {order.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            {order.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1 gap-1">
                  <Check className="h-3 w-3" /> Confirm
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Reject
                </Button>
              </div>
            )}
            {order.status === "confirmed" && (
              <div className="mt-3">
                <Button size="sm" className="w-full gap-1">
                  <Truck className="h-3 w-3" /> Mark as Shipped
                </Button>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            <Package className="mx-auto mb-2 h-8 w-8" />
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
