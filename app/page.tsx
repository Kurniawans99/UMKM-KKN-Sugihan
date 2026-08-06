import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/public/Navbar";
import HeroSection, { HeroStats } from "@/components/public/HeroSection";
import FeaturedSection from "@/components/public/FeaturedSection";
import PopularSection from "@/components/public/PopularSection";
import CatalogContainer from "@/components/public/CatalogContainer";
import Footer from "@/components/public/Footer";
import UmkmMapWrapper from "@/components/public/UmkmMapWrapper";
import type { Umkm } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; dusun?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch all active approved UMKMs once
  let query = supabase
    .from("umkm")
    .select("*")
    .eq("status", "approved")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (params.kategori) {
    query = query.eq("kategori_usaha", params.kategori);
  }

  if (params.dusun) {
    query = query.eq("dusun", params.dusun);
  }

  if (params.q) {
    query = query.or(
      `nama_usaha.ilike.%${params.q}%,nama_pemilik.ilike.%${params.q}%,deskripsi.ilike.%${params.q}%`
    );
  }

  const { data } = await query;
  const umkmList = (data as Umkm[]) || [];

  // Compute Hero Stats in memory from umkmList
  const uniqueDusun = new Set(umkmList.map((u) => u.dusun).filter(Boolean)).size;
  const uniqueKategori = new Set(umkmList.map((u) => u.kategori_usaha).filter(Boolean)).size;
  const totalWhatsApp = umkmList.filter((u) => Boolean(u.no_whatsapp && u.no_whatsapp.trim())).length;

  const heroStats: HeroStats = {
    totalUmkm: umkmList.length,
    totalDusun: uniqueDusun || 5,
    totalKategori: uniqueKategori || 10,
    totalWhatsApp,
  };

  // Compute Featured List in memory (Top 5 by views_count)
  const featuredList = [...umkmList]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  const hasFilters = Boolean(params.q || params.kategori || params.dusun);

  return (
    <>
      <Navbar />
      <HeroSection stats={heroStats} />

      <main className="flex-1 bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Top Featured Section */}
          {featuredList.length > 0 && (
            <FeaturedSection umkmList={featuredList} />
          )}

          {/* Top UMKM Populer (Harian, Mingguan, Bulanan) */}
          <PopularSection initialUmkmList={umkmList} />

          {/* Peta UMKM Section */}
          <UmkmMapWrapper umkmList={umkmList} />

          {/* Dynamic Catalog Container (Category Chips, Search, Grid vs List View) */}
          <CatalogContainer umkmList={umkmList} hasFilters={hasFilters} />
        </div>
      </main>

      <Footer />
    </>
  );
}
