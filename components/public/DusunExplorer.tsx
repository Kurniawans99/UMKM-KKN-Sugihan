"use client";

import { DAFTAR_DUSUN } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Map, MapPin, X } from "lucide-react";

export default function DusunExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDusun = searchParams.get("dusun") || "";

  const handleSelectDusun = (dusunName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeDusun === dusunName) {
      params.delete("dusun");
    } else {
      params.set("dusun", dusunName);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg relative overflow-hidden border border-emerald-800/50">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-2xl mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-700/50 shadow-xs">
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>Jelajah Wilayah Desa Sugihan</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-[var(--font-montserrat)] text-white">
            Cari UMKM Berdasarkan Dusun
          </h3>
          <p className="text-emerald-100/90 text-sm mt-1">
            Pilih nama dusun di bawah ini untuk melihat daftar usaha lokal di dusun tersebut:
          </p>
        </div>

        {/* Dusun Chips Grid */}
        <div className="flex flex-wrap gap-2.5">
          {DAFTAR_DUSUN.map((dusun) => {
            const isActive = activeDusun === dusun;
            return (
              <button
                key={dusun}
                onClick={() => handleSelectDusun(dusun)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                    : "bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-700/50"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>Dusun {dusun}</span>
                {isActive && <X className="w-3.5 h-3.5 ml-0.5 text-slate-950" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
