"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/lib/types";
import { Navigation } from "lucide-react";

const UmkmMap = dynamic(() => import("@/components/public/UmkmMap"), {
  ssr: false,
  loading: () => (
    <section className="mb-12" id="peta-umkm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Peta UMKM Desa Sugihan
          </h2>
          <p className="text-sm text-slate-500">
            Temukan lokasi UMKM terdekat di sekitar Anda
          </p>
        </div>
      </div>
      <div className="h-[400px] sm:h-[480px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm">Memuat peta...</span>
      </div>
    </section>
  ),
});

export default function UmkmMapWrapper({ umkmList }: { umkmList: Umkm[] }) {
  return <UmkmMap umkmList={umkmList} />;
}
