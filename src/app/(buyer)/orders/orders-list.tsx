"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_TABS: { label: string; statuses: OrderStatus[] }[] = [
  { label: "Active", statuses: ["pending", "confirmed", "harvesting", "packed", "in_transit"] },
  { label: "Completed", statuses: ["delivered"] },
  { label: "Cancelled", statuses: ["cancelled", "refunded"] },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "warning",
  confirmed: "default",
  harvesting: "success",
  packed: "default",
  in_transit: "accent",
  delivered: "success",
  cancelled: "destructive",
  refunded: "destructive",
};

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [activeTab, setActiveTab] = useState(0);
  const filtered = orders.filter((o) =>
    STATUS_TABS[activeTab].statuses.includes(o.status)
  );

  return (
    <div className="container px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {STATUS_TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
              activeTab === i
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {order.orderNumber} • {formatDate(order.createdAt)}
                </span>
                <Badge variant={STATUS_COLORS[order.status] as any}>
                  {order.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {(order.items?.length ?? 0)} item(s)
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(Number(order.totalAmount))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/marketplace"
        />
      )}
    </div>
  );
}
