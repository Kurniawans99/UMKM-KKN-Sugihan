"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/lib/types";
import { Navigation } from "lucide-react";

const UmkmMap = dynamic(() => import("@/components/public/UmkmMap"), {
  ssr: false,
  loading: () => (
    <section className="mb-12" id="peta-umkm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-[var(--font-montserrat)]">
            Peta UMKM Desa Sugihan
          </h2>
          <p className="text-sm text-text-muted">Temukan lokasi UMKM terdekat di sekitar Anda</p>
        </div>
      </div>
      <div className="h-[520px] rounded-2xl bg-border-light border border-border animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <Navigation className="w-8 h-8" style={{ animation: "spin 2s linear infinite" }} />
          <span className="text-sm">Memuat peta...</span>
        </div>
      </div>
    </section>
  ),
});

export default function UmkmMapWrapper({ umkmList }: { umkmList: Umkm[] }) {
  return <UmkmMap umkmList={umkmList} />;
}
