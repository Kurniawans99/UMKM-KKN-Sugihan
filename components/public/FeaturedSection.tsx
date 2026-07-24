import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { Award, Sparkles, MapPin, User, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function FeaturedSection({ umkmList }: { umkmList: Umkm[] }) {
  // Take top 3 UMKM to feature
  const featured = umkmList.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2 border border-amber-300 shadow-xs">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>UMKM Unggulan Desa Sugihan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            Produk & Usaha Pilihan
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Dikurasi oleh Pemerintah & KKN Desa Sugihan</span>
        </div>
      </div>

      {/* Featured Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((umkm, idx) => (
          <ScrollReveal key={umkm.id} delay={idx * 100}>
            <div className="group bg-white rounded-2xl border-2 border-amber-200/80 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between h-full">
              {/* Top Rank Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md border border-amber-300">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  #{idx + 1} Unggulan
                </span>
              </div>

              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={umkm.foto_url}
                    alt={umkm.nama_usaha}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 text-white font-semibold text-xs backdrop-blur-md border border-white/20">
                      {umkm.kategori_usaha}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {umkm.nama_usaha}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-2.5 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Dusun {umkm.dusun}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {umkm.nama_pemilik}
                    </span>
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                    {umkm.deskripsi}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-0 mt-auto">
                <Link
                  href={`/umkm/${umkm.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all group-hover:shadow-md"
                >
                  <span>Lihat Profil Unggulan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
