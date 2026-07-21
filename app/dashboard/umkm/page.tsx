import { createClient } from "@/lib/supabase/server";
import { createSellerUmkm, updateSellerUmkm, toggleUmkmActive } from "@/lib/actions";
import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import type { Umkm } from "@/lib/types";
import type { Metadata } from "next";
import SellerUmkmForm from "@/components/seller/SellerUmkmForm";

export const metadata: Metadata = { title: "UMKM Saya" };

export default async function DashboardUmkmPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: umkmData } = await supabase
    .from("umkm")
    .select("*")
    .eq("user_id", user?.id)
    .maybeSingle();

  const umkm = umkmData as Umkm | null;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          {umkm ? "Edit UMKM Saya" : "Daftarkan UMKM Baru"}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {umkm ? "Perbarui informasi UMKM Anda" : "Isi data UMKM untuk didaftarkan ke direktori"}
        </p>
      </div>

      {/* Toggle Active (only for existing approved UMKM) */}
      {umkm && umkm.status === "approved" && (
        <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-text-primary text-sm">Visibilitas Toko</p>
            <p className="text-text-muted text-xs mt-0.5">
              {umkm.is_active ? "UMKM Anda tampil di katalog publik" : "UMKM Anda disembunyikan dari katalog publik"}
            </p>
          </div>
          <form action={async () => {
            "use server";
            await toggleUmkmActive(umkm.id, !umkm.is_active);
          }}>
            <button type="submit" className={`toggle ${umkm.is_active ? "active" : ""}`} />
          </form>
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 max-w-3xl">
        <SellerUmkmForm
          umkm={umkm}
          createAction={createSellerUmkm}
          updateAction={umkm ? updateSellerUmkm.bind(null, umkm.id) : undefined}
          kategoriList={[...KATEGORI_USAHA]}
          dusunList={[...DAFTAR_DUSUN]}
        />
      </div>
    </div>
  );
}
