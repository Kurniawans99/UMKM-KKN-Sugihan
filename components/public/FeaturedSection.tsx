"use client";

import { useState } from "react";
import type { Umkm } from "@/lib/types";
import { Award, Sparkles } from "lucide-react";
import UmkmCard from "./UmkmCard";

export default function FeaturedSection({ umkmList }: { umkmList: Umkm[] }) {
  // Take top 5 featured UMKM sorted by highest view count
  const featured = umkmList.slice(0, 5);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (featured.length === 0) return null;

  const total = featured.length;
  const center = (total - 1) / 2;

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2.5 border border-amber-300/80 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>UMKM Unggulan Desa Sugihan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            Produk & Usaha Pilihan
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Berdasarkan Penayangan Terbanyak</span>
        </div>
      </div>

      {/* Fan-Deck Arc Cards — same baseline, rotation-only arc */}
      <div className="flex justify-center items-end py-6 sm:py-10 overflow-visible min-h-[380px] sm:min-h-[420px]">
        <div className="flex justify-center items-end -space-x-6 sm:-space-x-10 md:-space-x-12 lg:-space-x-14">
          {featured.map((umkm, idx) => {
            const offset = idx - center;
            const rotation = offset * 8; // -16, -8, 0, 8, 16 degrees
            const isHovered = hoveredIdx === idx;
            const isSiblingHovered = hoveredIdx !== null && hoveredIdx !== idx;

            // Base z-index: center card highest
            const baseZ = 10 + (total - Math.abs(offset));
            // When hovered, this card goes to top; when a sibling is hovered, dim slightly
            const zIndex = isHovered ? 60 : baseZ;

            return (
              <div
                key={`featured-static-${umkm.id}`}
                className="relative w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px] shrink-0"
                style={{
                  zIndex,
                  transformOrigin: "center bottom",
                  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease, opacity 0.4s ease",
                  transform: isHovered
                    ? "rotate(0deg) translateY(-28px) scale(1.08)"
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
    </section>
  );
}
