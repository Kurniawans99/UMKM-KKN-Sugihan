"use client";

import { useState, useRef } from "react";
import type { Umkm } from "@/lib/types";
import { Award, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import UmkmCard from "./UmkmCard";

export default function FeaturedSection({ umkmList }: { umkmList: Umkm[] }) {
  // Take top 5 featured UMKM sorted by highest view count
  const featured = umkmList.slice(0, 5);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (featured.length === 0) return null;

  const total = featured.length;
  const center = (total - 1) / 2;

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-14 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2.5 border border-amber-300/80 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>UMKM Unggulan Desa Sugihan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            Produk & Usaha Pilihan
          </h2>
        </div>

        {/* Navigation Buttons for Scroll View (visible on mobile & tablet) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll Kiri"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll Kanan"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Berdasarkan Penayangan Terbanyak</span>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: Fan-Deck Arc Cards (visible on Desktop lg+) ===== */}
      <div className="hidden lg:flex justify-center items-end py-6 lg:py-10 min-h-[380px] lg:min-h-[420px] max-w-full mx-auto">
        <div className="flex justify-center items-end -space-x-12 lg:-space-x-10 xl:-space-x-12 2xl:-space-x-14 max-w-full">
          {featured.map((umkm, idx) => {
            const offset = idx - center;
            // Smoother angle (6.5 degrees per step) to fit within container perfectly
            const rotation = offset * 6.5;
            const isHovered = hoveredIdx === idx;
            const isSiblingHovered = hoveredIdx !== null && hoveredIdx !== idx;

            const baseZ = 10 + (total - Math.abs(offset));
            const zIndex = isHovered ? 60 : baseZ;

            return (
              <div
                key={`featured-static-${umkm.id}`}
                className="relative w-[210px] lg:w-[230px] xl:w-[260px] 2xl:w-[280px] shrink-0"
                style={{
                  zIndex,
                  transformOrigin: "center bottom",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease, opacity 0.4s ease",
                  transform: isHovered
                    ? "rotate(0deg) translateY(-24px) scale(1.06)"
                    : `rotate(${rotation}deg) translateY(0px) scale(1)`,
                  filter: isSiblingHovered ? "brightness(0.75)" : "brightness(1)",
                  opacity: isSiblingHovered ? 0.8 : 1,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <UmkmCard
                  umkm={umkm}
                  rankBadge={{
                    text: `#${idx + 1}`,
                  }}
                  className={`shadow-lg transition-shadow duration-500 ${
                    isHovered ? "shadow-2xl shadow-emerald-200/40" : ""
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MOBILE & TABLET: Horizontal Scroll Cards (visible on < lg) ===== */}
      <div className="lg:hidden -mx-4 px-4">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {featured.map((umkm, idx) => (
            <div
              key={`featured-scroll-${umkm.id}`}
              className="w-[75vw] sm:w-[280px] max-w-[300px] shrink-0 snap-center"
            >
              <UmkmCard
                umkm={umkm}
                rankBadge={{
                  text: `#${idx + 1}`,
                }}
                className="shadow-md"
              />
            </div>
          ))}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {featured.map((_, idx) => (
            <div
              key={`dot-${idx}`}
              className="w-1.5 h-1.5 rounded-full bg-slate-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
