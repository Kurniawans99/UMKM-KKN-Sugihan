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
    <div className="flip-card-wrapper">
      <div className="flip-card-inner">
        {/* ===== FRONT SIDE ===== */}
        <div className="flip-card-face flip-card-front">
          <Link href={`/umkm/${umkm.slug}`} className="block w-full h-full relative">
            {/* Full Background Image */}
            <Image
              src={umkm.foto_url}
              alt={umkm.nama_usaha}
              fill
              sizes="(max-width: 640px) 280px, 310px"
              className="object-cover"
            />

            {/* Gradient Overlay */}
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

        {/* ===== BACK SIDE ===== */}
        <div className="flip-card-face flip-card-back">
          <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 relative overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

            {/* Top Content */}
            <div className="relative z-10">
              {/* Rank & Category */}
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

              {/* Business Name */}
              <h3 className="font-bold text-white text-lg leading-snug font-[var(--font-montserrat)] line-clamp-2 mb-3">
                {umkm.nama_usaha}
              </h3>

              {/* Owner Info */}
              <p className="text-emerald-200/80 text-xs font-medium flex items-center gap-1.5 mb-2">
                <User className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                {umkm.nama_pemilik}
              </p>

              {/* Location */}
              <p className="text-emerald-200/80 text-xs font-medium flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                Dusun {umkm.dusun}
              </p>

              {/* Description */}
              <p className="text-emerald-100/70 text-xs leading-relaxed line-clamp-3">
                {umkm.deskripsi}
              </p>
            </div>

            {/* Bottom CTAs */}
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
  );
}
