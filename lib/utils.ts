/**
 * Convert a string to a URL-friendly slug.
 * Example: "Warung Bu Sari" → "warung-bu-sari"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Format price in Indonesian Rupiah.
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadFile(
  supabase: ReturnType<typeof import("@supabase/ssr").createBrowserClient>,
  bucket: string,
  folder: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}
