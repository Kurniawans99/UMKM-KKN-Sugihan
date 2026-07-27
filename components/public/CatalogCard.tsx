import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, ArrowUpRight, Tag, Eye } from "lucide-react";

export default function CatalogCard({ umkm }: { umkm: Umkm }) {
  const hasViews = Boolean(umkm.views_count && umkm.views_count >= 1);

  return (
    <>
      {/* ===== DESKTOP: Content Reveal Card (hidden on mobile & tablet) ===== */}
      <div className="catalog-card group hidden lg:block">
        {/* Image Layer */}
        <div className="catalog-card__image-layer">
          <Image
            src={umkm.foto_url}
            alt={umkm.nama_usaha}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-emerald-800 font-semibold text-xs backdrop-blur-md shadow-md border border-emerald-200/90">
              <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {umkm.kategori_usaha}
            </span>
          </div>

          {/* Views Badge */}
          {hasViews && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 font-bold text-xs backdrop-blur-md border border-emerald-200/90 shadow-md">
                <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{umkm.views_count}</span>
              </span>
            </div>
          )}

          {/* Bottom Preview */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 catalog-card__preview">
            <h3 className="font-bold text-white text-base leading-tight font-[var(--font-montserrat)] line-clamp-1 drop-shadow-lg">
              {umkm.nama_usaha}
            </h3>
            <p className="text-white/60 text-[11px] mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              Dusun {umkm.dusun}
            </p>
          </div>
        </div>

        {/* Content Layer (rotateX reveal on hover) */}
        <Link href={`/umkm/${umkm.slug}`} className="catalog-card__content">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px] border border-emerald-200/80">
                  <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                  {umkm.kategori_usaha}
                </span>
                {hasViews && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
                    {umkm.views_count}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5 font-[var(--font-montserrat)] line-clamp-2 group-hover:text-emerald-800 transition-colors">
                {umkm.nama_usaha}
              </h3>

              <p className="text-slate-500 text-xs font-medium mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {umkm.nama_pemilik}
              </p>

              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {umkm.deskripsi}
              </p>
            </div>

            <div className="pt-3 mt-auto border-t border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100/80 px-2.5 py-1 rounded-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dusun {umkm.dusun}</span>
              </div>

              <div className="w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 text-emerald-700">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ===== MOBILE & TABLET: Traditional Stacked Card (visible on mobile & tablet) ===== */}
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

          {/* Category Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 text-emerald-800 font-semibold text-[11px] backdrop-blur-md shadow-sm border border-emerald-200/90">
              <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
              {umkm.kategori_usaha}
            </span>
          </div>

          {/* Views Badge */}
          {hasViews && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-emerald-800 font-bold text-[11px] backdrop-blur-md border border-emerald-200/90 shadow-sm">
                <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
                {umkm.views_count}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
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
