import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// POST /api/products/:id/images — Add an image to a product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the product belongs to this farmer
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { farmer: { select: { userId: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.farmer.userId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { imageUrl, thumbnailUrl, isPrimary, sortOrder } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const image = await db.productImage.create({
      data: {
        productId,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        isPrimary: isPrimary ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save image";
    console.error("Error saving product image:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
