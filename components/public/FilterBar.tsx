"use client";

import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [kategori, setKategori] = useState(
    searchParams.get("kategori") || ""
  );
  const [dusun, setDusun] = useState(searchParams.get("dusun") || "");

  const updateFilters = useCallback(
    (newSearch: string, newKategori: string, newDusun: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("q", newSearch);
      if (newKategori) params.set("kategori", newKategori);
      if (newDusun) params.set("dusun", newDusun);
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters(search, kategori, dusun);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, kategori, dusun, updateFilters]);

  const handleReset = () => {
    setSearch("");
    setKategori("");
    setDusun("");
    router.push("/", { scroll: false });
  };

  const hasFilters = search || kategori || dusun;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-card animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari nama usaha atau pemilik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input !pl-10"
            id="search-umkm"
          />
        </div>

        {/* Category Filter */}
        <div className="relative sm:w-48">
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="form-input appearance-none !pr-9 cursor-pointer"
            id="filter-kategori"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_USAHA.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dusun Filter */}
        <div className="relative sm:w-44">
          <select
            value={dusun}
            onChange={(e) => setDusun(e.target.value)}
            className="form-input appearance-none !pr-9 cursor-pointer"
            id="filter-dusun"
          >
            <option value="">Semua Dusun</option>
            {DAFTAR_DUSUN.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Reset Button */}
        {hasFilters && (
          <button
            onClick={handleReset}
            className="btn-secondary !px-3 !py-2 text-sm shrink-0"
            id="reset-filters"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
