import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/sync-user
 * Creates or updates the user row in the users table after Supabase auth sign-up.
 * Called from the client after a successful signUp.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const metadata = user.user_metadata || {};
    const firstName = metadata.first_name || metadata.firstName || "User";
    const lastName = metadata.last_name || metadata.lastName || "";
    const role = metadata.role || "consumer";
    const email = user.email || null;
    const phone = user.phone || null;

    // Upsert user in the users table
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        firstName,
        lastName,
        email,
        phone,
        role,
        lastLoginAt: new Date(),
        isActive: true,
      },
      create: {
        id: user.id,
        firstName,
        lastName,
        email,
        phone,
        role,
        isActive: true,
        isVerified: false,
        lastLoginAt: new Date(),
      },
    });

    // If the user is a farmer, ensure a farmer profile exists
    if (role === "farmer") {
      const farmName = metadata.farm_name || metadata.farmName || `${firstName}'s Farm`;
      const province = metadata.province || "";
      const municipality = metadata.municipality || "";
      const barangay = metadata.barangay || "";

      const existingFarmer = await prisma.farmer.findUnique({
        where: { userId: user.id },
      });

      if (!existingFarmer) {
        await prisma.farmer.create({
          data: {
            userId: user.id,
            farmName,
            province,
            municipality,
            barangay,
            farmSizeHectares: 0,
            primaryCrops: [],
            farmingExperienceYears: 0,
            // Auto-approve so farmers can list products immediately
            verificationStatus: "approved",
          },
        });
      } else {
        // Update location details if provided
        await prisma.farmer.update({
          where: { userId: user.id },
          data: {
            ...(farmName && { farmName }),
            ...(province && { province }),
            ...(municipality && { municipality }),
            ...(barangay && { barangay }),
          },
        });
      }
    }

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
