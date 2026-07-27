"use client";

import { useState } from "react";
import type { Umkm } from "@/lib/types";
import FilterBar from "./FilterBar";
import UmkmCard from "./UmkmCard";
import CatalogCard from "./CatalogCard";
import HorizontalUmkmCard from "./HorizontalUmkmCard";
import ScrollReveal from "./ScrollReveal";

export default function CatalogContainer({
  umkmList,
  hasFilters,
}: {
  umkmList: Umkm[];
  hasFilters: boolean;
}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-8">
      {/* Filter Bar with Category Pills, Search, Dusun & View Toggle */}
      <FilterBar
        umkmList={umkmList}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-[var(--font-montserrat)]">
            Semua Hasil Katalog
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {hasFilters
              ? `Ditemukan ${umkmList.length} UMKM sesuai kriteria filter.`
              : `Menampilkan total ${umkmList.length} usaha terdaftar di Desa Sugihan.`}
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          Tampilan: {viewMode === "grid" ? "📱 Grid Card" : "📄 List Baris"}
        </div>
      </div>

      {/* UMKM Display List / Grid */}
      {umkmList.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkmList.map((umkm, index) => (
              <ScrollReveal
                key={`grid-${umkm.id}-${index}`}
                delay={(index % 6) * 50}
              >
                <CatalogCard umkm={umkm} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {umkmList.map((umkm, index) => (
              <ScrollReveal
                key={`list-${umkm.id}-${index}`}
                delay={(index % 6) * 50}
              >
                <HorizontalUmkmCard umkm={umkm} />
              </ScrollReveal>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-slate-200 shadow-xs p-8 animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {hasFilters
              ? "Tidak ada UMKM yang cocok dengan filter"
              : "Belum ada UMKM terdaftar"}
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            {hasFilters
              ? "Coba sesuaikan kata kunci pencarian, pilihan dusun, atau reset filter kategori."
              : "Data UMKM akan segera ditambahkan oleh administrator desa."}
          </p>
        </div>
      )}
    </div>
  );
}
