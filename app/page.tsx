import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import FilterBar from "@/components/public/FilterBar";
import UmkmCard from "@/components/public/UmkmCard";
import Footer from "@/components/public/Footer";
import type { Umkm } from "@/lib/types";

async function getUmkmList(searchParams: {
  q?: string;
  kategori?: string;
  dusun?: string;
}): Promise<Umkm[]> {
  const supabase = await createClient();

  let query = supabase
    .from("umkm")
    .select("*")
    .eq("status", "approved")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (searchParams.kategori) {
    query = query.eq("kategori_usaha", searchParams.kategori);
  }

  if (searchParams.dusun) {
    query = query.eq("dusun", searchParams.dusun);
  }

  if (searchParams.q) {
    query = query.or(
      `nama_usaha.ilike.%${searchParams.q}%,nama_pemilik.ilike.%${searchParams.q}%,deskripsi.ilike.%${searchParams.q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching UMKM:", error);
    return [];
  }

  return data as Umkm[];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; dusun?: string }>;
}) {
  const params = await searchParams;
  const umkmList = await getUmkmList(params);

  const hasFilters = params.q || params.kategori || params.dusun;

  return (
    <>
      <Navbar />
      <HeroSection />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Katalog UMKM
              </h2>
              <p className="text-text-muted text-sm mt-1">
                {hasFilters
                  ? `${umkmList.length} hasil ditemukan`
                  : `Menampilkan ${umkmList.length} UMKM aktif`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Suspense fallback={<div className="skeleton h-16 mb-6" />}>
            <div className="mb-8">
              <FilterBar />
            </div>
          </Suspense>

          {/* Grid */}
          {umkmList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {umkmList.map((umkm, index) => (
                <div
                  key={umkm.id}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <UmkmCard umkm={umkm} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-border-light flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-text-muted"
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
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {hasFilters
                  ? "Tidak ada UMKM ditemukan"
                  : "Belum ada UMKM terdaftar"}
              </h3>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                {hasFilters
                  ? "Coba ubah kata kunci pencarian atau filter yang digunakan."
                  : "Data UMKM akan segera ditambahkan oleh admin desa."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
