import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/categories — Get all categories with subcategories
export async function GET() {
  const categories = await db.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ success: true, data: categories });
}
