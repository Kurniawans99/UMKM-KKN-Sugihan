"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { Flame, Calendar, TrendingUp, MapPin, User, ArrowUpRight, Eye, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Timeframe = "daily" | "weekly" | "monthly";

interface PopularUmkm extends Umkm {
  view_count: number;
  is_real: boolean;
}

export default function PopularSection({ initialUmkmList = [] }: { initialUmkmList?: Umkm[] }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [popularList, setPopularList] = useState<PopularUmkm[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPopular = useCallback(async (tf: Timeframe) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/umkm/popular?timeframe=${tf}`);
      if (res.ok) {
        const data = await res.json();
        if (data.popular && data.popular.length > 0) {
          setPopularList(data.popular);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error loading popular UMKM:", err);
    }

    // Fallback using initial list if API fails
    const fallback = initialUmkmList.slice(0, 6).map((u) => {
      return {
        ...u,
        view_count: typeof u.views_count === "number" ? u.views_count : 0,
        is_real: true,
      };
    });
    fallback.sort((a, b) => b.view_count - a.view_count);
    setPopularList(fallback);
    setLoading(false);
  }, [initialUmkmList]);

  useEffect(() => {
    fetchPopular(timeframe);
  }, [timeframe, fetchPopular]);

  return (
    <section className="mb-14">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-900 font-bold text-xs mb-2.5 border border-rose-200 shadow-2xs">
            <Flame className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Statistik Penayangan Real-Time</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            UMKM Terpopuler
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar usaha lokal yang paling sering dikunjungi oleh masyarakat & pembeli
          </p>
        </div>

        {/* Timeframe Tab Controls - Horizontally scrollable on small screens */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 max-w-full overflow-x-auto no-scrollbar shrink-0 self-start md:self-auto">
          <button
            onClick={() => setTimeframe("daily")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "daily"
                ? "bg-white text-rose-600 shadow-xs border border-rose-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${timeframe === "daily" ? "text-rose-600" : "text-slate-400"}`} />
            <span>Harian (24j)</span>
          </button>

          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "weekly"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 ${timeframe === "weekly" ? "text-emerald-600" : "text-slate-400"}`} />
            <span>Mingguan</span>
          </button>

          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "monthly"
                ? "bg-white text-amber-700 shadow-xs border border-amber-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${timeframe === "monthly" ? "text-amber-600" : "text-slate-400"}`} />
            <span>Bulanan</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularList.map((umkm, idx) => (
            <ScrollReveal key={`popular-${timeframe}-${umkm.id}`} delay={idx * 80}>
              <Link
                href={`/umkm/${umkm.slug}`}
                className="group relative block bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-full"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={umkm.foto_url}
                      alt={umkm.nama_usaha}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-extrabold text-xs shadow-md backdrop-blur-md border ${
                          idx === 0
                            ? "bg-amber-400 text-slate-950 border-amber-300"
                            : idx === 1
                            ? "bg-slate-200 text-slate-900 border-white/40"
                            : idx === 2
                            ? "bg-amber-700 text-white border-amber-500/50"
                            : "bg-slate-900/80 text-white border-white/20"
                        }`}
                      >
                        {idx === 0 ? <Sparkles className="w-3.5 h-3.5 text-slate-950" /> : null}
                        #{idx + 1} Terpopuler
                      </span>
                    </div>

                    {/* Views Count Pill (Visible only if views >= 1) */}
                    {umkm.view_count >= 1 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 text-amber-300 font-bold text-xs backdrop-blur-md border border-amber-400/30 shadow-md">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>{umkm.view_count} views</span>
                        </span>
                      </div>
                    )}

                    {/* Category Overlay */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20">
                        {umkm.kategori_usaha}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors font-[var(--font-montserrat)] line-clamp-1">
                      {umkm.nama_usaha}
                    </h3>

                    <p className="text-slate-500 text-xs font-medium mb-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{umkm.nama_pemilik}</span>
                    </p>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {umkm.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 border border-emerald-100/80 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dusun {umkm.dusun}</span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 text-slate-600">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
