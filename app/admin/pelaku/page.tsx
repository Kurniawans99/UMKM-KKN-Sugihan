import { createClient } from "@/lib/supabase/server";
import PelakuTable, { SellerWithUmkm } from "@/components/admin/PelakuTable";
import type { Profile, Umkm } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Pelaku UMKM — Admin",
};

export default async function PelakuAdminPage() {
  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (pErr) {
    console.error("Error fetching profiles:", pErr);
  }

  // Fetch all UMKM to map user_id -> umkms
  const { data: umkms } = await supabase
    .from("umkm")
    .select("*");

  const profileList = (profiles || []) as Profile[];
  const umkmList = (umkms || []) as Umkm[];

  // Group UMKMs by user_id
  const sellersData: SellerWithUmkm[] = profileList.map((p) => {
    const userUmkms = umkmList.filter((u) => u.user_id === p.id);
    return {
      profile: p,
      umkms: userUmkms,
    };
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Data Pelaku UMKM
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Daftar seluruh akun pelaku usaha dan pengelola UMKM Desa Sugihan
        </p>
      </div>

      <PelakuTable sellers={sellersData} />
    </div>
  );
}
