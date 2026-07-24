import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, MessageCircle, ArrowRight, Tag } from "lucide-react";

export default function HorizontalUmkmCard({ umkm }: { umkm: Umkm }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-hover shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
      {/* Image Container */}
      <div className="relative md:w-64 lg:w-72 aspect-[16/10] md:aspect-auto shrink-0 bg-slate-100 overflow-hidden">
        <Image
          src={umkm.foto_url}
          alt={umkm.nama_usaha}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 text-white font-semibold text-xs backdrop-blur-md border border-white/20">
            <Tag className="w-3 h-3 text-emerald-400" />
            {umkm.kategori_usaha}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Link
              href={`/umkm/${umkm.slug}`}
              className="font-bold text-slate-900 text-lg sm:text-xl group-hover:text-emerald-700 transition-colors"
            >
              {umkm.nama_usaha}
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Dusun {umkm.dusun}
            </span>
          </div>

          {/* Owner Info */}
          <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Pemilik: {umkm.nama_pemilik}
          </p>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi WhatsApp</span>
            </a>
          ) : (
            <div />
          )}

          <Link
            href={`/umkm/${umkm.slug}`}
            className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
          >
            <span>Lihat Profil Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
