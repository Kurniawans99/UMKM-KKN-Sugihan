"use client";

import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

interface UmkmOption {
  id: string;
  nama_usaha: string;
  status: string;
}

interface UmkmSelectorProps {
  umkms: UmkmOption[];
  selectedId: string;
  baseUrl: string;
}

export default function UmkmSelector({ umkms, selectedId, baseUrl }: UmkmSelectorProps) {
  const router = useRouter();

  if (umkms.length <= 1) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <label htmlFor="umkm_selector" className="font-bold text-text-primary text-sm block">
            Pilih UMKM
          </label>
          <p className="text-text-muted text-xs">
            Anda memiliki {umkms.length} UMKM. Pilih UMKM yang ingin dikelola.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-72 relative">
        <select
          id="umkm_selector"
          value={selectedId}
          onChange={(e) => {
            router.push(`${baseUrl}?umkm_id=${e.target.value}`);
          }}
          className="form-input appearance-none font-semibold text-text-primary pr-9 cursor-pointer !py-2 text-sm bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          {umkms.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nama_usaha} {u.status !== "approved" ? `(${u.status === "pending" ? "Menunggu Review" : "Ditolak"})` : ""}
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
