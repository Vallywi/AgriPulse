import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/products/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id, isActive: true, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      farmer: {
        select: {
          id: true,
          farmName: true,
          province: true,
          municipality: true,
          verificationStatus: true,
          ratingAverage: true,
          totalReviews: true,
        },
      },
      category: { select: { id: true, name: true, slug: true } },
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Increment view count
  await db.product.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true, data: product });
}

// DELETE /api/products/:id — Soft-delete a product (farmer only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const farmer = await db.farmer.findUnique({
    where: { userId: user.id },
  });

  if (!farmer) {
    return NextResponse.json({ error: "Farmer profile not found" }, { status: 403 });
  }

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.farmerId !== farmer.id) {
    return NextResponse.json({ error: "Not authorized to delete this product" }, { status: 403 });
  }

  // Soft delete: mark as inactive and set deletedAt
  await db.product.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, message: "Product removed" });
}

// PATCH /api/products/:id — Update product (farmer only)
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

  const farmer = await db.farmer.findUnique({
    where: { userId: user.id },
  });

  if (!farmer) {
    return NextResponse.json({ error: "Farmer profile not found" }, { status: 403 });
  }

  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.farmerId !== farmer.id) {
    return NextResponse.json({ error: "Not authorized to update this product" }, { status: 403 });
  }

  const body = await request.json();

  const updated = await db.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.unit !== undefined && { unit: body.unit }),
      ...(body.availableQuantity !== undefined && { availableQuantity: body.availableQuantity }),
      ...(body.minimumOrder !== undefined && { minimumOrder: body.minimumOrder }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.isOrganic !== undefined && { isOrganic: body.isOrganic }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
