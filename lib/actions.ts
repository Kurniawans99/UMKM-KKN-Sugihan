"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUmkm(formData: FormData) {
  const supabase = await createClient();

  const foto = formData.get("foto") as File;
  if (!foto || foto.size === 0) {
    return { error: "Foto produk wajib diupload" };
  }

  // Upload image
  const fileExt = foto.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("umkm-images")
    .upload(fileName, foto, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: `Gagal upload foto: ${uploadError.message}` };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("umkm-images").getPublicUrl(fileName);

  const { error } = await supabase.from("umkm").insert({
    nama_usaha: formData.get("nama_usaha") as string,
    nama_pemilik: formData.get("nama_pemilik") as string,
    deskripsi: formData.get("deskripsi") as string,
    kategori_usaha: formData.get("kategori_usaha") as string,
    dusun: formData.get("dusun") as string,
    alamat_detail: (formData.get("alamat_detail") as string) || null,
    no_whatsapp: formData.get("no_whatsapp") as string,
    foto_url: publicUrl,
    link_eksternal: (formData.get("link_eksternal") as string) || null,
    is_active: true,
  });

  if (error) {
    return { error: `Gagal menyimpan data: ${error.message}` };
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/");
  redirect("/admin/umkm");
}

export async function updateUmkm(id: string, formData: FormData) {
  const supabase = await createClient();

  let foto_url = formData.get("existing_foto_url") as string;

  const foto = formData.get("foto") as File;
  if (foto && foto.size > 0) {
    // Delete old image if it exists
    if (foto_url) {
      const oldFileName = foto_url.split("/").pop();
      if (oldFileName) {
        await supabase.storage.from("umkm-images").remove([oldFileName]);
      }
    }

    // Upload new image
    const fileExt = foto.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("umkm-images")
      .upload(fileName, foto, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: `Gagal upload foto: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("umkm-images").getPublicUrl(fileName);
    foto_url = publicUrl;
  }

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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: `Gagal update data: ${error.message}` };
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/");
  redirect("/admin/umkm");
}

export async function deleteUmkm(id: string) {
  const supabase = await createClient();

  // Get the UMKM to find the image URL
  const { data: umkm } = await supabase
    .from("umkm")
    .select("foto_url")
    .eq("id", id)
    .single();

  if (umkm?.foto_url) {
    const fileName = umkm.foto_url.split("/").pop();
    if (fileName) {
      await supabase.storage.from("umkm-images").remove([fileName]);
    }
  }

  const { error } = await supabase.from("umkm").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus data: ${error.message}` };
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/");
}

export async function toggleUmkmActive(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("umkm")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: `Gagal mengubah status: ${error.message}` };
  }

  revalidatePath("/admin/umkm");
  revalidatePath("/");
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

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
