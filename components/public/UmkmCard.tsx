import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, ArrowUpRight, Tag, Eye } from "lucide-react";

export default function UmkmCard({ umkm }: { umkm: Umkm }) {
  const hasViews = Boolean(umkm.views_count && umkm.views_count >= 1);

  return (
    <Link
      href={`/umkm/${umkm.slug}`}
      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden group block shadow-xs hover:shadow-xl hover:border-emerald-300/80 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative flex flex-col justify-between h-full"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={umkm.foto_url}
            alt={umkm.nama_usaha}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/75 text-white font-semibold text-xs backdrop-blur-md shadow-md border border-white/20">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              {umkm.kategori_usaha}
            </span>
          </div>

          {/* Views Badge (Visible only if views >= 1) */}
          {hasViews && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/75 text-amber-300 font-bold text-xs backdrop-blur-md shadow-md border border-amber-400/20">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{umkm.views_count} views</span>
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Business Name */}
          <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors font-[var(--font-montserrat)] flex items-center justify-between gap-2">
            <span className="line-clamp-1">{umkm.nama_usaha}</span>
          </h3>

          {/* Owner Name */}
          <p className="text-slate-500 text-xs font-medium mb-2.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{umkm.nama_pemilik}</span>
          </p>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {umkm.deskripsi}
          </p>
        </div>
      </div>

      {/* Location & Detail CTA Footer */}
      <div className="p-5 pt-0 mt-auto">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 border border-emerald-100/80 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Dusun {umkm.dusun}</span>
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 text-slate-600 shadow-2xs">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
