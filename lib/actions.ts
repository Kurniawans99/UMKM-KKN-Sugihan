"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";

// ============================================================
// Helper: Upload image to storage
// ============================================================
async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folder: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("umkm-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) return { url: null, error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("umkm-images").getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}

// ============================================================
// Helper: Generate unique slug
// ============================================================
async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  namaUsaha: string
): Promise<string> {
  const baseSlug = slugify(namaUsaha);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("umkm")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================================
// Auth Actions
// ============================================================

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const namaLengkap = formData.get("nama_lengkap") as string;
  const noWhatsapp = formData.get("no_whatsapp") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nama_lengkap: namaLengkap,
        role: "seller",
        no_whatsapp: noWhatsapp,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  // Get role for redirect
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin");
    }
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ============================================================
// Admin: UMKM CRUD (full access, direct approve)
// ============================================================

export async function createUmkm(formData: FormData) {
  const supabase = await createClient();

  const foto = formData.get("foto") as File;
  if (!foto || foto.size === 0) {
    return { error: "Foto produk wajib diupload" };
  }

  const { url: fotoUrl, error: uploadErr } = await uploadImage(
    supabase,
    "photos",
    foto
  );
  if (uploadErr || !fotoUrl)
    return { error: `Gagal upload foto: ${uploadErr}` };

  const namaUsaha = formData.get("nama_usaha") as string;
  const slug = await generateUniqueSlug(supabase, namaUsaha);

  const latStr = formData.get("latitude") as string;
  const lngStr = formData.get("longitude") as string;

  const { error } = await supabase.from("umkm").insert({
    nama_usaha: namaUsaha,
    nama_pemilik: formData.get("nama_pemilik") as string,
    deskripsi: formData.get("deskripsi") as string,
    kategori_usaha: formData.get("kategori_usaha") as string,
    dusun: formData.get("dusun") as string,
    alamat_detail: (formData.get("alamat_detail") as string) || null,
    no_whatsapp: formData.get("no_whatsapp") as string,
    foto_url: fotoUrl,
    link_eksternal: (formData.get("link_eksternal") as string) || null,
    is_active: true,
    status: "approved", // Admin-created → directly approved
    slug,
    latitude: latStr ? parseFloat(latStr) : null,
    longitude: lngStr ? parseFloat(lngStr) : null,
  });

  if (error) return { error: `Gagal menyimpan data: ${error.message}` };

  revalidatePath("/admin/umkm");
  revalidatePath("/");
  redirect("/admin/umkm");
}

export async function updateUmkm(id: string, formData: FormData) {
  const supabase = await createClient();

  let foto_url = formData.get("existing_foto_url") as string;

  const foto = formData.get("foto") as File;
  if (foto && foto.size > 0) {
    const { url, error: uploadErr } = await uploadImage(
      supabase,
      "photos",
      foto
    );
    if (uploadErr || !url)
      return { error: `Gagal upload foto: ${uploadErr}` };
    foto_url = url;
  }

  const latStr2 = formData.get("latitude") as string;
  const lngStr2 = formData.get("longitude") as string;

  const { error } = await supabase
    .from("umkm")
    .update({
      nama_usaha: formData.get("nama_usaha") as string,
      nama_pemilik: formData.get("nama_pemilik") as string,
      deskripsi: formData.get("deskripsi") as string,
      kategori_usaha: formData.get("kategori_usaha") as string,
      dusun: formData.get("dusun") as string,
      alamat_detail: (formData.get("alamat_detail") as string) || null,
      no_whatsapp: formData.get("no_whatsapp") as string,
      foto_url: foto_url,
      link_eksternal: (formData.get("link_eksternal") as string) || null,
      latitude: latStr2 ? parseFloat(latStr2) : null,
      longitude: lngStr2 ? parseFloat(lngStr2) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `Gagal update data: ${error.message}` };

  revalidatePath("/admin/umkm");
  revalidatePath("/");
  redirect("/admin/umkm");
}

export async function deleteUmkm(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("umkm").delete().eq("id", id);

  if (error) return { error: `Gagal menghapus data: ${error.message}` };

  revalidatePath("/admin/umkm");
  revalidatePath("/");
}

export async function toggleUmkmActive(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("umkm")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: `Gagal mengubah status: ${error.message}` };

  revalidatePath("/admin/umkm");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

// ============================================================
// Admin: Approval Actions
// ============================================================

export async function approveUmkm(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("umkm")
    .update({
      status: "approved",
      rejection_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `Gagal approve: ${error.message}` };

  revalidatePath("/admin/approval");
  revalidatePath("/admin/umkm");
  revalidatePath("/");
}

export async function rejectUmkm(id: string, reason: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("umkm")
    .update({
      status: "rejected",
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `Gagal reject: ${error.message}` };

  revalidatePath("/admin/approval");
  revalidatePath("/admin/umkm");
}

// ============================================================
// Seller: UMKM Actions
// ============================================================

export async function createSellerUmkm(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login" };

  const foto = formData.get("foto") as File;
  if (!foto || foto.size === 0) {
    return { error: "Foto produk wajib diupload" };
  }

  const { url: fotoUrl, error: uploadErr } = await uploadImage(
    supabase,
    "photos",
    foto
  );
  if (uploadErr || !fotoUrl)
    return { error: `Gagal upload foto: ${uploadErr}` };

  // Banner (optional)
  let bannerUrl: string | null = null;
  const banner = formData.get("banner") as File;
  if (banner && banner.size > 0) {
    const { url, error: bannerErr } = await uploadImage(
      supabase,
      "banners",
      banner
    );
    if (bannerErr) return { error: `Gagal upload banner: ${bannerErr}` };
    bannerUrl = url;
  }

  const namaUsaha = formData.get("nama_usaha") as string;
  const slug = await generateUniqueSlug(supabase, namaUsaha);

  const sellerLatStr = formData.get("latitude") as string;
  const sellerLngStr = formData.get("longitude") as string;

  const { error } = await supabase.from("umkm").insert({
    user_id: user.id,
    nama_usaha: namaUsaha,
    nama_pemilik: formData.get("nama_pemilik") as string,
    deskripsi: formData.get("deskripsi") as string,
    kategori_usaha: formData.get("kategori_usaha") as string,
    dusun: formData.get("dusun") as string,
    alamat_detail: (formData.get("alamat_detail") as string) || null,
    no_whatsapp: formData.get("no_whatsapp") as string,
    foto_url: fotoUrl,
    banner_url: bannerUrl,
    tagline: (formData.get("tagline") as string) || null,
    link_eksternal: (formData.get("link_eksternal") as string) || null,
    is_active: true,
    status: "pending", // Seller-created → needs approval
    slug,
    latitude: sellerLatStr ? parseFloat(sellerLatStr) : null,
    longitude: sellerLngStr ? parseFloat(sellerLngStr) : null,
  });

  if (error) return { error: `Gagal mendaftarkan UMKM: ${error.message}` };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSellerUmkm(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login" };

  let foto_url = formData.get("existing_foto_url") as string;
  let banner_url = (formData.get("existing_banner_url") as string) || null;

  const foto = formData.get("foto") as File;
  if (foto && foto.size > 0) {
    const { url, error: uploadErr } = await uploadImage(
      supabase,
      "photos",
      foto
    );
    if (uploadErr || !url)
      return { error: `Gagal upload foto: ${uploadErr}` };
    foto_url = url;
  }

  const banner = formData.get("banner") as File;
  if (banner && banner.size > 0) {
    const { url, error: bannerErr } = await uploadImage(
      supabase,
      "banners",
      banner
    );
    if (bannerErr) return { error: `Gagal upload banner: ${bannerErr}` };
    banner_url = url;
  }

  const sellerLatStr2 = formData.get("latitude") as string;
  const sellerLngStr2 = formData.get("longitude") as string;

  const { error } = await supabase
    .from("umkm")
    .update({
      nama_usaha: formData.get("nama_usaha") as string,
      nama_pemilik: formData.get("nama_pemilik") as string,
      deskripsi: formData.get("deskripsi") as string,
      kategori_usaha: formData.get("kategori_usaha") as string,
      dusun: formData.get("dusun") as string,
      alamat_detail: (formData.get("alamat_detail") as string) || null,
      no_whatsapp: formData.get("no_whatsapp") as string,
      foto_url: foto_url,
      banner_url: banner_url,
      tagline: (formData.get("tagline") as string) || null,
      link_eksternal: (formData.get("link_eksternal") as string) || null,
      latitude: sellerLatStr2 ? parseFloat(sellerLatStr2) : null,
      longitude: sellerLngStr2 ? parseFloat(sellerLngStr2) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id); // Ensure ownership

  if (error) return { error: `Gagal update: ${error.message}` };

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard/umkm");
}

export async function resubmitUmkm(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login" };

  const { error } = await supabase
    .from("umkm")
    .update({
      status: "pending",
      rejection_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: `Gagal resubmit: ${error.message}` };

  revalidatePath("/dashboard");
}

// ============================================================
// Product Actions
// ============================================================

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const foto = formData.get("foto") as File;
  if (!foto || foto.size === 0) return { error: "Foto produk wajib diupload" };

  const { url: fotoUrl, error: uploadErr } = await uploadImage(
    supabase,
    "products",
    foto
  );
  if (uploadErr || !fotoUrl)
    return { error: `Gagal upload foto: ${uploadErr}` };

  const hargaStr = formData.get("harga") as string;

  const { error } = await supabase.from("umkm_products").insert({
    umkm_id: formData.get("umkm_id") as string,
    nama_produk: formData.get("nama_produk") as string,
    deskripsi: (formData.get("deskripsi") as string) || null,
    harga: hargaStr ? parseFloat(hargaStr) : null,
    foto_url: fotoUrl,
    is_available: true,
    urutan: parseInt((formData.get("urutan") as string) || "0"),
  });

  if (error) return { error: `Gagal menambah produk: ${error.message}` };

  revalidatePath("/dashboard/produk");
  revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  let foto_url = formData.get("existing_foto_url") as string;

  const foto = formData.get("foto") as File;
  if (foto && foto.size > 0) {
    const { url, error: uploadErr } = await uploadImage(
      supabase,
      "products",
      foto
    );
    if (uploadErr || !url)
      return { error: `Gagal upload foto: ${uploadErr}` };
    foto_url = url;
  }

  const hargaStr = formData.get("harga") as string;

  const { error } = await supabase
    .from("umkm_products")
    .update({
      nama_produk: formData.get("nama_produk") as string,
      deskripsi: (formData.get("deskripsi") as string) || null,
      harga: hargaStr ? parseFloat(hargaStr) : null,
      foto_url: foto_url,
    })
    .eq("id", id);

  if (error) return { error: `Gagal update produk: ${error.message}` };

  revalidatePath("/dashboard/produk");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("umkm_products").delete().eq("id", id);
  if (error) return { error: `Gagal menghapus produk: ${error.message}` };
  revalidatePath("/dashboard/produk");
  revalidatePath("/");
}

export async function toggleProductAvailable(
  id: string,
  isAvailable: boolean
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("umkm_products")
    .update({ is_available: isAvailable })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/produk");
  revalidatePath("/");
}

// ============================================================
// Gallery Actions
// ============================================================

export async function addGalleryPhoto(formData: FormData) {
  const supabase = await createClient();

  const foto = formData.get("foto") as File;
  if (!foto || foto.size === 0) return { error: "Foto wajib diupload" };

  const { url: fotoUrl, error: uploadErr } = await uploadImage(
    supabase,
    "gallery",
    foto
  );
  if (uploadErr || !fotoUrl)
    return { error: `Gagal upload foto: ${uploadErr}` };

  const { error } = await supabase.from("umkm_gallery").insert({
    umkm_id: formData.get("umkm_id") as string,
    foto_url: fotoUrl,
    caption: (formData.get("caption") as string) || null,
    urutan: parseInt((formData.get("urutan") as string) || "0"),
  });

  if (error) return { error: `Gagal menambah foto: ${error.message}` };

  revalidatePath("/dashboard/galeri");
  revalidatePath("/");
}

export async function deleteGalleryPhoto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("umkm_gallery").delete().eq("id", id);
  if (error) return { error: `Gagal menghapus foto: ${error.message}` };
  revalidatePath("/dashboard/galeri");
  revalidatePath("/");
}

// ============================================================
// Profile Actions
// ============================================================

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login" };

  const { error } = await supabase
    .from("profiles")
    .update({
      nama_lengkap: formData.get("nama_lengkap") as string,
      no_whatsapp: (formData.get("no_whatsapp") as string) || null,
    })
    .eq("id", user.id);

  if (error) return { error: `Gagal update profil: ${error.message}` };

  revalidatePath("/dashboard/profil");
}
