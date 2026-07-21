import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Umkm } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get seller's UMKM
  const { data: umkmData } = await supabase
    .from("umkm")
    .select("*")
    .eq("user_id", user?.id)
    .maybeSingle();

  const umkm = umkmData as Umkm | null;

  // Get product count if UMKM exists
  let productCount = 0;
  let galleryCount = 0;
  if (umkm) {
    const { count: pCount } = await supabase
      .from("umkm_products")
      .select("*", { count: "exact", head: true })
      .eq("umkm_id", umkm.id);
    productCount = pCount || 0;

    const { count: gCount } = await supabase
      .from("umkm_gallery")
      .select("*", { count: "exact", head: true })
      .eq("umkm_id", umkm.id);
    galleryCount = gCount || 0;
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap")
    .eq("id", user?.id)
    .single();

  const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
    pending: { label: "Menunggu Persetujuan", class: "badge-warning", icon: "⏳" },
    approved: { label: "Disetujui", class: "badge-success", icon: "✅" },
    rejected: { label: "Ditolak", class: "badge-danger", icon: "❌" },
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Selamat Datang, {profile?.nama_lengkap || "Pengguna"}! 👋
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Kelola UMKM Anda dari dashboard ini
        </p>
      </div>

      {!umkm ? (
        /* No UMKM yet */
        <div className="bg-surface border border-border rounded-xl p-8 sm:p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Belum Ada UMKM Terdaftar</h2>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            Daftarkan UMKM Anda untuk mulai mempromosikan produk dan jasa di Direktori UMKM Desa Sugihan.
          </p>
          <Link href="/dashboard/umkm" className="btn-primary !py-3 !px-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Daftarkan UMKM Saya
          </Link>
        </div>
      ) : (
        <>
          {/* Status Banner */}
          {umkm.status === "pending" && (
            <div className="mb-6 p-4 rounded-xl bg-warning-light border border-warning/20 flex items-start gap-3 animate-fade-in">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-text-primary text-sm">UMKM Anda sedang menunggu persetujuan admin</p>
                <p className="text-text-muted text-xs mt-1">Proses review biasanya memakan waktu 1-2 hari kerja. UMKM Anda akan tampil di katalog publik setelah disetujui.</p>
              </div>
            </div>
          )}

          {umkm.status === "rejected" && (
            <div className="mb-6 p-4 rounded-xl bg-danger-light border border-danger/20 flex items-start gap-3 animate-fade-in">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-text-primary text-sm">UMKM Anda ditolak oleh admin</p>
                {umkm.rejection_reason && (
                  <p className="text-text-secondary text-sm mt-1 bg-surface p-2 rounded-lg border border-border">
                    <strong>Alasan:</strong> {umkm.rejection_reason}
                  </p>
                )}
                <p className="text-text-muted text-xs mt-2">Silakan perbaiki data Anda lalu ajukan kembali.</p>
                <form action={async () => {
                  "use server";
                  const { resubmitUmkm } = await import("@/lib/actions");
                  await resubmitUmkm(umkm.id);
                }}>
                  <button type="submit" className="btn-primary text-sm !py-2 !px-4 mt-3">
                    Ajukan Ulang
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card animate-fade-in-up opacity-0" style={{ animationDelay: "0ms" }}>
              <p className="text-text-muted text-xs font-medium mb-1">Status</p>
              <span className={`badge ${statusConfig[umkm.status]?.class || "badge-primary"}`}>
                {statusConfig[umkm.status]?.icon} {statusConfig[umkm.status]?.label}
              </span>
            </div>
            <div className="stat-card animate-fade-in-up opacity-0" style={{ animationDelay: "100ms" }}>
              <p className="text-text-muted text-xs font-medium mb-1">Produk</p>
              <p className="text-2xl font-bold text-text-primary">{productCount}</p>
            </div>
            <div className="stat-card animate-fade-in-up opacity-0" style={{ animationDelay: "200ms" }}>
              <p className="text-text-muted text-xs font-medium mb-1">Foto Galeri</p>
              <p className="text-2xl font-bold text-text-primary">{galleryCount}</p>
            </div>
            <div className="stat-card animate-fade-in-up opacity-0" style={{ animationDelay: "300ms" }}>
              <p className="text-text-muted text-xs font-medium mb-1">Visibilitas</p>
              <span className={`badge ${umkm.is_active ? "badge-success" : "badge-danger"}`}>
                {umkm.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/dashboard/umkm" className="bg-surface border border-border rounded-xl p-5 card-hover group">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">Edit Data UMKM</h3>
              <p className="text-text-muted text-xs mt-1">Ubah info, foto, dan banner</p>
            </Link>

            <Link href="/dashboard/produk" className="bg-surface border border-border rounded-xl p-5 card-hover group">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">Kelola Produk</h3>
              <p className="text-text-muted text-xs mt-1">{productCount} produk terdaftar</p>
            </Link>

            <Link href="/dashboard/galeri" className="bg-surface border border-border rounded-xl p-5 card-hover group">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary text-sm">Kelola Galeri</h3>
              <p className="text-text-muted text-xs mt-1">{galleryCount} foto</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
