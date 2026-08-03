"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/lib/types";
import { Navigation } from "lucide-react";

const SingleUmkmMap = dynamic(() => import("@/components/public/SingleUmkmMap"), {
  ssr: false,
  loading: () => (
    <section className="mb-10" id="lokasi-umkm">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
          <Navigation className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Lokasi Usaha</h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border shadow-md">
        <div className="h-[420px] bg-border-light animate-pulse flex items-center justify-center">
          <span className="text-text-muted text-sm">Memuat peta lokasi...</span>
        </div>
        <div className="h-16 bg-border-light/60 border-t border-border animate-pulse" />
      </div>
    </section>
  ),
});

export default function SingleUmkmMapWrapper({ umkm }: { umkm: Umkm }) {
  return <SingleUmkmMap umkm={umkm} />;
}
