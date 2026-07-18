import { createClient } from "@/lib/supabase/server";
import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import type { Umkm } from "@/lib/types";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: allUmkm } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  const umkmList = (allUmkm || []) as Umkm[];
  const activeCount = umkmList.filter((u) => u.is_active).length;
  const inactiveCount = umkmList.length - activeCount;

  // Count by kategori
  const kategoriCounts = KATEGORI_USAHA.map((k) => ({
    name: k,
    count: umkmList.filter((u) => u.kategori_usaha === k).length,
  })).filter((k) => k.count > 0);

  // Count by dusun
  const dusunCounts = DAFTAR_DUSUN.map((d) => ({
    name: d,
    count: umkmList.filter((u) => u.dusun === d).length,
  }));

  const stats = [
    {
      label: "Total UMKM",
      value: umkmList.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "text-primary bg-primary-50",
    },
    {
      label: "UMKM Aktif",
      value: activeCount,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-success bg-success-light",
    },
    {
      label: "UMKM Nonaktif",
      value: inactiveCount,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-warning bg-warning-light",
    },
    {
      label: "Kategori Aktif",
      value: kategoriCounts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: "text-accent bg-accent/10",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Ringkasan data UMKM Desa Sugihan
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-text-muted text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per Kategori */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Per Kategori Usaha
          </h3>
          <div className="space-y-3">
            {KATEGORI_USAHA.map((k) => {
              const count = umkmList.filter((u) => u.kategori_usaha === k).length;
              const pct = umkmList.length > 0 ? (count / umkmList.length) * 100 : 0;
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-24 shrink-0">{k}</span>
                  <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-text-primary w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per Dusun */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Per Dusun
          </h3>
          <div className="space-y-3">
            {dusunCounts.map((d) => {
              const pct = umkmList.length > 0 ? (d.count / umkmList.length) * 100 : 0;
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-24 shrink-0">{d.name}</span>
                  <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary-light rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-text-primary w-8 text-right">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
