import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, ArrowUpRight, Eye } from "lucide-react";

export interface UmkmCardProps {
  umkm: Umkm;
  rankBadge?: {
    text: string;
    variant?: "gold" | "silver" | "bronze" | "emerald" | "slate";
    icon?: React.ReactNode;
  };
  customViews?: number;
  showViews?: boolean;
  className?: string;
}

export default function UmkmCard({
  umkm,
  rankBadge,
  customViews,
  showViews = true,
  className = "",
}: UmkmCardProps) {
  const viewCount = typeof customViews === "number" ? customViews : umkm.views_count || 0;
  const hasViews = Boolean(showViews && viewCount >= 1);

  return (
    <Link
      href={`/umkm/${umkm.slug}`}
      className={`bg-white border border-slate-200/90 rounded-2xl overflow-hidden group block shadow-xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative flex flex-col justify-between h-full w-full ${className}`}
    >
      <div>
        {/* Image Container — clean, no floating badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={umkm.foto_url}
            alt={umkm.nama_usaha}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradient overlay — stronger at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          {/* Bottom overlay content — category, views, name & location on the image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Category & Views badges above business name */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-medium text-white/95 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-2xs">
                {umkm.kategori_usaha}
              </span>
              {hasViews && (
                <span className="text-[10px] font-medium text-white/85 flex items-center gap-1 bg-slate-950/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  <Eye className="w-3 h-3 shrink-0 text-emerald-300" />
                  {viewCount}
                </span>
              )}
            </div>

            <h3 className="font-bold text-white text-[15px] sm:text-base leading-snug font-[var(--font-montserrat)] line-clamp-1 drop-shadow-md">
              {umkm.nama_usaha}
            </h3>
            <div className="text-white/75 text-[11px] mt-1 flex items-center gap-2 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 shrink-0 text-white/70" />
                <span>{umkm.nama_pemilik}</span>
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0 text-white/70" />
                <span>Dusun {umkm.dusun}</span>
              </span>
            </div>
          </div>

          {/* Rank badge — minimal, top-left, only if present */}
          {rankBadge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-emerald-800 font-extrabold text-[11px] backdrop-blur-md shadow-sm ring-1 ring-black/5">
                {rankBadge.text}
              </span>
            </div>
          )}
        </div>

        {/* Content area — clean info below image */}
        <div className="p-4 sm:p-5">
          {/* Owner */}
          <p className="text-slate-500 text-xs font-medium mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600/70 shrink-0" />
            <span>{umkm.nama_pemilik}</span>
          </p>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {umkm.deskripsi}
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Dusun {umkm.dusun}
          </span>

          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 text-slate-500 shadow-2xs">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
