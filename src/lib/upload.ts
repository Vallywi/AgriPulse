/**
 * Upload a file via the /api/upload route (uses service role server-side).
 * @param file - The file to upload
 * @param bucket - Storage bucket name ("avatars" or "products")
 * @param path - Path within the bucket
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("path", path);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    return { url: null, error: data.error || "Upload failed" };
  }

  return { url: data.url, error: null };
}

/**
 * Upload a profile avatar image.
 */
export async function uploadAvatar(file: File, userId: string): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadFile(file, "avatars", path);
}

/**
 * Upload a product image.
 */
export async function uploadProductImage(file: File, farmerId: string, productId: string, index: number): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${farmerId}/${productId}/${index}.${ext}`;
  return uploadFile(file, "products", path);
}
