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

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
