import { createClient } from "@/lib/supabase/server";
import { createSellerUmkm, updateSellerUmkm, toggleUmkmActive } from "@/lib/actions";
import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import type { Umkm } from "@/lib/types";
import type { Metadata } from "next";
import SellerUmkmForm from "@/components/seller/SellerUmkmForm";
import Link from "next/link";
import { Store, Plus, Edit3, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "UMKM Saya" };

export default async function DashboardUmkmPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; action?: string }>;
}) {
  const { id, action } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all seller's UMKMs
  const { data: umkmsData } = await supabase
    .from("umkm")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const umkms = (umkmsData || []) as Umkm[];

  const isRegisteringNew = action === "new";

  // Determine target UMKM to edit
  let targetUmkm: Umkm | null = null;
  if (!isRegisteringNew) {
    if (id) {
      targetUmkm = umkms.find((u) => u.id === id) || null;
    } else if (umkms.length === 1) {
      targetUmkm = umkms[0];
    }
  }

  const showListMode = umkms.length > 1 && !id && !isRegisteringNew;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          { (id || isRegisteringNew || (umkms.length > 1 && targetUmkm)) && (
            <Link
              href="/dashboard/umkm"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-emerald-700 font-medium mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Daftar UMKM Saya</span>
            </Link>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {isRegisteringNew
              ? "Daftarkan UMKM Baru"
              : targetUmkm
              ? `Edit UMKM — ${targetUmkm.nama_usaha}`
              : "UMKM Saya"}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {isRegisteringNew
              ? "Isi data usaha baru yang ingin Anda daftarkan ke direktori"
              : targetUmkm
              ? "Perbarui informasi dan lokasi usaha Anda"
              : "Daftar seluruh UMKM yang terhubung ke akun Anda"}
          </p>
        </div>

        {!isRegisteringNew && umkms.length > 0 && (
          <Link
            href="/dashboard/umkm?action=new"
            className="btn-primary !py-2.5 !px-4 text-xs inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah UMKM Baru</span>
          </Link>
        )}
      </div>

      {showListMode ? (
        /* List of Seller UMKMs if user has > 1 and didn't select an ID */
        <div className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {umkms.map((u) => (
              <div
                key={u.id}
                className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : u.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {u.status === "approved"
                        ? "Disetujui"
                        : u.status === "pending"
                        ? "Menunggu Review"
                        : "Ditolak"}
                    </span>

                    {u.status === "approved" && (
                      <form
                        action={async () => {
                          "use server";
                          await toggleUmkmActive(u.id, !u.is_active);
                        }}
                      >
                        <button
                          type="submit"
                          className={`toggle ${u.is_active ? "active" : ""}`}
                          title={u.is_active ? "Nonaktifkan di publik" : "Aktifkan di publik"}
                        />
                      </form>
                    )}
                  </div>

                  <h3 className="font-bold text-text-primary text-base">{u.nama_usaha}</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {u.kategori_usaha} • Dusun {u.dusun}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{u.deskripsi}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center gap-2">
                  <Link
                    href={`/dashboard/umkm?id=${u.id}`}
                    className="btn-primary text-xs !py-2 !px-4 flex-1 inline-flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Data UMKM Ini</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Form Mode (Edit targetUmkm or Create new) */
        <>
          {/* Toggle Active banner (only for existing approved UMKM) */}
          {targetUmkm && targetUmkm.status === "approved" && (
            <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex items-center justify-between max-w-3xl">
              <div>
                <p className="font-semibold text-text-primary text-sm">Visibilitas Toko Publik</p>
                <p className="text-text-muted text-xs mt-0.5">
                  {targetUmkm.is_active
                    ? "UMKM ini tampil di katalog publik"
                    : "UMKM ini disembunyikan dari katalog publik"}
                </p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await toggleUmkmActive(targetUmkm!.id, !targetUmkm!.is_active);
                }}
              >
                <button type="submit" className={`toggle ${targetUmkm.is_active ? "active" : ""}`} />
              </form>
            </div>
          )}

          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7 max-w-3xl shadow-xs">
            <SellerUmkmForm
              key={targetUmkm?.id || "new-umkm"}
              umkm={targetUmkm}
              createAction={createSellerUmkm}
              updateAction={targetUmkm ? updateSellerUmkm.bind(null, targetUmkm.id) : undefined}
              kategoriList={[...KATEGORI_USAHA]}
              dusunList={[...DAFTAR_DUSUN]}
            />
          </div>
        </>
      )}
    </div>
  );
}
