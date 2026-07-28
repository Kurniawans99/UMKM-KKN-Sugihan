import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, MessageCircle, ArrowUpRight, Tag, Eye } from "lucide-react";

export default function HorizontalUmkmCard({ umkm }: { umkm: Umkm }) {
  const hasViews = Boolean(umkm.views_count && umkm.views_count >= 1);

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col md:flex-row group">
      {/* Image Container */}
      <div className="relative md:w-64 lg:w-72 aspect-[16/10] md:aspect-auto shrink-0 bg-slate-100 overflow-hidden">
        <Image
          src={umkm.foto_url}
          alt={umkm.nama_usaha}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/75 text-white font-semibold text-xs backdrop-blur-md border border-white/20">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            {umkm.kategori_usaha}
          </span>
        </div>

        {/* Views Badge (Visible only if views >= 1) */}
        {hasViews && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/75 text-amber-300 font-bold text-xs backdrop-blur-md border border-amber-400/20">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{umkm.views_count} views</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Link
              href={`/umkm/${umkm.slug}`}
              className="font-bold text-text-primary text-lg sm:text-xl group-hover:text-primary transition-colors font-[var(--font-montserrat)]"
            >
              {umkm.nama_usaha}
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100/80 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Dusun {umkm.dusun}
            </span>
          </div>

          {/* Owner Info */}
          <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Pemilik: {umkm.nama_pemilik}
          </p>

          {/* Description */}
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
            {umkm.deskripsi}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {umkm.no_whatsapp ? (
            <a
              href={`https://wa.me/${umkm.no_whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Halo ${umkm.nama_pemilik}, saya tertarik dengan produk ${umkm.nama_usaha} di Web UMKM Desa Sugihan.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Hubungi WhatsApp</span>
            </a>
          ) : (
            <div />
          )}

          <Link
            href={`/umkm/${umkm.slug}`}
            className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Lihat Profil Lengkap</span>
            <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
