"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Eye, TrendingUp, Calendar, BarChart3, Store } from "lucide-react";

export interface ViewTrafficStat {
  label: string; // e.g. "20 Jul"
  views: number;
}

export interface BusinessPerformanceStat {
  namaUsaha: string;
  viewsCount: number;
  productCount: number;
  galleryCount: number;
}

interface SellerChartsProps {
  dailyViewsData: ViewTrafficStat[];
  monthlyViewsData: ViewTrafficStat[];
  businessPerformanceData: BusinessPerformanceStat[];
  totalViews: number;
  todayViews: number;
  weeklyViews: number;
}

export default function SellerCharts({
  dailyViewsData,
  monthlyViewsData,
  businessPerformanceData,
  totalViews,
  todayViews,
  weeklyViews,
}: SellerChartsProps) {
  const [trafficTimeframe, setTrafficTimeframe] = useState<"daily" | "monthly">("daily");

  const trafficData = trafficTimeframe === "daily" ? dailyViewsData : monthlyViewsData;

  return (
    <div className="space-y-6">
      {/* Visitor Traffic Chart Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary font-bold text-xs mb-2 border border-primary-200">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Analitik Kunjungan Usaha Anda</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary">
              Grafik Penayangan Usaha / Visitors Trend
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Pantau tren statistik pengunjung yang melihat profil UMKM Anda di web
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-1.5 bg-border-light p-1.5 rounded-xl border border-border self-start sm:self-auto">
            <button
              onClick={() => setTrafficTimeframe("daily")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                trafficTimeframe === "daily"
                  ? "bg-surface text-primary shadow-xs font-bold border border-border"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Harian (14 Hari)</span>
            </button>

            <button
              onClick={() => setTrafficTimeframe("monthly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                trafficTimeframe === "monthly"
                  ? "bg-surface text-primary shadow-xs font-bold border border-border"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Bulanan</span>
            </button>
          </div>
        </div>

        {/* Quick Traffic Stats Pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-border-light border border-border rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-text-muted block uppercase tracking-wider">
              Hari Ini (24j)
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-primary">
              {todayViews}
            </span>
          </div>

          <div className="bg-border-light border border-border rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-text-muted block uppercase tracking-wider">
              7 Hari Terakhir
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-amber-500">
              {weeklyViews}
            </span>
          </div>

          <div className="bg-border-light border border-border rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold text-text-muted block uppercase tracking-wider">
              Total Penayangan
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-text-primary">
              {totalViews}
            </span>
          </div>
        </div>

        {/* Area Chart Container */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sellerViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
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
                fill="url(#sellerViewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Performance Comparison Bar Chart */}
      {businessPerformanceData.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs transition-colors duration-300">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Perbandingan Performa Usaha Anda
            </h3>
          </div>
          <p className="text-xs text-text-muted mb-4">
            Perbandingan penayangan (views), jumlah produk, dan foto galeri antar UMKM milik Anda
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="namaUsaha" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                <Bar dataKey="viewsCount" name="Penayangan (Views)" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="productCount" name="Produk/Jasa" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="galleryCount" name="Foto Galeri" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
