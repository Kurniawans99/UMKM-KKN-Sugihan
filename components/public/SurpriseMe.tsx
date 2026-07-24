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
      {/* Trigger Button */}
      <button
        onClick={handlePickRandom}
        disabled={isSpinning || umkmList.length === 0}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300/30 shrink-0"
      >
        <Shuffle className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
        <span>{isSpinning ? "Mengacak..." : "Surprise Me!"}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-in relative">
            {/* Header / Badge */}
            <div className="bg-gradient-to-r from-amber-500 to-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span className="font-bold text-sm sm:text-base">
                  Rekomendasi Acak Untukmu!
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
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
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 text-white font-semibold text-xs backdrop-blur-sm">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Dusun {selectedUmkm.dusun}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
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
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {selectedUmkm.no_whatsapp && (
                  <a
                    href={`https://wa.me/${selectedUmkm.no_whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Halo ${selectedUmkm.nama_pemilik}, saya ingin bertanya mengenai produk ${selectedUmkm.nama_usaha} dari web UMKM Desa Sugihan.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi WhatsApp</span>
                  </a>
                )}

                <Link
                  href={`/umkm/${selectedUmkm.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-1.5"
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
