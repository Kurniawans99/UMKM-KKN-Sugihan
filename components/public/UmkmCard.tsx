import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { MapPin, User, ArrowUpRight, Tag } from "lucide-react";

export default function UmkmCard({ umkm }: { umkm: Umkm }) {
  return (
    <Link
      href={`/umkm/${umkm.slug}`}
      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-hover group block shadow-sm hover:shadow-xl hover:border-emerald-200/90 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={umkm.foto_url}
          alt={umkm.nama_usaha}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white font-semibold text-xs backdrop-blur-md shadow-md border border-white/20">
            <Tag className="w-3 h-3 text-emerald-400" />
            {umkm.kategori_usaha}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Business Name */}
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors flex items-center justify-between gap-2">
          <span className="line-clamp-1">{umkm.nama_usaha}</span>
          <ArrowUpRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </h3>

        {/* Owner Name */}
        <p className="text-slate-500 text-xs font-semibold mb-3 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{umkm.nama_pemilik}</span>
        </p>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {umkm.deskripsi}
        </p>

        {/* Location & Detail CTA Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Dusun {umkm.dusun}</span>
          </div>

          <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
            Lihat Detail
          </span>
        </div>
      </div>
    </Link>
  );
}
