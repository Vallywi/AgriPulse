import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

// GET /api/products — List products with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "newest";
  const isOrganic = searchParams.get("isOrganic");
  const mine = searchParams.get("mine");

  const skip = (page - 1) * limit;

  const where: any = {
    deletedAt: null,
  };

  // If farmer is fetching their own products, include inactive ones
  if (mine === "true") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const farmer = await db.farmer.findUnique({ where: { userId: user.id } });
    if (!farmer) {
      // No farmer profile yet — return empty list rather than everyone's products.
      return NextResponse.json({ success: true, data: [], meta: { page: 1, limit, total: 0, totalPages: 0 } });
    }
    where.farmerId = farmer.id;
  } else {
    where.isActive = true;
  }

  if (categoryId) where.categoryId = categoryId;
  if (isOrganic === "true") where.isOrganic = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any = (() => {
    switch (sortBy) {
      case "price_asc": return { price: "asc" };
      case "price_desc": return { price: "desc" };
      case "rating": return { ratingAverage: "desc" };
      case "popular": return { totalSold: "desc" };
      default: return { createdAt: "desc" };
    }
  })();

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { id: true, farmName: true, province: true, verificationStatus: true, ratingAverage: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: products,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/products — Create product (farmer only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in to add a product" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.categoryId || body.price == null) {
      return NextResponse.json({ error: "Please fill in product name, category, and price" }, { status: 400 });
    }

    // Validate the category exists (avoids a foreign-key error)
    const category = await db.category.findUnique({ where: { id: body.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Selected category is invalid. Please pick a category." }, { status: 400 });
    }

    // Find the farmer profile, or auto-create one so the farmer can list
    // products immediately without needing to log out and back in.
    let farmer = await db.farmer.findUnique({
      where: { userId: user.id },
    });

    if (!farmer) {
      const meta = user.user_metadata || {};
      const firstName = meta.first_name || meta.firstName || "Farmer";

      // Ensure the user row exists first (FK requirement)
      await db.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email ?? null,
          firstName,
          lastName: meta.last_name || meta.lastName || "",
          role: "farmer",
          isActive: true,
        },
      });

      farmer = await db.farmer.create({
        data: {
          userId: user.id,
          farmName: meta.farm_name || meta.farmName || `${firstName}'s Farm`,
          province: meta.province || "",
          municipality: meta.municipality || "",
          barangay: meta.barangay || "",
          farmSizeHectares: 0,
          primaryCrops: [],
          farmingExperienceYears: 0,
          verificationStatus: "approved",
        },
      });
    }

    // Extract image URLs from body (already uploaded by the client)
    const imageUrls: string[] = Array.isArray(body.imageUrls) ? body.imageUrls.filter((u: any) => typeof u === "string" && u.length > 0) : [];

    // Create the product AND its image records in one atomic transaction.
    const product = await db.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          farmerId: farmer!.id,
          categoryId: body.categoryId,
          name: body.name,
          description: body.description || "",
          price: body.price,
          unit: body.unit || "kg",
          availableQuantity: body.availableQuantity || 0,
          minimumOrder: body.minimumOrder || 1,
          harvestDate: body.harvestDate ? new Date(body.harvestDate) : null,
          isOrganic: body.isOrganic || false,
          isActive: true,
        },
      });

      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, i) => ({
            productId: p.id,
            imageUrl: url,
            thumbnailUrl: url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: p.id },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          farmer: { select: { id: true, farmName: true, province: true } },
        },
      });
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    console.error("Error creating product:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
