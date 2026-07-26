import { createClient } from "@/lib/supabase/server";
import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import type { Umkm } from "@/lib/types";
import Link from "next/link";
import AdminCharts, {
  ViewTrafficStat,
  DistributionStat,
  GrowthStat,
} from "@/components/admin/AdminCharts";
import { Building2, CheckCircle2, Clock, Users, Eye, ArrowUpRight, ShieldCheck, Tag, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch all UMKM
  const { data: allUmkm } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  const umkmList = (allUmkm || []) as Umkm[];
  const approvedList = umkmList.filter((u) => u.status === "approved");
  const pendingCount = umkmList.filter((u) => u.status === "pending").length;
  const approvedCount = approvedList.length;

  // 2. Fetch seller profile count
  const { count: sellerCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "seller");

  // 3. Fetch view logs from umkm_views for traffic analytics
  const { data: viewLogs } = await supabase
    .from("umkm_views")
    .select("created_at, umkm_id")
    .order("created_at", { ascending: true });

  const logs = viewLogs || [];
  const totalViewsSum = umkmList.reduce((acc, u) => acc + (u.views_count || 0), 0);
  const totalViews = Math.max(logs.length, totalViewsSum);

  // Time boundaries
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const todayViews = logs.filter((l) => new Date(l.created_at).getTime() >= todayStart).length;
  const weeklyViews = logs.filter((l) => new Date(l.created_at).getTime() >= sevenDaysAgo).length;

  // 4. Generate Daily Views Trend Data (Last 14 Days)
  const dailyViewsData: ViewTrafficStat[] = [];
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

  // 5. Generate Monthly Views Trend Data (Last 6 Months)
  const monthlyViewsData: ViewTrafficStat[] = [];
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

  // 6. Category & Dusun Distribution Data
  const kategoriData: DistributionStat[] = KATEGORI_USAHA.map((k) => ({
    name: k,
    count: approvedList.filter((u) => u.kategori_usaha === k).length,
  })).filter((k) => k.count > 0);

  const dusunData: DistributionStat[] = DAFTAR_DUSUN.map((d) => ({
    name: `Dusun ${d}`,
    count: approvedList.filter((u) => u.dusun === d).length,
  }));

  // 7. Registration Growth Data per Month
  const growthMap: Record<string, number> = {};
  umkmList.forEach((u) => {
    const d = new Date(u.created_at);
    const key = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    growthMap[key] = (growthMap[key] || 0) + 1;
  });

  const growthData: GrowthStat[] = Object.keys(growthMap).map((key) => ({
    label: key,
    umkmCount: growthMap[key],
  }));

  // 8. Top 5 Visited UMKM
  const topVisitedUmkm = [...approvedList]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  // 9. Latest 5 Registered UMKM
  const latestUmkmList = umkmList.slice(0, 5);

  const stats = [
    {
      label: "Total UMKM",
      value: umkmList.length,
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50 text-emerald-900 border-emerald-100",
    },
    {
      label: "UMKM Disetujui",
      value: approvedCount,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      color: "bg-emerald-50 text-emerald-900 border-emerald-100",
    },
    {
      label: "Menunggu Approval",
      value: pendingCount,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50 text-amber-900 border-amber-200",
      href: "/admin/approval",
    },
    {
      label: "Pelaku UMKM",
      value: sellerCount || 0,
      icon: <Users className="w-5 h-5 text-sky-600" />,
      color: "bg-sky-50 text-sky-900 border-sky-100",
    },
    {
      label: "Total Penayangan (Views)",
      value: totalViews,
      icon: <Eye className="w-5 h-5 text-rose-600" />,
      color: "bg-rose-50 text-rose-900 border-rose-100",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
          Dashboard Analitik Admin
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Pusat pemantauan trafik penayangan, statistik sebaran, dan persetujuan UMKM Desa Sugihan
        </p>
      </div>

      {/* Pending Approval Warning Alert */}
      {pendingCount > 0 && (
        <Link
          href="/admin/approval"
          className="block p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 hover:bg-amber-500/15 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
                ⏳
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm sm:text-base">
                  {pendingCount} Pengajuan UMKM Menunggu Verifikasi
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Klik di sini untuk mereview detail pengajuan pelaku usaha baru
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-slate-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map((stat, i) => {
          const cardContent = (
            <div className={`p-4 rounded-2xl border ${stat.color} shadow-2xs transition-all hover:shadow-md h-full flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{stat.label}</span>
                <div className="p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs">
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{stat.value}</p>
            </div>
          );

          if (stat.href) {
            return (
              <Link key={i} href={stat.href} className="block group">
                {cardContent}
              </Link>
            );
          }
          return <div key={i}>{cardContent}</div>;
        })}
      </div>

      {/* Interactive Charts Section (Traffic, Kategori, Dusun, Growth) */}
      <AdminCharts
        dailyViewsData={dailyViewsData}
        monthlyViewsData={monthlyViewsData}
        kategoriData={kategoriData}
        dusunData={dusunData}
        growthData={growthData}
        totalViews={totalViews}
        todayViews={todayViews}
        weeklyViews={weeklyViews}
      />

      {/* Summary Tables Grid (Top Visited & Latest Registered) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Top 5 Visited UMKM */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Top 5 UMKM Paling Sering Dikunjungi
                </h3>
              </div>
              <Link href="/admin/umkm" className="text-xs font-bold text-emerald-700 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="pb-2.5">Usaha</th>
                    <th className="pb-2.5">Dusun</th>
                    <th className="pb-2.5 text-right">Penayangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {topVisitedUmkm.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-2">
                        <Link href={`/umkm/${u.slug}`} target="_blank" className="font-bold text-slate-900 hover:text-emerald-700 line-clamp-1">
                          #{idx + 1} {u.nama_usaha}
                        </Link>
                        <span className="text-[11px] text-slate-500 block">{u.nama_pemilik}</span>
                      </td>
                      <td className="py-3 text-slate-600 font-medium whitespace-nowrap">
                        Dusun {u.dusun}
                      </td>
                      <td className="py-3 text-right font-extrabold text-amber-600 whitespace-nowrap">
                        👁️ {u.views_count || 0} views
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Latest Registered UMKM */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Pendaftaran UMKM Terkini
                </h3>
              </div>
              <Link href="/admin/umkm" className="text-xs font-bold text-emerald-700 hover:underline">
                Kelola UMKM
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="pb-2.5">Nama Usaha</th>
                    <th className="pb-2.5">Kategori</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {latestUmkmList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-2">
                        <span className="font-bold text-slate-900 block line-clamp-1">{u.nama_usaha}</span>
                        <span className="text-[11px] text-slate-500 block">{u.nama_pemilik}</span>
                      </td>
                      <td className="py-3 text-slate-600 font-medium whitespace-nowrap">
                        {u.kategori_usaha}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : u.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {u.status === "approved" ? "Disetujui" : u.status === "pending" ? "Menunggu" : "Ditolak"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

