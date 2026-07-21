import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";

export default function UmkmCard({ umkm }: { umkm: Umkm }) {
  return (
    <Link
      href={`/umkm/${umkm.slug}`}
      className="bg-surface border border-border rounded-xl overflow-hidden card-hover group block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-border-light">
        <Image
          src={umkm.foto_url}
          alt={umkm.nama_usaha}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary glass !border-0 text-xs">
            {umkm.kategori_usaha}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Business Name */}
        <h3 className="font-bold text-text-primary text-lg leading-snug mb-1 group-hover:text-primary transition-colors">
          {umkm.nama_usaha}
        </h3>

        {/* Owner Name */}
        <p className="text-text-muted text-sm mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {umkm.nama_pemilik}
        </p>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
          {umkm.deskripsi}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-text-muted">
          <svg className="w-3.5 h-3.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Dusun {umkm.dusun}</span>
        </div>
      </div>
    </Link>
  );
}
