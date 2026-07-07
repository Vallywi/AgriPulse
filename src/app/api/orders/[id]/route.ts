import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/orders/:id — Get single order
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
      },
      address: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Only buyer or farmer involved can view
  if (order.buyerId !== user.id) {
    const farmer = await db.farmer.findUnique({ where: { userId: user.id } });
    const farmerOwnsItem = order.items.some((item) => item.farmerId === farmer?.id);
    if (!farmerOwnsItem) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  }

  return NextResponse.json({ success: true, data: order });
}

// PATCH /api/orders/:id — Update order status (cancel, confirm, ship, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status, reason } = body;

  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Buyer can cancel if order is still pending
  if (status === "cancelled") {
    const isBuyer = order.buyerId === user.id;
    const farmer = await db.farmer.findUnique({ where: { userId: user.id } });
    const isFarmer = order.items.some((item) => item.farmerId === farmer?.id);

    if (!isBuyer && !isFarmer) {
      return NextResponse.json({ error: "Not authorized to cancel this order" }, { status: 403 });
    }

    // Buyers can only cancel pending orders
    if (isBuyer && !["pending", "confirmed"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot cancel order — it has already been shipped or delivered" },
        { status: 400 }
      );
    }

    // Farmers can cancel/reject pending or confirmed orders
    if (isFarmer && !["pending", "confirmed"].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot cancel order at this stage" },
        { status: 400 }
      );
    }

    // Restore stock for cancelled items
    for (const item of order.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { availableQuantity: { increment: item.quantity } },
      });
    }

    const updated = await db.order.update({
      where: { id },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason || null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  }

  // Farmer can confirm, mark as shipped, etc.
  const farmer = await db.farmer.findUnique({ where: { userId: user.id } });
  const isFarmer = order.items.some((item) => item.farmerId === farmer?.id);

  if (!isFarmer) {
    return NextResponse.json({ error: "Not authorized to update this order" }, { status: 403 });
  }

  const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["harvesting", "packed", "in_transit", "cancelled"],
    harvesting: ["packed", "in_transit"],
    packed: ["in_transit"],
    in_transit: ["delivered"],
  };

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `Cannot transition from "${order.status}" to "${status}"` },
      { status: 400 }
    );
  }

  const updated = await db.order.update({
    where: { id },
    data: {
      status,
      ...(status === "delivered" && { deliveredAt: new Date() }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
