"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Store } from "lucide-react";
import CustomSelect from "@/components/shared/CustomSelect";

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
  const [isPending, startTransition] = useTransition();

  if (umkms.length <= 1) return null;

  const selectOptions = umkms.map((u) => ({
    value: u.id,
    label: `${u.nama_usaha} ${u.status !== "approved" ? `(${u.status === "pending" ? "Menunggu Review" : "Ditolak"})` : ""}`,
  }));

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs relative">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          {isPending ? (
            <svg className="animate-spin w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Store className="w-4 h-4" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="font-bold text-text-primary text-sm block">
              Pilih UMKM
            </label>
            {isPending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                <svg className="animate-spin w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memuat...
              </span>
            )}
          </div>
          <p className="text-text-muted text-xs">
            Anda memiliki {umkms.length} UMKM. Pilih UMKM yang ingin dikelola.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-72">
        <CustomSelect
          options={selectOptions}
          value={selectedId}
          onChange={(newId) => {
            startTransition(() => {
              router.push(`${baseUrl}?umkm_id=${newId}`);
            });
          }}
          placeholder="Pilih UMKM..."
        />
      </div>
    </div>
  );
}
