"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Umkm } from "@/lib/types";
import { Flame, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import UmkmCard from "./UmkmCard";

type Timeframe = "daily" | "weekly" | "monthly";

interface PopularUmkm extends Umkm {
  view_count: number;
  is_real: boolean;
}

export default function PopularSection({ initialUmkmList = [] }: { initialUmkmList?: Umkm[] }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [popularList, setPopularList] = useState<PopularUmkm[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const userTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPosRef = useRef(0);

  const fetchPopular = useCallback(async (tf: Timeframe) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/umkm/popular?timeframe=${tf}`);
      if (res.ok) {
        const data = await res.json();
        if (data.popular && data.popular.length > 0) {
          setPopularList(data.popular);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error loading popular UMKM:", err);
    }

    // Fallback using initial list if API fails
    const fallback = initialUmkmList.map((u) => {
      return {
        ...u,
        view_count: typeof u.views_count === "number" ? u.views_count : 0,
        is_real: true,
      };
    });
    fallback.sort((a, b) => b.view_count - a.view_count);
    setPopularList(fallback);
    setLoading(false);
  }, [initialUmkmList]);

  useEffect(() => {
    fetchPopular(timeframe);
  }, [timeframe, fetchPopular]);

  // Quadruple items for guaranteed infinite seamless auto-scroll wrap across all screen widths
  const displayList =
    popularList.length > 1
      ? [...popularList, ...popularList, ...popularList, ...popularList]
      : popularList;

  // Continuous auto-scroll loop (60FPS subpixel float accumulator) on native scroll container
  useEffect(() => {
    if (popularList.length <= 1) return;

    let animId: number;
    let lastTime = performance.now();

    const getSingleSetWidth = () => {
      const container = scrollContainerRef.current;
      if (!container || container.children.length <= popularList.length) return 0;
      const firstCard = container.children[0] as HTMLElement;
      const set2Card = container.children[popularList.length] as HTMLElement;
      if (firstCard && set2Card) {
        return set2Card.offsetLeft - firstCard.offsetLeft;
      }
      return 0;
    };

    const loop = (now: number) => {
      const container = scrollContainerRef.current;
      if (container && !isHoveredRef.current) {
        const delta = Math.min(now - lastTime, 32);
        lastTime = now;

        const singleSetWidth = getSingleSetWidth();
        if (singleSetWidth > 0) {
          // Auto-scroll speed: 40px per second with float accumulator
          scrollPosRef.current += (40 * delta) / 1000;

          if (scrollPosRef.current >= singleSetWidth) {
            scrollPosRef.current -= singleSetWidth;
          }

          container.scrollLeft = scrollPosRef.current;
        }
      } else {
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [popularList.length]);

  // Reset scroll position when popularList or timeframe changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollPosRef.current = 0;
    }
  }, [popularList, timeframe]);

  const pauseAutoScrollTemporarily = () => {
    isHoveredRef.current = true;
    if (userTimerRef.current) clearTimeout(userTimerRef.current);
    userTimerRef.current = setTimeout(() => {
      isHoveredRef.current = false;
    }, 3000);
  };

  const handleScrollEvent = () => {
    if (!scrollContainerRef.current || popularList.length <= 1) return;
    const container = scrollContainerRef.current;
    const firstCard = container.children[0] as HTMLElement;
    const set2Card = container.children[popularList.length] as HTMLElement;
    if (firstCard && set2Card) {
      const singleSetWidth = set2Card.offsetLeft - firstCard.offsetLeft;
      if (singleSetWidth > 0) {
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        }
        scrollPosRef.current = container.scrollLeft;
      }
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    pauseAutoScrollTemporarily();
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-14">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-900 font-bold text-xs mb-2.5 border border-rose-200 shadow-2xs">
            <Flame className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Statistik Penayangan Real-Time</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-[var(--font-montserrat)] tracking-tight">
            UMKM Terpopuler
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar usaha lokal yang paling sering dikunjungi oleh masyarakat & pembeli
          </p>
        </div>

        {/* Timeframe Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 max-w-full overflow-x-auto no-scrollbar shrink-0 self-start md:self-auto">
          <button
            onClick={() => setTimeframe("daily")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "daily"
                ? "bg-white text-rose-600 shadow-xs border border-rose-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${timeframe === "daily" ? "text-rose-600" : "text-slate-400"}`} />
            <span>Harian (24j)</span>
          </button>

          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "weekly"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 ${timeframe === "weekly" ? "text-emerald-600" : "text-slate-400"}`} />
            <span>Mingguan</span>
          </button>

          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              timeframe === "monthly"
                ? "bg-white text-amber-700 shadow-xs border border-amber-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${timeframe === "monthly" ? "text-amber-600" : "text-slate-400"}`} />
            <span>Bulanan</span>
          </button>
        </div>
      </div>

      {/* User-Scrollable Container with Floating Side Navigation Buttons & Auto-Looping */}
      {loading ? (
        <div className="flex items-center gap-5 overflow-hidden py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[250px] sm:w-[280px] shrink-0 aspect-[3/4] bg-slate-200/80 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="relative group/carousel">
          {/* Floating Left Scroll Arrow (Sisi Kiri Div) */}
          <button
            onClick={() => handleScroll("left")}
            aria-label="Geser Kiri"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl backdrop-blur-md border border-slate-200 flex items-center justify-center transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          </button>

          {/* Floating Right Scroll Arrow (Sisi Kanan Div) */}
          <button
            onClick={() => handleScroll("right")}
            aria-label="Geser Kanan"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl backdrop-blur-md border border-slate-200 flex items-center justify-center transition-all duration-300 opacity-90 hover:opacity-100 hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          </button>

          {/* Card Scroll Track (scroll-auto to allow continuous 60fps rAF scrolling) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScrollEvent}
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
            onTouchStart={pauseAutoScrollTemporarily}
            className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-4 px-8 sm:px-12 scroll-auto cursor-grab active:cursor-grabbing"
          >
            {displayList.map((umkm, idx) => {
              const originalIdx = idx % (popularList.length || 1);

              return (
                <div
                  key={`popular-${timeframe}-${umkm.id}-${idx}`}
                  onMouseEnter={() => {
                    isHoveredRef.current = true;
                  }}
                  onMouseLeave={() => {
                    isHoveredRef.current = false;
                  }}
                  className="w-[260px] sm:w-[290px] md:w-[310px] shrink-0 group flex flex-col justify-stretch"
                >
                  <UmkmCard
                    umkm={umkm}
                    customViews={umkm.view_count}
                    rankBadge={{
                      text: `#${originalIdx + 1} Terpopuler`,
                      variant:
                        originalIdx === 0
                          ? "gold"
                          : originalIdx === 1
                          ? "silver"
                          : originalIdx === 2
                          ? "bronze"
                          : "emerald",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
