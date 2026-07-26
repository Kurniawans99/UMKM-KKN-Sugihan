"use client";

import { useRouter } from "next/navigation";
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

  if (umkms.length <= 1) return null;

  const selectOptions = umkms.map((u) => ({
    value: u.id,
    label: `${u.nama_usaha} ${u.status !== "approved" ? `(${u.status === "pending" ? "Menunggu Review" : "Ditolak"})` : ""}`,
  }));

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <label className="font-bold text-text-primary text-sm block">
            Pilih UMKM
          </label>
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
            router.push(`${baseUrl}?umkm_id=${newId}`);
          }}
          placeholder="Pilih UMKM..."
        />
      </div>
    </div>
  );
}
