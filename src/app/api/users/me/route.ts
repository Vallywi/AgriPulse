import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * PATCH /api/users/me
 * Update the authenticated user's profile.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, avatarUrl, address } = body;

    const meta = user.user_metadata || {};

    const updateData: Record<string, any> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    // Upsert so the profile is always saved even if the row doesn't exist yet.
    const updatedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: updateData,
      create: {
        id: user.id,
        email: user.email ?? null,
        firstName: firstName || meta.first_name || meta.firstName || "User",
        lastName: lastName || meta.last_name || meta.lastName || "",
        avatarUrl: avatarUrl ?? null,
        role: meta.role || "consumer",
        isActive: true,
      },
    });

    // Save/update the user's default address if provided
    if (address && (address.streetAddress || address.province || address.municipality || address.barangay)) {
      const existing = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
      });

      const addressData = {
        label: address.label || "Home",
        recipientName: address.recipientName || `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        phone: address.phone || "",
        streetAddress: address.streetAddress || "",
        barangay: address.barangay || "",
        municipality: address.municipality || "",
        province: address.province || "",
        postalCode: address.postalCode || "",
        isDefault: true,
      };

      if (existing) {
        await prisma.address.update({ where: { id: existing.id }, data: addressData });
      } else {
        await prisma.address.create({ data: { userId: user.id, ...addressData } });
      }
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/me
 * Get the authenticated user's profile.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { farmer: true },
    });

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
