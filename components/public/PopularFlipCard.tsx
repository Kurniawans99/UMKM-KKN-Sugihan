import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, Eye, Tag, MessageCircle, ArrowUpRight, Sparkles } from "lucide-react";

interface PopularFlipCardProps {
  umkm: Umkm & { view_count?: number };
  rank: number;
  customViews?: number;
}

export default function PopularFlipCard({ umkm, rank, customViews }: PopularFlipCardProps) {
  const viewCount = typeof customViews === "number" ? customViews : umkm.views_count || 0;

  return (
    <>
      {/* ===== DESKTOP: Flip Card (hidden on mobile & tablet) ===== */}
      <div className="flip-card-wrapper hidden lg:block">
        <div className="flip-card-inner">
          {/* FRONT SIDE */}
          <div className="flip-card-face flip-card-front">
            <Link href={`/umkm/${umkm.slug}`} className="block w-full h-full relative">
              <Image
                src={umkm.foto_url}
                alt={umkm.nama_usaha}
                fill
                sizes="(max-width: 640px) 280px, 310px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Rank Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 font-bold text-xs backdrop-blur-md shadow-md border border-emerald-200/90">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>#{rank}</span>
                </span>
              </div>

              {/* Views Badge */}
              {viewCount >= 1 && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 font-bold text-xs backdrop-blur-md border border-emerald-200/90 shadow-md">
                    <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{viewCount}</span>
                  </span>
                </div>
              )}

              {/* Bottom Content on Front */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white/90 font-medium text-[10px] backdrop-blur-sm mb-2 border border-white/10">
                  <Tag className="w-3 h-3 shrink-0" />
                  {umkm.kategori_usaha}
                </span>
                <h3 className="font-bold text-white text-base leading-tight font-[var(--font-montserrat)] line-clamp-2 drop-shadow-lg">
                  {umkm.nama_usaha}
                </h3>
                <p className="text-white/70 text-[11px] mt-1 font-medium">
                  Hover untuk detail →
                </p>
              </div>
            </Link>
          </div>

          {/* BACK SIDE */}
          <div className="flip-card-face flip-card-back">
            <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white font-bold text-xs backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    #{rank}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-emerald-200 font-medium text-[10px] border border-white/10">
                    <Tag className="w-3 h-3 shrink-0" />
                    {umkm.kategori_usaha}
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg leading-snug font-[var(--font-montserrat)] line-clamp-2 mb-3">
                  {umkm.nama_usaha}
                </h3>

                <p className="text-emerald-200/80 text-xs font-medium flex items-center gap-1.5 mb-2">
                  <User className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  {umkm.nama_pemilik}
                </p>

                <p className="text-emerald-200/80 text-xs font-medium flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  Dusun {umkm.dusun}
                </p>

                <p className="text-emerald-100/70 text-xs leading-relaxed line-clamp-3">
                  {umkm.deskripsi}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                {umkm.no_whatsapp && (
                  <a
                    href={`https://wa.me/${umkm.no_whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Halo ${umkm.nama_pemilik}, saya tertarik dengan produk ${umkm.nama_usaha} di Web UMKM Desa Sugihan.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-[11px] transition-colors backdrop-blur-sm border border-white/10"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>WhatsApp</span>
                  </a>
                )}

                <Link
                  href={`/umkm/${umkm.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-emerald-900 font-bold text-[11px] transition-colors ml-auto shadow-sm"
                >
                  <span>Lihat Profil</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE & TABLET: Traditional Card (visible on mobile & tablet) ===== */}
      <Link
        href={`/umkm/${umkm.slug}`}
        className="lg:hidden bg-white border border-slate-200/90 rounded-2xl overflow-hidden block shadow-xs active:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={umkm.foto_url}
            alt={umkm.nama_usaha}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

          {/* Rank Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-emerald-800 font-bold text-[11px] backdrop-blur-md shadow-sm border border-emerald-200/90">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              #{rank}
            </span>
          </div>

          {/* Views Badge */}
          {viewCount >= 1 && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-emerald-800 font-bold text-[11px] backdrop-blur-md border border-emerald-200/90 shadow-sm">
                <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
                {viewCount}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-100">
              <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
              {umkm.kategori_usaha}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug font-[var(--font-montserrat)] line-clamp-1 mb-1">
            {umkm.nama_usaha}
          </h3>
          <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1 mb-1.5">
            <User className="w-3 h-3 text-emerald-600 shrink-0" />
            {umkm.nama_pemilik}
          </p>
          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2 mb-2.5">
            {umkm.deskripsi}
          </p>
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/80">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              Dusun {umkm.dusun}
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
