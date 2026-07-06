import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/cart — Get user's cart (stored client-side via Zustand, this syncs)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cart is primarily client-side (Zustand + localStorage)
  // This endpoint is for future server-side cart sync
  return NextResponse.json({ success: true, data: { items: [] } });
}
