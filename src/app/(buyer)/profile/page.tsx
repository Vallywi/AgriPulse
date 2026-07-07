import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileContent } from "./profile-content";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fallback to auth user data if the DB profile row doesn't exist yet,
  // so authenticated users always see their profile and the Sign Out button.
  const meta = user.user_metadata || {};
  const resolvedProfile = profile ?? {
    id: user.id,
    email: user.email ?? null,
    firstName: meta.first_name || meta.firstName || "User",
    lastName: meta.last_name || meta.lastName || "",
    avatarUrl: meta.avatar_url || null,
    role: meta.role || "consumer",
  };

  return <ProfileContent user={resolvedProfile as any} />;
}
