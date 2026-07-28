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

async function getHeroStats(): Promise<HeroStats> {
  try {
    const supabase = await createClient();
    const { data: allApproved, error } = await supabase
      .from("umkm")
      .select("dusun, kategori_usaha, no_whatsapp")
      .eq("status", "approved")
      .eq("is_active", true);

    if (error || !allApproved) {
      console.error("Error fetching hero stats:", error?.message || error?.details || error);
      return {
        totalUmkm: 0,
        totalDusun: 5,
        totalKategori: 10,
        totalWhatsApp: 0,
      };
    }

    const totalUmkm = allApproved.length;
    const uniqueDusun = new Set(allApproved.map((u) => u.dusun).filter(Boolean)).size;
    const uniqueKategori = new Set(allApproved.map((u) => u.kategori_usaha).filter(Boolean)).size;
    const totalWhatsApp = allApproved.filter((u) => Boolean(u.no_whatsapp && u.no_whatsapp.trim())).length;

    return {
      totalUmkm,
      totalDusun: uniqueDusun || 5,
      totalKategori: uniqueKategori || 10,
      totalWhatsApp,
    };
  } catch (err) {
    console.error("Unexpected error fetching hero stats:", err);
    return {
      totalUmkm: 0,
      totalDusun: 5,
      totalKategori: 10,
      totalWhatsApp: 0,
    };
  }
}

async function getFeaturedUmkmList(): Promise<Umkm[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm")
      .select("*")
      .eq("status", "approved")
      .eq("is_active", true)
      .order("views_count", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching featured UMKM:", error.message || error.details || JSON.stringify(error));
      return [];
    }

    return (data as Umkm[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching featured UMKM:", err);
    return [];
  }
}

async function getUmkmList(searchParams: {
  q?: string;
  kategori?: string;
  dusun?: string;
}): Promise<Umkm[]> {
  try {
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
      console.error("Error fetching UMKM:", error.message || error.details || JSON.stringify(error));
      return [];
    }

    return (data as Umkm[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching UMKM list:", err);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; dusun?: string }>;
}) {
  const params = await searchParams;
  const [heroStats, featuredList, umkmList] = await Promise.all([
    getHeroStats(),
    getFeaturedUmkmList(),
    getUmkmList(params),
  ]);

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
