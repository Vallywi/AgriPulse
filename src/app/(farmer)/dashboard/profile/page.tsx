import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FarmerProfileContent } from "./profile-content";

export const metadata: Metadata = {
  title: "Profile - Farmer Dashboard",
};

export default async function FarmerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*, farmer:farmers(*)")
    .eq("id", user.id)
    .single();

  // Fallback to auth data if DB row is missing, so the profile and Sign Out always render.
  const meta = user.user_metadata || {};
  const resolvedProfile = profile ?? {
    id: user.id,
    email: user.email ?? null,
    firstName: meta.first_name || meta.firstName || "User",
    lastName: meta.last_name || meta.lastName || "",
    avatarUrl: meta.avatar_url || null,
    role: meta.role || "farmer",
    farmer: null,
  };

  return <FarmerProfileContent user={resolvedProfile} />;
}
