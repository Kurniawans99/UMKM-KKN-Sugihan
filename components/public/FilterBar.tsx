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
  const [, startTransition] = useTransition();

  const dusunDropdownRef = useRef<HTMLDivElement>(null);

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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-4">
        {/* Search, Dusun, Surprise & View Toggle Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari produk, nama usaha, atau pemilik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
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

          {/* Action Row for Mobile / Tablet */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Custom Popover Dusun Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none sm:w-52" ref={dusunDropdownRef}>
              <button
                type="button"
                onClick={() => setIsDusunOpen(!isDusunOpen)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  dusun
                    ? "bg-emerald-50/90 border-emerald-300 text-emerald-900 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
                id="filter-dusun-trigger"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${dusun ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="truncate">
                    {dusun ? `Dusun ${dusun}` : "Semua Dusun"}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isDusunOpen ? "rotate-180 text-emerald-600" : ""}`} />
              </button>

              {/* Popover Menu */}
              {isDusunOpen && (
                <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-60 mt-1.5 z-50 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-scale-in max-h-64 overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => handleSelectDusun("")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      !dusun
                        ? "bg-emerald-700 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>Semua Dusun</span>
                    {!dusun && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {DAFTAR_DUSUN.map((d) => {
                    const isSelected = dusun === d;
                    return (
                      <button
                        key={d}
                        onClick={() => handleSelectDusun(d)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-emerald-700 text-white font-bold"
                            : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-emerald-600"}`} />
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
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
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
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
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
                className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                id="reset-filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Chips Scroll Bar */}
        <div className="pt-3 border-t border-slate-100 relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar touch-pan-x pr-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Kategori:
            </span>

            <button
              onClick={() => {
                setKategori("");
                updateFilters(search, "", dusun);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                !kategori
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semua</span>
            </button>

            {KATEGORI_USAHA.map((cat) => {
              const isActive = kategori === cat;
              const iconComponent = CATEGORY_ICON_COMPONENTS[cat] || (
                <Tag className="w-3.5 h-3.5" />
              );

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50"
                  }`}
                >
                  {iconComponent}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Right Gradient Fade Hint for Horizontal Scroll on Mobile */}
          <div className="absolute right-0 top-3 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>
    </div>
  );
}
