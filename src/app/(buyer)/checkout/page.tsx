"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MapPin, CreditCard, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { value: "gcash", label: "GCash", icon: "💳" },
  { value: "maya", label: "Maya", icon: "💳" },
  { value: "cod", label: "Cash on Delivery", icon: "💵" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 100 : 0;
  const serviceFee = Math.round(subtotal * 0.02);
  const total = subtotal + deliveryFee + serviceFee;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    // In a real app, this would call an API to create the order
    // For now, simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearCart();
    setOrderPlaced(true);
    toast.success("Order placed successfully!");
    setLoading(false);
  }

  if (orderPlaced) {
    return (
      <div className="container px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-sm text-gray-600">Your order has been placed successfully. You will receive updates on your order status.</p>
        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={() => router.push("/orders")}>View My Orders</Button>
          <Button variant="outline" onClick={() => router.push("/marketplace")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Cart is empty</h2>
        <Button className="mt-4" onClick={() => router.push("/marketplace")}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container pb-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm px-4 py-3 border-b">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Checkout
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="px-4 py-4 space-y-5">
        {/* Order items summary */}
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Order Items ({items.length})</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={item.product.images?.[0]?.thumbnailUrl || "/placeholder-product.svg"}
                    alt={item.product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} {item.product.unit}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(Number(item.product.price) * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MapPin className="h-4 w-4 text-primary" /> Delivery Address
          </h3>
          <Input placeholder="Recipient Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
          <Input placeholder="Phone Number (e.g. 09171234567)" value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" />
          <Input placeholder="Street Address / House No." value={address} onChange={(e) => setAddress(e.target.value)} required />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} required />
            <Input placeholder="Municipality" value={municipality} onChange={(e) => setMunicipality(e.target.value)} required />
          </div>
          <Input placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} required />
        </div>

        {/* Payment method */}
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CreditCard className="h-4 w-4 text-primary" /> Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  paymentMethod === method.value
                    ? "border-primary bg-primary-50 ring-1 ring-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{method.icon}</span>
                <p className="mt-1 text-xs font-medium text-gray-900">{method.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="rounded-xl border bg-white p-4 space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MessageSquare className="h-4 w-4 text-primary" /> Note to Seller
          </h3>
          <textarea
            placeholder="Special instructions (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Price summary */}
        <div className="rounded-xl border bg-white p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee (2%)</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Place order */}
        <Button type="submit" size="xl" className="w-full text-base" loading={loading}>
          Place Order — {formatCurrency(total)}
        </Button>
      </form>
    </div>
  );
}
