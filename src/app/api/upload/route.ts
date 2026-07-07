import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /api/upload
 * Upload a file to Supabase Storage using the service role (bypasses RLS).
 * Expects multipart/form-data with:
 * - file: the file to upload
 * - bucket: "avatars" or "products"
 * - path: the storage path (e.g., "user-id/avatar.jpg")
 */
export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const path = formData.get("path") as string | null;

    if (!file || !bucket || !path) {
      return NextResponse.json({ error: "Missing file, bucket, or path" }, { status: 400 });
    }

    // Validate bucket names
    if (!["avatars", "products"].includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Use service role client to bypass RLS
    const serviceClient = await createServiceClient();

    const { error: uploadError } = await serviceClient.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = serviceClient.storage
      .from(bucket)
      .getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
