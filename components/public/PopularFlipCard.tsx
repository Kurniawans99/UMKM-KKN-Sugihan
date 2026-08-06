"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const viewCount = typeof customViews === "number" ? customViews : umkm.views_count || 0;

  return (
    <>
      {/* ===== DESKTOP: Flip Card (hidden on mobile & tablet) ===== */}
      <div className="flip-card-wrapper hidden lg:block">
        <div className="flip-card-inner">
          {/* FRONT SIDE */}
          <div className="flip-card-face flip-card-front relative">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-white rounded-2xl animate-fade-in">
                <svg className="animate-spin w-8 h-8 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-medium text-white/90">Memuat profil...</span>
              </div>
            )}
            <Link
              href={`/umkm/${umkm.slug}`}
              onClick={() => setLoading(true)}
              className="block w-full h-full relative"
            >
              <Image
                src={umkm.foto_url}
                alt={umkm.nama_usaha}
                fill
                sizes="(max-width: 640px) 280px, 310px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

              {/* Rank Badge — Minimal Circle */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-emerald-800 font-extrabold text-[11px] backdrop-blur-md shadow-sm ring-1 ring-black/5">
                  #{rank}
                </span>
              </div>

              {/* Bottom Content on Front */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-medium text-white/95 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-2xs">
                    {umkm.kategori_usaha}
                  </span>
                  {viewCount >= 1 && (
                    <span className="text-[10px] font-medium text-white/85 flex items-center gap-1 bg-slate-950/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                      <Eye className="w-3 h-3 shrink-0 text-emerald-300" />
                      {viewCount}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-tight font-[var(--font-montserrat)] line-clamp-2 drop-shadow-md">
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
            </Link>
          </div>

          {/* BACK SIDE */}
          <div className="flip-card-face flip-card-back relative">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-white rounded-2xl animate-fade-in">
                <svg className="animate-spin w-8 h-8 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-medium text-white/90">Memuat profil...</span>
              </div>
            )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setLoading(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-emerald-900 font-bold text-[11px] transition-colors ml-auto shadow-sm"
                >
                  <span>Lihat Profil</span>
                  {loading ? (
                    <svg className="animate-spin w-3.5 h-3.5 text-emerald-900" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE & TABLET: Traditional Card (visible on mobile & tablet) ===== */}
      <Link
        href={`/umkm/${umkm.slug}`}
        onClick={() => setLoading(true)}
        className="lg:hidden bg-surface border border-border rounded-2xl overflow-hidden block shadow-xs active:shadow-md transition-all duration-200 active:scale-[0.98] relative"
      >
        {loading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-white rounded-2xl animate-fade-in">
            <svg className="animate-spin w-7 h-7 text-emerald-400 mb-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-[11px] font-medium text-white/90">Memuat profil...</span>
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={umkm.foto_url}
            alt={umkm.nama_usaha}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          {/* Bottom overlay — name & location */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <h3 className="font-bold text-white text-sm leading-snug font-[var(--font-montserrat)] line-clamp-1 drop-shadow-md">
              {umkm.nama_usaha}
            </h3>
            <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 shrink-0" />
              Dusun {umkm.dusun}
            </p>
          </div>

          {/* Rank badge — minimal circle */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface/90 text-primary font-extrabold text-[10px] backdrop-blur-md shadow-sm ring-1 ring-black/5">
              #{rank}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Category & Views — subtle inline */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
              {umkm.kategori_usaha}
            </span>
            {viewCount >= 1 && (
              <span className="text-[10px] font-medium text-text-muted flex items-center gap-1">
                <Eye className="w-3 h-3 shrink-0" />
                {viewCount}
              </span>
            )}
          </div>

          <p className="text-text-muted text-[11px] font-medium flex items-center gap-1 mb-1.5">
            <User className="w-3 h-3 text-primary/70 shrink-0" />
            {umkm.nama_pemilik}
          </p>
          <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-2 mb-2.5">
            {umkm.deskripsi}
          </p>
          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              Dusun {umkm.dusun}
            </span>
            <div className="w-6 h-6 rounded-full bg-border-light flex items-center justify-center text-text-primary">
              {loading ? (
                <svg className="animate-spin w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
