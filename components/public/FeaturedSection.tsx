import type { Umkm } from "@/lib/types";
import { Award, Sparkles } from "lucide-react";
import UmkmCard from "./UmkmCard";

export default function FeaturedSection({ umkmList }: { umkmList: Umkm[] }) {
  // Take top 5 featured UMKM sorted by highest view count
  const featured = umkmList.slice(0, 5);

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

      {/* Static Fan-Deck Arc Cards (5 Cards) */}
      <div className="flex justify-center items-center py-6 sm:py-8 overflow-visible">
        <div className="flex justify-center items-center -space-x-14 sm:-space-x-20 md:-space-x-24 lg:-space-x-28">
          {featured.map((umkm, idx) => {
            const offset = idx - center;
            const rotation = offset * 7; // -14deg, -7deg, 0deg, 7deg, 14deg
            const translateY = Math.abs(offset) * 10; // Center card highest
            const zIndex = 50 - Math.abs(offset);

            return (
              <div
                key={`featured-static-${umkm.id}`}
                className="relative w-[230px] sm:w-[260px] md:w-[280px] lg:w-[300px] shrink-0 transition-all duration-500 ease-out hover:z-50 group"
                style={{
                  transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
                  zIndex: zIndex,
                  transformOrigin: "center bottom",
                }}
              >
                <UmkmCard
                  umkm={umkm}
                  rankBadge={{
                    text: `#${idx + 1} Unggulan`,
                    variant: idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : "emerald",
                  }}
                  className="group-hover:-translate-y-4 group-hover:rotate-0 shadow-lg group-hover:shadow-2xl"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
