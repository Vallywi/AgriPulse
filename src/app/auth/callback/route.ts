import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const role = data.user.user_metadata?.role;
      const redirect = role === "farmer" ? "/dashboard" : "/marketplace";
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  }

  // Expired or invalid link
  return NextResponse.redirect(new URL("/auth/verify-expired", request.url));
}
