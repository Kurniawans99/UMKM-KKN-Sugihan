import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Umkm, UmkmProduct, UmkmGallery } from "@/lib/types";
import { toggleUmkmActive, resubmitUmkm } from "@/lib/actions";
import { Store, Plus, Package, Image as ImageIcon, Edit3, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import SellerExportButton from "@/components/seller/SellerExportButton";
import SellerCharts from "@/components/seller/SellerCharts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all seller's UMKMs
  const { data: umkmsData } = await supabase
    .from("umkm")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const umkms = (umkmsData || []) as Umkm[];
  const umkmIds = umkms.map((u) => u.id);

  // Fetch products and gallery for exporting
  const [{ data: productsData }, { data: galleryData }, { data: sellerViewsData }] = await Promise.all([
    umkmIds.length > 0 ? supabase.from("umkm_products").select("*").in("umkm_id", umkmIds) : Promise.resolve({ data: [] }),
    umkmIds.length > 0 ? supabase.from("umkm_gallery").select("*").in("umkm_id", umkmIds) : Promise.resolve({ data: [] }),
    umkmIds.length > 0 ? supabase.from("umkm_views").select("created_at, umkm_id").in("umkm_id", umkmIds).order("created_at", { ascending: true }) : Promise.resolve({ data: [] }),
  ]);

  // Fetch counts for all UMKMs
  const umkmsWithStats = await Promise.all(
    umkms.map(async (u) => {
      const [{ count: pCount }, { count: gCount }] = await Promise.all([
        supabase.from("umkm_products").select("*", { count: "exact", head: true }).eq("umkm_id", u.id),
        supabase.from("umkm_gallery").select("*", { count: "exact", head: true }).eq("umkm_id", u.id),
      ]);
      return {
        ...u,
        productCount: pCount || 0,
        galleryCount: gCount || 0,
      };
    })
  );

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap")
    .eq("id", user?.id)
    .single();

  const totalProducts = umkmsWithStats.reduce((sum, u) => sum + u.productCount, 0);
  const totalGallery = umkmsWithStats.reduce((sum, u) => sum + u.galleryCount, 0);
  const approvedCount = umkms.filter((u) => u.status === "approved").length;

  // View analytics calculation
  const logs = sellerViewsData || [];
  const totalViewsSum = umkms.reduce((sum, u) => sum + (u.views_count || 0), 0);
  const totalViews = Math.max(logs.length, totalViewsSum);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const todayViews = logs.filter((l) => new Date(l.created_at).getTime() >= todayStart).length;
  const weeklyViews = logs.filter((l) => new Date(l.created_at).getTime() >= sevenDaysAgo).length;

  // Daily views data (last 14 days)
  const dailyViewsData = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = logs.filter((l) => {
      const t = new Date(l.created_at).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;

    const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    dailyViewsData.push({ label, views: count });
  }

  // Monthly views data (last 6 months)
  const monthlyViewsData = [];
  for (let i = 5; i >= 0; i--) {
    const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = mDate.getTime();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1).getTime();

    const count = logs.filter((l) => {
      const t = new Date(l.created_at).getTime();
      return t >= monthStart && t < nextMonth;
    }).length;

    const label = mDate.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    monthlyViewsData.push({ label, views: count });
  }

  // Business performance comparison data
  const businessPerformanceData = umkmsWithStats.map((u) => ({
    namaUsaha: u.nama_usaha,
    viewsCount: u.views_count || 0,
    productCount: u.productCount,
    galleryCount: u.galleryCount,
  }));

  const statusConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
    pending: { label: "Menunggu Persetujuan", class: "bg-amber-100 text-amber-800 border-amber-200", icon: <Clock className="w-3.5 h-3.5" /> },
    approved: { label: "Disetujui", class: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    rejected: { label: "Ditolak", class: "bg-rose-100 text-rose-800 border-rose-200", icon: <XCircle className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Selamat Datang, {profile?.nama_lengkap || "Pengguna"}! 👋
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Kelola usaha, pantau statistik penayangan, dan promosi produk UMKM Anda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {umkms.length > 0 && (
            <SellerExportButton
              profile={{ id: user?.id || "", nama_lengkap: profile?.nama_lengkap || "Seller", no_whatsapp: null, role: "seller", created_at: "" }}
              umkms={umkms}
              products={(productsData || []) as UmkmProduct[]}
              gallery={(galleryData || []) as UmkmGallery[]}
            />
          )}
          <Link
            href="/dashboard/umkm?action=new"
            className="btn-primary !py-2.5 !px-5 text-sm self-start sm:self-auto inline-flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan UMKM Baru</span>
          </Link>
        </div>
      </div>

      {umkms.length === 0 ? (
        /* Empty State */
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-xs animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Store className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Belum Ada UMKM Terdaftar</h2>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            Daftarkan usaha UMKM Anda untuk mulai mempromosikan produk dan jasa di Katalog Digital Desa Sugihan.
          </p>
          <Link href="/dashboard/umkm?action=new" className="btn-primary !py-3 !px-6 text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Daftarkan UMKM Saya</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Global Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            <div className="stat-card">
              <p className="text-text-muted text-xs font-medium mb-1">Total Usaha Milik Anda</p>
              <p className="text-2xl font-bold text-text-primary">{umkms.length} Usaha</p>
            </div>
            <div className="stat-card">
              <p className="text-text-muted text-xs font-medium mb-1">Status Disetujui</p>
              <p className="text-2xl font-bold text-emerald-700">{approvedCount} Aktif</p>
            </div>
            <div className="stat-card">
              <p className="text-text-muted text-xs font-medium mb-1">Total Penayangan (Views)</p>
              <p className="text-2xl font-bold text-rose-700">👁️ {totalViews}</p>
            </div>
            <div className="stat-card">
              <p className="text-text-muted text-xs font-medium mb-1">Total Produk / Jasa</p>
              <p className="text-2xl font-bold text-sky-700">{totalProducts}</p>
            </div>
            <div className="stat-card">
              <p className="text-text-muted text-xs font-medium mb-1">Total Foto Galeri</p>
              <p className="text-2xl font-bold text-purple-700">{totalGallery}</p>
            </div>
          </div>

          {/* Seller Analytics & Charts Component */}
          <SellerCharts
            dailyViewsData={dailyViewsData}
            monthlyViewsData={monthlyViewsData}
            businessPerformanceData={businessPerformanceData}
            totalViews={totalViews}
            todayViews={todayViews}
            weeklyViews={weeklyViews}
          />

          {/* UMKM List Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                Daftar UMKM Saya ({umkms.length})
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {umkmsWithStats.map((item) => {
                const conf = statusConfig[item.status] || statusConfig.pending;

                return (
                  <div key={item.id} className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-200 transition-all">
                    <div>
                      {/* Top Bar: Status & Active Toggle */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.class}`}>
                          {conf.icon}
                          {conf.label}
                        </span>

                        {item.status === "approved" && (
                          <form action={async () => {
                            "use server";
                            await toggleUmkmActive(item.id, !item.is_active);
                          }} className="flex items-center gap-2">
                            <span className="text-xs text-text-muted font-medium">Tampil:</span>
                            <button
                              type="submit"
                              className={`toggle ${item.is_active ? "active" : ""}`}
                              title={item.is_active ? "Sembunyikan dari katalog publik" : "Tampilkan di katalog publik"}
                            />
                          </form>
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.foto_url || "/logo-kab-semarang.png"}
                            alt={item.nama_usaha}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-text-primary text-base truncate">
                            {item.nama_usaha}
                          </h3>
                          <p className="text-xs text-text-muted mt-0.5 truncate">
                            {item.kategori_usaha} • Dusun {item.dusun}
                          </p>
                          {item.tagline && (
                            <p className="text-xs italic text-emerald-800 mt-1 line-clamp-1">
                              &quot;{item.tagline}&quot;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rejection Message if Rejected */}
                      {item.status === "rejected" && (
                        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                          <p className="font-semibold">Alasan Penolakan:</p>
                          <p>{item.rejection_reason || "Data tidak sesuai ketentuan."}</p>
                          <form action={async () => {
                            "use server";
                            await resubmitUmkm(item.id);
                          }}>
                            <button type="submit" className="btn-primary text-xs !py-1.5 !px-3 mt-1">
                              Ajukan Ulang
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Stats Pills */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border text-center text-xs">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-text-muted block">Produk/Jasa</span>
                          <span className="font-bold text-text-primary text-sm">{item.productCount}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-text-muted block">Foto Galeri</span>
                          <span className="font-bold text-text-primary text-sm">{item.galleryCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-border">
                      <Link
                        href={`/dashboard/umkm?id=${item.id}`}
                        className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Info</span>
                      </Link>

                      <Link
                        href={`/dashboard/produk?umkm_id=${item.id}`}
                        className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Produk</span>
                      </Link>

                      <Link
                        href={`/dashboard/galeri?umkm_id=${item.id}`}
                        className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        <span>Galeri</span>
                      </Link>

                      <Link
                        href={`/umkm/${item.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-medium transition-colors shrink-0"
                        title="Lihat Halaman Publik"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
