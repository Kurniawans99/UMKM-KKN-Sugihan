"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Umkm } from "@/lib/types";
import { Shuffle, Sparkles, MessageCircle, X, User, MapPin, RotateCw, ExternalLink } from "lucide-react";

export default function SurpriseMe({ umkmList }: { umkmList: Umkm[] }) {
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePickRandom = () => {
    if (!umkmList || umkmList.length === 0) return;
    setIsSpinning(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * umkmList.length);
      setSelectedUmkm(umkmList[randomIndex]);
      setIsSpinning(false);
      setIsOpen(true);
    }, 400);
  };

  return (
    <>
      {/* Trigger Button - Premium Dark Emerald & Amber Accent */}
      <button
        onClick={handlePickRandom}
        disabled={isSpinning || umkmList.length === 0}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer border border-emerald-700/60 shrink-0"
      >
        <Sparkles className={`w-4 h-4 text-amber-300 ${isSpinning ? "animate-spin" : ""}`} />
        <span>{isSpinning ? "Mengacak..." : "Surprise Me!"}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-in relative">
            {/* Header / Badge - Sleek Dark Header */}
            <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="font-bold text-sm sm:text-base block text-white leading-tight">
                    Rekomendasi Acak Untukmu!
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Jelajahi usaha unik di Desa Sugihan
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/9] w-full bg-slate-100">
              <Image
                src={selectedUmkm.foto_url}
                alt={selectedUmkm.nama_usaha}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-semibold text-xs shadow-md">
                  {selectedUmkm.kategori_usaha}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 text-white font-semibold text-xs backdrop-blur-sm border border-slate-700/50">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Dusun {selectedUmkm.dusun}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {selectedUmkm.nama_usaha}
              </h3>
              <p className="text-sm font-medium text-emerald-700 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Pemilik: {selectedUmkm.nama_pemilik}</span>
              </p>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                {selectedUmkm.deskripsi}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {selectedUmkm.no_whatsapp && (
                  <a
                    href={`https://wa.me/${selectedUmkm.no_whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Halo ${selectedUmkm.nama_pemilik}, saya ingin bertanya mengenai produk ${selectedUmkm.nama_usaha} dari web UMKM Desa Sugihan.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi WhatsApp</span>
                  </a>
                )}

                <Link
                  href={`/umkm/${selectedUmkm.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Detail</span>
                </Link>

                <button
                  onClick={handlePickRandom}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-sm text-center transition-colors border border-amber-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Acak Lagi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
