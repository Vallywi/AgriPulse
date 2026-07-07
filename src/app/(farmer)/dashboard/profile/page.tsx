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

  return <FarmerProfileContent user={profile} />;
}
