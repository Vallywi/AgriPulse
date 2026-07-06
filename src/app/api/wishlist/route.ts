import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/wishlist — Get user's wishlist
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlist = await db.wishlist.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          farmer: { select: { id: true, farmName: true, province: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: wishlist });
}

// POST /api/wishlist — Add product to wishlist
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  // Check if already in wishlist
  const existing = await db.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    return NextResponse.json({ success: true, data: existing, message: "Already in wishlist" });
  }

  const item = await db.wishlist.create({
    data: { userId: user.id, productId },
  });

  return NextResponse.json({ success: true, data: item }, { status: 201 });
}

// DELETE /api/wishlist — Remove from wishlist
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  await db.wishlist.deleteMany({
    where: { userId: user.id, productId },
  });

  return NextResponse.json({ success: true });
}
