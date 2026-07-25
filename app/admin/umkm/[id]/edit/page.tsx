import AdminEditUmkmTabs from "@/components/admin/AdminEditUmkmTabs";
import { updateUmkm } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Umkm, UmkmProduct, UmkmGallery, Profile } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit UMKM — Admin",
};

export default async function EditUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch UMKM
  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const umkm = data as Umkm;

  // Fetch Products & Gallery for this UMKM
  const [{ data: products }, { data: gallery }] = await Promise.all([
    supabase
      .from("umkm_products")
      .select("*")
      .eq("umkm_id", umkm.id)
      .order("urutan", { ascending: true }),
    supabase
      .from("umkm_gallery")
      .select("*")
      .eq("umkm_id", umkm.id)
      .order("urutan", { ascending: true }),
  ]);

  // Fetch Owner Profile if user_id is present, and fetch all profiles for assignment dropdown
  let ownerProfile: Profile | null = null;
  const [{ data: pData }, { data: allProfilesData }] = await Promise.all([
    umkm.user_id
      ? supabase.from("profiles").select("*").eq("id", umkm.user_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("profiles").select("*").order("nama_lengkap", { ascending: true }),
  ]);

  if (pData) ownerProfile = pData as Profile;
  const allProfiles = (allProfilesData || []) as Profile[];

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateUmkm(id, formData);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/umkm"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Data UMKM
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Kelola UMKM
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Kelola informasi, produk, galeri, dan akun pemilik usaha &quot;{umkm.nama_usaha}&quot;
        </p>
      </div>

      {/* Tabs */}
      <AdminEditUmkmTabs
        umkm={umkm}
        products={(products || []) as UmkmProduct[]}
        gallery={(gallery || []) as UmkmGallery[]}
        ownerProfile={ownerProfile}
        allProfiles={allProfiles}
        action={handleUpdate}
      />
    </div>
  );
}


