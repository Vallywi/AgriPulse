import { createClient } from "@/lib/supabase/client";

/**
 * Upload a file to Supabase Storage and return the public URL.
 * @param file - The file to upload
 * @param bucket - Storage bucket name (e.g. "avatars", "products")
 * @param path - Path within the bucket (e.g. "user-id/filename.jpg")
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { url: urlData.publicUrl, error: null };
}

/**
 * Upload a profile avatar image.
 * Returns the public URL of the uploaded image.
 */
export async function uploadAvatar(file: File, userId: string): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadFile(file, "avatars", path);
}

/**
 * Upload a product image.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File, farmerId: string, productId: string, index: number): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${farmerId}/${productId}/${index}.${ext}`;
  return uploadFile(file, "products", path);
}
