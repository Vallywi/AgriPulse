import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
