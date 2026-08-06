"use client";

import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef, useTransition, JSX } from "react";
import SurpriseMe from "./SurpriseMe";
import type { Umkm } from "@/lib/types";
import {
  Utensils,
  Palette,
  Wrench,
  Sprout,
  Beef,
  Trees,
  Shirt,
  Factory,
  Store,
  Sparkles,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  MapPin,
  Tag,
  Check,
} from "lucide-react";

// Category Icons Component Mapping
const CATEGORY_ICON_COMPONENTS: Record<string, JSX.Element> = {
  Kuliner: <Utensils className="w-3.5 h-3.5" />,
  Kerajinan: <Palette className="w-3.5 h-3.5" />,
  Jasa: <Wrench className="w-3.5 h-3.5" />,
  Pertanian: <Sprout className="w-3.5 h-3.5" />,
  Peternakan: <Beef className="w-3.5 h-3.5" />,
  Agribisnis: <Trees className="w-3.5 h-3.5" />,
  Fashion: <Shirt className="w-3.5 h-3.5" />,
  Manufaktur: <Factory className="w-3.5 h-3.5" />,
  Toko: <Store className="w-3.5 h-3.5" />,
  Lainnya: <Sparkles className="w-3.5 h-3.5" />,
};

interface FilterBarProps {
  umkmList?: Umkm[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export default function FilterBar({
  umkmList = [],
  viewMode = "grid",
  onViewModeChange,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [kategori, setKategori] = useState(
    searchParams.get("kategori") || ""
  );
  const [dusun, setDusun] = useState(searchParams.get("dusun") || "");
  const [isDusunOpen, setIsDusunOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dusunDropdownRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollPosition();
    const scrollEl = categoryScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScrollPosition);
    }
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Sync state with URL params ONLY when input is not actively focused to prevent text reset while typing
  useEffect(() => {
    if (document.activeElement?.id !== "search-umkm") {
      setSearch(searchParams.get("q") || "");
    }
    setKategori(searchParams.get("kategori") || "");
    setDusun(searchParams.get("dusun") || "");
  }, [searchParams]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dusunDropdownRef.current &&
        !dusunDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDusunOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilters = useCallback(
    (newSearch: string, newKategori: string, newDusun: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newSearch) params.set("q", newSearch);
      else params.delete("q");

      if (newKategori) params.set("kategori", newKategori);
      else params.delete("kategori");

      if (newDusun) params.set("dusun", newDusun);
      else params.delete("dusun");

      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  // Debounced search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        search !== (searchParams.get("q") || "") ||
        kategori !== (searchParams.get("kategori") || "") ||
        dusun !== (searchParams.get("dusun") || "")
      ) {
        updateFilters(search, kategori, dusun);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, kategori, dusun, updateFilters, searchParams]);

  const handleCategoryClick = (catName: string) => {
    const nextCat = kategori === catName ? "" : catName;
    setKategori(nextCat);
    updateFilters(search, nextCat, dusun);
  };

  const handleSelectDusun = (selectedDusun: string) => {
    setDusun(selectedDusun);
    updateFilters(search, kategori, selectedDusun);
    setIsDusunOpen(false);
  };

  const handleReset = () => {
    setSearch("");
    setKategori("");
    setDusun("");
    startTransition(() => {
      router.push("/", { scroll: false });
    });
  };

  const hasFilters = search || kategori || dusun;

  return (
    <div className="space-y-4">
      {/* Primary Toolbar Container */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors duration-300">
        {/* Search, Dusun, Surprise & View Toggle Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            {isPending ? (
              <svg className="animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
            <input
              type="text"
              placeholder="Cari produk, nama usaha, atau pemilik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-border-light border border-border rounded-xl pl-10 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              id="search-umkm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  updateFilters("", kategori, dusun);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Action Controls Group */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Custom Popover Dusun Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none sm:w-48" ref={dusunDropdownRef}>
              <button
                type="button"
                onClick={() => setIsDusunOpen(!isDusunOpen)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  dusun
                    ? "bg-primary-50 border-primary-200 text-primary font-bold shadow-xs"
                    : "bg-border-light hover:bg-border border-border text-text-primary"
                }`}
                id="filter-dusun-trigger"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${dusun ? "text-primary" : "text-text-muted"}`} />
                  <span className="truncate">
                    {dusun ? `Dusun ${dusun}` : "Semua Dusun"}
                  </span>
                </div>
                {isPending ? (
                  <svg className="animate-spin w-4 h-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <ChevronDown className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${isDusunOpen ? "rotate-180 text-primary" : ""}`} />
                )}
              </button>

              {/* Popover Menu */}
              {isDusunOpen && (
                <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-56 mt-1.5 z-50 bg-surface/95 backdrop-blur-md border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-scale-in max-h-64 overflow-y-auto custom-scrollbar-v">
                  <button
                    onClick={() => handleSelectDusun("")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      !dusun
                        ? "bg-primary text-white font-bold"
                        : "text-text-primary hover:bg-border-light"
                    }`}
                  >
                    <span>Semua Dusun</span>
                    {!dusun && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <div className="my-1 border-t border-border" />

                  {DAFTAR_DUSUN.map((d) => {
                    const isSelected = dusun === d;
                    return (
                      <button
                        key={d}
                        onClick={() => handleSelectDusun(d)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white font-bold"
                            : "text-text-primary hover:bg-primary-50 hover:text-primary"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-primary"}`} />
                          <span>Dusun {d}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Surprise Me Component */}
            {umkmList.length > 0 && <SurpriseMe umkmList={umkmList} />}

            {/* View Mode Toggle Buttons */}
            {onViewModeChange && (
              <div className="flex items-center gap-1 bg-border-light p-1 rounded-xl shrink-0 border border-border">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-surface text-primary shadow-xs font-bold border border-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Tampilan Grid Card"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>

                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-surface text-primary shadow-xs font-bold border border-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Tampilan Horizontal Baris"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            )}

            {/* Reset Button */}
            {hasFilters && (
              <button
                onClick={handleReset}
                disabled={isPending}
                className="px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-surface hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs shadow-2xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                id="reset-filters"
              >
                {isPending ? (
                  <svg className="animate-spin w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <RotateCcw className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Chips Scroll Bar with Interactive Scroll Controls */}
        <div className="pt-3 border-t border-border relative group">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-border shadow-md text-text-primary hover:text-primary hover:bg-border-light flex items-center justify-center cursor-pointer transition-all active:scale-95"
              title="Geser Kategori Kiri"
              aria-label="Geser Kategori Kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Left Gradient Fade Mask */}
          {canScrollLeft && (
            <div className="absolute left-0 top-3 bottom-0 w-10 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10 pointer-events-none" />
          )}

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-border shadow-md text-text-primary hover:text-primary hover:bg-border-light flex items-center justify-center cursor-pointer transition-all active:scale-95"
              title="Geser Kategori Kanan"
              aria-label="Geser Kategori Kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Right Gradient Fade Mask */}
          {canScrollRight && (
            <div className="absolute right-0 top-3 bottom-0 w-10 bg-gradient-to-l from-surface via-surface/80 to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto pt-1 pb-2.5 custom-scrollbar-h touch-pan-x scroll-smooth px-0.5"
          >
            <div className="flex items-center gap-1.5 shrink-0 mr-1 bg-border-light border border-border px-2.5 py-1.5 rounded-full">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Kategori
              </span>
              {isPending ? (
                <span className="text-[10px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse border border-primary-200">
                  <svg className="animate-spin w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memuat...
                </span>
              ) : canScrollRight ? (
                <span className="text-[10px] font-semibold text-primary bg-primary-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                  Geser <ChevronRight className="w-2.5 h-2.5" />
                </span>
              ) : null}
            </div>

            <button
              onClick={() => {
                setKategori("");
                updateFilters(search, "", dusun);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                !kategori
                  ? "bg-primary text-white shadow-xs"
                  : "bg-border-light hover:bg-border text-text-primary border border-border"
              }`}
            >
              {isPending && !kategori ? (
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Semua</span>
            </button>

            {KATEGORI_USAHA.map((cat) => {
              const isActive = kategori === cat;
              const iconComponent = (isPending && isActive) ? (
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : CATEGORY_ICON_COMPONENTS[cat] || (
                <Tag className="w-3.5 h-3.5" />
              );

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-border-light hover:bg-border text-text-primary border border-border"
                  }`}
                >
                  {iconComponent}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
