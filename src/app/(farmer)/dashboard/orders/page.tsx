"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Check, Truck, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

interface FarmerOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  buyerName: string;
  items: OrderItem[];
}

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?role=farmer");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber ?? o.order_number ?? "",
          status: o.status,
          totalAmount: Number(o.totalAmount ?? o.total_amount ?? 0),
          createdAt: o.createdAt ?? o.created_at,
          buyerName: o.buyer?.firstName
            ? `${o.buyer.firstName} ${o.buyer.lastName || ""}`.trim()
            : "Customer",
          items: (o.items ?? []).map((i: any) => ({
            id: i.id,
            productName: i.productName ?? i.product_name ?? "Product",
            quantity: i.quantity,
            unit: i.unit,
            unitPrice: Number(i.unitPrice ?? i.unit_price ?? 0),
            subtotal: Number(i.subtotal ?? 0),
          })),
        })));
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleUpdateStatus(orderId: string, newStatus: string) {
    if (newStatus === "cancelled" && !confirm("Are you sure you want to reject/cancel this order?")) return;

    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason: newStatus === "cancelled" ? "Rejected by farmer" : undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
        );
        toast.success(
          newStatus === "cancelled" ? "Order rejected" :
          newStatus === "confirmed" ? "Order confirmed" :
          "Order updated"
        );
      } else {
        toast.error(data.error || "Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = orders.filter((o) =>
    filter === "all" ? true : o.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Orders</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "confirmed", "in_transit", "delivered", "cancelled"].map((f) => (
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
                <p className="text-xs text-gray-500">{order.orderNumber}</p>
                <div className="mt-1 space-y-0.5">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm font-medium text-gray-900">
                      {item.productName} × {item.quantity} {item.unit}
                    </p>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {order.buyerName} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                <Badge
                  variant={
                    order.status === "pending" ? "warning" :
                    order.status === "delivered" ? "success" :
                    order.status === "cancelled" ? "destructive" : "default"
                  }
                  className="mt-1"
                >
                  {order.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            {order.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleUpdateStatus(order.id, "confirmed")}
                  disabled={updatingId === order.id}
                >
                  {updatingId === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleUpdateStatus(order.id, "cancelled")}
                  disabled={updatingId === order.id}
                >
                  <X className="h-3 w-3" /> Reject
                </Button>
              </div>
            )}
            {order.status === "confirmed" && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => handleUpdateStatus(order.id, "in_transit")}
                  disabled={updatingId === order.id}
                >
                  {updatingId === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Truck className="h-3 w-3" />}
                  Mark as Shipped
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleUpdateStatus(order.id, "cancelled")}
                  disabled={updatingId === order.id}
                >
                  <X className="h-3 w-3" /> Cancel
                </Button>
              </div>
            )}
            {order.status === "in_transit" && (
              <div className="mt-3">
                <Button
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => handleUpdateStatus(order.id, "delivered")}
                  disabled={updatingId === order.id}
                >
                  {updatingId === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Mark as Delivered
                </Button>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            <Package className="mx-auto mb-2 h-8 w-8" />
            {orders.length === 0 ? "No orders yet" : "No orders found"}
          </div>
        )}
      </div>
    </div>
  );
}
