import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { Award, Sparkles, MapPin, User, ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function FeaturedSection({ umkmList }: { umkmList: Umkm[] }) {
  // Take top 3 UMKM to feature
  const featured = umkmList.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2.5 border border-amber-300/80 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>UMKM Unggulan Desa Sugihan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            Produk & Usaha Pilihan
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Kurasi Spesial Desa Sugihan</span>
        </div>
      </div>

      {/* Featured Editorial Poster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {featured.map((umkm, idx) => (
          <ScrollReveal key={umkm.id} delay={idx * 120}>
            <Link
              href={`/umkm/${umkm.slug}`}
              className="group relative block aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-slate-200/60 bg-slate-950"
            >
              {/* Full Bleed Background Image */}
              <Image
                src={umkm.foto_url}
                alt={umkm.nama_usaha}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
              />

              {/* Gradient Vignette Overlay for Crisp Typography Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 group-hover:from-slate-950/90 transition-all duration-300" />

              {/* Top Glassmorphic Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/75 text-amber-300 font-extrabold text-xs backdrop-blur-md border border-amber-400/30 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  #{idx + 1} Unggulan
                </span>

                <span className="px-3 py-1.5 rounded-full bg-white/15 text-white font-semibold text-xs backdrop-blur-md border border-white/20">
                  {umkm.kategori_usaha}
                </span>
              </div>

              {/* Editorial Card Content Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
                {/* Location & Owner Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5 text-xs font-medium text-amber-200/90">
                  <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Dusun {umkm.dusun}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 text-slate-200">
                    <User className="w-3 h-3 text-slate-300" />
                    {umkm.nama_pemilik}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-white text-xl sm:text-2xl leading-snug mb-2 group-hover:text-amber-300 transition-colors font-[var(--font-montserrat)] drop-shadow-md">
                  {umkm.nama_usaha}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 font-normal opacity-90">
                  {umkm.deskripsi}
                </p>

                {/* Editorial CTA Bar */}
                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  <span>Lihat Detail Profil</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
