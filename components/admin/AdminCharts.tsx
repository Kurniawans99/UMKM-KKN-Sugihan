"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Eye, TrendingUp, Calendar, Tag, MapPin, Layers } from "lucide-react";

export interface ViewTrafficStat {
  label: string; // e.g. "20 Jul" or "Mei 26"
  views: number;
}

export interface DistributionStat {
  name: string;
  count: number;
}

export interface GrowthStat {
  label: string;
  umkmCount: number;
}

interface AdminChartsProps {
  dailyViewsData: ViewTrafficStat[];
  monthlyViewsData: ViewTrafficStat[];
  kategoriData: DistributionStat[];
  dusunData: DistributionStat[];
  growthData: GrowthStat[];
  totalViews: number;
  todayViews: number;
  weeklyViews: number;
}

const COLORS = [
  "#059669", // Emerald
  "#0284c7", // Sky blue
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#e11d48", // Rose
  "#0d9488", // Teal
  "#ca8a04", // Yellow
  "#4f46e5", // Indigo
  "#ea580c", // Orange
  "#64748b", // Slate
];

export default function AdminCharts({
  dailyViewsData,
  monthlyViewsData,
  kategoriData,
  dusunData,
  growthData,
  totalViews,
  todayViews,
  weeklyViews,
}: AdminChartsProps) {
  const [trafficTimeframe, setTrafficTimeframe] = useState<"daily" | "monthly">("daily");

  const trafficData = trafficTimeframe === "daily" ? dailyViewsData : monthlyViewsData;

  return (
    <div className="space-y-6">
      {/* Visitor Traffic Chart Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs mb-2 border border-emerald-200/60">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Analitik Trafik Pengunjung Real-Time</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Grafik Penayangan / Visitors Trend
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pantau frekuensi kunjungan masyarakat ke katalog UMKM Desa Sugihan
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setTrafficTimeframe("daily")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                trafficTimeframe === "daily"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Harian (14 Hari)</span>
            </button>

            <button
              onClick={() => setTrafficTimeframe("monthly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                trafficTimeframe === "monthly"
                  ? "bg-white text-emerald-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bulanan</span>
            </button>
          </div>
        </div>

        {/* Quick Traffic Stats Pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Hari Ini (24j)
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-emerald-700">
              {todayViews}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              7 Hari Terakhir
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-amber-600">
              {weeklyViews}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Total Akumulasi
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {totalViews}
            </span>
          </div>
        </div>

        {/* Area Chart Container */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "#34d399" }}
              />
              <Area
                type="monotone"
                dataKey="views"
                name="Penayangan"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Distribution & Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kategori Usaha Pie / Donut Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Visual Distribusi Kategori Usaha
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Proporsi jumlah UMKM berdasarkan kategori bisnis
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {kategoriData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kategoriData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {kategoriData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 font-medium">Belum ada data kategori</div>
            )}
          </div>
        </div>

        {/* Dusun Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Sebaran UMKM Per Dusun
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Jumlah UMKM aktif yang tersebar di 5 dusun Desa Sugihan
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dusunData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Jumlah UMKM" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Growth Trend */}
      {growthData.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Pertumbuhan Pendaftaran UMKM
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Tren penambahan data UMKM baru per bulan
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="umkmCount" name="UMKM Baru" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
