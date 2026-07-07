"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

export function OrdersList({ orders: initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filtered = orders.filter((o) =>
    STATUS_TABS[activeTab].statuses.includes(o.status)
  );

  async function handleCancel(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled", reason: "Cancelled by buyer" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" as OrderStatus } : o)
        );
        toast.success("Order cancelled successfully");
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  }

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
          {filtered.map((order) => {
            const canCancel = ["pending", "confirmed"].includes(order.status);
            return (
              <div
                key={order.id}
                className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <Link href={`/orders/${order.id}`}>
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
                {canCancel && (
                  <div className="mt-3 border-t pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      Cancel Order
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/marketplace"
        />
      )}
    </div>
  );
}
