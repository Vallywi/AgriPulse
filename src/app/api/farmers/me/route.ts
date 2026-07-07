import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/farmers/me — Get the authenticated farmer's profile.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const farmer = await db.farmer.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ farmer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch farmer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/farmers/me — Update (or create) the authenticated farmer's profile.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const meta = user.user_metadata || {};

    // Ensure the user row exists (FK requirement)
    await db.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email ?? null,
        firstName: meta.first_name || meta.firstName || "Farmer",
        lastName: meta.last_name || meta.lastName || "",
        role: "farmer",
        isActive: true,
      },
    });

    const data: Record<string, any> = {};
    if (body.farmName !== undefined) data.farmName = body.farmName;
    if (body.province !== undefined) data.province = body.province;
    if (body.municipality !== undefined) data.municipality = body.municipality;
    if (body.barangay !== undefined) data.barangay = body.barangay;
    if (body.farmSizeHectares !== undefined) data.farmSizeHectares = body.farmSizeHectares;
    if (body.farmingExperienceYears !== undefined) data.farmingExperienceYears = body.farmingExperienceYears;

    const farmer = await db.farmer.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        farmName: body.farmName || meta.farm_name || "My Farm",
        province: body.province || meta.province || "",
        municipality: body.municipality || meta.municipality || "",
        barangay: body.barangay || meta.barangay || "",
        farmSizeHectares: body.farmSizeHectares || 0,
        primaryCrops: [],
        farmingExperienceYears: body.farmingExperienceYears || 0,
        verificationStatus: "approved",
      },
    });

    return NextResponse.json({ farmer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update farmer";
    console.error("Error updating farmer:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
