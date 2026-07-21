import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Umkm, UmkmGallery } from "@/lib/types";
import type { Metadata } from "next";
import GalleryManager from "@/components/seller/GalleryManager";

export const metadata: Metadata = { title: "Kelola Galeri" };

export default async function DashboardGaleriPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: umkmData } = await supabase
    .from("umkm")
    .select("id, nama_usaha")
    .eq("user_id", user?.id)
    .maybeSingle();

  if (!umkmData) redirect("/dashboard/umkm");

  const umkm = umkmData as Pick<Umkm, "id" | "nama_usaha">;

  const { data: gallery } = await supabase
    .from("umkm_gallery")
    .select("*")
    .eq("umkm_id", umkm.id)
    .order("urutan", { ascending: true });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Galeri Foto</h1>
        <p className="text-text-muted text-sm mt-1">Foto-foto tambahan untuk halaman UMKM Anda</p>
      </div>
      <GalleryManager umkmId={umkm.id} gallery={(gallery || []) as UmkmGallery[]} />
    </div>
  );
}
