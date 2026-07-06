import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/orders — Get user's orders
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where: any = { buyerId: user.id };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        items: {
          include: { product: { include: { images: { take: 1 } } } },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: orders,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/orders — Create new order
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { addressId, deliveryDate, deliveryTimeSlot, paymentMethod, items, specialInstructions } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems: any[] = [];

  for (const item of items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      include: { farmer: { select: { id: true } } },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: `Product ${item.productId} not available` }, { status: 400 });
    }

    if (Number(product.availableQuantity) < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
    }

    const itemSubtotal = Number(product.price) * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      productId: product.id,
      farmerId: product.farmer!.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      unit: product.unit,
      subtotal: itemSubtotal,
    });
  }

  const deliveryFee = 100; // simplified
  const serviceFee = Math.round(subtotal * 0.03); // 3% service fee
  const totalAmount = subtotal + deliveryFee + serviceFee;

  // Generate order number
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  const orderNumber = `AP-${dateStr}-${random}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      buyerId: user.id,
      addressId,
      subtotal,
      deliveryFee,
      serviceFee,
      totalAmount,
      paymentMethod,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      deliveryTimeSlot,
      specialInstructions,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  // Decrement stock
  for (const item of orderItems) {
    await db.product.update({
      where: { id: item.productId },
      data: { availableQuantity: { decrement: item.quantity } },
    });
  }

  return NextResponse.json({ success: true, data: order }, { status: 201 });
}
