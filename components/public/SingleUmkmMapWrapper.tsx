"use client";

import dynamic from "next/dynamic";
import type { Umkm } from "@/lib/types";
import { Navigation } from "lucide-react";

const SingleUmkmMap = dynamic(() => import("@/components/public/SingleUmkmMap"), {
  ssr: false,
  loading: () => (
    <section className="mb-10" id="lokasi-umkm">
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-5 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-primary" />
        Lokasi Usaha
      </h2>
      <div className="h-[350px] sm:h-[400px] rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 text-sm">Memuat peta lokasi...</span>
      </div>
    </section>
  ),
});

export default function SingleUmkmMapWrapper({ umkm }: { umkm: Umkm }) {
  return <SingleUmkmMap umkm={umkm} />;
}
